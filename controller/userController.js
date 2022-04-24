var jwt = require('jsonwebtoken');
var config = require('../config');
const centreInteretController = require('../controller/centreInteretController')
const specialiteController = require('../controller/specialiteController')

const formidable = require('formidable')
var path = require('path')
const fs = require("fs");
const storage = require('../utils/StorageHandler')
var bcrypt = require('bcryptjs');



const updateUserOnlyImage = async (req, res) => {

  let idutilisateur = req.user.idutilisateur
  var form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {

    let file = files.file
    let profileImageFileName = ''

    if (file) {

      profileImageFileName = Date.now() + path.extname(file.name);
      let rawDataImage = fs.readFileSync(file.path)
      let filePathImage = storage.profileImagePath() + profileImageFileName

      fs.writeFile(filePathImage, rawDataImage, function (err) {
        if (err) {

          res.status(400).end()
          console.log(err)

        } else {


        }
      })

    }



    const queryString = "UPDATE utilisateur  SET image = ? WHERE idutilisateur = ? "

    await pool.query(queryString, [profileImageFileName, idutilisateur], (err, rows, fields) => {
      if (err) {

        res.status(400).end()
        console.log(err)

      } else {

        res.status(200).send({ image: profileImageFileName }).end()

      }

    })



  })
}




const updateUser = async (req, res) => {

  var form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {

    let idutilisateur = req.user.idutilisateur

    console.log(idutilisateur)

    let file = files.file
    let profileImageFileName = ''
    let type = req.user.type

    if (type == 1) {

      let job = fields.job;
      let firstname = fields.firstname;
      let lastname = fields.lastname;
      let centreInteret = fields.centrelist

      if (file) {

        profileImageFileName = Date.now() + path.extname(file.name);
        let rawDataImage = fs.readFileSync(file.path)
        let filePathImage = storage.profileImagePath() + profileImageFileName

        fs.writeFile(filePathImage, rawDataImage, function (err) {
          if (err) {

            res.status(400).end()
            console.log(err)

          } else {


          }
        })

      }

      let apprenant = { job, firstname, lastname, centreInteret, idutilisateur, type, image: profileImageFileName }

      const queryString = "update utilisateur inner join apprenant on utilisateur.idutilisateur = apprenant.utilisateur_idutilisateur set apprenant.job = ?,utilisateur.image = ?, utilisateur.firstname = ?, utilisateur.lastname = ? where utilisateur.idutilisateur = ? "
      await pool.query(queryString, [apprenant.job, apprenant.image, apprenant.firstname, apprenant.lastname, apprenant.idutilisateur], (err, rows, fields) => {
        if (err) {

          res.status(400).end()
          console.log(err)

        }else {

          centreInteretController.updateCentreInteret(req,res,apprenant)    
          
        }
      })

    } else if (type == 2) {


      let bio = fields.bio;
      let linkedin_link = fields.linkedin_link;
      let youtube_link = fields.youtube_link;
      let firstname = fields.firstname;
      let lastname = fields.lastname;
      let specialiteList = fields.specialitelist

      if (file) {

        profileImageFileName = Date.now() + path.extname(file.name);
        let rawDataImage = fs.readFileSync(file.path)
        let filePathImage = storage.profileImagePath() + profileImageFileName

        fs.writeFile(filePathImage, rawDataImage, function (err) {
          if (err) {

            res.status(400).end()
            console.log(err)

          } else {


          }
        })

      }

      let formateur = { bio, linkedin_link, youtube_link, firstname, lastname, specialiteList, idutilisateur, type, image: profileImageFileName }

      const queryString = "update utilisateur inner join formateur on utilisateur.idutilisateur = formateur.utilisateur_idutilisateur set formateur.bio = ?, utilisateur.image = ?, formateur.linkedin_link = ?, formateur.youtube_link = ?, utilisateur.firstname = ?, utilisateur.lastname = ? where utilisateur.idutilisateur = ? "

      console.log(fields)

      pool.query(queryString, [formateur.bio, formateur.image, formateur.linkedin_link, formateur.youtube_link, formateur.firstname, formateur.lastname, formateur.idutilisateur, formateur.specialiteList], (err, rows, fields) => {
        if (err) {

          res.status(400).end()
          console.log(err)

        } else {

          specialiteController.updateSpecialte(req, res, formateur)

        }
      })
    } else {

      res.status(400).end()

    }

  })
}





