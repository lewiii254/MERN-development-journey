const express = require('express');
require('dotenv').config();
const workoutRoutes = require('./routes/workouts');
const mongoose = require('mongoose');

// Create express app
const app = express();

// Middleware
app.use(express.json());

app.use((req, res, next) => {
    console.log(`Request received: ${req.method} ${req.url}`);
    next();
});


// routes for the app
app.use('/api/workouts', workoutRoutes);


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
 .then(() => {
    //listen for requests
    console.log('connected to db & listening on port', process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
});

 })
 .catch((error) => {
    console.log(error)
 })



if (!process.env.PORT) {
    console.error('PORT environment variable is not set.');
    process.exit(1);
} else {
    console.log(`Server is listening on port ${process.env.PORT}`);
}
