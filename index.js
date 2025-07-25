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

  switch (path.basename(file)) {
    case 'members.yml': {
      const teamFolder = path.join(__dirname, '/public/images/team');

      const missing = contents.map(content => {
        const { name } = content;
        if (!content.image) {
          const names = name.toLowerCase().split(' ');
          const paths = [`${names.join('_')}.webp`, `${names[0]}.webp`];
          const file = paths.find(p => fs.existsSync(path.join(teamFolder, p)));
          if (!file) return name;
          content.image = `/images/team/${file}`;
        }
        return null;
      }).filter(i => i);

      if (missing.length) throw new Error(`Missing Images for [${missing.join(', ')}]`);

      break;
    }
    default: break;
  }
  return contents;
}

app.use(compression());
app.use(express.json());
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
    if (page[key].includes('.yml')) page[key] = readConfig(page[key]);
  }
  app.get(route, (req, res) => {
    res.status(200).render(page.page, page);
  });
}

const routes = readConfig('routes.yml');
for (const path in routes) {
  app.get(path, (req, res) => {
    res.redirect(routes[path]);
  });
}

// DO NOT CHANGE - this is required for website to update
app.post('/webhook', (req, res) => {
  console.log('Webhook received:', req.body);

  const payload = JSON.stringify(req.body);
  const sig = `sha1=${crypto.createHmac('sha1', SECRET).update(payload).digest('hex')}`;

  if (req.headers['x-hub-signature'] === sig && req.body.ref === 'refs/heads/master') {
    console.log('Webhook signature verified. Pulling latest changes...');
    
    exec('git pull origin master', (err, stdout, stderr) => {
      if (err) {
        console.error('Git pull failed:', stderr);
        res.status(500).send('Git pull failed');
        return;
      }
      
      console.log('Git pull successful:', stdout);
      res.status(200).send('Updated! Restarting server...');
      
      setTimeout(() => process.exit(0), 1000);
    });

  } else {
    console.log('Webhook signature invalid or wrong ref:', req.headers['x-hub-signature'], req.body.ref);
    res.status(403).send('Forbidden!');
  }
});

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
  console.log('Active on port:', PORT);
});
