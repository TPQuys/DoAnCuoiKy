const jwt = require("jsonwebtoken");

const middlewareController ={

    //verify token
    verifyToken: (req, res, next) => {
        const token = req.headers.token; 
        if (token) {
            const accessToken = token.split(" ")[1]; // Tách lấy access token
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
                if (err) {
                    return res.status(403).json(err); 
                }
                req.user = user; 
                next(); 
            });
        } else {
            return res.status(401).json("You're not authenticated"); // Gửi phản hồi nếu không có token
        }
    },
    
    verifyTokenAdmin: (req, res, next) =>{
        middlewareController.verifyToken(req, res, () => {
            if(req.user.id == req.params.id || req.user.admin){
                next();
            }else{
                res.status(403).json("You're not allowed");
            }
        });
    }
}

module.exports = middlewareController;