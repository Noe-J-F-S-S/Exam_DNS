const mongoose = require('mongoose');
const { Schema } = mongoose;

// Estructura de las notas, requiere el campo usuario para guardar los datos del mismo usuario
const NoteSchema = new Schema ({
    name: { type: String, required: true},
    last_name: { type: String, required: true},
    city: { type: String, required: false},
    address: { type: String, required: false},
    phone_number: { type: String, required: true},
    imageLink: String,
    image_id: String,
    date: { type: Date, default: Date.now},
    user: { type: String}
});

module.exports = mongoose.model('Note', NoteSchema)