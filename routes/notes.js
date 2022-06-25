const express = require('express');
const router = express.Router();
const Notes = require('../models/Notes');
const fetchUser = require('../middleware/fetchUser');
const { body, validationResult } = require('express-validator');

//------------------------------------------------------------------------------//

router.get('/fetchAll',
    fetchUser,                  //Validating login using middleware
    async (req, res) => {
        try {
            //Finding user using user id.
            let notes = await Notes.find({ user: req.user.id })
            res.json(notes);
        }
        //Catching it there is an internal error
        catch (error) {
            res.status(500).json({ error: "Internal Server error" });
        }
    });
//------------------------------------------------------------------------------//

router.post('/addNotes',
    fetchUser,               //Validating login using middleware
    [
        body('title', 'Enter a valid title').isLength({ min: 3 }),
        body('description', 'Description should be atleast 5 chars long').isLength({ min: 5 })
    ],
    async (req, res) => {
        try {
            //Fetching errors of validation
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            //Creating new note
            const { title, description, tag } = req.body;
            const newNote = new Notes({
                user: req.user.id,
                title,
                description,
                tag
            })

            await newNote.save();
            res.status(200).json({ newNote });
        }
        //Catching it there is an internal error
        catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
//------------------------------------------------------------------------------//

router.put('/updateNote/:id',
    fetchUser,
    async (req, res) => {
        try {
            const { title, description, tag } = req.body;
            const newNote = {};

            if (title) {
                newNote.title = title;
            }
            if (description) {
                newNote.description = description;
            }
            if (tag) {
                newNote.tag = tag;
            }

            let note = await Notes.findById(req.params.id);

            if (!note) {
                return res.status(404).json({ error: "Note not found" });
            }
            if (note.user.toString() !== req.user.id) {
                return res.status(401).json({ error: "Access Denied" });
            }

            note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
            res.status(200).json({ note });
        }
        catch (error) {
            console.error(error.message);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
//------------------------------------------------------------------------------//

router.delete('/deleteNote/:id',
    fetchUser,
    async (req, res) => {
        try {

            let note = await Notes.findById(req.params.id);

            if (!note) {
                return res.status(404).json({ error: "Note not found" });
            }
            if (note.user.toString() !== req.user.id) {
                return res.status(401).json({ error: "Access Denied" });
            }

            note = await Notes.findByIdAndDelete(req.params.id)
            res.status(200).json({ "Success": "Note is successfully deleted" });
        }
        catch (error) {
            console.error(error.message);
            res.status(500).json({ error: "Internal Server Error" });
        }

    });
//------------------------------------------------------------------------------//

module.exports = router;