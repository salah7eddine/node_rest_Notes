const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const authorController = require('../controllers/authors');

router.get('/', checkAuth, authorController.authors_get_all);

router.post('/', checkAuth, authorController.authors_create_author);

router.get('/:authorId', authorController.authors_get_author);

router.patch('/:authorId', checkAuth, authorController.authors_update_author);

router.delete('/:authorId', checkAuth, authorController.authors_delete_author);


module.exports = router;
