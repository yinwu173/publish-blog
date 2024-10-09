const router = require('express').Router();
const { User } = require('../../models');

// POST route to create a new user
router.post('/', async (req, res) => {
  try {
    // create a new user using data in the request body
    const userData = await User.create(req.body);

    // save the new user id in the session
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      // return json reponse with the user data
      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

// POST route to user login
router.post('/login', async (req, res) => {
  try {
    // find user by email
    const userData = await User.findOne({ where: { email: req.body.email } });

    // if no email matches are found, return error message
    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    // check user password 
    const validPassword = await userData.checkPassword(req.body.password);

    // if user password does not match, return error message
    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    // if email and password are valid, save session data
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      
      res.json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    res.status(400).json(err);
  }
});

// POST route for user to log out
router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
