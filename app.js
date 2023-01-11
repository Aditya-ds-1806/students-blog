const express = require('express'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	passport = require('passport'),
	cookieSession = require('cookie-session'),
	flash = require('connect-flash'),
	facts = require('fun-facts'),
	moment = require('moment'),
    dotenv = require('dotenv');
    
dotenv.config();

const authRoutes = require('./routes/auth-routes'),
profileRoutes = require('./routes/profile-routes'),
commentRoutes = require('./routes/comment-routes'),
createRoute = require('./routes/create'),
retrieveRoute = require('./routes/retrieve'),
	updateRoute = require('./routes/update'),
	deleteRoutes = require('./routes/delete'),
	draftRoutes = require('./routes/draft-routes'),
	otherRoutes = require('./routes/other-routes'),
	stateRoutes = require('./routes/state-routes'),
	adminRoutes = require('./routes/admin-routes');

const passportSetup = require('./config/passport-setup');

// Connect to MongoDB
const conn = mongoose.connect(process.env.DATABASEURL, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

mongoose.connection.on('open', function () {
	console.log('Connected to DB');
});

const app = express();

app.enable('trust proxy');
app.set('view engine', 'ejs');

app.use(
	cookieSession({
		name: 'ECE-IIITDM',
		maxAge: 24 * 60 * 60 * 1000,
		keys: ['IIITDMKancheepuram']
	})
);
app.use(flash()); // flash must be used before passport
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(function (req, res, next) {
	res.locals.fact = facts.get({
		useDesc: 2
	});
	res.locals.dateToMoment = function (date) {
		var date = date.toString();
		// Convert date to iso format
		var iso =
			date.substring(0, 4) +
			date.substring(8, 11) +
			date.substring(4, 7) +
			date.substring(10, 25) +
			date.substring(28, 33);
		return moment(iso).calendar(null, {
			sameElse: 'DD/MM/YYYY'
		});
	};
	next();
});


app.use('/blogs', otherRoutes); // should remain at the top
app.use('/blogs', createRoute);
app.use('/blogs/:id', retrieveRoute);
app.use('/blogs/:id', updateRoute);
app.use('/blogs/:id', deleteRoutes);
app.use(commentRoutes);
app.use('/profile/:id', profileRoutes);
app.use('/auth', authRoutes);
app.use(adminRoutes);
app.use(draftRoutes);
app.use(stateRoutes);

// Root Route
app.get('/', function (req, res) {
	res.redirect('/blogs');
});

// Privacy Policy
app.get('/privacy', function (req, res) {
	res.render('privacy');
});

// All other routes
app.get('*', function (req, res) {
	res.sendStatus(404);
});

app.listen(process.env.PORT || 3000, process.env.IP, function () {
	console.log('Server has started!');
});

process.on('SIGINT', function () {
	console.log('Bye :-(');
});
