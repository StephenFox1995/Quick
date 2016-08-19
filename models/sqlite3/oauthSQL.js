'use strict';

var oauthModel = exports;

oauthModel.createOauthTokens = 'CREATE TABLE OAUTH_TOKENS(' +
  'id TEXT NOT NULL PRIMARY KEY,' +
  'accessToken TEXT NOT NULL,' +
  'accessTokenExpiresOn DATETIME NOT NULL,' +
  'clientID TEXT NOT NULL,' +
  'refreshToken TEXT NOT NULL,' +
  'refreshTokenExpiresOn DATETIME NOT NULL,' +
  'userID TEXT NOT NULL' +
  ');';


oauthModel.createOauthClients = 'CREATE TABLE OAUTH_CLIENTS(' +
  'clientID TEXT NOT NULL PRIMARY KEY,' +
  'clientSecret TEXT NOT NULL PRIMARY KEY,' +
  'redirectURI TEXT NOT NULL' +
  ');';


oauthModel.getAccessToken = 'SELECT accessToken, accessTokenExpiresOn, clientID, refreshToken,' +
  ' refreshTokenExpiresOn, userID FROM OAUTH_TOKENS WHERE accessToken = ?';

oauthModel.saveAccessToken = 'INSERT INTO OAUTH_TOKENS(accessToken, accessTokenExpiresOn, clientID, refreshToken,' +
  ' refreshTokenExpiresOn, userID) VALUES(?, ?, ?, ?, ?, ?);';


oauthModel.getClient = 'SELECT clientID, clientSecrect, redirectURI FROM OAUTH_CLIENTS WHERE clientID = ? AND clientSecret = ?';

oauthModel.getUser = 'SELECT id, firstname, lastname, password FROM User WHERE email = ?';
 
