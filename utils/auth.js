const jwt = require("jsonwebtoken");
exports.createJWT = (email, userId) => {
   const payload = {
      email,
      userId
   };
   // "secret" is private key. can be anything
   // 3600 is time in seconds. token will expire after one hour
   return jwt.sign(payload, "secret", {
     expiresIn: 3600,
   });
};