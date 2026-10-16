const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');
const userRoutes = require('./routes/user.routes');

const app = express();
app.use(express.json());

app.use('/api/users', userRoutes);

connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port: ${process.env.PORT}`);
    });
}).catch((err) => {
    console.log("Database connection failed", err);
    process.exit(1);
});