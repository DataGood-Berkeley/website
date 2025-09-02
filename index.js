require('dotenv').config();

const PORT = process.env.PORT || 8080;
const SECRET = process.env.SECRET;

const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

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
			const {
				name
			} = content;
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

// DO NOT CHANGE - this is required for website to update
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