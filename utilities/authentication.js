const jwt = require('jsonwebtoken')



function createTokenForUser(user){
    const payload = {
        _id: user._id,
        email: user.email,
        profileImageURL: user.profileImageURL,
        role: user.role,
    };
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET)
    return token;


}

function validateToken(token){
    try {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        return payload;
    } catch (error) {
        throw new Error("invalid token")
        
    }

} 


module.exports={
    createTokenForUser,
    validateToken
}