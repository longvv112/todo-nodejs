const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let todoSchema = new Schema({
    description: {
        type: String,
        require: true
    },
    done: {
        type: Boolean,
        default: false
    },
    user: {
        type: Schema.ObjectId,
        ref: "user"
    }
});

module.exports = mongoose.model('Todo', todoSchema);