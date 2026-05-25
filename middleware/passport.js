const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userModel = require('../models/client');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, cb) => {
    try {
        console.log('Profile:', profile )
        let user = await userModel.findOne({email: profile._json.email})

        if (!user){
            const [firstName, ...lastName] = (profile._json.name || '').split(' ')

            user = new userModel({
                firstName: profile._json.given_name,
                lastName: profile._json.family_name,
                phoneNumber: `${Math.floor(Math.random() * 1E9)}`,
                email: profile._json.email,
                isVerified: profile._json.email_verified,
                password: ' ',
                profilePicture: profile._json.picture
            })
            await user.save()
        }

        return cb(null, user)
    } catch (error) {
      console.log('Error signing up with google:', error.message);
        return cb(null, error)
    }
  }
));

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
  try {
  const user = await userModel.findById(id)
  if(!user){
    return cb(new Error('User not found'), null)
  }
  cb(null, user)
} catch (error) {
  cb(error, null)
}
});

const profile = passport.authenticate('google', {scope: ['profile', 'email']});
const loginProfile = passport.authenticate('google', {failureRedirect: '/login'})

module.exports = {passport, profile, loginProfile}
