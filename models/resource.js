const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resourceSchema = new Schema({
  _id: String,
  name: String,
  description: String,
  trelloId: String,
  labels: Array,
  shortUrl: String,
  checklists: [{ type: Schema.Types.String, ref: 'Checklist' }],
});

module.exports = mongoose.model('Resource', resourceSchema);
