const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resourceSchema = new Schema({
  trelloId: String,
  description: String,
  labels: [],
  shortUrl: String,
  checkListIds: [String],
  name: String
});

module.exports = mongoose.model('Resource', resourceSchema);
