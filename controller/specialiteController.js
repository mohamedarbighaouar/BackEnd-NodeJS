

const updateSpecialte = async (req, res,formateur) => { 


    const queryString = "delete formateur_has_specialite from formateur_has_specialite inner join formateur on formateur_has_specialite.formateur_idformateur = formateur.idformateur where formateur.utilisateur_idutilisateur = ?"

    pool.query(queryString, [formateur.idutilisateur], (err, rows, fields) => {
         
        if (!err)
         {
             
            if(formateur.specialiteList)
            {
                let specialiteArray = formateur.specialiteList.split(',')

                if(specialiteArray.length == 1)
                {

                        const queryString = "insert into formateur_has_specialite(formateur_idformateur,specialite_idspecialite) select formateur.idformateur, ? from formateur inner join utilisateur on formateur.utilisateur_idutilisateur = utilisateur.idutilisateur where utilisateur.idutilisateur = ?;"

                        pool.query(queryString, [specialiteArray,formateur.idutilisateur], (err, rows, fields) => {

                        }) 
                    
                }
                else 
                {

                    specialiteArray.forEach(element => {

                        const queryString = "insert into formateur_has_specialite(formateur_idformateur,specialite_idspecialite) select formateur.idformateur, ? from formateur inner join utilisateur on formateur.utilisateur_idutilisateur = utilisateur.idutilisateur where utilisateur.idutilisateur = ?;"
                    
                        pool.query(queryString, [element,formateur.idutilisateur], (err, rows, fields) => {

                            
                        }) 

                    });
                
                }
                    
                 res.status(200).send(formateur)   
                 console.log("Good One")


            }else{

             res.status(200).send(formateur)
             console.log("Bad One ")
             
            }
         }
         else
         {
             res.status(400).end()
             console.log(err)
             console.log("Bad two")
         }
    
    })

}

const getAllSpecialite = async (req, res) => { 

      const queryString = "SELECT * from specialite"
  
      pool.query(queryString, [], (err, rows, fields) => {
        
          if (err) {
          
          res.status(404).end()
  
        
        }else{
  
          let specialites = []
  
          rows.forEach(element => {
          
          let specialite = {idspecialite:element.idspecialite,specialite:element.specialite }
  
          specialites.push(specialite)
          });
  
          res.status(200).send(specialites)
  
        }
      })

  }


module.exports = {

    updateSpecialte,getAllSpecialite
  
}