const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

class UserService {
    async signup({ name, email, password, role, department }) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword, role, department });
        user.password = undefined; 
        return user;
    }

    async login(email, password) {
        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error('Invalid email or password');
        }
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );
        
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;
        
        return { user: userWithoutPassword, token };
    }
    async getUserFromToken(token) {
        try {
           
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
          
            const user = await User.findOne({ _id: decoded.id, isActive: true });
            
            if (!user) {
                throw new Error('User not found or deactivated');
            }
            
        
            const userWithoutPassword = user.toObject();
            delete userWithoutPassword.password;

            return { decoded, user: userWithoutPassword };
        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    }
    async getUsersByRole(role) {
        return await User.find({ role, isActive: true });
    }

    async getUserByIdAndRole(id, role) {
        return await User.findOne({ _id: id, role, isActive: true });
    }

    async updateProfile(userId, updateData) {
       
        return await User.findByIdAndUpdate(userId, updateData, { new: true });
    }

    async updateStudentByTeacher(studentId, updateData) {
        // Teacher vera oru student data-va update pandrathu
        const student = await User.findOne({ _id: studentId, role: 'Student' });
        if (!student) {
            throw new Error('Student not found or ID belongs to a Teacher');
        }
        return await User.findByIdAndUpdate(studentId, updateData, { new: true });
    }
}

module.exports = new UserService();