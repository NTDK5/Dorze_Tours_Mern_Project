const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userModel'); // Adjust the path as necessary

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/users/auth/google/callback',
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if a user with the same Google ID already exists
            let user = await User.findOne({ googleId: profile.id });
            if (user) {
                // If found, log them in
                return done(null, user);
            }

            // Check if a user with the same email already exists
            user = await User.findOne({ email: profile.emails[0].value });
            if (user) {
                // If found, link Google account by adding the Google ID
                user.googleId = profile.id;
                await user.save();
                return done(null, user);
            }

            // If no user is found, create a new one
            user = await new User({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                first_name: profile.name.givenName || '',
                last_name: profile.name.familyName || '',
                password: '', // Leave blank for Google users
            }).save();

            done(null, user);
        } catch (error) {
            done(error, null);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
}); 