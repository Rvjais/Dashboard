const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const { auth, adminAuth } = require('../middleware/auth');

// create a new client and assign to an employee
router.post('/', auth, adminAuth,async (req, res) => {

    try {
        const client = new Client({...req.body });
        await client.save();
        res.status(201).json(client);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create client' });
    }
});

// Update an existing client

router.patch('/:id', auth, adminAuth, async (req, res) => {
    try {
        const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }
        res.json(client);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update client' });
    
    }
})

module.exports = router;