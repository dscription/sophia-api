var express = require('express');
const fetch = require('node-fetch');
var { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const schema = require('./schema/schema');
const Resource = require('./models/resource');
const Checklist = require('./models/checklist');
const helpers = require('./helpers/helpers');
require('dotenv').config();

// Base URL
const baseURL = 'https://api.trello.com/1/';

// Helper Functions
// todo: Some of these need to be moved into a controllers folder.

const initResources = () => {
  getAllCards().then((newResources) => {
    newResources.forEach((newResource) => {
      createResource(newResource);
    });
  });
};
const initChecklists = () => {
  getAllCheckLists().then((checklists) => {
    checklists.forEach((checklist) => {
      const { id, name, idCard, idBoard, checkItems } = checklist;
      const newChecklist = {
        _id: id,
        trelloId: id,
        name: name,
        cardId: idCard,
        boardId: idBoard,
        items: checkItems,
      };
      Checklist.create(newChecklist).then((checklist) => {
        return;
      });
    });
  });
};

const createResource = async (newResource) => {
  Resource.create(newResource).then((resource) => {
    return;
  });
};

const createChecklist = async (newChecklist) => {
  Checklist.create(newChecklist).then((checklist) => {
    return;
  });
};

const getResource = async (trelloId) => {
  Resource.find({ trelloId: trelloId }).then((data) => console.log(data));
};

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
          _id: card.id,
          trelloId: card.id,
          description: card.desc,
          labels: card.labels,
          shortUrl: card.shortUrl,
          checklists: card.idChecklists,
          name: card.name,
        };
        newResources.push(newResource);
      });
      return newResources;
    })
    .catch((err) => console.error(err));
  return newResources;
};

const getAllCheckLists = async () => {
  const endpoint =
    baseURL +
    `boards/${process.env.BOARD_ID}/checklists?key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_SERVER_TOKEN}`;
  const options = { method: 'GET' };
  let newChecklists = [];
  await fetch(endpoint, options)
    .then((response) => {
      // console.log(`Response: ${response.status} ${response.statusText}`);
      return response.json();
    })
    .then((checklists) => {
      // console.log('checklist', checklists);
      newChecklists = checklists;
      return newChecklists;
    })
    .catch((err) => console.error(err));
  return newChecklists;
};

const getAllResourcesWithChecklists = async () => {
  let newResources = [];
  await Resource.find()
    .populate('checklists')
    .then((resources) => {
      newResources = resources;
    });
  return newResources;
};

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
    //!create a resource from newly created card
    case 'createCard':
      Resource.create({
        _id: data.card.id,
        trelloId: data.card.id,
        description: '',
        labels: [],
        shortUrl: data.card.shortUrl,
        checklists: [],
        name: data.card.name,
      });
      break;
    // !update the name, description of card
    case 'updateCard':
      console.log('updating Card');
      Resource.findById(data.card.id).then((resource) => {
        resource.description = data.card.desc;
        resource.name = data.card.name;
        resource.save();
      });
      break;
    // add a label to a card
    case 'addLabelToCard':
      console.log('adding label to card');
      Resource.find({ _id: data.card.id }).then((resource) => {
        resource.labels.push(data.label);
        resource.save();
      });
      break;
    case 'removeLabelFromCard':
      console.log('removing label from card');
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
      console.log('adding checklist to card');
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
      console.log('removing checklist from card');
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
      console.log('creating a check item');
      Checklist.findById(data.checklist.id).then((checklist) => {
        checklist.items.push(data.checkItem);
        checklist.save();
      });
      break;
    case 'updateCheckItem':
      console.log('updating a check item');
      Checklist.findById(data.checklist.id).then((checklist) => {
        let indexOfCheckItem = checklist.items.findIndex(function (i) {
          return i.id === data.checkItem.id;
        });
        checklist.items[indexOfCheckItem] = data.checkItem;
        checklist.save();
      });
      break;
    case 'deleteCheckItem':
      console.log('deleting cehck item');
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

// initResources();
