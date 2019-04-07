const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const config = require('../../config');
const User = require('../models/user');
const Post = require('../models/post');
const jwt = require('jsonwebtoken');

router.post('/signup', async(req, res, next) => {
  try{
    const checkUser = await User.find({email: req.body.email});
    if(checkUser.length >= 1){
      res.status(409).json({
          success: false,
          message: 'Email already exists'
      })
    }else{
      bcrypt.hash(req.body.password, bcrypt.genSaltSync(12), null, async (err, hash) => {
        if(err){
            res.status(500).json({error: err})
        }else{
          try{
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              fullNames: req.body.fullNames,
              company: req.body.company,
              position: req.body.position,
              email: req.body.email,
              password: hash,
              creationDate: Date()
            });
            let userData = await user.save();
            console.log(userData)
            res.status(200).json({
                success: true,
                request: {
                  type: 'GET',
                  url: config.api.url + user._id
                }
            })
          }catch(error){
            res.status(500).json({error: error})
          }
        }
      })
    }
  }catch(error){
    res.status(500).json({error: error})
  }
});

router.post('/signin', async (req, res, next) => {
  try{
    const checkUser = await User.findOne({email: req.body.email});
    if(checkUser.length < 1){
      return res.status(401).json({
        success: false,
        message: 'Unauthoirized Credentials'
      })
    }
    bcrypt.compare(req.body.password, checkUser.password, (err, response) => {
      if(err){
        return res.status(401).json({
          success: false,
          message: 'Unauthoirized',
          error: err
        })
      }
      if(response){
        const token = jwt.sign({email: checkUser.email, id: checkUser._id}, config.jwt.key, 
          {expiresIn: '1h'}
        )
        return res.status(200).json({
          success: true,
          message: 'Authorized successfully',
          token: token
        })
      }
    })
  }catch(error){
    res.status(500).json({error: error});
  }
})

router.get('/:id', async (req, res, next) => {
  try{
    let id =  req.params.id;
    const user = await User.findById(id).populate('posts');
    console.profileEnd('User, ',user)
    if(user){
      res.status(200).json({
        sucess: true,
        user: {
          userId: user._id,
          name: user.fullNames,
          email: user.email,
          company: user.company,
          position: user.position,
          creationDate: user.creationDate,
          count: user.posts.length,
          posts: user.posts.map(post => {
            return {
              postId: post._id,
              title: post.title,
              message: post.message,
              postImage: post.postImage,
              creationDate: post.creationDate
            }
          })
        }
      });
    }else{
      res.status(404).json({
        message: 'No valid entry found'
      });
    }
  }catch(error){
    res.status(500).json({error: error});
  }
})

router.delete('/:id', async (req, res, next) => {
  try{
    let id =  req.params.id;
    const user = await User.deleteOne({_id: id});
    console.log(user)
    res.status(200).json({
      sucess: true,
      _id: id,
      request: {
        type: 'POST',
        url: `${config.api.url}user/signup`,
        body: {email: 'String', password: 'String'}
      }
    });
  }catch(error){
    res.status(500).json({error: error});
  }
});

module.exports = router;