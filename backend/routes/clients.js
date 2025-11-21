const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const { auth, adminAuth } = require('../middleware/auth');

// Public endpoint - Client self-onboarding (no authentication required)
router.post('/onboard', async (req, res) => {
    try {
        // Create client with 'pending' status by default
        const client = new Client({
            ...req.body,
            status: 'pending'
        });
        await client.save();
        res.status(201).json({
            message: 'Thank you for submitting your information! Our team will review and get back to you soon.',
            client: {
                id: client._id,
                name: client.name,
                email: client.email
            }
        });
    } catch (error) {
        console.error('Client onboarding error:', error);
        res.status(400).json({ error: 'Failed to submit client information' });
    }
});

// create a new client and assign to an employee (Admin only)
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

// Get all clients (all authenticated users can access)
router.get('/', auth, async (req, res) => {
    try {
        const clients = await Client.find()
            .populate('assignedEmployee', 'name department')
            .sort({ createdAt: -1 });
        res.json(clients);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch clients' });
    }
});

// Get clients assigned to a specific employee
router.get('/employee/:employeeId', auth, async (req, res) => {
    try {
        const clients = await Client.find({ assignedEmployee: req.params.employeeId })
            .populate('assignedEmployee', 'name department')
            .sort({ createdAt: -1 });
        res.json(clients);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch employee clients' });
    }
});

// Get pending clients (Admin only)
router.get('/pending', auth, adminAuth, async (req, res) => {
    try {
        const pendingClients = await Client.find({ status: 'pending' })
            .sort({ createdAt: -1 });
        res.json(pendingClients);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch pending clients' });
    }
});

// Approve client and assign to employee (Admin only)
router.patch('/:id/approve', auth, adminAuth, async (req, res) => {
    try {
        const { assignedEmployee } = req.body;
        const client = await Client.findByIdAndUpdate(
            req.params.id,
            {
                status: 'approved',
                assignedEmployee: assignedEmployee || null
            },
            { new: true }
        ).populate('assignedEmployee', 'name department');

        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }
        res.json(client);
    } catch (error) {
        res.status(400).json({ error: 'Failed to approve client' });
    }
});

// Reject client (Admin only)
router.patch('/:id/reject', auth, adminAuth, async (req, res) => {
    try {
        const client = await Client.findByIdAndUpdate(
            req.params.id,
            { status: 'rejected' },
            { new: true }
        );

        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }
        res.json(client);
    } catch (error) {
        res.status(400).json({ error: 'Failed to reject client' });
    }
});

module.exports = router;