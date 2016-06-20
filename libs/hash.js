var bcrypt = require('bcryptjs');

var hash = exports;

/**
 * Hashes a password using bcrypt.
 * @param password The password to hash.
 * */
hash.hashPassword = function(password) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return {"hash": hash, "salt": salt};
};


module.exports = hash;