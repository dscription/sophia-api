var express = require('express');
var { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const schema = require('./schema/schema');
require('dotenv').config();

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;

var app = express();
app.use(express.json());
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
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
});
