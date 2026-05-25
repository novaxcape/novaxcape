const jwt = require('jsonwebtoken')

const authenticateToken = async(req, res, next)=>{
    try {
        const token = req.headers.authorization?.split(" ")[1]
        if(!token){
            return res.status(401).json({
                message: 'Token not found'
            })
        }
        
        const validToken = await jwt.verify(token, process.env.SECERT_KEY)
        req.user = validToken
        next()
    } catch (error) {
        next(error)
    }
}


const adminAuth = async (req, res, next) => {
    if(req.user.role !== 'admin'){
        return res.status(403).json({
            message: 'Access denied'
        })
    }
    next()
}

module.exports ={
     authenticateToken,
     adminAuth
}