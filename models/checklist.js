const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// const checklistItemSchema = new Schema({
//   checklistId: String,
//   state: String,
//   trelloId: String,
//   name: String,
// });

const checklistSchema = new Schema({
  _id: String,
  trelloId: String,
  name: String,
  cardId: String,
  boardId: String,
  items: Array,
});

module.exports = mongoose.model('Checklist', checklistSchema);
