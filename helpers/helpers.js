const fetch = require('node-fetch');
const Resource = require('./models/resource');
const Checklist = require('./models/checklist');
const mongoose = require('mongoose');
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