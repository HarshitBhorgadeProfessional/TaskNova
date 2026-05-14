const express = require('express');
const router = express.Router();
const {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/role');

router.route('/')
  .get(protect, getProjects)
  .post(protect, isAdmin, createProject);

router.route('/:id')
  .put(protect, isAdmin, updateProject)
  .delete(protect, isAdmin, deleteProject);

module.exports = router;
