module.exports = (req, res, next) => {
    if (req.user.credits < 1) {
        return res.status(403).send("Sorry. You don't have enough credits.");
    } 
    // next() means proceed to the request handler 
    // from this middleware
    next();
}