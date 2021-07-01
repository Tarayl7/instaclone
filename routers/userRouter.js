const router = require('express').Router();
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(e => res.status(400).json({ msg: e.message }))
})

router.get('/:id', auth, async (req, res) => {
    User.findById(req.params.id)
        .then(user => res.json(user))
        .catch(e => res.status(400).json({ msg: e.message }))
})

router.post('/sign_up', async (req, res) => {
    const email = req.body.email;
    const fullName = req.body.fullName;
    const username = req.body.username;
    const password = req.body.password;

    try {
        // email regex
        const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        
        // If email is invalid
        if(!email.match(emailRegEx)) return res.status(400).send('Invalid email');
        
        // Find email in database
        const emailInDatabase = await User.findOne({ email });
           
        // If email already in database
        if (emailInDatabase) return res.status(400).send('Email already exists');
           
        // Find username in database
        const usernameInDatabase = await User.findOne({ username });
           
        // If username in database
        if (usernameInDatabase) return res.status(400).send('Username already exists');

        // password regex
        const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!?])([a-zA-Z0-9!?])/;

        // If password is invalid
        if(!password.match(passwordRegex)) return res.status(400).send('Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and a special character(!, ?)');

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            fullName,
            username,
            password: hashed
        })

        newUser.save()
            .then(() => res.json('User added!'))
            .catch(e => res.status(400).json({ msg: e.message }))

    } catch (e) {
        res.status(400).json(e.message)
    }

})

router.post('/login', async (req, res) => {
    const emailOrUsername = req.body.emailOrUsername;
    const password = req.body.password;

    try {
        // Find email in database
        const emailInDatabase = await User.findOne({ email: emailOrUsername });

        // Find username in database
        const usernameInDatabase = await User.findOne({ username: emailOrUsername });

        // Identify user by either their email or username
        const user = (emailInDatabase || usernameInDatabase);

        // If no user in database
        if (!user) return res.status('400').send('User does not exist');

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);

        // If password does not match 
        if (!isMatch) return res.status('400').send('Password was incorrect');

        // Sign token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: 86400 });

        // If no token
        if (!token) return res.status('400').send('Could not sign the token');

        res.status(200).json({
            id: user._id,
            username: user.username,
            fullName: user.fullName,
            profilePic: user.profilePic,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            publicId: user.publicId,
            token
        })

    } catch (e) {
        res.status(400).json(e.message);
    }
})

router.put('/followers/:id', (req, res) => {
    User.updateOne(
        { _id: req.params.id },
        {
            $push: {
                followers: {
                    $each: [
                        {
                            id: req.body.id,
                            username: req.body.username,
                            fullName: req.body.fullName,
                            profilePic: req.body.profilePic
                        }
                    ]
                }
            }
        }
    )
        .then(user => res.json(user))
        .catch(e => res.status(400).json({ msg: e.message }))
})

router.put('/followers/delete/:id', (req, res) => {
    User.updateOne(
        { _id: req.params.id },
        {
            $pull: {
                followers: {
                    id: req.body.id
                }
            }
        })
        .then(user => res.json(user))
        .catch(e => res.status(400).json({ msg: e.message }))
})

router.put('/following/:id', (req, res) => {
    User.updateOne(
        { _id: req.params.id },
        {
            $push: {
                following: {
                    $each: [
                        {
                            id: req.body.id,
                            username: req.body.username,
                            fullName: req.body.fullName,
                            profilePic: req.body.profilePic
                        }
                    ]
                }
            }
        }
    )
        .then(user => res.json(user))
        .catch(e => res.status(400).json({ msg: e.message }))
})

router.put('/following/delete/:id', (req, res) => {
    User.updateOne(
        { _id: req.params.id },
        {
            $pull: {
                following: {
                    id: req.body.id
                }
            }
        })
        .then(user => res.json(user))
        .catch(e => res.status(400).json({ msg: e.message }))
})

