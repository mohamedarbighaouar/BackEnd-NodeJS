var jwt = require('jsonwebtoken');

/*

houni on verifie l token o en meme temps tisrlou l refresh kenou expiré 

l principe simple l user yabaath hachtin fel header mtaa request accessToken o refreshToken 
o en retour yekhou l newAccessToken fel header mtaa response

*/ 


function verifyToken(req, res, next) {
  
  var accessToken = req.headers[process.env.ACCESS_TOKEN_HEADER_KEY];
  var refreshToken = req.headers[process.env.REFRESH_TOKEN_HEADER_KEY];

  if (!accessToken)
  {

    res.status(403).end()

  }else{

    jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET_KEY,(err,authData)=>{

      if(err)
      {
        
        jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET_KEY,(err,authData)=>{
          
          if(err)
          {

            res.status(403).end()
            
          }else{

            var newAccessToken = jwt.sign({ user: authData.user }, process.env.ACCESS_TOKEN_SECRET_KEY, {
              expiresIn: process.env.ACCESS_TOKEN_EXPIRED_IN 
            });

            req.user = authData.user

            res.setHeader('accessToken',newAccessToken)
            next()
          }

        })

      }else{

        req.user = authData.user
        res.setHeader('accessToken',accessToken)
        next()

      }

  })
  }  

};

module.exports = verifyToken;