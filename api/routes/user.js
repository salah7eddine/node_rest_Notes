const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const brcypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

router.post('/signup', (req, res, next) => {
  User.find({ email: req.body.email})
      .exec()
      .then(user => {
        if(user.length >= 1) {
          return res.status(409).json({
            message: 'Mail exists '
          }); 
        } else {
          brcypt.hash(req.body.password, 10, (err, hash) => {
            if(err) {
              return res.status(500).json({
                error: err
              });
            } else {
              const user = new User({
                _id:  mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hash
              });
              user
                .save()
                .then(result => {
                  console.log(result);
                  res.status(201).json({
                    message: 'User created'
                  });
                })
                .catch(err => {
                  console.log(err);
                  res.status(500).json({
                    error: err
                  });
                });
            }
          });
        }
      });
});

router.post("/login", (req, res, next) => {
  User.find({ email: req.body.email })
      .exec()
      .then(user => {
        if(user.length < 1) {
          return res.status(401).json({
            messgae: 'Auth failed'
          })
        }
        const token = jwt.sign({
          email: user[0].email,
          userId: user[0]._id
        }, process.env.JWT_KEY,
          { 
            expiresIn: "1h" 
          } 
        );

        if(user.length < 1) {
          return res.status(401).json({
            message: 'Auth failed' 
          });
        }
        brcypt.compare(req.body.password, user[0].password, (err, result) => {
          if (err) {
            return res.status(401).json({
              message: 'Auth failed' 
            });
          }
          if(result) {
            return res.status(200).json({
              message: 'Auth successful',
              token: token
            });
          }
          res.status(401).json({
            message: 'Auth failed' 
          });
        });
      })
      .catch(err => {
        console.log(err);
        releaseEvents.status(500).json({
          error: err
        });
      });
});

router.delete('/:userId', (req, res, next) => {
  User.remove({ _id: req.params.userId})
      .exec()
      .then(result => {
        res.status(200).json({
          message: 'User deleted'
        });
      }).catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
});

module.exports = router;