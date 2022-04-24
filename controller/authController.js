var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const uuid = require("uuid")
var mailer = require('../utils/MailSender');
const cryptoRandomString = require('crypto-random-string');
const formidable = require('formidable')
const storage = require('../utils/StorageHandler')
var path = require('path')
const fs = require("fs")


const VerifyEmail = async (req, res) => { 

  let idcode = req.params.idcode
  let iduser = req.params.iduser
  let code = req.params.code

  const queryString = "SELECT * FROM code WHERE idcode = ? "

  pool.query(queryString, [idcode], (err, rows, fields) => {
    if (err) {
      res.status(400).end()
      console.log(err)
    } else {
      if (code == rows[0].code) {
        verifyEmail(res, iduser, idcode)
      }

    }
  })

}

const signup = async (req, res) => {

  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

  let email = req.body.email
  let firstname = req.body.firstname
  let lastname = req.body.lastname
  let password = await  bcrypt.hash(req.body.password, 10)
  let isVerified = 0

  const queryStringEmail = "SELECT * FROM utilisateur WHERE email = ? "
  
  pool.query(queryStringEmail, [email], async (err, rows, fields) => {

    if (err) {
    
      res.status(400).end()
      console.log(err)

    }

    if (rows.length != 0) {
      res.status(203).send({ auth: false })
    }
    else { 

      const queryString = "INSERT INTO utilisateur (email,password,firstname,lastname) values (?,?,?,?)"

      pool.query(queryString, [email, password,firstname,lastname], async (err, rows, fields) => {
        if (err) {
 
          console.log(err)
          res.status(400).end()
          console.log(err)

        }
        else {

          let idutilisateur = rows.insertId

          const queryStringFinal = "INSERT INTO apprenant (job,utilisateur_idutilisateur) values (?,?)"
          
           pool.query(queryStringFinal, ["engineer", idutilisateur], (err, rows, fields) => {
            if (err) {
              
              console.log(err)

            }
            else {
           
              //res.status(200).send("success")
              //console.log("SignUP GOOD")
    
              sendVerificationMail(req, idutilisateur, email,res)
  

              let user = {idutilisateur,firstname,lastname,email,isVerified,type:1}
        
              var accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET_KEY, {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRED_IN 
              });
      
              var refreshToken = jwt.sign({ user }, process.env.REFRESH_TOKEN_SECRET_KEY, {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRED_IN 
              });
      
              res.status(200).send({ auth: true, accessToken , refreshToken, user });

            
            }
          })

        }


      })

    }

  })

}

const checkUserExistance = async (req, res) => {

  let email = req.body.email;

  const queryString = "SELECT * FROM utilisateur WHERE email = ? "
 pool.query(queryString, [email], (err, rows, fields) => {
    if (err) {

      res.status(400).end()
      console.log(err)
    
    }

    if (rows.length != 0) {
      res.status(200).send({ auth: true })
    }

    else {
      res.status(203).send({ auth: false })
    }

  })

}
const googleLinkedInSignIn = async (req, res) => {

  let email = req.body.email
  let associated = req.body.associated

  const queryString = "SELECT * FROM utilisateur WHERE email = ? and associated = ? "
   pool.query(queryString, [email,associated], (err, rows, fields) => {
    if (err) {
      
      res.status(400).end()
      console.log(err)
      
    }else{

      if (rows.length == 0) {
        res.status(402).end()
      }

      else {
        
        getUser(res,rows[0].idutilisateur)
  
      }

    }

    
  })

}


const googleLinkedInSignUp = async (req, res) => {

  // signin bel linkedin ouala google rahou besh iji houni
  // input: user schema (firstname,lastname,email,image)
  // logic: on verifie ken l user jdid s'il existe fel base ou pas si oui donc insert o baad get, sinon mawjoud fel base donc get toul
  // output : get user

  // upload image b formidable moush multer 
  // donc naamelou form besh nakraw l data khater l data tebaath bel multipart-form
  
  var form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    
    let firstname = fields.firstname
    let lastname = fields.lastname
    let email = fields.email
    let associated = fields.associated
    let profileImageFile = files.file
    let imgProfileFileName = Date.now() + path.extname(profileImageFile.name);

    let newOauthUser = {firstname,lastname,email,profileImageFile,associated,imgProfileFileName}
    
    const queryString = "SELECT * FROM utilisateur WHERE email = ? "
     pool.query(queryString, [
      email], (err, rows, fields) => {
      if (err) {
        
        res.status(400).end()
        console.log(err)
        
      }
  
      if (rows.length == 0) {
        //Ken user mahouch mawjoud
        insertUser(res,newOauthUser)
  
      }
      else {
        //Ken user mawjoud
        //getUser(res,rows[0])
        res.status(402).end()

      }
    })

  })


}

