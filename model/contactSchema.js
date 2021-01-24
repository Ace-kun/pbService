  const mongoose = require('mongoose');
  const { Schema } = mongoose;

  const contactSchema = new Schema({
    name:  { type: String, required: true}, 
    number: { type: Number},
    email:   { type: String, required: true}
  }, {collection: 'contact'});

module.exports = contactSchema;