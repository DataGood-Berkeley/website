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

app.use(compression());
app.use(express.json());
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', `${__dirname}/src/views`);
app.use(express.static(`${__dirname}/public`));
app.locals.config = yaml.safeLoad(fs.readFileSync(`${__dirname}/configs/defaults.yaml`, 'utf8'));
app.get('/', (req, res) => {
	res.status(200).render('home');
});

app.get('/about', (req, res) => {
	res.status(200).render('about', {
		title: 'about us.',
		sponsors: yaml.safeLoad(fs.readFileSync(`${__dirname}/configs/sponsors.yaml`, 'utf8'))
	});
});

app.get('/team', (req, res) => {
	res.status(200).render('team', {
		title: 'meet the team.',
		members: yaml.safeLoad(fs.readFileSync(`${__dirname}/configs/members.yaml`, 'utf8'))
	});
});

app.get('/events', (req, res) => {
	res.status(200).render('events', {
		title: 'upcoming events.'
	});
});

app.get('/education', (req, res) => {
	res.status(200).render('education', {
		title: 'education.',
		helpers: {
			add(val1, val2) {
				return val1 + val2;
			}
		},
		topics: yaml.safeLoad(fs.readFileSync(`${__dirname}/configs/topics.yaml`, 'utf8'))
	});
});

app.get('/projects', (req, res) => {
	res.status(200).render('projects', {
		title: 'projects.',
		projectGroups: yaml.safeLoad(fs.readFileSync(`${__dirname}/configs/projects.yaml`, 'utf8'))
	});
});

app.get('/contact', (req, res) => {
	res.status(200).render('contact', {
		title: 'contact us.'
	});
});

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
  res.redirect('https://berkeley.zoom.us/j/98351933735?pwd=dE0yeEl5OEZyd05MOC9VbWxKOXUxQT09')
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