async function insertUser(res,newUserGoogle)
{

  const queryString = "INSERT INTO utilisateur (email,password,firstname,lastname,isVerified,associated,image) values (?,?,?,?,?,?,?)"
   pool.query(queryString, [newUserGoogle.email, uuid.v4(),newUserGoogle.firstname,newUserGoogle.lastname,"1",newUserGoogle.associated,newUserGoogle.imgProfileFileName], async (err, rows, fields) => {
    if (err) {

      console.log(err)
      res.status(400).end()

    }
    else {

      let idutilisateur = rows.insertId
      
      const queryStringFinal = "INSERT INTO apprenant (job,utilisateur_idutilisateur) values (?,?)"
      
     pool.query(queryStringFinal, ["", idutilisateur], (err, rows, fields) => {
        if (err) {
          
          res.status(400).end()
          console.log(err)
          
        }
        else {

          //Houni l upload image bel formidable
          // naatiweh l path mtaa dossier mteena 
          // o l path mtaa l file (li howa mel TEMP, l formidable ihotou ghadi)
          let rawData = fs.readFileSync(newUserGoogle.profileImageFile.path)
          let filePath = storage.profileImagePath()+'/'+newUserGoogle.imgProfileFileName
          
          fs.writeFile(filePath, rawData, function(err){
            if(err){

              res.status(400).end()
              console.log(err)

            }else{


            }
          })       
          
          getUser(res,idutilisateur)

        }
      })
    }
  })
  
}

async function getUser(res,idutilisateur)
{
  const queryStringFormateurUser = "SELECT * ,(select GROUP_CONCAT(DISTINCT specialite.idspecialite SEPARATOR ',') from formateur_has_specialite inner join specialite on formateur_has_specialite.specialite_idspecialite = specialite.idspecialite where formateur_idformateur = formateur.idformateur) as specialite_formateur FROM utilisateur inner join formateur on formateur.utilisateur_idutilisateur = utilisateur.idutilisateur where utilisateur.idutilisateur = ? "
     pool.query(queryStringFormateurUser, [ idutilisateur ], (err, rows, fields) => {
      if (err) {
        
        res.status(400).end()
        console.log(err)
    
      }
  
      if (rows.length != 0) {
        console.log("formateurtUser")

        let user = { type:2, idutilisateur: rows[0].idutilisateur,  email: rows[0].email, isVerified: rows[0].isVerified, firstname: rows[0].firstname, lastname: rows[0].lastname,centreInteret : "",specialite_formateur:rows[0].specialite_formateur == null ? "":rows[0].specialite_formateur,image:rows[0].image}
        
        var accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET_KEY, {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRED_IN 
        });

        var refreshToken = jwt.sign({ user }, process.env.REFRESH_TOKEN_SECRET_KEY, {
          expiresIn: process.env.REFRESH_TOKEN_EXPIRED_IN 
        });

        res.status(200).send({ auth: true, accessToken , refreshToken, user });
          
      }
      
    })

      
    const queryStringApprenantUser = "SELECT *, (select count(*) from utilisateur_has_categorie where utilisateur.idutilisateur = utilisateur_idutilisateur ) as centreinteret_count, (select GROUP_CONCAT(DISTINCT utilisateur_has_categorie.categorie_idcategorie SEPARATOR ',') from utilisateur_has_categorie where utilisateur_has_categorie.utilisateur_idutilisateur=utilisateur.idutilisateur ) as centre_interet FROM utilisateur inner join apprenant on apprenant.utilisateur_idutilisateur = utilisateur.idutilisateur   where utilisateur.idutilisateur = ? "
    
    pool.query(queryStringApprenantUser, [ idutilisateur ], (err, rows, fields) => {
      
      if (err) {
        
        res.status(400).end()
        console.log(err)

      }

      if (rows.length != 0 && rows[0].idutilisateur != null) {

        console.log("apprenantUser")

        let user = { type:1,job: rows[0].job,centreinteret_count:rows[0].centreinteret_count,centreInteret : rows[0].centre_interet  ?? "" , idutilisateur: rows[0].idutilisateur,  email: rows[0].email, isVerified: rows[0].isVerified, firstname: rows[0].firstname, lastname: rows[0].lastname,specialite_formateur:"",image:rows[0].image }
        
        var accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET_KEY, {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRED_IN 
        });

        var refreshToken = jwt.sign({ user }, process.env.REFRESH_TOKEN_SECRET_KEY, {
          expiresIn: process.env.REFRESH_TOKEN_EXPIRED_IN 
        });
        
        res.status(200).send({ auth: true, accessToken, refreshToken, user });


      }else{

        console.log("sssssssss")

      }

    })
}


