const router = require('express').Router();
const { User, Post } = require('../models');
const withAuth = require('../utils/auth');

// GET route to find all posts
router.get('/', withAuth, async (req, res) => {
    try {
        const userData = await User.findAll({
            attributes: { exclude: ['password'] },
            order: [['name', 'ASC']],
        });

        const users = userData.map((project) => project.get({ plain: true }));

        res.render('homepage', {
            users,
            logged_in: req.session.logged_in,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET route to find one post
router.get('/post/:id', async (req, res) => {
    try {
        const postData = await Post.findOne({
            where: {
                id: req.params.id
            },
            attributes: [
                'id',
                'title',
                'body',
            ],
            include: [
                {
                    model: User,
                    attributes: ['username'],
                },
            ],
        });

        if (!postData) {
            res.status(404).json({ message: 'No post found.' });
            return;
        }

        const post = postData.get({ plain: true });

        res.render('post', {
            ...post,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});


// GET route to login
router.get('/login', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/');
        return;
    }

    res.render('login');
});

// GET route to sign up
router.get('/signup', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/');
        return;
    }

    res.render('signup');
});


module.exports = router;
