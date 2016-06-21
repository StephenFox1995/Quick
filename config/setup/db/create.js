exports.getCreateUserTableStatement = function () {
  return "CREATE TABLE User(              \
          id          STRING PRIMARY KEY, \
          firstname   STRING,             \
          lastname    STRING,             \
          email       STRING,             \
          password    STRING,             \
          salt        STRING              \
  )";
};