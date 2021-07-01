const router = require('express').Router();
const Post = require('../models/postModel');

router.get('/', (req, res) => {
    Post.find()
        .then(posts => res.json(posts))
        .catch(e => res.status(400).json({ msg: e.message }))
})

router.get('/:id', async (req, res) => {
    Post.findById(req.params.id)
        .then(post => res.json(post))
        .catch(e => res.status(400).json({ msg: e.message }))
})

router.post('/submit_post', (req, res) => {
    const { userId, profilePic, username, url, type, caption, publicId } = req.body;

    const newPost = new Post({
        userId,
        profilePic,
        username,
        url,
        type,
        caption,
        publicId
    });

    newPost.save()
        .then(() => res.json('Post added!'))
        .catch(e => res.status(400).json({ msg: e.message }))
})

router.post('/update_profilePic/:username', (req, res) => {

    Post.updateMany(
        { "username": req.params.username },
        {
            $set: {
                "profilePic": req.body.profilePic
            }
        }
    )
        .then(() => res.json('Updated user profilePic!'))
        .catch(e => res.status(400).json({ msg: e.message }))

})

router.post('/update_username/:username', (req, res) => {

    Post.updateMany(
        { "username": req.params.username },
        {
            $set: {
                "username": req.body.username
            }
        }
    )
        .then(() => res.json('Updated username of user!'))
        .catch(e => res.status(400).json({ msg: e.message }))
})

router.put('/comments/:id', (req, res) => {
    Post.updateOne(
        { _id: req.params.id },
        {
            $push: {
                comments: {
                    $each: [
                        { 
                            id: req.body.id, 
                            comment: req.body.comment, 
                            profilePic: req.body.profilePic, 
                            username: req.body.username 
                        }
                    ]
                }
            }
        }
    )
        .then(comment => res.json(comment))
        .catch(e => res.status(400).json({ msg: e.message }))
})

router.put('/add_like/:id', (req, res) => {
    Post.updateOne(
        { _id: req.params.id },
        {
            $push: {
                likes: {
                    $each: [
                        { 
                            id: req.body.id, 
                            profilePic: req.body.profilePic, 
                            username: req.body.username 
                        }
                    ]
                }
            }
        }
    )
        .then(likes => res.json(likes))
        .catch(e => res.status(400).json({ msg: e.message }))
})

router.put('/delete_like/:id', (req, res) => {
    Post.updateOne(
        { _id: req.params.id },
        {
            $pull: {
                likes: {
                    id: req.body.id
                }
            }
        })
        .then(user => res.json(user))
        .catch(e => res.status(400).json({ msg: e.message }))
})

router.delete('/post/:id', (req, res) => {
    Post.findByIdAndDelete(req.params.id)
        .then(() => res.json('post deleted!'))
})

module.exports = router;