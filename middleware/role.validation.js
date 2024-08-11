exports.isUser = async(req, res, next) => {
    console.log(req.user.role)
    if(req.user.role == "user"){
        next()
    }
    else {
        return res.status(401).json({
            success: false,
            auth: false,
            message: "Forbidden! You are not User"
        })
    }
}
exports.isAdmin = async(req, res, next) => {
    console.log(req.user.role)
    if(req.user.role == "admin"){
        next()
    }
    else {
        return res.status(401).json({
            success: false,
            auth: false,
            message: "Forbidden! You are not Admin"
        })
    }
}