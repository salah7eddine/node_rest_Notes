const mongoose = require('mongoose');


const Author = require('../models/author');


exports.authors_get_all = (req, res, next) => {
  Author
   .find()
   .select('numNote name age note _id')
   .populate('note', '_id name type body author')
   .exec()
   .then(docs => {
     res.status(200).json({
       count: docs.length,
       authors: docs.map(doc => {
         return {
           _id: doc._id,
           name: doc.name,
           age: doc.age,
           note: doc.note,
           numNote: doc.numNote,
           request: {
             type: 'GET',
             url: 'http://localhost:3000/authors/' + doc._id
           }
         }
       }), 
     });
   })
   .catch(err => {
     res.status(500).json({
       error: err
     });
   });
 };

exports.authors_create_author = (req, res, next) => {

  Note.findById(req.body.noteId)
      .exec()
      .then(note => {

        if(!note) {
          return res.status(404).json({
            message: "Note not found"
          });
        }
        const author = new Author({
          _id: mongoose.Types.ObjectId(),
          name: req.body.name,
          age: req.body.age,
          numNote: req.body.numNote,
          note: req.body.noteId
        });
      
        return author
          .save()
      })
      .then(result => {
        console.log(result);
        res.status(201).json({
          message: 'Author sotred',
          createdAuthor: {
            _id: result._id,
            name: result.name,
            age: result.age,
            numNote: result.numNote, 
            note: result.note,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/authors/' + result._id 
            }
          }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
};

exports.authors_get_author = (req, res, next) => {

  Author
  .findById(req.params.authorId)
  .select('numNote name age note _id')
  .populate('note')
  .exec()
  .then(author => {
    if(!author) {
      res.status(404).json({
        message: 'Order not found'
      });
    }
    res.status(200).json({
      order: author,
      request: {
        type: 'GET',
        url: 'http://localhost:3000/authors' 
      }
    });
  })
  .catch(err => {
    res.status(500).json({
      error: err
    });
  });
};

exports.authors_update_author = (req, res, next) => {
  const id = req.params.authorId;
  const updateOps = {};
  for(const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Author.update({ _id: id}, { $set: updateOps })
        .exec()
        .then(result => {
          res.status(200).json({
            message: 'Author Updated',
            request: {
              type: 'GET',
              url: 'http://localhost:3000/authors/' + id
            }
          });
        }).catch(err => {
          console.log(err);
          res.status(500).json({
            error: err
          });
        });
};

exports.authors_delete_author = (req, res, next) => {
  Author
    .remove({ _id: req.params.authorId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Author deleted',
        request: {
          type: 'GET',
          url: 'http://localhost:3000/authors' 
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};