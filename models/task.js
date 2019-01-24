const mongoose = require('mongoose');
const moment = require('moment');

const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    text: { 
        type: String,
        required: true,
        trim: true
    },
    created_at: {
        type: Date,  
        required: true,
        default: Date.now
    }
});
 
// Virtual for task url
TaskSchema.virtual('url').get(function () {
    return `/task/${this._id}`;
});

TaskSchema.virtual('formatted_date').get(function () {
    return moment(this.created_at).startOf('hour').fromNow();
})

module.exports = mongoose.model('Task', TaskSchema);