const login = async (req, res) => {

  console.log("Login Called")

  let email = req.body.email;
  let password = req.body.password;

  //console.log("Token is :" + req.headers.token)

  const queryString = "SELECT * FROM utilisateur WHERE email = ? "
   pool.query(queryString, [email], (err, rows, fields) => {
    if (err) {
      
      res.status(410).end()

    }

    if (rows.length == 0) {

      res.status(201).send({ auth: false })
    
    }
    else {

      checkUser(password, rows[0], res)
   
    }
  })

}


async function sendVerificationMail(req, iduser, email,res) {

  let code = uuid.v4()        

  const queryString = "INSERT INTO code (utilisateur_idutilisateur,code) values (?,?) "

  pool.query(queryString, [iduser, code], (err, rows, fields) => {
    if (err) {

      res.status(400).end()
      console.log(err)
   
    } else {

      let urlOfVerification = req.protocol + "://" + req.headers.host + "/skillspace/auth/VerifyEmail/" + rows.insertId + "/" + iduser + "/" + code;
      sendMail(urlOfVerification, email,res)

    }

  })

}


async function sendMail(urlOfVerification, to,res) {

  var mailOptions = {

    from: process.env.NODE_MAILER_USER,
    to: to,
    subject: 'Please verify your SkillSpace account',
    html: '<h1>Click here to verify your account</h1><a href =' + urlOfVerification + '>click here to verify </a>'

  };

  mailer.transporter.sendMail(mailOptions, function (error, info) {
    if (error) {

      res.status(400).end()
      console.log(err)

    } else {

      console.log('email sent') 

    }

  })
}

async function verifyEmail(res, iduser, idcode) {

  const queryString = "UPDATE utilisateur set isVerified = '1' where idutilisateur = ?"

   pool.query(queryString, [iduser], async (err, rows, fields) => {
    if (err) {

      res.status(400).end()
      console.log(err)
   
    } else {

      const queryString = "DELETE FROM CODE WHERE idcode = ?"

       pool.query(queryString, [idcode], (err, rows, fields) => {
        if (err) {

          res.status(400).end()
          console.log(err)
    
        } else {

          res.status(200).send("user email verified")

        }
      })

    }
  })
}

async function checkUser(password, existingUser, res) {

  const match = await bcrypt.compare(password, existingUser.password);

  if (match) {

    const queryStringFormateurUser = "SELECT * ,(select GROUP_CONCAT(DISTINCT specialite.idspecialite SEPARATOR ',') from formateur_has_specialite inner join specialite on formateur_has_specialite.specialite_idspecialite = specialite.idspecialite where formateur_idformateur = formateur.idformateur) as specialite_formateur FROM utilisateur inner join formateur on formateur.utilisateur_idutilisateur = utilisateur.idutilisateur where utilisateur.idutilisateur = ? "
     pool.query(queryStringFormateurUser, [ existingUser.idutilisateur ], (err, rows, fields) => {
      if (err) {
        
        res.status(400).end()
        console.log(err)
    
      }
  
      if (rows.length != 0) {
        console.log("formateurtUser")

        let user = { type:2, idutilisateur: existingUser.idutilisateur,  email: existingUser.email, isVerified: existingUser.isVerified, firstname: existingUser.firstname, lastname: existingUser.lastname,centreInteret : "",specialite_formateur:rows[0].specialite_formateur == null ? "":rows[0].specialite_formateur,image:existingUser.image}
        
        var accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET_KEY, {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRED_IN 
        });

        var refreshToken = jwt.sign({ user }, process.env.REFRESH_TOKEN_SECRET_KEY, {
          expiresIn: process.env.REFRESH_TOKEN_EXPIRED_IN 
        });

        res.status(200).send({ auth: true, accessToken , refreshToken, user });
          
      }
      
    })

      
    const queryStringApprenantUser = "SELECT *, (select count(*) from utilisateur_has_categorie where utilisateur.idutilisateur = utilisateur_idutilisateur ) as centreinteret_count, (select GROUP_CONCAT(DISTINCT utilisateur_has_categorie.categorie_idcategorie SEPARATOR ',') from utilisateur_has_categorie where utilisateur_has_categorie.utilisateur_idutilisateur=utilisateur.idutilisateur ) as centre_interet FROM utilisateur inner join apprenant on apprenant.utilisateur_idutilisateur = utilisateur.idutilisateur   where utilisateur.idutilisateur = ? "
    
    pool.query(queryStringApprenantUser, [ existingUser.idutilisateur ], (err, rows, fields) => {
      
      if (err) {
        
        res.status(400).end()
        console.log(err)

      }

      if (rows.length != 0 && rows[0].idutilisateur != null) {

        console.log("apprenantUser")

        let user = { type:1,job: rows[0].job,centreinteret_count:rows[0].centreinteret_count,centreInteret : rows[0].centre_interet  ?? "" , idutilisateur: existingUser.idutilisateur,  email: existingUser.email, isVerified: existingUser.isVerified, firstname: existingUser.firstname, lastname: existingUser.lastname,specialite_formateur:"",image:existingUser.image }
        
        var accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET_KEY, {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRED_IN 
        });

        var refreshToken = jwt.sign({ user }, process.env.REFRESH_TOKEN_SECRET_KEY, {
          expiresIn: process.env.REFRESH_TOKEN_EXPIRED_IN 
        });
        
        res.status(200).send({ auth: true, accessToken, refreshToken, user });


      }else{

        console.log("sssssssss")

      }

    })

  }
  else {
    res.status(203).send({ auth: false, token: null });
  }

  
}

