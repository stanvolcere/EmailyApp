module.exports = (req, res, next) => {
    if (!req.user) {
        return res.status(401).send("You have to log in.");
    } 
    // next() means proceed to the request handler 
    // from this middleware
    next();
}