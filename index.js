const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const hbs = exphbs.create({
	extname: '.hbs'
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', `${__dirname}/src/views`);
app.use(express.static(`${__dirname}/public`));

app.get('/', (req, res) => {
	res.render('home');
});

app.get('/about', (req, res) => {
	res.render('about');
});

app.get('/team', (req, res) => {
	res.render('team')
});

app.get('/events', (req, res) => {
	res.render('events');
});

app.get('/education', (req, res) => {
	res.render('education');
});

app.get('/projects', (req, res) => {
	res.render('projects');
});

app.get('/contact', (req, res) => {
	res.render('contact');
});

app.listen(8080);