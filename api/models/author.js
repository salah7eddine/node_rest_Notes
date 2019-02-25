const mongoose = require('mongoose');

const authorSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  note: { type: mongoose.Schema.Types.ObjectId, ref: 'Note', require: true},
  name: { type: String, required: true},
  age: { type: Number, required: true},
  numNote: { type: Number, default: 1}
});

module.exports = mongoose.model('Author', authorSchema);