

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }
  
  const sessions = require('express-session');
  var db = require('./connection');
  const hbs = require('express-handlebars');
  
  // view engine setup
  app.engine('hbs', hbs.engine({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/', partialsDir: __dirname + '/views/partials/' }))
  
  // creating 24 hours from milliseconds
  const oneDay = 1000 * 60 * 60 * 24;
  
  //session middleware
  app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
  }));
  
  db.connect((err) => {
    if (err) console.log("Connection Error" + err);
    else console.log("Database connected to port")
  })
  
  
                      