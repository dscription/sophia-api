const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resourceSchema = new Schema({
  _id: String,
  trelloId: String,
  description: String,
  labels: [],
  shortUrl: String,
  checklists: [{ type: Schema.Types.ObjectId, ref: 'Checklist' }],
  name: String,
});

module.exports = mongoose.model('Resource', resourceSchema);
