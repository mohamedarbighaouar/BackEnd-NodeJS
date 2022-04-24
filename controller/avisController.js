const { async } = require('crypto-random-string');
var jwt = require('jsonwebtoken');
var config = require('../config');

  const addOrUpdateAvis = async (req, res) => { 

    let avis  = req.body.avis
    let rate  = req.body.rate
    let idFormation  = req.body.formation_idFormation
    let idutilisateur = req.user.idutilisateur

    console.log(idutilisateur)

    const queryString = "SELECT * from avis WHERE (formation_idFormation = ? AND utilisateur_idutilisateur = ?)"

    pool.query(queryString, [idFormation,idutilisateur], (err, rows, fields) => {

      if(err)
      {
        res.send(400).end()
        console.log(err)
      }

      else 
      {
        if(rows.length == 0)
        {

            const queryString2 = "INSERT into avis(avis,rate,formation_idFormation,utilisateur_idutilisateur) values(?,?,?,?)"
  
            pool.query(queryString2, [avis,rate,idFormation,idutilisateur], (err, rows, fields) => {

            if(!err)
            
            res.send(200).end()

            else
            {
              res.send(401).end()
              console.log(err)
            }
              
          })
        }
        else
        {

            const queryString2 = "UPDATE avis SET avis = ?, rate = ? WHERE (formation_idFormation = ? AND utilisateur_idutilisateur =  ?  )"
  
            pool.query(queryString2, [avis,rate,idFormation,idutilisateur], (err, rows, fields) => {

            if(!err)
             {
              res.send(200).end()

             }           
            else
            {
              res.send(401).end()
              console.log(err)
            }

            })
        }
          
      }
            
    })
  }
  

const getAllAvisByFormation = async (req, res) => { 

    let idformation = req.body.idformation

    const queryString = "SELECT *  from avis inner join utilisateur on avis.utilisateur_idutilisateur = utilisateur.idutilisateur where  formation_idFormation = ?  "

    pool.query(queryString, [idformation], (err, rows, fields) => {
      
        if (err) {
        
        res.status(400).end()


        console.log(err)

      
      }else{

        let avisArray = []

        rows.forEach(element => {
        
        let avisObj = {idavis:element.idavis,avis:element.avis,rate : element.rate,idFormation: element.formation_idFormation,idutilisateur:element.utilisateur_idutilisateur, user:{firstname:element.firstname,lastname:element.lastname,idutilisateur:element.idutilisateur,image:element.image ?? ""} }

        avisArray.push(avisObj)

        });

        res.status(200).send(avisArray)
        
      }
    })
  
  
  }
  
module.exports = {

    getAllAvisByFormation,addOrUpdateAvis
  
}