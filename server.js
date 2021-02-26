var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
const fetch = require('node-fetch');

require('dotenv').config();

// Base URL
const baseURL = 'https://api.trello.com/1/';

// Fetch all cards on board
// ! Returns a large array. Stored in sampleData.js as cards variable.
const getAllCards = async () => {
  const endpoint =
    baseURL +
    `boards/${process.env.BOARD_ID}/cards?key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_SERVER_TOKEN}`;
  const options = { method: 'GET' };
  await fetch(endpoint, options)
    .then((response) => {
      console.log(`Response: ${response.status} ${response.statusText}`);
      return response.text();
    })
    .then((text) => console.log(text))
    .catch((err) => console.error(err));
};

getAllCards();

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  hello: () => {
    return 'Hello world!';
  },
};

var app = express();
app.use(express.json());
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
app.listen(process.env.PORT || 4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');

app.get('/trelloCallback', function (req, res) {
  // console.log(req);
  // try {
  // } catch {}
  res.status(200).send('You hit the server');
});

app.post('/trelloCallBack', function (req, res) {
  console.log('action', req.body.action.data);
});
