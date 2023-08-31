const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const Writer = require('../models/Writers');
const writerauth = require('../middleware/writerauth');
const crypto = require('crypto')



router.post('/api/writers/register', 
 [
   check('name', 'please add name').not().isEmpty(),
   check('studentid', 'please enter a valid studentid').not().isEmpty(),
   check( 'email', 'please include a valid email').isEmail(),
   check('password', 'please enter a password with 6 or more characters').isLength({ min: 6})
 ],
  async (req, res) => {
    const errors =  validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, studentid, email, password, picture } = req.body;
    try {
      let writer = await Writer.findOne({ email });

      if(writer) {
        return res.status(400).json({ msg: 'Writer already exists'});
      }

      writer = new Writer({
        name,
        studentid,
        email,
        password,
        picture
      });

      const salt = await bcrypt.genSalt(10);
      writer.password = await bcrypt.hash(password, salt);
      await writer.save();

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
      console.log('done')
    }
});




module.exports = router;