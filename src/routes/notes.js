const express = require('express');
const router = express.Router();

const Note = require('../models/Note');

const { isAuthenticated } = require('../helpers/auth');

router.get('/notes/add', isAuthenticated, (req, res) => {
    res.render('notes/new-note');
});

router.post('/notes/new-note', isAuthenticated ,async (req, res) => {
    // const { title, description} = req.body;
    const { name, last_name, city, address, phone_number} = req.body;
    const errors = [];
    if(!name){
        errors.push({text: 'Please Write The Name'});
    }
    if(!last_name){
        errors.push({text: 'Please Write The Last Name'});
    }
    if(!phone_number){
        errors.push({text: 'Please Write Your Phone Number'});
    }
    if(errors.length > 0){
        res.render('notes/new-note', {
            errors,
            name,
            last_name,
            city,
            address,
            phone_number
        });
    } else {
        const newNote = new Note({ name, last_name, city, address, phone_number});
        newNote.user = req.user.id;
        await newNote.save();
        req.flash('success_msg', 'Contact Added Successfully');
        res.redirect('/notes');
    }
});

router.get('/notes', isAuthenticated ,async (req, res) => {
    //el .lean() funciona para leer las variables privadas y el .sort() permite ordenar de forma ascendente o descendente
    const notes = await Note.find({user: req.user.id}).lean().sort({date: 'desc'});
    res.render('notes/all-notes', { notes });
});

router.get('/notes/edit/:id', isAuthenticated ,async (req, res) => {
    const note = await Note.findById(req.params.id).lean();
    res.render('notes/edit-notes', {note});
})

//Cumple la función de editar con el metodo findByIdAndUpdate utilizando el modelo Note
router.put('/notes/edit-note/:id', isAuthenticated ,async (req, res) => {
    const { name, last_name, city, address, phone_number }= req.body;
    await Note.findByIdAndUpdate(req.params.id, {name, last_name, city, address, phone_number}).lean();
    req.flash('success_msg','Contact Update Successfully');
    res.redirect('/notes');
});

//Eliminar
router.delete('/notes/delete/:id', isAuthenticated ,async (req, res) => {
    await Note.findByIdAndDelete(req.params.id).lean();
    req.flash('success_msg','Contact Delete Successfully');
    res.redirect('/notes')
})

module.exports = router;