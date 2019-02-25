const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');


const noteController = require('../controllers/notes');

router.get('/', checkAuth, noteController.notes_get_all);

router.post('/', checkAuth, noteController.notes_create_note);

router.get('/:noteId', checkAuth, noteController.notes_get_note);

router.patch('/:noteId', checkAuth, noteController.notes_update_note);

router.delete('/:noteId', checkAuth, noteController.notes_delete_note);



module.exports = router;