const getFormateur = async (req, res) => {

  let iduser_formateur = req.body.idutilisateur
  let idutilisateur = req.user.idutilisateur

  const queryString = " SELECT *,(select GROUP_CONCAT(DISTINCT specialite.idspecialite SEPARATOR ',') from formateur_has_specialite inner join specialite on formateur_has_specialite.specialite_idspecialite = specialite.idspecialite where formateur_idformateur = formateur.idformateur) as specialite_formateur, (select avg(avis.rate) from avis inner join formation on avis.formation_idFormation = formation.idFormation inner join formateur on formation.formateur_idformateur = formateur.idformateur where formateur.utilisateur_idutilisateur = utilisateur.idutilisateur  ) AS formateur_rate ,(select count(*) from formation inner join formateur on formation.formateur_idformateur = formateur.idformateur where formateur.utilisateur_idutilisateur = idutilisateur) as nb_formation, (select count(*) from interaction inner join formation on interaction.formation_idFormation = formation.idFormation inner join formateur on formation.formateur_idformateur = formateur.idformateur where type = 'PARTICIPATION' ) as nb_participants, (select count(*) from abonnement where apprenant_idutilisateur = ? and formateur_idutilisateur = ? ) as isSubscribe FROM utilisateur inner join formateur on utilisateur.idutilisateur = formateur.utilisateur_idutilisateur where idutilisateur = ?;"

  pool.query(queryString, [idutilisateur, iduser_formateur, iduser_formateur], (err, rowsFormateur, fields) => {
    if (err) {

      res.send(400).end()
      console.log(err)

    }
    else {

      let user = { type: 2, idutilisateur: rowsFormateur[0].idutilisateur, email: rowsFormateur[0].email, isVerified: rowsFormateur[0].isVerified, firstname: rowsFormateur[0].firstname, lastname: rowsFormateur[0].lastname, bio: rowsFormateur[0].bio, linkedin_link: rowsFormateur[0].linkedin_link, youtube_link: rowsFormateur[0].youtube_link,image:rowsFormateur[0].image ?? ""  }

      let finalRes = { user: user, isSubscribe: rowsFormateur[0].isSubscribe, nb_formation: rowsFormateur[0].nb_formation, nb_participants: rowsFormateur[0].nb_participants, formateur_rate: parseFloat(rowsFormateur[0].formateur_rate).toFixed(1) == "NaN" ? "0" : parseFloat(rowsFormateur[0].formateur_rate).toFixed(1), specialite_formateur: rowsFormateur[0].specialite_formateur == null ? " " : rowsFormateur[0].specialite_formateur,image:rowsFormateur[0].image ?? "" }

      res.status(200).send(finalRes)

    }

  })

}


