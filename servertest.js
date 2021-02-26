var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

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
  try {} catch {}
  return res.status(200);
});
