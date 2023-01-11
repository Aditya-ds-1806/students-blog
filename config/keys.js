const { CLIENT_ID, CLIENT_SECRET, EMAIL, EMAIL_PWD } = process.env;

var keys = {
	google: {
		clientID: CLIENT_ID,
		clientSecret: CLIENT_SECRET,
		callbackURL: '/auth/google/callback'
	},
	mail: {
		email: EMAIL,
		password: EMAIL_PWD
	},
	admins: [ 'esd18i001@iiitdm.ac.in' ]
};

module.exports = keys;