const SearchForFormateur = async (req, res) => {

  let index = req.body.index
  let keyword = req.body.keyword

  let oldlimit

  if (index == 1) {
    oldlimit = 0
  }
  else {
    oldlimit = (index - 1) * 10
  }


  //const queryString = "SELECT * ,(SELECT count(*) FROM interaction WHERE formation.idFormation = formation_idFormation and interaction.utilisateur_idutilisateur = ? and type = 'PARTICIPATION') AS owned, (SELECT avg(rate) FROM avis WHERE formation.idFormation = formation_idFormation ) AS formation_rate,(SELECT count(*) FROM interaction WHERE formation.idFormation = formation_idFormation and utilisateur_idutilisateur = ? and type = 'FAVORIS' ) AS isFavorite, (SELECT count(*) FROM avis WHERE formation.idFormation = formation_idFormation ) AS formation_rate_count, (SELECT count(*) FROM avis WHERE formation.idFormation = formation_idFormation and avis is not null and avis <> '' ) AS formation_avis_count,(SELECT count(*) FROM question WHERE formation.idFormation = question.formation_idcours) AS formation_question_count, (SELECT count(*) FROM interaction WHERE formation.idFormation = formation_idFormation and type = 'PARTICIPATION') AS formation_participation_count,(SELECT count(*) FROM contenu WHERE formation.idFormation = formation_idFormation) AS formation_lecon_count FROM formation inner join formateur on formation.formateur_idformateur = formateur.idformateur inner join utilisateur on formateur.utilisateur_idutilisateur = utilisateur.idutilisateur WHERE (formation.title LIKE concat('%',?,'%')) LIMIT 15 OFFSET ?  "
  const queryString = " SELECT * FROM formateur inner join utilisateur on formateur.utilisateur_idutilisateur = utilisateur.idutilisateur where (concat(utilisateur.firstname,utilisateur.lastname) LIKE concat('%',?,'%')) LIMIT 15 OFFSET ?"

  pool.query(queryString, [keyword, oldlimit], (err, rows, fields) => {
    if (err) {

      res.send(400).end()
      console.log(err)

    }
    else {

      let formations = []

      rows.forEach(rowsFormateur => {

        let user = { type: 2, idutilisateur: rowsFormateur.utilisateur_idutilisateur, image: rowsFormateur.image ?? "", email: rowsFormateur.email, isVerified: rowsFormateur.isVerified, firstname: rowsFormateur.firstname, lastname: rowsFormateur.lastname, bio: rowsFormateur.bio, linkedin_link: rowsFormateur.linkedin_link, youtube_link: rowsFormateur.youtube_link }

        formations.push(user)
      })

      res.status(200).send(formations)

    }

  })
}



const getFormationsByFormateur = async (req, res) => {

  let iduser_formateur = req.body.idutilisateur
  let idutilisateur = req.user.idutilisateur

  console.log(iduser_formateur)

  const queryString2 = "SELECT *,(select GROUP_CONCAT(DISTINCT formation_has_categorie.categorie_idcategorie SEPARATOR ',') from formation_has_categorie where  formation_has_categorie.formation_idFormation = formation.idFormation ) as formation_categorie ,(SELECT count(*) FROM interaction WHERE formation.idFormation = formation_idFormation and interaction.utilisateur_idutilisateur = ? and type = 'PARTICIPATION') AS owned, (SELECT avg(rate) FROM avis WHERE formation.idFormation = formation_idFormation ) AS formation_rate,(SELECT count(*) FROM interaction WHERE formation.idFormation = formation_idFormation and utilisateur_idutilisateur = ? and type = 'FAVORIS' ) AS isFavorite, (SELECT count(*) FROM avis WHERE formation.idFormation = formation_idFormation ) AS formation_rate_count, (SELECT count(*) FROM avis WHERE formation.idFormation = formation_idFormation and avis is not null and avis <> '' ) AS formation_avis_count, (SELECT count(*) FROM interaction WHERE formation.idFormation = formation_idFormation and type = 'PARTICIPATION') AS formation_participation_count,(SELECT count(*) FROM contenu WHERE formation.idFormation = formation_idFormation) AS formation_lecon_count FROM formation inner join formateur on formation.formateur_idformateur = formateur.idformateur inner join utilisateur on formateur.utilisateur_idutilisateur = utilisateur.idutilisateur where utilisateur.idutilisateur = ? "

  pool.query(queryString2, [idutilisateur, idutilisateur, iduser_formateur], (err, rowsFormation, fields) => {

    if (err) {

      res.send(400).end()
      console.log(err)
    }
    else {

      let formations = []

      rowsFormation.forEach(element => {
        let item = {
          idFormation: element.idFormation,formation_categorie:element.formation_categorie, trailername: element.trailername, covername: element.covername, isFavorite: element.isFavorite, title: element.title, descriptionFormation: element.description, author: element.firstname + " " + element.lastname, rate: parseFloat(element.formation_rate).toFixed(1) == "NaN" ? "0" : parseFloat(element.formation_rate).toFixed(1), price: element.price, level: element.level, language: element.language, isVisitor: element.isVisitor
          , isBanner: element.isBanner, owned: element.owned, creationDate: element.creationDate, avis_formation_count: element.formation_avis_count, rate_formation_count: element.formation_rate_count, formation_lecon_count: element.formation_lecon_count, formation_participation_count: element.formation_participation_count, isTrend: element.isTrend, isPopular: element.isPopular, formateur: { idutilisateur: element.idutilisateur, image: element.image, firstname: element.firstname, lastname: element.lastname, email: element.email, github_link: element.github_link, youtube_link: element.youtube_link, linkedin_link: element.linkedin_link }
        }

        formations.push(item)
      });


      res.status(200).send(formations)

    }

  })

}