router.put('/messages/add_user/:id', (req, res) => {
    User.updateOne(
        { _id: req.params.id },
        {
            $push: {
                messages: {
                    $each: [
                        {
                            recipientId: req.body.recipientId,
                            recipientUsername: req.body.recipientUsername,
                            recipientFullName: req.body.recipientFullName,
                            recipientProfilePic: req.body.recipientProfilePic,
                            messagesBetweenRecipient: []
                        }
                    ]
                }
            }
        }
    )
        .then(user => res.json(user))
        .catch(e => res.status(400).json({ msg: e.message }))
})

router.put('/messages/:id', (req, res) => {
    User.updateOne(
        { _id: req.params.id, "messages.recipientUsername": req.body.recipientUsername },
        {
            $push: {
                "messages.$.messagesBetweenRecipient": {
                    $each: [
                        {
                            id: req.body.id,
                            profilePic: req.body.profilePic,
                            username: req.body.username,
                            message: req.body.message
                        }
                    ]
                }
            }
        }
    )
        .then(user => res.json(user))
        .catch(e => res.status(400).json({ msg: e.message }))
})

router.put('/update_user_info/:id', async (req, res) => {
    const { username, loggedInUserUsername } = req.body;

    const usernameInDatabase = await User.findOne({ username });

    // If username is in database and it is not the username of the logged in user
    if (usernameInDatabase && loggedInUserUsername !== username) return res.status(400).send('Username already exists');

    User.findById(req.params.id)
        .then(user => {
            user.username = req.body.username;

            user.fullName = req.body.fullName;

            user.bio = req.body.bio || "";

            user.save()
                .then(() => res.json('User updated!'))
                .catch(e => res.status(400).json({ msg: e.message }))
        })
        .catch(e => res.status(400).json({ msg: e.message }))

})

router.patch('/update_profilePic/:id', (req, res) => {
    User.findById(req.params.id)
        .then(user => {
            user.profilePic = req.body.profilePic,
                user.publicId = req.body.publicId

            user.save()
                .then(() => res.json('Profile picture updated'))
                .catch(e => res.status(400).json({ msg: e.message }))
        })
        .catch(e => res.status(400).json({ msg: e.message }))
})

router.put('/update_names_of_arrays/:username', (req, res) => {
    User.updateMany(
        {},
        {
            $set: {
                "followers.$[followers].username": req.body.username,
                "followers.$[followers].fullName": req.body.fullName,
                "following.$[following].username": req.body.username,
                "following.$[following].fullName": req.body.fullName,
                "messages.$[messages].recipientUsername": req.body.username,
                "messages.$[messages].recipientFullName": req.body.fullName,
                "messages.$[].messagesBetweenRecipient.$[messagesBR].username": req.body.username
            }
        },
        {
            arrayFilters: [
                {
                    "followers.username": req.params.username
                },
                {
                    "following.username": req.params.username
                },
                {
                    "messages.recipientUsername": req.params.username
                },
                {
                    "messagesBR.username": req.params.username
                }
            ]
        }
    )
        .then(() => res.json('arrays updated!'))
        .catch(e => res.status(400).json({ msg: e.message }))
})

router.put('/update_profilePic_of_arrays/:username', (req, res) => {
    User.updateMany(
        {},
        {
            $set: {
                "followers.$[followers].profilePic": req.body.profilePic,
                "following.$[following].profilePic": req.body.profilePic,
                "messages.$[messages].recipientProfilePic": req.body.profilePic,
                "messages.$[].messagesBetweenRecipient.$[messagesBR].profilePic": req.body.profilePic
            }
        },
        {
            arrayFilters: [
                {
                    "followers.username": req.params.username
                },
                {
                    "following.username": req.params.username
                },
                {
                    "messages.recipientUsername": req.params.username
                },
                {
                    "messagesBR.username": req.params.username
                }
            ]
        }
    )
        .then(() => res.json('arrays updated!'))
        .catch(e => res.status(400).json({ msg: e.message }))
})

module.exports = router;