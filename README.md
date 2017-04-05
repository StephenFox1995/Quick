# Quick Web Application

Web Application for Quick.

## Setting up the app

First ensure that the configuration file is present in directory /etc/quick/config.json
as it contains the details to access the MongoDB and the token secret used for generating JSON Web Tokens (JWTs).
The configration file can be created using the QuickConfig script else use the following template to stored the information
```javascript
{
  "databases": [
    {
      "database": "database-name-goes-here",
      "password": "password-goes-here",
      "port": "port-goes-here",
      "uri": "uri-goes-here",
      "username": "username-goes-here"
    }
  ],
  "gmaps": "google-maps-key-goes-here",
  "token": {
    "secret": "jwt-secret-goes-here"
  }
}
```

Once this has been done run the following commands.
- Navigate to root of project.
- Run `npm install` to build project.
- Run `npm start` to start the application.
- Navigate to `http://localhost:3000/` to use the app.
