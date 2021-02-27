// const { ApolloServer, gql, PubSub } = require('apollo-server');
// const { GraphQLScalarType } = require('graphql');
// const { Kind } = require('graphql/language');
// const mongoose = require('mongoose');

// require('dotenv').config();

// mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });

// const db = mongoose.connection;

// const typeDefs = gql`
//   # type User {

//   # }

//   type Resource {
//     id: ID
//     type: String
//     name: String
//     link: String
//     isbn: String
//     notes: String
//     status: String
//   }

//   type Query {
//     resources: [Resource]
//     resource(id: ID): Resource
//   }
// `;

// const resources = [
//   {
//     id: '123',
//     type: 'book',
//     name: 'graphql',
//     link: 'www.google.com',
//     isbn: '123456789',
//     notes: 'This was a great course!',
//     status: 'In Progress',
//   },
// ];
// const resolvers = {
//   Query: {
//     resources: async () => {
//       try {
//         return resources;
//       } catch (e) {
//         console.log('error', e);
//         return [];
//       }
//     },
//   },
// };

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   introspection: true,
//   playground: true,
//   // conext: ({req}) => {

//   // }
// });

// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function () {
//   console.log('database connected');
//   server
//     .listen({
//       port: process.env.PORT || 4000,
//     })
//     .then(({ url }) => {
//       console.log(`Server started at ${url}`);
//     });
// });
