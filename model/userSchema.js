const mongoose = require('mongoose');
  const { Schema } = mongoose;

  const userSchema = new Schema({
    name:  { type: String},
    password: { type: String}
  }, {collection: 'user'});

module.exports = userSchema;