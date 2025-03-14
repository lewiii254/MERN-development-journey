const express = require('express');

// const Workout = require('../models/workoutModel');
const Workout = require('../models/workoutModel');

const router = express.Router();

// GET all workouts
router.get('/', (req, res) => {
    res.json({mssg: 'Get all workouts'});
});

// GET a specific workout
router.get('/:id', (req, res) => {
    res.json({mssg: `Get workout with id ${req.params.id}`});
});
// POST a new workout
router.post('/', async(req, res) => {
    
    const { title, reps, loads } = req.body;

    try {
        const workout = await Workout.create({ title, reps, loads });
        res.status(200).json({ workout });

    } catch(error) {
        res.status(400).json({ error: error.message });

    }
    // res.json({mssg: 'Create a new workout'});
});

// delete a workout
router.delete('/:id', (req, res) => {
    res.json({mssg: `Delete workout with id ${req.params.id}`});
});

// update  a workout
router.patch('/:id', (req, res) => {
    res.json({mssg: `Update workout with id ${req.params.id}`});
});


module.exports = router;