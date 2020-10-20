'use strict';

module.exports = function(server, CONFIG) {
  server.route({
      method: 'GET',
      path: '/{filename}',
      handler: {
          file: function (request) {
              return request.params.filename;
          }
      },
      options: {
        auth: {
          mode: 'try',
        },
      },
  });
};