///////////////////// RESET PASSWORD SECTION /////////////////////

const resetPassword = async (req, res) => {

  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
  let email = req.body.email;
  let code =  cryptoRandomString({length: 10, type: 'alphanumeric'});
  checkEmailForPassword(email,code,res)

}

async function checkEmailForPassword(email,code,res)
{
  const queryString = "SELECT * FROM utilisateur WHERE email = ? "
   pool.query(queryString, [email], (err, rows, fields) => {
    if (err) {
   
      res.status(400).end()
      console.log(err)
   
    }

    if (rows.length != 0) {

      console.log(rows)
      addPasswordCodeToDataBase(email,code,rows[0]['idutilisateur'],res)

    }

    else {
      res.status(203).send({ auth: false })
      console.log("not found")
    }

  })

}


async function addPasswordCodeToDataBase(email,code,iduser,res)
{
  const queryString = "INSERT INTO code (utilisateur_idutilisateur,code) values (?,?) "

   pool.query(queryString, [iduser, code], (err, rows, fields) => {
    if (err) {

      res.status(400).end()
      console.log(err)
   
    } else {

      sendMailPassword(email,code,res)
    }


  })
}

async function sendMailPassword(to,code,res) {

  var mailOptions = {
    from: 'SkillSpace.orange@gmail.com',
    to: to,
    
    subject: 'Mot de passe oublié SkillSpace',

    html: '<h1> Code pour changer le mot de passe: <p style="background-color:powderblue;">' +code+ ' </p> </h1>'

  };

  await mailer.transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      
      res.status(400).end()
      console.log(err)
   
    } else {

      console.log('email sent')
      res.status(200).send({auth : true})
    }

  })
}



////////////////// VERIF RESET PASSWORD SECTION //////////////////


const checkResetPassword = async (req, res) => {
  let email = req.body.email;
  let code = req.body.code;

  console.log(email,code)

  getIdFromMail(email,code,res)
}


async function getIdFromMail(email,code,res)
{
  const queryString = "SELECT * FROM utilisateur WHERE email = ? "
  await pool.query(queryString, [email], (err, rows, fields) => {
    if (err) {
   
      res.status(400).end()
      console.log(err)
   
    }

    if (rows.length != 0) {
        verifCode(rows[0]['idutilisateur'],code,res)
    }
    else {
        res.status(203).send({ auth: false })
    }

  })

}


async function verifCode(id,code,res)
{
  const queryString = "SELECT * FROM code WHERE utilisateur_idutilisateur = ? and code = ? "
    pool.query(queryString, [id,code], (err, rows, fields) => {
    if (err) {
     
      res.status(410).end()
   
    }

    if (rows.length != 0) {
      
      console.log("Good")

        deleteCodeReset(id,res)

    }
    else {
            console.log("Bad")
      res.status(203).send({ auth: false })

      
    }

  })

}


async function deleteCodeReset(id,res)
{
  const queryString = "DELETE  FROM code WHERE utilisateur_idutilisateur = ? "
   pool.query(queryString, [id], (err, rows, fields) => {
    if (err) {
      
      res.status(400).end()
      console.log(err)
    
    }else{
      
      res.status(200).send({ auth: true }) 

    }
  })
  
}

////////////////// UPDATE PASSWORD SECTION //////////////////

const updatePassword = async (req, res) => {
  let email = req.body.email;
  let password = await bcrypt.hash(req.body.password, 10)
  const queryString = "UPDATE utilisateur SET password = ? WHERE email = ? "
   pool.query(queryString, [password,email], (err, rows, fields) => {
    if (err) {

      res.status(400).end()
      console.log(err)

    }
    else {
     res.status(200).send({auth:true})
    }

  })
}


module.exports = {

  googleLinkedInSignUp,googleLinkedInSignIn,login,checkUserExistance,signup,VerifyEmail,resetPassword,checkResetPassword,updatePassword

}




