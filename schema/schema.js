const graphql = require('graphql');
const Resource = require('../models/resource');
const Checklist = require('../models/checklist');

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
    labels: { type: GraphQLList(LabelType) },
    shortUrl: { type: GraphQLString },
    checklists: { type: GraphQLList(ChecklistType) },
  }),
});

const LabelType = new GraphQLObjectType({
  name: 'Label',
  fields: () => ({
    id: { type: GraphQLString },
    idBoard: { type: GraphQLString },
    name: { type: GraphQLString },
    color: { type: GraphQLString },
  }),
});

const ChecklistType = new GraphQLObjectType({
  name: 'Checklist',
  fields: () => ({
    trelloId: { type: GraphQLString },
    name: { type: GraphQLString },
    cardId: { type: GraphQLString },
    boardId: { type: GraphQLString },
    items: { type: GraphQLList(ItemType) },
  }),
});

const ItemType = new GraphQLObjectType({
  name: 'Item',
  fields: () => ({
    idChecklist: { type: GraphQLString },
    state: { type: GraphQLString },
    id: { type: GraphQLString },
    name: { type: GraphQLString },
  }),
});

// Root querys are how we describe how the user can jump into the graph and grab data.
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  // Each entry point (ie, book, author, all books, all authors will be a field)
  fields: {
    resource: {
      type: ResourceType,
      args: { name: { type: GraphQLString } },
      resolve(parent, args) {
        return Resource.find({ name: args.name }).then(
          (resource) => resource[0]
        );
      },
    },
    resources: {
      type: new GraphQLList(ResourceType),
      resolve(parent, args) {
        return Resource.find({})
          .populate('checklists')
          .then((resources) => resources);
      },
    },
    // checklist: {

    // },
    checklists: {
      type: new GraphQLList(ChecklistType),
      resolve(parent, args) {
        return Checklist.find({});
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
