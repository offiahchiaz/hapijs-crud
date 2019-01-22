const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    text: { type: String }
});

module.exports = mongoose.model('Task', TaskSchema);