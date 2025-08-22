require('dotenv').config();
const SECRET = process.env.SECRET;

console.log("Loaded webhook secret:", SECRET ? "YES" : "NO");

const PORT = process.env.PORT || 8080;

const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { exec } = require('child_process');

const compression = require('compression');
const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const hbs = exphbs.create({
  extname: '.hbs'
});

const CONFIG_FOLDER = path.join(__dirname, 'configs');

function readConfig(file) {
  const contents = yaml.load(fs.readFileSync(path.join(CONFIG_FOLDER, file), 'utf8'));
  return contents;
}

app.use(compression());
app.use(express.json({ verify: (req, res, buf) => { req.rawBody = buf } }));
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', `${__dirname}/src/views`);
app.use(express.static(`${__dirname}/public`));
app.locals.config = readConfig('defaults.yml');

const pages = readConfig('pages.yml');
for (const route in pages) {
  const page = pages[route];
  page.page = page.page || (route.substring(1).replace(/\//g, '-').toLowerCase());
  for (const key in page) {
    if (key === 'title') continue;
    if (typeof page[key] === 'string' && page[key].includes('.yml')) {
      page[key] = readConfig(page[key]);
    }
  }
  app.get(route, (req, res) => {
    res.status(200).render(page.page, page);
  });
}

const routes = readConfig('routes.yml');
for (const pathKey in routes) {
  app.get(pathKey, (req, res) => {
    res.redirect(routes[pathKey]);
  });
}

// --- Webhook handler ---
app.post('/webhook', (req, res) => {
  console.log('Webhook received');

  const payload = req.rawBody.toString();

  const sigSha1 = 'sha1=' + crypto.createHmac('sha1', SECRET).update(payload).digest('hex');
  const sigSha256 = 'sha256=' + crypto.createHmac('sha256', SECRET).update(payload).digest('hex');

  const githubSha1 = req.headers['x-hub-signature'];
  const githubSha256 = req.headers['x-hub-signature-256'];

  const sigOk = 
    (githubSha1 && crypto.timingSafeEqual(Buffer.from(sigSha1), Buffer.from(githubSha1))) ||
    (githubSha256 && crypto.timingSafeEqual(Buffer.from(sigSha256), Buffer.from(githubSha256)));

  if (sigOk && (req.body.ref === 'refs/heads/master' || req.body.ref === 'refs/heads/main')) {
    console.log('Webhook signature verified. Pulling latest changes...');

    exec('git pull origin && npm install && npm run build:sass', (err, stdout, stderr) => {
      if (err) {
        console.error('Deployment failed:', stderr);
        res.status(500).send('Deployment failed');
        return;
      }

      console.log('Deployment successful:', stdout);
      res.status(200).send('Updated! Restarting server...');

      setTimeout(() => process.exit(0), 1000);
    });

  } else {
    console.log('Webhook signature invalid or wrong ref');
    res.status(403).send('Forbidden!');
  }
});

// Catch-all routes
app.get('*', (req, res) => {
  res.status(404).render('error', {
    code: 404,
    msg: 'Page not found!'
  });
});

app.use((err, req, res) => {
  res.status(500).render('error', {
    code: 500,
    msg: err.message
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Active on port: ${PORT}`);
});
