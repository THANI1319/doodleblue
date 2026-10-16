const UserService = require('../services/user.services');
const extractToken = (req) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        return req.headers.authorization.split(' ')[1];
    }
    if (req.body && req.body.token) return req.body.token;
    return null;
};
class UserController {
    async signup(req, res) {
        try {
            const user = await UserService.signup(req.body);
            res.status(201).json({ message: 'Signup success', user });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
            
            const result = await UserService.login(email, password);
            res.status(200).json({ message: 'Login success', ...result });
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    }
    async decodeToken(req, res) {
        try {
            const token = extractToken(req);
            if (!token) {
                return res.status(400).json({ message: 'Token is required' });
            }
            
            const result = await UserService.getUserFromToken(token);
            return res.status(200).json({
                message: 'Token decoded successfully',
                decoded: result.decoded,
                user: result.user
            });
        } catch (error) {
            return res.status(401).json({ message: error.message });
        }
    }
    async getAllStudents(req, res) {
        try {
            const students = await UserService.getUsersByRole('Student');
            res.status(200).json(students);
        } catch (error) { res.status(500).json({ message: error.message }); }
    }

    async getStudentById(req, res) {
        try {
            const student = await UserService.getUserByIdAndRole(req.params.id, 'Student');
            if (!student) return res.status(404).json({ message: 'Student not found' });
            res.status(200).json(student);
        } catch (error) { res.status(500).json({ message: error.message }); }
    }

    async getAllTeachers(req, res) {
        try {
            const teachers = await UserService.getUsersByRole('Teacher');
            res.status(200).json(teachers);
        } catch (error) { res.status(500).json({ message: error.message }); }
    }

    async getTeacherById(req, res) {
        try {
            const teacher = await UserService.getUserByIdAndRole(req.params.id, 'Teacher');
            if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
            res.status(200).json(teacher);
        } catch (error) { res.status(500).json({ message: error.message }); }
    }

    async updateProfile(req, res) {
        try {
            // req.user.id token-la irunthu varuthu, so avanga data mattum thaan update aagum
            const updatedUser = await UserService.updateProfile(req.user.id, req.body);
            res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
        } catch (error) { res.status(500).json({ message: error.message }); }
    }

    async updateStudent(req, res) {
        try {
            // Teacher vera student-a update pandrathu
            const updatedStudent = await UserService.updateStudentByTeacher(req.params.id, req.body);
            res.status(200).json({ message: 'Student updated successfully by Teacher', user: updatedStudent });
        } catch (error) { res.status(400).json({ message: error.message }); }
    }
}

module.exports = new UserController();