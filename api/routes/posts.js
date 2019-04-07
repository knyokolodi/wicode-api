const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth')
const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, './uploads/')
  },
  filename: function(req, file, cb){
    cb(null, new Date().toISOString() + file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
    cb(null, true);
  }else{
    cb(null, false)
  }
}

const upload = multer({storage: storage, limits: {
  fileSize: 1024* 1024 * 5},
  fileFilter: fileFilter
});
const config = require('../../config');

const Post = require('../models/post');
const User = require('../models/user');

//Create posts
router.post('/:userId/', checkAuth, upload.single('postImage'), async (req, res, next) => {
    try{
      const user = await User.findById(req.params.userId);

      const post = new Post({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        message: req.body.message,
        postImage: req.file.path,
        creationDate: Date()
      });

      post.user = user;
      await post.save();

      user.posts.push(post);
      await user.save();

      res.status(200).json({
        success: true,
        post: {
          postId: post._id,
          title: post.title,
          message: post.message,
          postImage: post.postImage,
          creationDate: post.creationDate,
          request: {
            type: 'GET',
            url: config.api.url + post._id
          }
        }
      })
    }catch(error){
        console.log(error)
        res.status(500).json({error: error});
    }
})
//Get posts
router.get('/', async (req, res, next) => {
  try{
    const posts = await Post.find().populate('user');
    console.log('Post: ', posts)
    if(posts){
      res.status(200).json({
        sucess: true,
        count: posts.length,
        posts: posts.map(post => {
          return { 
            postId: post._id,
            title: post.title,
            message: post.message,
            postImage: post.postImage,
            creationDate: post.creationDate,
            user: {
              userId: post.user._id,
              name: post.user.fullNames,
              email: post.user.email,
              company: post.user.company,
              position: post.user.position
            }
          }
        })
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
//Get post by id
router.get('/:id', async (req, res, next) => {
  try{
    let id =  req.params.id;
    const post = await Post.findById(id).populate('user');
    if(post){
      res.status(200).json({
        sucess: true,
        post: {
          postId: post._id,
          title: post.title,
          message: post.message,
          postImage: post.postImage,
          creationDate: post.creationDate,
          user: {
            userId: post.user._id,
            name: post.user.fullNames,
            email: post.user.email,
            company: post.user.company,
            position: post.user.position
          }
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
//Update post data
router.patch('/:id', checkAuth, async (req, res, next) => {
  try{
    let id =  req.params.id;
    const updateData = {};
    for(const i of req.body){
      updateData[i.propName] = i.value;
    }
    const post = await Post.updateOne({_id: id}, {$set: updateData});
    res.status(200).json({
      sucess: true,
      _id : id,
      request: {
        type: 'GET',
        url: config.api.url + id
      }
    });
  }catch(error){
    res.status(500).json({error: error});
  }
 })
//delete post by id
 router.delete('/:id', checkAuth, async (req, res, next) => {
  try{
    let id =  req.params.id;
    const post = await Post.deleteOne({_id: id});
    if(post){
      res.status(200).json({
        sucess: true,
        _id: id,
        request: {
          type: 'POST',
          url: config.api.url,
          body: {title: 'String', message: 'String'}
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

module.exports = router;