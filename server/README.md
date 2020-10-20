# Server

The server is a simple node.js API server, developed for the purpose of assisting you test your solution.  You are free to use it towards that purpose, and may *not* share or publish any code contained within.

#### Installation

* Install Node.js, version >= 8.0.0
* From a terminal in the server folder, run the `npm install` command
* Once complete, run `npm start` to start the server on port 3000
* If your system is already using port, 3000, you can configure the port in the config.js file

#### The API

All API requests must be authenticated using an `Authorization` header. For the purpose of this challenge, use the `token` value in the server/config.js file, which should be:

`33b55673-57c7-413f-83ed-5b4ae8d18827`

For example, to make a request using curl:

```
curl -X GET -H "Authorization: Bearer 33b55673-57c7-413f-83ed-5b4ae8d18827" http://localhost:3000/snacks
```

You may also configure the list of snacks that appear in the application by tweaking the value in the server/config.js file as well.  In fact, it's a good idea to do so so that your application continues to function as expected under varying numbers of snacks to be displayed.

There are two APIs that you will need to complete the challenge:

##### GET /snacks

Returns an array of snack objects with id, name and votes properties

##### POST /snacks/vote/{snackId}

Records a new vote, where {snackId} is a value from the `id` property of a snack model.
Returns a 200 response with an empty body on success.