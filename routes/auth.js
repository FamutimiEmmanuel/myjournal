const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const writerauth = require('../middleware/writerauth'); 
const Writer = require('../models/Writers');  



router.get('/api/writerauth', writerauth, async (req, res) => {
  try {
    const writer = await Writer.findById(req.writer.id).select('-password');
    res.json(writer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/api/writer/login',
[
    check('email', 'please include a valid email').isEmail(),
    check('password', 'password is required').exists().isLength({ min: 6, max:10 })
]
,
 
 async (req, res) => {
    const errors =  validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password} = req.body;

    try {
       let writer = await Writer.findOne({ email });
        if(!writer) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        
        const ismatch = await bcrypt.compare(password, writer.password);
        if(!ismatch) {
            return res.status(400).send('invalid credentials');
        };


        const payload = {
          writer: {
            id:writer._id
          }
        }
        jwt.sign(payload, config.get('jwtsecret'), {
          expiresIn:36000
        }, (err, token) => {
          if(err) throw err;
          res.json({token});
        });
  
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
});



module.exports = router;