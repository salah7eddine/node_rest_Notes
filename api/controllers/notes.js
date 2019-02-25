const mongoose = require('mongoose');


const Note = require('../models/note');


exports.notes_get_all = (req, res, next) => {
  Note.find()
   .select('name type body postDate updateDate author _id')
   .exec()
   .then(docs => {
     const response = {
       count: docs.length,
       Notes: docs.map(doc => {
         return {
           id: doc._id,
           name: doc.name,
           type: doc.type,
           body: doc.body,
           postDate: doc.postDate,
           updateDate: doc.updateDate,
           author: doc.author,
           request: {
             type: 'GET',
             url: 'http://localhost:3000/notes/' + doc._id 
           }
         }
       })
     };
     //if(docs.length >= 0) {
       res.status(200).json(response);
     // } else {
     //   res.status(404).json({
     //     message: 'No entries found'
     //   });
     // }
   })
   .catch(err => {
     console.log(err);
     res.status(500).json({
       error: err
     });
   });
 }; 


exports.notes_create_note = (req, res, next) => {
  
  const note = new Note({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    type: req.body.type,
    body: req.body.body,
    postDate: new Date().toISOString(),
    updateDate: new Date().toISOString(),
    author: req.body.user
  });

  note
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Created Note succesfully',
        createdNote: {
          name: result.name,
          type: result.type,
          body: result.body,
          postDate: result.postDate,
          updateDate: result.updateDate,
          author: result.author,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/notes/' + result._id 
          }
        }
      });
    }).catch(err =>{
      console.log(err);
      res.status(500).json({
      error: err
      });
    });
};

exports.notes_get_note =  (req, res, next) => {
  const id = req.params.noteId;
  Note.findById(id)
        .select('name type body postDate updateDate author _id')
        .exec()
        .then(doc => {
          if(doc) {
            res.status(200).json({
              Note: doc,
              request: {
                type: 'GET',
                description: 'GET_ALL_NOTES',
                url: 'http://localhost:3000/notes/'
              }
            });
          } else {
            res;status(404).json({message: 'No Valid entry found for provided ID'});
          }
        }).catch(err => {
          console.log(err);
          res.status(500).json({
            error: err
          });
        });
}

exports.notes_update_note = (req, res, next) => {
  const id = req.params.noteId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value; 
  }
  Note.update({ _id: id }, { $set: updateOps })
      .exec()
      .then(result => {
        res.status(200).json({
          message: 'Notes Updated',
          request: {
            type: 'GET',
            url: 'http://localhost:3000/notes/' + id
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

exports.notes_delete_note =  (req, res, next) => {
  const id = req.params.noteId;
  Note
    .remove({_id: id})
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Note deleted',
        request: {
          type: 'POST',
          url: 'http://localhost:3000/notes',
          body: { name : 'String', type: 'String', body: 'String', postDate: 'Date', updateDate: 'Date', author: 'String' }
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};