const yaml = require('js-yaml');
const fs = require('fs');

const compression = require('compression');
const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const hbs = exphbs.create({
	extname: '.hbs'
});
app.use(compression());
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
		title: 'about us.'
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
			add: function(val1, val2) {
				return val1 + val2;
			}
		},
		topics: yaml.safeLoad(fs.readFileSync(`${__dirname}/configs/topics.yaml`, 'utf8'))
	});
});

app.get('/projects', (req, res) => {
	res.status(200).render('projects', {
		title: 'projects.',
		projects: yaml.safeLoad(fs.readFileSync(`${__dirname}/configs/projects.yaml`, 'utf8'))
	});
});

app.get('/contact', (req, res) => {
	res.status(200).render('contact', {
		title: 'contact us.'
	});
});

app.get('*', (req, res) => {
	res.status(404).render('error', {
		code: 404,
		msg: 'Page not found!'
	});
});

app.use((err, req, res, next) => {
	res.status(500).render('error', {
		code: 500,
		msg: err.message
	});
});

app.listen(8080);