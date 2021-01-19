require('dotenv').config();

const PORT = process.env.PORT || 8080;
const SECRET = process.env.SECRET;

const yaml = require('js-yaml');
const fs = require('fs');
const crypto = require('crypto');

const compression = require('compression');
const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const hbs = exphbs.create({
	extname: '.hbs'
});

const readConfig = path => yaml.load(fs.readFileSync(`${__dirname}/configs/${path}`, 'utf8'));

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
	page.page = page.page || (route
		.substring(1)
		.replace(/\//g, '-')
		.toLowerCase());
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

app.post('/webhook', (req, res) => {
	const sig = `sha1=${crypto.createHmac('sha1', SECRET).update(JSON.stringify(req.body))
		.digest('hex')}`;
	if (req.headers['x-hub-signature'] === sig && req.body.ref === 'refs/heads/master') {
		res.status(200).send('Success!');
		process.exit(0);
	} else {
		res.status(403).send('Forbidden!');
	}
});

app.get('/zoom', (req, res) => {
	res.redirect('https://berkeley.zoom.us/j/98351933735?pwd=dE0yeEl5OEZyd05MOC9VbWxKOXUxQT09');
});

app.get('/mtm', (req, res) => {
	res.redirect('https://tinyurl.com/y3qqkdnl');
});

app.get('/discord', (req, res) => {
	res.redirect('https://discord.com/invite/j6WDA75k7s');
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

app.listen(PORT, () => {
	console.log('Active on port:', PORT);
});
