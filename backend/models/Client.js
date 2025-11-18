// backend/models/Client.js
const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    // Other client fields
    assignedEmployee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Client', clientSchema);
