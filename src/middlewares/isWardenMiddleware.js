import asyncHandler from "express-async-handler";

const isWarden = asyncHandler(async (req, res, next) => {
    if (req.user.isWarden) {
        next();
    } else {
        res.status(403)
        throw new Error('Access Denied')
    }
});

export { isWarden }