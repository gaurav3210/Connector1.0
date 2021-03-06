const express = require('express');
const router =  express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const {check, validationResult} = require('express-validator');
const request = require('request');
const config = require('config');
// @route  GET api/profile/me
// @desc   Get current user's profile
// @access Private
router.get('/me',auth,async (req,res) => {

    try{

        const profile = await Profile.findOne({user: req.user.id}).populate('user',['name','avatar']);
        if(!profile){

            return res.status(400).json({msg: 'there is no profile for this user'});
        }

        res.json({profile});
    }catch (e) {
        console.error(e.message);
        res.status(500).send('Server error');
    }
});

// @route  POST api/profile
// @desc   create or update user profile
// @access Private

router.post('/',[auth,
    [check('status','Status is required').not().isEmpty(),
     check('skills','Skills is required').not().isEmpty()
    ]],async (req,res)=>{

    const  errors = validationResult(req);
    if(!errors.isEmpty()){
        return  res.status(400).json({errors:errors.array()});
    }
    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin,
    } = req.body;

    // built profile object
    const profileFields ={};
    profileFields.user = req.user.id;
    if(company)
        profileFields.company = company;
    if(website)
        profileFields.website = website;
    if(location)
        profileFields.location = location;
    if(bio)
        profileFields.bio = bio;
    if(status)
        profileFields.status = status;
    if(githubusername)
        profileFields.githubusername = githubusername;
    if(skills)
        profileFields.skills = skills.split(',').map(skill=>skill.trim());

    console.log(profileFields.skills);

    // built social objects
    profileFields.social = {}
    if(youtube)
        profileFields.social.youtube = youtube;
    if(twitter)
        profileFields.social.twitter = twitter;
    if(facebook)
        profileFields.social.facebook = facebook;
    if(linkedin)
        profileFields.social.linkedin = linkedin;
    if(instagram)
        profileFields.social.instagram = instagram;


    try{
        let profile = await Profile.findOne({user:req.user.id});
        if(profile){
            //update
            profile = await Profile.findOneAndUpdate({user:req.user.id},{$set:profileFields},{new: true});

            return res.json(profile);
        }
        //create
        profile = new Profile(profileFields);
        await profile.save();
        return res.json(profile);
    }catch (e) {
        console.error(e.message);
        res.send(500).send('Server Error');

    }
})

// @route  GET api/profile
// @desc   Get all profiles
// @access Public

router.get('/',async (req,res)=>{
    try{

        const profiles = await Profile.find().populate('user',['name','avatar']);
        res.json(profiles);
    }catch (e) {
        console.error(e.message);
        res.status(500).send('Server Error');

    }

})
// @route  GET api/profile/user/:user_id
// @desc   Get profile by user_id
// @access Public

router.get('/user/:user_id',async (req,res)=>{
    try{

        const profile = await Profile.findOne({user: req.params.user_id}).populate('user',['name','avatar']);
        if(!profile)
            return  res.status(400).json({msg:'No profile for this user'});

        res.json({profile});
    }catch (e) {
        console.error(e.message);
        if(e.kind == 'ObjectId')
        {
            return  res.status(400).json({msg:'No profile for this user'});

        }
        res.status(500).send('Server Error');

    }

})
// @route  Delete api/profile/user/:user_id
// @desc   delete profile,user and post
// @access Private

router.delete('/',auth, async (req,res)=>{
    try{

        await Profile.findOneAndRemove({user:req.user.id});
        await User.findOneAndRemove({_id: req.user.id});

        res.json({mag:'user deleted'});
    }catch (e) {
        console.error(e.message);
        res.status(500).send('Server Error');

    }

})
// @route  Put api/profile/experience
// @desc   Add profile experience
// @access Private

router.put('/experience',[auth,
check('title', 'Title is required').not().isEmpty(),
check('company', 'Company Name is Required').not().isEmpty(),
check('from', 'Start date is required').not().isEmpty()],

    async (req,res) => {

    const  errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description,
    } = req.body;

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }
    console.log("HELLO");
    try{

        const profile = await Profile.findOne({user: req.user.id});
        profile.experience.push(newExp);
        await profile.save();
        res.json(profile);
        console.log("HELLO1")
    }catch (e) {
        console.error(e.message);
        res.status(500).send('Server Error');

    }

});
// @route  DELETE api/profile/experience/:exp_id
// @desc   delete profile experience
// @access Private
router.delete('/experience/:exp_id', auth,async (req,res) =>{
    try{
        const profile = await Profile.findOne({user: req.user.id});

        //get remove index
        const removeIndex = profile.experience.map(item=>item.id).indexOf(req.params.exp_id);
        profile.experience.splice(removeIndex,1);
        await profile.save();
        res.json(profile);
    }catch (e) {
        console.error(e.message);
        res.status(500).send("Server Error");
    }
});
// @route  Put api/profile/education
// @desc   Add profile education
// @access Private

router.put('/education',[auth,
        check('school', 'School is required').not().isEmpty(),
        check('degree', 'Degree is Required').not().isEmpty(),
        check('fieldofstudy', 'Field of study is required').not().isEmpty(),
        check('from', 'start date is Required').not().isEmpty()],
    async (req,res) => {

        const  errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }

        const {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description,
        } = req.body;

        const newEdu = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        }

        try{

            const profile = await Profile.findOne({user: req.user.id});
            profile.education.push(newEdu);
            await profile.save();
            res.json(profile);
        }catch (e) {
            console.error(e.message);
            res.status(500).send('Server Error');

        }

    });
// @route  DELETE api/profile/education/:edu_id
// @desc   delete profile education
// @access Private
router.delete('/education/:edu_id', auth,async (req,res) =>{


    try{
        const profile = await Profile.findOne({user: req.user.id});

        //get remove index
        const removeIndex = profile.education.map(item=>item.id).indexOf(req.params.edu_id);
        profile.education.splice(removeIndex,1);
        await profile.save();
        res.json(profile);
    }catch (e) {
        console.error(e.message);
        res.status(500).send("Server Error");
    }
});
// @route  GET api/profile/github/:username
// @desc   Get user repos from Github
// @access Public
router.get('/github/:username',auth,async (req,res)=>{
    try{
        const options = {
            url: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc` +
                `&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: {'user-agent':'node.js'}
        };

        request(options,(error,response,body)=>{
            if(error) {
                console.error(error);
                res.status(500).send('Server Error');

            }

            if(response.statusCode!==200){
              return res.status(404).json({msg:'No Github account found'});
            }
            res.json(JSON.parse(body));
        })
    }catch (e) {
        console.error(e.message);
        res.status(500).send('Server Error');
    }
});



module.exports = router