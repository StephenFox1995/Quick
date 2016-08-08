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


hash.compare = function (password, hashedPassword, callback) {
  bcrypt.compare(password, hashedPassword, function (err, res) {
    if (err) {
      callback(err);
    }
    if (res == true) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  });
};

module.exports = hash;