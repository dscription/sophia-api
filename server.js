var express = require('express');
var { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const schema = require('./schema/schema');
const Resource = require('./models/resource');
const Checklist = require('./models/checklist');
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
  const { data } = req.body.action;
  switch (req.body.action.type) {
    //create a resource from newly created card
    case 'createCard':
      Resource.create({
        _id: data.card.id,
        trelloId: data.card.id,
        description: [],
        labels: [],
        shortUrl: data.card.shortUrl,
        checklists: [],
        name: data.card.name,
      });
      break;
    // update the name, description of card
    case 'updateCard':
      Resource.findByIdAndUpdate(
        data.card.id,
        {
          description: data.card.desc,
          name: data.card.name,
        },
        {
          new: true,
        }
      );
      break;
    // add a label to a card
    case 'addLabelToCard':
      Resource.find({ _id: data.card.id }).then((resouce) => {
        resource.labels.push(data.label);
        resource.save();
      });
      break;
    case 'removeLabelFromCard':
      Resource.find({ _id: data.card.id }).then((resource) => {
        resource.labels.splice(
          resource.findIndex(function (i) {
            return i._id === data.label.id;
          }),
          1
        );
        resource.save();
      });
      break;
    case 'addChecklistToCard':
      Checklist.create({
        _id: data.checklist.id,
        trelloId: data.checklist.id,
        name: data.checklist.name,
        cardId: data.card.id,
        boardId: data.board.id,
        items: [],
      }).then((checklist) => {
        Resource.findById(data.card.id).then((resource) => {
          resource.checklists.push(checklist._id);
          resource.save();
        });
      });
      break;
    case 'removeChecklistFromCard':
      Resource.findById(data.card.id).then((resource) => {
        resource.checklists.splice(
          resource.checklists.findIndex(function (i) {
            return i._id === data.checklist.id;
          }),
          1
        );
        resource.save();
      });
      break;
    case 'createCheckItem':
      Checklist.findById(data.checklist.id).then((checklist) => {
        checklist.items.push(data.checkItem);
        checklist.save();
      });
      break;
    case 'updateCheckItem':
      Checklist.findById(data.checklist.id).then((checklist) => {
        let indexOfCheckItem = checklist.items.findIndex(function (i) {
          return i.id === data.checkItem.id;
        });
        checklist.items[indexOfCheckItem] = data.checkItem;
        checklist.save();
      });
      break;
    case 'deleteCheckItem':
      Checklist.findById(data.checklist.id).then((checklist) => {
        checklist.items.splice(
          checklist.items.findIndex(function (i) {
            return i.id === data.checkItem.id;
          }),
          1
        );
        checklist.save();
      });
      break;
    default:
      console.log(
        'post request from Trello, not yet managed, here is the action data',
        data
      );
  }
});
