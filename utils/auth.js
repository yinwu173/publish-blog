const withAuth = (req, res, next) => {
    if(!req.session.loggedIn) {
        res.direct('./login');
    } else {
        next();
    }
};

module.exports = withAuth;