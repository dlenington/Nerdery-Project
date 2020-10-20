'use strict';

module.exports = function(server, CONFIG) {
  server.auth.strategy('simple', 'bearer-access-token', {
    accessTokenName: 'token',
    allowQueryToken: false,
    validate: async (request, token, h) => {
      const isValid = token === CONFIG.token;
      const credentials = { token };
      return { isValid, credentials };
    }
  });

  server.auth.default('simple');
};