const mongoose = require('mongoose');
const crypto = require('crypto');
const uuidv1 = require('uuid/v1'); // unique
const {
  ObjectId
} = mongoose.Schema;

const Schema = mongoose.Schema;

// Document Schema
const documentSchema = new Schema({
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

// User Schema
const userSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    maxlength: 32
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  hashed_password: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    trim: true,
  },
  salt: String,
  documents: [documentSchema]
}, {
  timestamps: true
});

// Virtual field - User
userSchema.virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = uuidv1();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  })

// User Schema Methods
userSchema.methods = {
  encryptPassword: function (password) {
    if (!password) return '';
    try {
      return crypto.createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    } catch (err) {
      return '';
    }
  }
};

const Document = mongoose.model('Document', documentSchema);
const User = mongoose.model('User', userSchema);

module.exports = {
  User,
  Document
};