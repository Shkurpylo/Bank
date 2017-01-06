import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import config from '../src/config';
import * as actions from './actions/index';
import * as publicActions from './public';
import { mapUrl } from 'utils/url.js';
import PrettyError from 'pretty-error';
import http from 'http';
import SocketIo from 'socket.io';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { login, configPassport } from './actions/login';
import passportBearer from 'passport-http-bearer';
import { checkCustomerToken } from './actions/customer';
import util from 'util';
import { ping } from 'express-ping';

const pretty = new PrettyError();
const app = express();
const server = new http.Server(app); // Event Emitter

// const mongoUrl = 'mongodb://localhost:27017/BankDB'; // local todo: make db non-local
const db = config.db;
const mLab = util.format('mongodb://%s:%s@%s:%s/%s', db.user, db.password, db.host, db.port, db.name);

mongoose.Promise = global.Promise;
mongoose.connect(mLab, err => {
  if (err) {
    console.log('Please make sure MongoDb is up and running');
  }
  console.log('==> MongoDB connection is up and ready');
});

const io = new SocketIo(server);
io.path('/ws');
app.use(ping);
app.use(cookieParser());
app.use(session({
  secret: 'react and redux rule!!!!',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 6000000 }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());


if (process.env.NODE_ENV === 'public_api') {
  // if running as Public API server
  const BearerStrategy = passportBearer.Strategy;

  passport.use(
    new BearerStrategy(
      (token, done) => {
        checkCustomerToken(token)
          .then(res => {
            console.log('is token valid: ' + res);
            if (res) {
              return done(null, true, { scope: 'all' });
            }
            return done(null, false);
          });
      }
    )
  );


  app.use(
    passport.authenticate('bearer', { session: false }),
    (req, res) => {
      const splittedUrlPath = req.url.split('?')[0].split('/').slice(1);

      const { action, params } = mapUrl(publicActions, splittedUrlPath);

      if (action) {
        action(req, params)
          .then((result) => {
            if (result instanceof Function) {
              result(res);
            } else {
              res.json(result);
            }
          }, (reason) => {
            if (reason && reason.redirect) {
              res.redirect(reason.redirect);
            } else {
              console.error('API ERROR:', pretty.render(reason));
              res.status(reason.status || 500).json(reason);
            }
          });
      } else {
        res.status(404).end('NOT FOUND');
      }
    });
} else {
  // if running as Bank API server
  configPassport(passport);

  login(app, passport);

  app.use(
    (req, res) => {
      const splittedUrlPath = req.url.split('?')[0].split('/').slice(1);

      const { action, params } = mapUrl(actions, splittedUrlPath);

      if (action) {
        action(req, params)
          .then((result) => {
            if (result instanceof Function) {
              result(res);
            } else {
              res.json(result);
            }
          }, (reason) => {
            if (reason && reason.redirect) {
              res.redirect(reason.redirect);
            } else {
              console.error('API ERROR:', pretty.render(reason));
              res.status(reason.status || 500).json(reason);
            }
          });
      } else {
        res.status(404).end('NOT FOUND');
      }
    });
}

const bufferSize = 100;
const messageBuffer = new Array(bufferSize);
let messageIndex = 0;

if (config.apiPort) {
  const runnable = app.listen(config.apiPort, (err) => {
    if (err) {
      console.error(err);
    }
    console.info('----\n==> 🌎  API is running on port %s', config.apiPort);
    console.info('==> 💻  Send requests to http://%s:%s', config.apiHost, config.apiPort);
  });

  io.on('connection', (socket) => {
    socket.emit('news', { msg: `'Hello World!' from server` });

    socket.on('history', () => {
      for (let index = 0; index < bufferSize; index++) {
        const msgNo = (messageIndex + index) % bufferSize;
        const msg = messageBuffer[msgNo];
        if (msg) {
          socket.emit('msg', msg);
        }
      }
    });

    socket.on('msg', (data) => {
      data.id = messageIndex;
      messageBuffer[messageIndex % bufferSize] = data;
      messageIndex++;
      io.emit('msg', data);
    });
  });
  io.listen(runnable);
} else {
  console.error('==>     ERROR: No PORT environment variable has been specified');
}
