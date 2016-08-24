var bcrypt = require('bcryptjs');

var hash = exports;

/**
 * Hashes a password using bcrypt.
 * @param   {string } password The password to hash.
 * @return  {object} hash - An object contained the hash and salt.
 * @return  {string} hash.hash - The hashed password.
 * @return  {string} hash.salt - The salt. 
 * */
hash.hashPassword = function(password) {
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(password, salt);
  return {"hash": hash, "salt": salt};
};


hash.compare = function (password, hashedPassword, callback) {
  bcrypt.compare(password, hashedPassword, function (err, res) {
    if (err) { return callback(err); }
    if (res === true) {
      return callback(null, true);
    } else {
      return callback(null, false);
    }
  });
};

module.exports = hash;