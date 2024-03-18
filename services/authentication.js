const JWT=require('jsonwebtoken');
const secret="$uperman@123";


function createjwttoken(user){
    const payload={
        _id:user.id,
        email:user.email,
        profileImageUrl:user.profileImageUrl,
        role:user.role
    }
    const token=JWT.sign(payload,secret);
    return token;
}

function validateToken(token){
    const payload=JWT.sign(token,secret);
    return payload;
}

module.exports={
    createjwttoken,validateToken
};