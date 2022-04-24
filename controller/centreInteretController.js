

const updateCentreInteret = async (req, res,apprenant) => { 

    const queryString = "delete from utilisateur_has_categorie where utilisateur_idutilisateur = ? "

    pool.query(queryString, [apprenant.idutilisateur], (err, rows, fields) => {
         if (!err)
         {
             
            if(apprenant.centreInteret)
            {

               
                apprenant.centreInteret = apprenant.centreInteret.split(',')

                if(apprenant.centreInteret.length == 1)
                {
                    const queryString = "insert into utilisateur_has_categorie(utilisateur_idutilisateur,categorie_idcategorie) values( ? , ? );"
                
                    pool.query(queryString, [apprenant.idutilisateur,apprenant.centreInteret], (err, rows, fields) => {
                    
                    }) 
                    
                }
                else 
                {
                    apprenant.centreInteret.forEach(element => {


                    const queryString = "insert into utilisateur_has_categorie(utilisateur_idutilisateur,categorie_idcategorie) values( ? , ? );"
                
                    pool.query(queryString, [apprenant.idutilisateur,element], (err, rows, fields) => {
                    
                    }) 

                    });
                }
                 apprenant.centreInteret = apprenant.centreInteret.join(',')
                 res.status(200).send(apprenant)   
                 console.log("Good One")


            }else{

                
                apprenant.centreInteret = ""
                res.status(200).send(apprenant)             
                             
            }

         }

         else
         {
             res.status(400).end()
             console.log("Bad two")
         }
    
    })

}



const addCentreInteret = async (req, res) => { 


    let idutilisateur = req.user.idutilisateur
    let centreInteret = req.body.centreInteret


    const queryString = "delete from utilisateur_has_categorie where utilisateur_idutilisateur = ? "

    pool.query(queryString, [idutilisateur], (err, rows, fields) => {
         if (!err)
         {
             
            if(centreInteret)
            {

                centreInteret = centreInteret.split(',')
                console.log(centreInteret)
                if(centreInteret.length == 1)
                {
                    const queryString = "insert into utilisateur_has_categorie(utilisateur_idutilisateur,categorie_idcategorie) values( ? , ? );"
                
                    pool.query(queryString, [idutilisateur,centreInteret], (err, rows, fields) => {
                    
                    }) 
                    
                }
                else 
                {
                    centreInteret.forEach(element => {


                    const queryString = "insert into utilisateur_has_categorie(utilisateur_idutilisateur,categorie_idcategorie) values( ? , ? );"
                
                    pool.query(queryString, [idutilisateur,element], (err, rows, fields) => {
                    
                    }) 

                    });
                }
                 res.status(200).end()
                 
            }else{
                
                res.status(200).end()
                                   
            }

         }

         else
         {
             res.status(400).end()

         }
    
    })

}




const updateCentreInteretAutre = async (req, res) => { 

    let idutilisateur = req.user.idutilisateur
    let centre_list = req.body.centrelist

    const queryString = "delete from utilisateur_has_categorie where utilisateur_idutilisateur = ? "

    pool.query(queryString, [idutilisateur], (err, rows, fields) => {
         if (!err)
         {
             
            if(centre_list)
            {

                console.log("centrelist")
                console.log(centre_list)
                console.log(centre_list.length)


                if(centre_list.length  == 1)
                {
                    const queryString = "insert into utilisateur_has_categorie(utilisateur_idutilisateur,categorie_idcategorie) values( ? , ? );"
                
                    pool.query(queryString, [idutilisateur,centre_list], (err, rows, fields) => {
                    
                    }) 
                    
                }
                

                else 
                {
                    centre_list.forEach(element => {


                    const queryString = "insert into utilisateur_has_categorie(utilisateur_idutilisateur,categorie_idcategorie) values( ? , ? );"
                
                    pool.query(queryString, [idutilisateur,element], (err, rows, fields) => {
                
    
                    
                    }) 

                    });
                }
                    
                 res.status(200).send("Good")   



            }else{

                
             res.status(400).end()

             
            }




         }

         else
         {
             res.status(400).end()

         }
    
    })

}



const getMyCentreInteret = async (req, res) => { 

    let idutilisateur = req.user.idutilisateur

    console.log("getMyCentreInteret Called !!")
      const queryString = "SELECT * from utilisateur_has_categorie WHERE utilisateur_idutilisateur = ?"
  
      pool.query(queryString, [idutilisateur], (err, rows, fields) => {
        
          if (err) {
          
          res.status(404).end()
        
        }else{
  
          res.status(200).send(rows)
  
        }
      })
  
  
  
  }
 

module.exports = {

    updateCentreInteret,getMyCentreInteret,updateCentreInteretAutre,addCentreInteret
  
}
  