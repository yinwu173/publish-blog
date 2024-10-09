const withAuth = (req, res, next) => {
    if(!req.session.logged_in) {
        res.direct('./login');
    } else {
        next();
    }
};

module.exports = withAuth;