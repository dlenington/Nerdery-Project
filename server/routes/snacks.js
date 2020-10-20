'use strict';

const Joi = require('joi');
const findWhere = require('lodash.findwhere');

module.exports = function(server, CONFIG) {
  var snacks = CONFIG.snacks;

  server.route({
    method: 'GET',
    path: '/snacks',
    config: {
      cors: true,
      tags: ['api'],
      description: 'Responds with the list of snacks that can be voted on',
      response: {
        schema: Joi.array().items(
          Joi.object().keys({
            id: Joi.string().alphanum().description('Snack ID'),
            brand: Joi.string().description('Parent brand name'),
            product: Joi.string().description('Snack product name'),
            description: Joi.string().description('Snack Description'),
            image: Joi.string().description('Snack brand image'),
            votes: Joi.number().integer().description('Current tally of votes for this month')
          })
        )
      }
    },
    handler: function (request, h) {
        return snacks;
    }
  });

  server.route({
    method: 'POST',
    path: '/snacks/vote/{snackId}',
    config: {
      cors: true,
      tags: ['api'],
      description: 'Increments the vote count for the give snack',
      notes: 'Per-user vote count restriction is not implemented.  NAT candidates are resopnsible for handling this.',
      pre: [
        function(request, h) {
          var id = request.params.snackId;
          var snack = findWhere(snacks, {id: id});
          if (!snack)
            return Boom.badData('Snack ID not recognized');

          return request.snack = snack;
        }
      ],
      validate: {
        params: {
          snackId: Joi.string().alphanum().required().description('Snack ID to vote for')
        }
      }
    },
    handler: function (request, h) {
      var id = request.params.snackId;
      var snack = findWhere(snacks, {id: id});
      request.snack.votes++;
      return snack;
    }
  });
};
