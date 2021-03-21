const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('users');
const keys = require('../config/keys');

const oprions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: keys.jwt
};

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(oprions, async (payload, done) => {
      try {
        const user = await (await User.findById(payload.userId)).isSelected('email id');

        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      } catch(e) {
        console.log(e);
      }
    })
  );
}