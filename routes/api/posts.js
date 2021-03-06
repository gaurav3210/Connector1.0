const express = require('express');
const router =  express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');
const {check, validationResult} = require('express-validator');
// @route  POST api/posts
// @desc   Create a post
// @access Private
router.post('/',[auth,[check('text','Text is required').not().isEmpty()]],
    async (req,res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(404).json({errors: errors.array()});
    }
    try {
        const user = await User.findById(req.user.id).select('-password');

        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });
        const post = await newPost.save();

        res.json(post);
    }catch (e) {
        console.error(e.message);
        res.status(500).send('Server error');

    }
});
// @route  GET api/posts
// @desc   Get all posts
// @access Private

router.get('/',auth,async (req,res)=>{
    try{
        const posts = await Post.find().sort({date:-1});
        res.json(posts);
    }catch (e) {
        console.error(e.message);
        res.status(500).send('Server Error');
    }
})
// @route  GET api/posts/:id
// @desc   Get post by id
// @access Private

router.get('/:id',auth,async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(!post) {
            return res.status(404).json({msg: 'post not found'});
        }
        res.json(post);
    }catch (e) {
        console.error(e.message);
        if(e.kind=='ObjectId'){
            return res.status(404).json({msg:'post not found'});
        }
        res.status(500).send('Server Error');
    }
})

// @route  Delete api/posts/:id
// @desc   delete a post
// @access Private

router.delete('/:id',auth,async (req,res)=>{
    try{
        const post = await Post.findById(req.parama.id);

        if(e.kind=='ObjectId'){
            return res.status(404).json({msg:'post not found'});
        }

        if(post.user.toString() != req.user.id){
            return res.status(401).json({msg:'User not authorised'});
        }
        await post.remove();
        res.json({msg: 'post successfully removed'});
    }catch (e) {
        console.error(e.message);
        if(e.kind=='ObjectId'){
            return res.status(404).json({msg:'post not found'});
        }
        res.status(500).send('Server Error');
    }
});

// @route  Put api/posts/like/:id
// @desc   like a post
// @access Private
router.put('/like/:id',auth,async (req,res)=>{
    try{

        const post = await Post.findById(req.params.id);

        // if(req.params.id.toString()===req.user.id)
        // {
        //     return res.status(400).json({msg:"can't like your own post"});
        // }
        if(post.likes.filter(like=>like.user.toString()===req.user.id).length>0)
        {
            return res.status(400).json({msg:'Post already liked'});
        }
        post.likes.unshift({user:req.user.id});
        await post.save();
        res.json(post.likes);
    } catch (e) {
        console.error(e.message);
        res.status(500).send('Server Error');
    }
});
// @route  Put api/posts/unlike/:id
// @desc   unlike a post
// @access Private
router.put('/unlike/:id',auth,async (req,res)=>{
    try{

        const post = await Post.findById(req.params.id);


        // if(req.params.id.toString()===req.user.id)
        // {
        //     return res.status(400).json({msg:"can't like your own post"});
        // }
        if(post.likes.filter(like=>like.user.toString()===req.user.id).length === 0)
        {
            return res.status(400).json({msg:'Post has not yet been liked'});
        }
        const removeIndex = post.likes.map(like=>like.user.toString()).indexOf(req.user.id);
        post.likes.splice(removeIndex,1);
        await post.save();
        return res.json(post.likes);
    } catch (e) {
        console.error(e.message);
        res.status(500).send('Server Error');
    }
});

// @route  POST api/posts/comments/:id
// @desc   Comment on a post
// @access Private
router.post('/comment/:id',[auth,[check('text','Text is required').not().isEmpty()]],
    async (req,res) => {

        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(404).json({errors: errors.array()});
        }
        try {
            const user = await User.findById(req.user.id).select('-password');

            const post = await Post.findById(req.params.id);
            const newComment = {
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            };

            post.comments.unshift(newComment);

            await post.save();

            res.json(post.comments);
        }catch (e) {
            console.error(e.message);
            res.status(500).send('Server error');

        }
    });

// @route  DELETE api/posts/comments/:id/:comment_id
// @desc   DeleteComment
// @access Private
router.delete('/comments/:id/:comment_id',auth,async (req,res)=>{

    try{
        const post = await Post.findById(req.params.id);

        const comment = post.comments.find(comment=>comment.id===req.params.comment_id);
        if(!comment){
            return res.status(404).json({msg:'Comment does not exist'});
        }
        if(comment.user.toString()!=req.user.id)
        {
            return res.status(401).json({msg:'user not authorised'});
        }
        const removeIndex = post.comments.map(comments=>comments.user.toString()).indexOf(req.user.id);
        post.comments.splice(removeIndex,1);
        await post.save();
        return res.json(post.comments);
    }catch (e) {
        console.error(e.message);
        res.status(500).send('Server error');
    }
})
module.exports = router;