const changePassword = async (req, res) => {

  let oldPassword = req.body.oldPassword
  let newPassword = req.body.newPassword
  let idutilisateur = req.user.idutilisateur

  const queryString = "select * from utilisateur where idutilisateur = ?"

  pool.query(queryString, [idutilisateur], async (err, rows, fields) => {

    if (err) {

      console.log(err)
      res.status(404).end()

    } else {

      const match = await bcrypt.compare(oldPassword, rows[0].password)

      if (match) {

        let newHashedPassword = await bcrypt.hash(newPassword, 10)

        const queryString2 = "update utilisateur set password = ? where idutilisateur = ?"

        pool.query(queryString2, [newHashedPassword, idutilisateur], async (err, rows, fields) => {

          if (err) {
            console.log(err)
            res.status(403).end()

          } else {

            res.status(200).end()

          }

        })


      } else {

        res.status(402).end()

      }


    }

  })


}


const subscribeOrUnsubscribeFormateur = async (req, res) => {

  let idutilisateur = req.user.idutilisateur
  let formateur_idutilisateur = req.body.formateur_idutilisateur

  const queryString = "select * from abonnement where apprenant_idutilisateur = ? AND formateur_idutilisateur = ?"

  pool.query(queryString, [idutilisateur, formateur_idutilisateur], (err, rows, fields) => {

    if (!err) {

      if (rows.length != 0) {

        const queryString = "delete from abonnement where apprenant_idutilisateur = ? AND formateur_idutilisateur = ?"

        pool.query(queryString, [idutilisateur, formateur_idutilisateur], (err, rows, fields) => {

          res.status(202).end()

        })

      } else {

        const queryString = "insert into abonnement(apprenant_idutilisateur,formateur_idutilisateur) values(?,?)"

        pool.query(queryString, [idutilisateur, formateur_idutilisateur], (err, rows, fields) => {

          res.status(201).end()

        })


      }


    }
    else {
      res.status(401).end()
      console.log(err)
    }

  })


}



const updateUserOnlyWithoutImage = async (req, res) => {

  let idutilisateur = req.user.idutilisateur
  let type = req.body.type


  if (type == 1) {

    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let job = req.body.job
    let centreInteret = req.body.centrelist


    let apprenant = { firstname, lastname, job, centreInteret, idutilisateur, type }


    const queryString = "update utilisateur inner join apprenant on utilisateur.idutilisateur = apprenant.utilisateur_idutilisateur set apprenant.job = ?, utilisateur.firstname = ?, utilisateur.lastname = ? where utilisateur.idutilisateur = ? "
    pool.query(queryString, [apprenant.job, apprenant.firstname, apprenant.lastname, apprenant.idutilisateur], (err, rows, fields) => {
      if (err) {

        res.status(400).end()
        console.log(err)

      }


      else {

        centreInteretController.updateCentreInteretAutre(req, res, apprenant)
      }

    })

  }

}


module.exports = {

  updateUser, getFormateur, changePassword, getFormationsByFormateur, subscribeOrUnsubscribeFormateur, updateUserOnlyImage, updateUserOnlyWithoutImage, SearchForFormateur

}