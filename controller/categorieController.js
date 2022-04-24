var jwt = require('jsonwebtoken');
var config = require('../config');

const getAllCategories = async (req, res) => { 


    const queryString = "SELECT * from categorie"

    pool.query(queryString, [], (err, rows, fields) => {
      
        if (err) {
        
        res.status(404).end()

      
      }else{

        let categories = []

        rows.forEach(element => {
        
        let categorie = {idcategory:element.idcategorie,categorie:element.categorie }

        categories.push(categorie)
        });


        res.status(200).send(categories)

      }
    })

}

const postNewCategorieAdmin = async (req, res) => { 

  let categorie  =req.body.categorie

  const queryString = "SELECT * from categorie WHERE categorie = ?  "

  pool.query(queryString, [categorie], (err, rows, fields) => {
       if (!err && rows.length == 0)
       {

        const queryString2 = "INSERT into categorie(categorie) values(?)"

        pool.query(queryString2, [categorie], (err, rows, fields) => {

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
         res.send(400).end()
         console.log(err)
       }
  
  })
}
 
module.exports = {

    getAllCategories,postNewCategorieAdmin
  
}