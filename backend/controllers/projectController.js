const Project = require('../models/Project');
const { sendNotification } = require('../utils/notificationHelper');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'Admin') {
      // Admin sees all projects
      projects = await Project.find().populate('teamMembers', 'name email').populate('createdBy', 'name');
    } else {
      // Member sees only assigned projects
      projects = await Project.find({ teamMembers: req.user._id }).populate('teamMembers', 'name email').populate('createdBy', 'name');
    }
    res.json(projects);
  } catch (error) {
    res.status(res.statusCode || 500).json({ message: error.message });
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private/Admin
const createProject = async (req, res) => {
  try {
    const { title, description, teamMembers, status } = req.body;

    const project = new Project({
      title,
      description,
      teamMembers: teamMembers || [],
      status: status || 'Active',
      createdBy: req.user._id,
    });

    const createdProject = await project.save();

    const io = req.app.get('io');
    if (teamMembers && teamMembers.length > 0) {
      for (const memberId of teamMembers) {
        if (memberId !== req.user._id.toString()) {
          await sendNotification(
            io,
            memberId,
            `You have been added to a new project: ${title}`,
            'Project',
            '/projects',
            'projectUpdates'
          );
        }
      }
    }

    res.status(201).json(createdProject);
  } catch (error) {
    res.status(res.statusCode || 500).json({ message: error.message });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Admin
const updateProject = async (req, res) => {
  try {
    const { title, description, teamMembers, status } = req.body;

    const project = await Project.findById(req.params.id);

    if (project) {
      project.title = title || project.title;
      project.description = description || project.description;
      // check for new members to notify
      const newMembers = teamMembers ? teamMembers.filter(m => !project.teamMembers.includes(m)) : [];

      if (teamMembers) project.teamMembers = teamMembers;
      project.status = status || project.status;

      const updatedProject = await project.save();

      const io = req.app.get('io');
      for (const memberId of newMembers) {
        if (memberId !== req.user._id.toString()) {
          await sendNotification(
            io,
            memberId,
            `You have been added to project: ${updatedProject.title}`,
            'Project',
            '/projects',
            'projectUpdates'
          );
        }
      }

      res.json(updatedProject);
    } else {
      res.status(404);
      throw new Error('Project not found');
    }
  } catch (error) {
    res.status(res.statusCode || 500).json({ message: error.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      await project.deleteOne();
      res.json({ message: 'Project removed' });
    } else {
      res.status(404);
      throw new Error('Project not found');
    }
  } catch (error) {
    res.status(res.statusCode || 500).json({ message: error.message });
  }
};

module.exports = {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
};
