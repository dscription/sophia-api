var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const fetch = require('node-fetch');
require('dotenv').config();
const Resource = require('./models/resource');

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;

// Base URL
const baseURL = 'https://api.trello.com/1/';

const initResources = () => {
  getAllCards().then((newResources) => {
    newResources.forEach((newResource) => {
      createResource(newResource);
    });
  });
};

const createResource = async (newResource) => {
  Resource.create(newResource).then((resource) => {
    console.log(resource);
  });
};

const getResource = async (trelloId) => {
  Resource.find(
    {trelloId:trelloId}
  ).then(data => console.log(data))
}



// Fetch all cards on board
// ! Returns a large array. Stored in sampleData.js as cards variable.
const getAllCards = async () => {
  const endpoint =
    baseURL +
    `boards/${process.env.BOARD_ID}/cards?key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_SERVER_TOKEN}`;
  const options = { method: 'GET' };
  const newResources = [];

  await fetch(endpoint, options)
    .then((response) => {
      console.log(`Response: ${response.status} ${response.statusText}`);
      return response.json();
    })
    .then((cards) => {
      cards.forEach((card) => {
        const newResource = {
          trelloId: card.id,
          description: card.desc,
          labels: card.labels,
          shortUrl: card.shortUrl,
          checkListIds: card.idChecklists,
          name: card.name
        };
        newResources.push(newResource);
      });
      return newResources;
    })
    .catch((err) => console.error(err));
  return newResources;
};

const getCheckList = async (checkListId) => {
  const endpoint =
    baseURL +
    `checklists/${checkListId}?key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_SERVER_TOKEN}`;
  const options = { method: 'GET' };
  await fetch(endpoint, options)
    .then((response) => {
      // console.log(`Response: ${response.status} ${response.statusText}`);
      return response.json();
    })
    .then((checklist) => console.log('checklist', checklist))
    .catch((err) => console.error(err));
};

// getAllCards();
// getCheckList('6016d8c432cc8a3af30577bf')

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

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  app.listen(process.env.PORT || 4000);
  console.log(
    'Running a Express GraphQL API server at http://localhost:4000/graphql'
  );
});

// routes
app.get('/trelloCallback', function (req, res) {
  res.status(200).send('You hit the server');
});

app.post('/trelloCallBack', function (req, res) {
  console.log('action', req.body.action.data);
  // shape the data into a payload
  const resourceData = {
    
  }
  // updateOrCreateResource()
});

// initResources();
getResource("600e70a88d2d345e01d733ea")

const updateOrCreateResource = async (data) => {

}