var pdf = require("pdf-creator-node");
var fs = require("fs");
var path = require('path')
const uuid = require("uuid")
const storage = require('../utils/StorageHandler')
var mailer = require('../utils/MailSender');

const createCertification = async (req, resRoute) => { 

    let idformation = req.body.idformation
    let idutilisateur = req.user.idutilisateur
    let filename = uuid.v4()+".pdf"
    console.log(idutilisateur)
    const queryString = "select idFormation,title,filename,email from attestation inner join utilisateur on attestation.utilisateur_idutilisateur = utilisateur.idutilisateur inner join formation on attestation.formation_idFormation = formation.idformation where attestation.formation_idFormation = ? and attestation.utilisateur_idutilisateur = ? "
    await pool.query(queryString, [idformation,idutilisateur], async (err, rows, fields) => {

        if (err) {

            resRoute.status(400).end()
            console.log(err)

        } else {

            if (rows.length == 0)
            {
            
                const queryStringUtilisateur = "select email,firstname,lastname from utilisateur where idutilisateur = ?;"
                await pool.query(queryStringUtilisateur, [idutilisateur], async (err, rowsUtilisateur, fields) => {
                
                    if (err)
                    {
                        resRoute.status(400).end()
                        console.log(err)

                    }else{

                        const queryStringFormation = "select title from formation where idformation = ?"
                        await pool.query(queryStringFormation, [idformation], async (err, rowsFormation, fields) => {
                        
                            if (err)
                            {
                                resRoute.status(400).end()
                                console.log(err)
        
                            }else{
        
                                let utilisateur = rowsUtilisateur[0]
                                let formation = rowsFormation[0]
                                let outputAttestationFilePath = storage.singleCertificationPath(idformation)+"/"+filename

                                let certifContent = {

                                    name: utilisateur.firstname + " " + utilisateur.lastname, 
                                    formationTitle : formation.title,
                                    email : utilisateur.email
                                }

                                const queryStringFormation = "insert into attestation(formation_idFormation,utilisateur_idutilisateur,filename,created_at) values (?,?,?,CURRENT_TIMESTAMP)"
                                await pool.query(queryStringFormation, [idformation,idutilisateur,filename], async (err, rowsFormation, fields) => {
                                
                                    if (err)
                                    {
                                        resRoute.status(400).end()
                                        console.log(err)
                
                                    }else{

                                        generateCertification(resRoute,certifContent,outputAttestationFilePath)

                                    }

                                })
     
                            }
                        
                        })
                    
                    
                    }
                
                })

            }else {

                //certification exists 
                let outputAttestationFilePath = storage.singleCertificationPath(rows[0].idFormation)+"/"+rows[0].filename
                sendMail(outputAttestationFilePath,rows[0].title, rows[0].email,resRoute)

            }

        }
    })

}


function generateCertification(resRoute,certif,outputFilePath)
{

    const html = fs.readFileSync(path.join(__dirname, '../', 'utils','template', 'certification.html'), "utf8")
        
    var options = {
        
        format: "A4",
        orientation: "portrait",
    };

    var document = {
        html: html,
        data: {
            certif: certif,
        },
        path: outputFilePath,
        type: "",
    };

    pdf
  .create(document, options)
  .then((res) => {

    sendMail(outputFilePath,certif.formationTitle, certif.email,resRoute)

  })
  .catch((error) => {
    console.error(error);
    resRoute.status(404).end()
  });

}


const getCertifications = async (req, res) => {

    let idutilisateur = req.user.idutilisateur
    
    const queryString = "select * from attestation inner join formation on attestation.formation_idFormation = formation.idFormation where attestation.utilisateur_idutilisateur = ? order by idattestation desc;"
  
    pool.query(queryString, [idutilisateur], (err, rows, fields) => {
  
      if (err) {
  
        console.log(err)
        res.status(404).end()
  
      } else { 
  
        let attestations = []
        rows.forEach(element => {
          let attestation = { idFormation: element.idFormation,created_at:element.created_at ?? "", formationTitle: element.title, filename:element.filename}
          attestations.push(attestation)
        });
  
        res.status(200).send(attestations)
  
      }
    })
  
  }

async function sendMail(attestationFilePath,formationTitle, to,res) {

    var mailOptions = {
  
      from: process.env.NODE_MAILER_USER,
      to: to,
      subject: 'Votre attestation de participation Skillspace',
      html: '<h1>Merci pour votre participation</h1><p> vous trouverez ci-joint votre attestation skillspace pour la formation <b>' + formationTitle + '</b></p>',
      attachments:[{

        filename: 'Certification.pdf',
        path: attestationFilePath
      }]

    };
  
    mailer.transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
  
        res.status(400).end()
        console.log(error)
  
      } else {
  
        console.log('email sent') 
        res.status(200).end()

      }
  
    })
  }


module.exports = {

    createCertification,getCertifications
  
}