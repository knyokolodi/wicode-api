
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Joi = require('joi');
const config = require('../../config')

router.post('/', async(req, res, next) => {
  try{
      const schema = Joi.object().keys({
        from: Joi.string().email(),
        to: Joi.alternatives().try(Joi.string().email(), Joi.array().items(Joi.string().email()))
          .required(),
        subject: Joi.string()
          .required(),
        html: Joi.string()
          .required()
      });
  
      await Joi.validate(req.body, schema);

      const transporter = await nodemailer.createTransport({
        service: config.mail.service,
        auth: {
          user: config.mail.username,
          pass: config.mail.password
        }
      });
        
      const mailOptions = {
        from: req.body.from,
        to: config.mail.sendTo,
        subject: req.body.subject,
        text: 'NO-TEXT!',
        html: req.body.html
      };
      
      let response = await transporter.sendMail(mailOptions);
      console.log(response);
      res.status(200).json({
        success: true,
        sentFrom: response.envelope.from,
        sentTo: response.envelope.to,
        response: response.response,
        messageID: response.messageId
      })
  }catch(error){
    res.status(500).json({
        error: error
    })
  }
})

module.exports = router;