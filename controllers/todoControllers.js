const Todo = require('../models/todo');
const { body, validationResult } = require('express-validator');

const getAllTodos = async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const createTodo = [
    body('task').notEmpty().withMessage('Task is required'),
    body('completed').isBoolean().withMessage('Completed should be a boolean'),
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { task, completed } = req.body;
        try {
            const newTodo = new Todo({ task, completed });
            await newTodo.save();
            res.status(201).json(newTodo);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
];

const updateTodo = [
    body('task').notEmpty().withMessage('Task is required'),
    body('completed').isBoolean().withMessage('Completed should be a boolean'),
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { task, completed } = req.body;
        try {
            const updatedTodo = await Todo.findByIdAndUpdate(id, { task, completed }, { new: true });
            res.json(updatedTodo);
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
];

const deleteTodo = [
    async (req, res) => {
        const { id } = req.params;

        try {
            // No need for validation of id in this case as it's coming from URL params
            await Todo.findByIdAndDelete(id);
            res.json({ message: 'Todo deleted successfully' });
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
];

module.exports = { getAllTodos, createTodo, updateTodo, deleteTodo };
