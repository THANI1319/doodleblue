const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controllers');
const authMiddleware = require('../middlewares/auth.middleware');
const authorizeRole = require('../middlewares/role.middleware');


router.post('/signup', UserController.signup);
router.post('/login', UserController.login);
router.post('/decode', UserController.decodeToken); 


router.use(authMiddleware);

router.put('/profile', UserController.updateProfile);



router.get('/students', authorizeRole('Student', 'Teacher'), UserController.getAllStudents);
router.get('/students/:id', authorizeRole('Student', 'Teacher'), UserController.getStudentById);

router.get('/teachers', authorizeRole('Teacher'), UserController.getAllTeachers);
router.get('/teachers/:id', authorizeRole('Teacher'), UserController.getTeacherById);
router.put('/students/:id', authorizeRole('Teacher'), UserController.updateStudent);

module.exports = router;