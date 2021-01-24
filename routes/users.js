var express = require('express');
var router = express.Router();
let jwt = require('jsonwebtoken');
let config = require('../config')
var mongoose = require('mongoose');
let authReq = require('../authenticateRrequest')
let userSchema = require('../model/userSchema') 
let contactSchema = require('../model/contactSchema') 

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

//User Login
router.post('/login', function(req, res) {
  try{
    const user = mongoose.model('user',userSchema );
    let username = req.body.username;
    let user_password = req.body.password;
    user.findOne({ name: username, password: user_password }, function(err, result){
      if (err) res.send(err)
      else {
        jwt.sign({
          username: result.name
        },
        config.secretkey, {
          expiresIn: "3h"
        }, function(err, token){
          var newUser = {}
          Object.assign(newUser, result._doc);
          newUser.token = token
          delete newUser.password;
          newUser.status = "success"
          newUser.message = "Logged In"
          res.send(newUser)
        })
      }
    })
  }
  catch (err) {console.log(err)}
});

// Adding contact to database
router.post('/addContact', authReq, function(req, res) {
  try{
    const contact = mongoose.model('contact',contactSchema );
    let contactObj = req.body;
    let newContact = new contact(contactObj);
    newContact.save(function (err, result){
      if (err) res.send(err)
      else {
        res.send(result);
      }
  });
  }
  catch (err) {console.log(err)}
});

//Editing or Updating contact in database
router.post('/editContact', authReq,function(req, res) {
  try{
    const contact = mongoose.model('contact',contactSchema );
    let contactId = req.body.id;
    let contactObj = req.body.contactData;
    contact.findOne({ _id : contactId }, function(err, result){
      if (err) res.send(err)
      else {
        contact.updateOne({ _id : contactId }, {$set: contactObj}, {upsert: true, multi: true}, function(err, result){
          if (err) res.send(err)
          else {
            res.send(result);
          }
        })
      }
    })
  }
  catch (err) {console.log(err)}
});

//Deleting a contact in database
router.post('/deleteContact',authReq, function(req, res) {
  try{
    const contact = mongoose.model('contact',contactSchema );
    let contactId = req.body.id;
    contact.findOne({ _id : contactId }, function(err, result){
      if (err) res.send(err)
      else {
        contact.deleteOne({ _id : contactId }, function(err, result){
          if (err) res.send(err)
          else {
            res.send(result);
          }
        })
      }
    })
  }
  catch (err) {console.log(err)}
});

//Displaying 10 contacts
router.get('/getContact',authReq, function(req, res) {
  try{
  const contact = mongoose.model('contact',contactSchema );
  contact.find({})
  .limit(10)
  .exec(function(err, result) {
          if (err) res.send(err)
          else {
            res.send(result);
          }
  });
  }
  catch (err) {console.log(err)}
});

//Displaying contact with name or
router.post('/getContactByNameEmail',authReq, function(req, res) {
  try{
  const contact = mongoose.model('contact',contactSchema );
  let contact_name = req.body.contact_name;
  let contact_email = req.body.contact_email;
  contact.find({ $or:[ {'name':contact_name}, {'email':contact_email}]}, function(err, result){
    if (err) res.send(err)
    else {
      res.send(result);
    }
  })
  }
  catch (err) {console.log(err)}
});

module.exports = router;
