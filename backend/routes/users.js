const express = require('express');
const router = express.Router();
const { getUsers, getUserById } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/role');

router.route('/')
  .get(protect, isAdmin, getUsers);

router.route('/:id')
  .get(protect, isAdmin, getUserById);

module.exports = router;
