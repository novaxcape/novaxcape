const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const { Client } = require('../models');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    },

    async (accessToken, refreshToken, profile, cb) => {
      try {
        const email = profile.emails?.[0]?.value || profile._json?.email;
        const firstName = profile.name?.givenName || profile.displayName || 'Google';
        const lastName = profile.name?.familyName || 'User';

        if (!email) {
          return cb(new Error('Google did not return an email address'), null);
        }

        // Check if client already exists
        let client = await Client.findOne({
          where: {
            email
          }
        });

        // Create client if not existing
        if (!client) {

          client = await Client.create({
            firstName,
            lastName,
            email,
            password: ' ',
            profilePicture: profile._json.picture,
            isVerified: profile._json.email_verified
          });

        }

        return cb(null, client);

      } catch (error) {

        console.log('Error signing up with google', error.message);

        return cb(error, null);

      }
    }
  )
);

passport.serializeUser((client, cb) => {
  cb(null, client.id);
});

passport.deserializeUser(async (id, cb) => {

  try {

    const client = await Client.findByPk(id);

    if (!client) {
      return cb(new Error('User not found'), null);
    }

    cb(null, client);

  } catch (error) {

    cb(error, null);

  }

});

const profile = passport.authenticate('google', {
  scope: ['profile', 'email']
});

const loginProfile = passport.authenticate('google', {
  failureRedirect: '/login',
  session: false
});

module.exports = { passport, profile, loginProfile };
