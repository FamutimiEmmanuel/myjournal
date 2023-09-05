const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Post = require('../models/Posts');
const writerauth = require('../middleware/writerauth');

router.get('/api/writerauth', writerauth, async (req, res) => {
    try {
      const writer = await Writer.findById(req.writer.id).select('-password');
      res.json(writer);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

router.post('/api/writers/posts', writerauth
 [
   check('title', 'please add name').not().isEmpty(),
   check('body', 'please enter a valid studentid').not().isEmpty()
 ],
  async (req, res) => {
    const errors =  validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, body } = req.body;
    try {
      let post = await Post.findOne({ title });

      if(post) {
        return res.status(400).json({ msg: 'Title already exists'});
      }

      post = new Post({
        id: req.writer.id,
       title,
       body
      });

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
      console.log('done')
    }
});