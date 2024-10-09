const router = require('express').Router();
const { Post } = require('../../models');
const withAuth = require('../../utils/auth');


// POST route for user to create new blog post only if logged in
router.post('/', withAuth, async (req, res) => {
    try {
        // create new post and associate with logged in user
        const newPost = await Post.create({
            ...req.body,
            user_id: req.session.user_id,
        });
        // respond with new post
        res.status(200).json(newPost);
    } catch (err) {
        res.status(400).json(err);
    }
});

module.exports = router;