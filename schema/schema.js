const graphql = require('graphql');

// Define the schema, the object types and relations between object types and how you can reach into the graph and interact with that data, query or mutate the data.
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

// typeDefs
const ResourceType = new GraphQLObjectType({
  name: 'Resource',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    trelloId: { type: GraphQLString },
    // labels: { type: GraphQLList },
    shortUrl: { type: GraphQLString },
  }),
});

// todo
// const ChecklistType = new GraphQLObjectType({
//   name: 'Checklist',
//   fields: () => ({
//     // todo
//   }),
// });

// Root querys are how we describe how the user can jump into the graph and grab data.
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  // Each entry point (ie, book, author, all books, all authors will be a field)
  fields: {
    // todo
    resource: {
      type: ResourceType,
      args: { name: { type: GraphQLString } },
      resolve(parent, args) {
        return {name: 'Dan'};
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // todo
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  // mutation: Mutation,
});
