let jwt = require("jsonwebtoken");
let config = require('./config')

let authentication = function (req, res, next) {
  
  
	const token = req.headers.authorization

	//if token is empty
	if (!token) {
		return res.status(401).send({status: 401, message: "Not Authorized"})
	}

	var payload
	try {
		//varyfing token
        payload = jwt.verify(token, config.secretkey)
        
	} catch (e) {
		if (e instanceof jwt.JsonWebTokenError) {
			
			return res.status(401).end()
		}
		// otherwise, return a bad request error
		return res.status(400).end()
	}


    
    next()
};

module.exports = authentication;