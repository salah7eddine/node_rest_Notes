const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {type: String, required: true},
  type: {type: String, required: true},
  body: {type: String, required: true},
  postDate: {type: Date, required: true},
  updateDate: {type: Date, required: true},
  author: {type: String, required: true}
});

module.exports = mongoose.model('Note', noteSchema);