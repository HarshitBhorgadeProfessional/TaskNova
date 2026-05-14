const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/role');

router.route('/')
  .get(protect, getTasks)
  .post(protect, isAdmin, createTask);

router.route('/:id')
  .put(protect, updateTask) // Status can be updated by members, other fields by admin
  .delete(protect, isAdmin, deleteTask);

module.exports = router;
