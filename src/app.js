const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const upload = require('express-fileupload');
const passport = require('passport');
const httpStatus = require('http-status');
const config = require('./config/config');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');

const cookieParser = require("cookie-parser");
// const header = new Headers();
const MongoDBSession = require('connect-mongodb-session');
const session = require('express-session');
const cookieSession = require("cookie-session");
const { NO_CONTENT } = require('http-status');


  const app = express();
  

  const MongoSession = MongoDBSession(session)
  const store = new MongoSession({
      uri: config.mongoose.url,
      collection: "Session"
  })

  // set security HTTP headers
  app.use(helmet());
  // set cookie-parser
  app.use(cookieParser(config.cookie))
  // parse json request body
  app.use(express.json({limit:'50mb'}));

  // parse urlencoded request body
  app.use(express.urlencoded({limit:'50mb', extended: true }));

  // sanitize request data
  app.use(xss());
  app.use(mongoSanitize());
  app.use(upload());

  // gzip compression
  app.use(compression());

  // (All)10mins- if no activity
 
  var allowlist = ['http://localhost:3000', 'http://localhost:3001']
  var corsOptionsDelegate = function (req, callback) {
    var corsOptions;
    if (allowlist.indexOf(req.header('Origin')) !== -1) {
      corsOptions = { origin: true} // reflect (enable) the requested origin in the CORS response
    } else {
      corsOptions = { origin: false } // disable CORS for this request
    }
    callback(null, corsOptions) // callback expects two parameters: error and options
  }
  // enable cors
  app.use(cors(config.corsOption));
 

app.use((req,res,next)=>{
  req.headers['authorization'] = `Bearer ${req.cookies['x-access-token']}`;
  res.setHeader('Access-Control-Allow-Origin', ['http://localhost:3000']);
  
  next();
});

app.use(
    cookieSession({
      name: "__session",
      keys: ["key1"],
        maxAge: 24 * 60 * 60 * 100,
        secure: false,
        httpOnly: true,
        sameSite:'Lax',
        store:store,
    })
);


  // jwt authentication
  app.use(passport.initialize());
  app.use(passport.session());



  // v1 api routes
  app.use('/v1', routes);

  // send back a 404 error for any unknown api request
  app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
  });

  
  // convert error to ApiError, if needed
  app.use(errorConverter);

  // handle error
  app.use(errorHandler);

  module.exports = app;

