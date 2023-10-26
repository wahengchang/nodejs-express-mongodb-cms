const mongoose = require('mongoose');

const todoCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
},
{ timestamps: true } // Enable timestamps for createdAt and updatedAt fields
);

const TodoCategory = mongoose.model('TodoCategory', todoCategorySchema);

module.exports = TodoCategory;