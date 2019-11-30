const mongoose = require('mongoose');
const {
  ObjectId
} = mongoose.Schema;


const Schema = mongoose.Schema;

const documentSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32
    },
    body: {
      type: String,
      required: true,
      maxlength: 2000
    },
    category: {
      type: ObjectId,
      ref: 'Category',
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  }, {
    timestamps: true
});

const Document = mongoose.model('Document', documentSchema);
module.exports = Document;