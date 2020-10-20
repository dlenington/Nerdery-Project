'use strict';

const Hapi = require('hapi');
const Path = require('path');
const AuthBearer = require('hapi-auth-bearer-token');
const Inert = require('inert');
const CONFIG = require('./config');

const server = Hapi.server({
  port: CONFIG.port,
  host: 'localhost',
  routes: {
      files: {
          relativeTo: Path.join(__dirname, 'public')
      }
  }
});

const init = async () => {
  await server.register(AuthBearer);
  await server.register(Inert);
console.log("hello");
  require('./auth')(server, CONFIG);
  require('./routes/snacks')(server, CONFIG);
  require('./routes/images')(server, CONFIG);

  await server.start();
  console.log(`Server running at ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.log("entered");
  console.log(err);
  process.exit(1);
});

init();