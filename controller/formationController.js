var jwt = require('jsonwebtoken');
var config = require('../config');
const storage = require('../utils/StorageHandler')
const formidable = require('formidable')
var path = require('path')
const fs = require("fs");
const { parse } = require('dotenv');
const { getVideoDurationInSeconds } = require('get-video-duration')

const ffmpeg = require("fluent-ffmpeg")
const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg")

ffmpeg.setFfmpegPath(ffmpegInstaller.path)

const getAllFormations = async (req, res) => {

  let idutilisateur = req.user.idutilisateur
  console.log(idutilisateur)

  const queryString = "SELECT *, (select GROUP_CONCAT(DISTINCT formation_has_categorie.categorie_idcategorie SEPARATOR ',') from formation_has_categorie where  formation_has_categorie.formation_idFormation = formation.idFormation ) as formation_categorie ,(SELECT avg(rate) FROM avis WHERE formation.idFormation = formation_idFormation ) AS formation_rate,(SELECT count(*) FROM interaction WHERE formation.idFormation = formation_idFormation and utilisateur_idutilisateur = ? and type = 'FAVORIS' ) AS isFavorite, (SELECT count(*) FROM avis WHERE formation.idFormation = formation_idFormation ) AS formation_rate_count, (SELECT count(*) FROM avis WHERE formation.idFormation = formation_idFormation and avis is not null and avis <> '' ) AS formation_avis_count,(SELECT count(*) FROM question WHERE formation.idFormation = question.formation_idcours) AS formation_question_count, (SELECT count(*) FROM interaction WHERE formation.idFormation = formation_idFormation and type = 'PARTICIPATION') AS formation_participation_count,(SELECT count(*) FROM interaction WHERE formation.idFormation = formation_idFormation and interaction.utilisateur_idutilisateur = ? and type = 'PARTICIPATION') AS owned,(SELECT count(*) FROM contenu WHERE formation.idFormation = formation_idFormation) AS formation_lecon_count FROM formation inner join formateur on formation.formateur_idformateur = formateur.idformateur inner join utilisateur on formateur.utilisateur_idutilisateur = utilisateur.idutilisateur "

  await pool.query(queryString, [idutilisateur, idutilisateur], (err, rows, fields) => {

    if (err) {

      res.status(400).end()
      console.log(err)

    } else {

      let formations = []

      rows.forEach(element => {
        let formation = {
          idFormation: element.idFormation,formation_categorie:element.formation_categorie , covername: element.covername ?? "", trailername: element.trailername ?? "", isFavorite: element.isFavorite, title: element.title, question_count: element.formation_question_count,creationDate:element.creationDate ?? "", descriptionFormation: element.description, author: element.firstname + " " + element.lastname, rate: parseFloat(element.formation_rate).toFixed(1) == "NaN" ? "0" : parseFloat(element.formation_rate).toFixed(1), price: element.price, level: element.level, language: element.language, isVisitor: element.isVisitor
          , isBanner: element.isBanner, avis_formation_count: element.formation_avis_count, rate_formation_count: element.formation_rate_count, formation_lecon_count: element.formation_lecon_count, formation_participation_count: element.formation_participation_count, owned: element.owned, isTrend: element.isTrend, isPopular: element.isPopular, formateur: { image: element.image ?? "", idutilisateur: element.idutilisateur, firstname: element.firstname, lastname: element.lastname, email: element.email, github_link: element.github_link, youtube_link: element.youtube_link, linkedin_link: element.linkedin_link, bio: element.bio }
        }

        formations.push(formation)
      });

      res.status(200).send(formations)

    }
  })

}


const getAllFormationsBySubscription = async (req, res) => {

  let idutilisateur = req.user.idutilisateur

  const queryString = "SELECT *, (select GROUP_CONCAT(DISTINCT formation_has_categorie.categorie_idcategorie SEPARATOR ',') from formation_has_categorie where  formation_has_categorie.formation_idFormation = formation.idFormation ) as formation_categorie , (SELECT avg(rate) FROM avis WHERE formation.idFormation = formation_idFormation ) AS formation_rate,(SELECT count(*) FROM interaction WHERE formation.idFormation = formation_idFormation and utilisateur_idutilisateur = ? and type = 'FAVORIS' ) AS isFavorite, (SELECT count(*) FROM avis WHERE formation.idFormation = formation_idFormation ) AS formation_rate_count, (SELECT count(*) FROM avis WHERE formation.idFormation = formation_idFormation and avis is not null and avis <> '' ) AS formation_avis_count,(SELECT count(*) FROM question WHERE formation.idFormation = question.formation_idcours) AS formation_question_count, (SELECT count(*) FROM interaction WHERE formation.idFormation = formation_idFormation and type = 'PARTICIPATION') AS formation_participation_count,(SELECT count(*) FROM interaction WHERE formation.idFormation = formation_idFormation and interaction.utilisateur_idutilisateur = ? and type = 'PARTICIPATION') AS owned,(SELECT count(*) FROM contenu WHERE formation.idFormation = formation_idFormation) AS formation_lecon_count FROM formation inner join formateur on formation.formateur_idformateur = formateur.idformateur inner join utilisateur on formateur.utilisateur_idutilisateur = utilisateur.idutilisateur inner join abonnement on utilisateur.idutilisateur = abonnement.formateur_idutilisateur "

  await pool.query(queryString, [idutilisateur, idutilisateur], (err, rows, fields) => {

    if (err) {

      res.status(400).end()
      console.log(err)

    } else {

      let formations = []

      rows.forEach(element => {
        let formation = {
          idFormation: element.idFormation, formation_categorie:element.formation_categorie,covername: element.covername ?? "", trailername: element.trailername ?? "", isFavorite: element.isFavorite, title: element.title, question_count: element.formation_question_count, descriptionFormation: element.description,creationDate:element.creationDate ?? "", author: element.firstname + " " + element.lastname, rate: parseFloat(element.formation_rate).toFixed(1) == "NaN" ? "0" : parseFloat(element.formation_rate).toFixed(1), price: element.price, level: element.level, language: element.language, isVisitor: element.isVisitor
          , isBanner: element.isBanner, avis_formation_count: element.formation_avis_count, rate_formation_count: element.formation_rate_count, formation_lecon_count: element.formation_lecon_count, formation_participation_count: element.formation_participation_count, owned: element.owned, isTrend: element.isTrend, isPopular: element.isPopular, formateur: { image: element.image ?? "", idutilisateur: element.idutilisateur, firstname: element.firstname, lastname: element.lastname, email: element.email, github_link: element.github_link, youtube_link: element.youtube_link, linkedin_link: element.linkedin_link, bio: element.bio }
        }

        formations.push(formation)
      });

      res.status(200).send(formations)

    }
  })

}


const getMyFavoriteFormations = async (req, res) => {

  let idutilisateur = req.user.idutilisateur

  console.log(idutilisateur)

  const queryString = "SELECT *,(select GROUP_CONCAT(DISTINCT formation_has_categorie.categorie_idcategorie SEPARATOR ',') from formation_has_categorie where  formation_has_categorie.formation_idFormation = formation.idFormation ) as formation_categorie , (SELECT avg(rate) FROM avis WHERE formation.idFormation = formation_idFormation ) AS formation_rate,(SELECT count(*) FROM interaction WHERE formation.idFormation = formation_idFormation and utilisateur_idutilisateur = ? and type = 'FAVORIS' ) AS isFavorite, (SELECT count(*) FROM avis WHERE formation.idFormation = formation_idFormation ) AS formation_rate_count, (SELECT count(*) FROM avis WHERE formation.idFormation = formation_idFormation and avis is not null and avis <> '' ) AS formation_avis_count,(SELECT count(*) FROM question WHERE formation.idFormation = question.formation_idcours) AS formation_question_count, (SELECT count(*) FROM interaction WHERE formation.idFormation = formation_idFormation and type = 'PARTICIPATION') AS formation_participation_count,(SELECT count(*) FROM interaction WHERE formation.idFormation = formation_idFormation and interaction.utilisateur_idutilisateur = ? and type = 'PARTICIPATION') AS owned,(SELECT count(*) FROM contenu WHERE formation.idFormation = formation_idFormation) AS formation_lecon_count FROM formation inner join interaction on idFormation = interaction.formation_idFormation inner join formateur on formation.formateur_idformateur = formateur.idformateur inner join utilisateur on formateur.utilisateur_idutilisateur = utilisateur.idutilisateur where interaction.type = 'FAVORIS' AND interaction.utilisateur_idutilisateur = ? "

  await pool.query(queryString, [idutilisateur, idutilisateur, idutilisateur], (err, rows, fields) => {

    if (err) {

      res.status(400).end()
      console.log(err)

    } else {

      let formations = []

      rows.forEach(element => {
        let formation = {
          idFormation: element.idFormation,formation_categorie:element.formation_categorie, covername: element.covername ?? "", trailername: element.trailername ?? "", isFavorite: element.isFavorite, title: element.title, question_count: element.formation_question_count,creationDate:element.creationDate ?? "", descriptionFormation: element.description, author: element.firstname + " " + element.lastname, rate: parseFloat(element.formation_rate).toFixed(1) == "NaN" ? "0" : parseFloat(element.formation_rate).toFixed(1), price: element.price, level: element.level, language: element.language, isVisitor: element.isVisitor
          , isBanner: element.isBanner, avis_formation_count: element.formation_avis_count, rate_formation_count: element.formation_rate_count, formation_lecon_count: element.formation_lecon_count, formation_participation_count: element.formation_participation_count, owned: element.owned, isTrend: element.isTrend, isPopular: element.isPopular, formateur: { image: element.image ?? "", idutilisateur: element.idutilisateur, firstname: element.firstname, lastname: element.lastname, email: element.email, github_link: element.github_link, youtube_link: element.youtube_link, linkedin_link: element.linkedin_link, bio: element.bio }
        }

        formations.push(formation)
      });

      res.status(200).send(formations)

    }
  })

}

const getAllFormationsOptimized = async (req, res) => {

  let idutilisateur = 9
  let index = req.body.index
  let oldlimit
  
  if (index == 1) {
    oldlimit = 0
  }
  else {
    oldlimit = (index - 1) * 10
  }


  const queryString = "SELECT , (SELECT avg(rate) FROM avis WHERE formation.idFormation = formation_idFormation ) AS formation_rate,(SELECT count() FROM interaction WHERE formation.idFormation = formation_idFormation and utilisateur_idutilisateur = ? and type = 'FAVORIS' ) AS isFavorite, (SELECT count() FROM avis WHERE formation.idFormation = formation_idFormation ) AS formation_rate_count, (SELECT count() FROM avis WHERE formation.idFormation = formation_idFormation and avis is not null and avis <> '' ) AS formation_avis_count,(SELECT count() FROM question WHERE formation.idFormation = question.formation_idcours) AS formation_question_count, (SELECT count() FROM interaction WHERE formation.idFormation = formation_idFormation and type = 'PARTICIPATION') AS formation_participation_count,(SELECT count(*) FROM contenu WHERE formation.idFormation = formation_idFormation) AS formation_lecon_count FROM formation inner join formateur on formation.formateur_idformateur = formateur.idformateur inner join utilisateur on formateur.utilisateur_idutilisateur = utilisateur.idutilisateur LIMIT 15 OFFSET ? "

  await pool.query(queryString, [idutilisateur, oldlimit], (err, rows, fields) => {

    if (err) {

      res.status(400).end()
      console.log(err)

    } else {

      let formations = []

      rows.forEach(element => {
        let formation = {
          idFormation: element.idFormation, covername: element.covername ?? "", trailername: element.trailername ?? "", isFavorite: element.isFavorite, title: element.title, question_count: element.formation_question_count,creationDate:element.creationDate ?? "", descriptionFormation: element.description, author: element.firstname + " " + element.lastname, rate: parseFloat(element.formation_rate).toFixed(1) == "NaN" ? "0" : parseFloat(element.formation_rate).toFixed(1), price: element.price, level: element.level, language: element.language, isVisitor: element.isVisitor
          , isBanner: element.isBanner, avis_formation_count: element.formation_avis_count, rate_formation_count: element.formation_rate_count, formation_lecon_count: element.formation_lecon_count, formation_participation_count: element.formation_participation_count, isTrend: element.isTrend, isPopular: element.isPopular, formateur: { image: element.image ?? "", idutilisateur: rows[0].idutilisateur, firstname: element.firstname, lastname: element.lastname, email: element.email, github_link: element.github_link, youtube_link: element.youtube_link, linkedin_link: element.linkedin_link, bio: element.bio }
        }

        formations.push(formation)
      });

      res.status(200).send(formations)

    }
  })
}

const postNewFormation = async (req, res) => {

  var form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {

    let idformateur = fields.formateur_idformateur
    let title = fields.title
    let description = fields.description
    let price = fields.price
    let level = fields.level
    let language = fields.language
    let coverFormation = files.cover
    let trailer = files.trailer

    let coverFileName = Date.now() + path.extname(coverFormation.name);
    let trailerFileName = Date.now() + path.extname(trailer.name);

    const queryString = "Insert into formation (formateur_idformateur,title,description,price,level,language,covername,trailername) values (?,?,?,?,?,?,?,?)"

    pool.query(queryString, [idformateur, title, description, price, level, language, coverFileName, trailerFileName], (err, rows, fields) => {

      if (err) {

        res.status(400).end()
        console.log(err)

      } else {

        let idformation = rows.insertId
        let formationPath = storage.singleFormationPath(idformation)

        let rawData = fs.readFileSync(coverFormation.path)
        let filePath = formationPath + '/' + coverFileName

        fs.writeFile(filePath, rawData, function (err) {
          if (err) {

            res.status(400).end()
            console.log(err)

          } else {

            res.end()


          }
        })

        let rawDatatrailer = fs.readFileSync(trailer.path)
        let filePathtrailer = formationPath + '/' + trailerFileName

        fs.writeFile(filePathtrailer, rawDatatrailer, function (err) {
          if (err) {

            res.status(400).end()
            console.log(err)

          } else {

            res.end()


          }
        })

      }
    })
  })

}

const postNewVideoFormation = async (req, res) => {

  var form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {

    form.multiples = true

    let idformation = fields.idformation

    storage.videoFormationPath(idformation)

    let json = JSON.parse(JSON.stringify(files));
    let data = JSON.parse(JSON.stringify(fields));
    let key = Object.keys(json);

    var indexes = key.map(k => k.split("_")[1])

    indexes = Array.from(new Set(indexes))

    indexes.forEach(k => {

      let video = json["video_" + k]
      let image = json["image_" + k]
      let title = data["title_" + k]
      let description = data["description_" + k]

      let course = { video, image, title, description }
      let currentTime =  Date.now()
      let contenuFileName = currentTime + '.m3u8';
      let imageFileName = currentTime + path.extname(course.image.name);

      getVideoDurationInSeconds(course.video.path).then((duration) => {

        let video_duration = parseInt(duration)

        const queryString = "Insert into contenu (title,duration,formation_idFormation,videoname,imagename,description) values (?,?,?,?,?,?)"

        pool.query(queryString, [course.title, video_duration, idformation, contenuFileName, imageFileName, course.description], (err, rows, fields) => {

          if (err)
          {
            console.log(err)
            res.status(404).end()

          }else {

            let idcontenu = rows.insertId
            let contenuPath = storage.videoFormationPath(idformation, idcontenu)
            let rawDataImage = fs.readFileSync(course.image.path)
            let filePathImage = storage.videoFormationPath(idformation, idcontenu) + imageFileName
            fs.writeFile(filePathImage, rawDataImage, function (err) {
              if (err) {
  
                res.status(400).end()
                console.log(err)
  
              } else {
  


              }
            })

            ffmpeg(course.video.path, { timeout: 432000 }).addOptions([
              '-profile:v baseline',
              '-level 3.0',
              '-start_number 0',
              '-hls_time 10',
              '-hls_list_size 0',
              '-f hls']).output(contenuPath + currentTime +".m3u8").on('end', () => {
  
  
                console.log("ok ok ok ")
                res.status(200).end()

  
              }).run()

          }
        

        })


      })


    })


  })

}


const getContenu = async (req, res) => {

  let idformation = req.body.idformation

  const queryString = "SELECT * from contenu WHERE formation_idFormation = ?  "

  pool.query(queryString, [idformation], (err, rows, fields) => {
    if (err) {

      res.send(400).end()
      console.log(err)

    }
    else {


      let contenus = []

      rows.forEach(element => {
        let contenu = {
          idcontent: element.idcontent, title: element.title, formation_idFormation: element.formation_idFormation,duration: element.duration, videoname: element.videoname  ?? "" , imagename: element.imagename ?? "", description: element.description ?? ""}

        contenus.push(contenu)
    })
    res.status(200).send(contenus)
  }

  })

}



const getOneFormation = async (req, res) => {

  let idutilisateur = 2
  let idformation = req.params.idformation

  const queryString = "SELECT *, (select GROUP_CONCAT(DISTINCT formation_has_categorie.categorie_idcategorie SEPARATOR ',') from formation_has_categorie where  formation_has_categorie.formation_idFormation = formation.idFormation ) as formation_categorie ,(SELECT count(*) FROM interaction WHERE formation.idFormation = formation_idFormation and interaction.utilisateur_idutilisateur = ? and type = 'PARTICIPATION') AS owned,(SELECT count(*) FROM question WHERE formation.idFormation = question.formation_idcours) AS formation_question_count, (SELECT avg(rate) FROM avis WHERE formation.idFormation = formation_idFormation ) AS formation_rate,(SELECT count(*) FROM interaction WHERE formation.idFormation = formation_idFormation and utilisateur_idutilisateur = ? and type = 'FAVORIS' ) AS isFavorite, (SELECT count(*) FROM avis WHERE formation.idFormation = formation_idFormation ) AS formation_rate_count, (SELECT count(*) FROM avis WHERE formation.idFormation = formation_idFormation and avis is not null and avis <> '' ) AS formation_avis_count, (SELECT count(*) FROM interaction WHERE formation.idFormation = formation_idFormation and type = 'PARTICIPATION') AS formation_participation_count,(SELECT count(*) FROM contenu WHERE formation.idFormation = formation_idFormation) AS formation_lecon_count FROM formation inner join formateur on formation.formateur_idformateur = formateur.idformateur inner join utilisateur on formateur.utilisateur_idutilisateur = utilisateur.idutilisateur WHERE formation.idFormation = ? "

  pool.query(queryString, [idutilisateur,idutilisateur, idformation], (err, rows, fields) => {
    if (err) {

      res.send(400).end()
      console.log(err)

    } 
    else {


      let formation = {
        idFormation: rows[0].idFormation,formation_categorie:rows[0].formation_categorie , trailername: rows[0].trailername, covername: rows[0].covername, question_count: rows[0].formation_question_count, isFavorite: rows[0].isFavorite, title: rows[0].title, descriptionFormation: rows[0].description, author: rows[0].firstname + " " + rows[0].lastname, rate: parseFloat(rows[0].formation_rate).toFixed(1) == "NaN" ? "0" : parseFloat(rows[0].formation_rate).toFixed(1), price: rows[0].price, level: rows[0].level, language: rows[0].language, isVisitor: rows[0].isVisitor
        , isBanner: rows[0].isBanner,owned: rows[0].owned , avis_formation_count: rows[0].formation_avis_count,creationDate: rows[0].creationDate ?? "", rate_formation_count: rows[0].formation_rate_count, formation_lecon_count: rows[0].formation_lecon_count, formation_participation_count: rows[0].formation_participation_count, isTrend: rows[0].isTrend, isPopular: rows[0].isPopular, formateur: { idutilisateur: rows[0].idutilisateur, firstname: rows[0].firstname, lastname: rows[0].lastname, email: rows[0].email, github_link: rows[0].github_link, youtube_link: rows[0].youtube_link, linkedin_link: rows[0].linkedin_link, image: rows[0].image ?? "" }
      }

      res.status(200).send(formation)

    }

  })



}

const getFormationEnCours = async (req, res) => {

  let idUser = req.user.idutilisateur

  const queryString = "select * ,(select GROUP_CONCAT(DISTINCT formation_has_categorie.categorie_idcategorie SEPARATOR ',') from formation_has_categorie where  formation_has_categorie.formation_idFormation = formation.idFormation ) as formation_categorie ,(SELECT avg(rate) FROM avis WHERE formation.idFormation = formation_idFormation ) AS formation_rate,(SELECT count(*) FROM interaction WHERE formation.idFormation = formation_idFormation and utilisateur_idutilisateur = ? and type = 'FAVORIS' ) AS isFavorite, (SELECT count(*) FROM avis WHERE formation.idFormation = formation_idFormation ) AS formation_rate_count, (SELECT count(*) FROM avis WHERE formation.idFormation = formation_idFormation and avis is not null and avis <> '' ) AS formation_avis_count, (SELECT count(*) FROM interaction WHERE formation.idFormation = formation_idFormation and type = 'PARTICIPATION') AS formation_participation_count,(SELECT count(*) FROM interaction WHERE formation.idFormation = formation_idFormation and interaction.utilisateur_idutilisateur = ? and type = 'PARTICIPATION') AS owned,(SELECT count(*) FROM contenu WHERE formation.idFormation = formation_idFormation) AS formation_lecon_count,(select sum(duration) from contenu where formation_idFormation = contenu_hist.formation_idFormation and idcontent < contenu_hist.contenu_idcontent) as total_old_duration, (select sum(duration)  from contenu where formation_idformation = contenu_hist.formation_idFormation) as total_duration from contenu_hist inner join contenu on contenu_hist.contenu_idcontent = contenu.idcontent inner join formation on contenu_hist.formation_idFormation = formation.idFormation inner join formateur on formation.formateur_idformateur = formateur.idformateur inner join utilisateur on formateur.utilisateur_idutilisateur = utilisateur.idutilisateur where  contenu_hist.utilisateur_idutilisateur = ?"

  pool.query(queryString, [idUser, idUser, idUser], (err, rows, fields) => {
    if (err) {

      res.send(400).end()
      console.log(err)

    }
    else {

      let formationsEnCours = []

      rows.forEach(element => {
        let formationEnCours = {
          formation: {
            idFormation: element.idFormation,
            trailername: element.trailername,
            covername: element.covername,
            title: element.title,
            descriptionFormation: element.description,
            author: element.firstname + " " + element.lastname,
            rate: parseFloat(element.formation_rate).toFixed(1) == "NaN" ? "0" : parseFloat(element.formation_rate).toFixed(1),
            price: element.price, level: element.level,
            language: element.language,
            isVisitor: element.isVisitor,
            isFavorite: element.isFavorite,
            owned: element.owned,
            isBanner: element.isBanner,
            creationDate:element.creationDate ?? "",
            avis_formation_count: element.formation_avis_count,
            rate_formation_count: element.formation_rate_count,
            formation_lecon_count: element.formation_lecon_count,
            formation_participation_count: element.formation_participation_count,
            isTrend: element.isTrend,
            isPopular: element.isPopular,
            formation_categorie:element.formation_categorie,
            formateur: {idutilisateur: element.idutilisateur, firstname: element.firstname, lastname: element.lastname, email: element.email, github_link: element.github_link, youtube_link: element.youtube_link, linkedin_link: element.linkedin_link, bio: element.bio,image:element.image ?? "" }
          },
          contenu: { idcontent: element.idcontent, title: element.title, duration: element.duration, imagename: element.imagename, videoname: element.videoname },
          last_length: element.lastLength,
          total_old_duration: (element.total_old_duration == null ? 0 : element.total_old_duration),
          total_duration: element.total_duration,
          progress_percentage: (((element.total_old_duration == null ? 0 : element.total_old_duration) + element.lastLength) / element.total_duration)
        }
        console.log(formationEnCours.progress_percentage)
        formationsEnCours.push(formationEnCours)
      });

      res.send(formationsEnCours)

    }

  })
}


const getFormationEnCoursOnlyOne = async (req, res) => {

  let idUser = req.user.idutilisateur
  let idformation = req.body.idformation

  queryString = "SELECT contenu_idcontent,lastLength from contenu_hist WHERE (utilisateur_idutilisateur = ? AND formation_idFormation =?)"


  pool.query(queryString, [idUser, idformation], (err, rows, fields) => {
    if (err) {

      res.send(400).end()
      console.log(err)

    }
    else {

      res.send(rows)

    }

  })


}


const updateOrAddContenuHist = async (req, res) => {

  let lastLength = req.body.lastLength
  let idcontent = req.body.contenu_idcontent
  let idformation = req.body.formation_idFormation
  let idutilisateur = req.user.idutilisateur

  const queryString = "delete from contenu_hist where formation_idFormation = ? and utilisateur_idutilisateur = ?  ; "

  pool.query(queryString, [idformation, idutilisateur], (err, rows, fields) => {
    if (err) {

      res.send(400).end()
      console.log(err)

    }
    else {
      const queryString2 = "insert into contenu_hist (lastLength,contenu_idcontent,utilisateur_idutilisateur,formation_idFormation) values(?,?,?,?) "

      pool.query(queryString2, [lastLength, idcontent, idutilisateur, idformation], (err, rows, fields) => {
        if (err) {

          res.send(400).end()
          console.log(err)

        }
        else {

          res.send(200).end()

        }

      })

    }

  })



}

const buyFormation = async (req, res) => {

  let idformation = req.body.formation_idFormation
  let idutilisateur = req.user.idutilisateur

  const queryString = "select * from interaction where utilisateur_idutilisateur = ? and  formation_idFormation = ? and type = 'PARTICIPATION' "

  pool.query(queryString, [idutilisateur, idformation], (err, rows, fields) => {
    if (err) {

      res.send(400).end()
      console.log(err)

    }
    else {

      if (rows.length == 0) {

        const queryString2 = "insert into interaction (utilisateur_idutilisateur,formation_idFormation,type) values (?,?,'PARTICIPATION') "

        pool.query(queryString2, [idutilisateur, idformation], (err, rows, fields) => {
          if (err) {

            res.send(400).end()
            console.log(err)

          }
          else {

            res.send(200).end()

          }

        })

      }

    }

  })



}




const makeVideoFav = async (req, res) => {

  let idutilisateur = req.user.idutilisateur
  let idformation = req.body.formation_idFormation


  console.log("idFormation")
  console.log(idformation)

  const queryString = "SELECT * from interaction WHERE utilisateur_idutilisateur = ? AND type = ? AND formation_idFormation = ?"

  pool.query(queryString, [idutilisateur, "FAVORIS", idformation], (err, rows, fields) => {
    if (err) {

      res.send(400).end()
      console.log(err)

    }
    else {

      if (rows.length == 0) {
        const queryString = "INSERT INTO interaction (type,utilisateur_idutilisateur,formation_idFormation) VALUES(?,?,?)"

        pool.query(queryString, ["FAVORIS", idutilisateur, idformation], (err, rows, fields) => {
          if (err) {

            res.send(400).end()
            console.log(err)

          }
          else {
            res.send(201).end()
          }
        })

      }
      else {

        const queryString = "DELETE FROM interaction WHERE formation_idFormation = ? AND utilisateur_idutilisateur = ? AND type = ?"

        pool.query(queryString, [idformation, idutilisateur, "FAVORIS"], (err, rows, fields) => {
          if (err) {

            res.send(400).end()
            console.log(err)

          }
          else {
            res.send(202).end()
          }
        })

      }

    }

  })

}




const SearchForFormation = async (req, res) => {

  let idutilisateur = req.user.idutilisateur
  let index = req.body.index
  let keyword = req.body.keyword

  let oldlimit
  if (index == 1) {
    oldlimit = 0
  }
  else {
    oldlimit = (index - 1) * 10
  }


  const queryString = "SELECT * ,(SELECT count(*) FROM interaction WHERE formation.idFormation = formation_idFormation and interaction.utilisateur_idutilisateur = ? and type = 'PARTICIPATION') AS owned, (SELECT avg(rate) FROM avis WHERE formation.idFormation = formation_idFormation ) AS formation_rate,(SELECT count(*) FROM interaction WHERE formation.idFormation = formation_idFormation and utilisateur_idutilisateur = ? and type = 'FAVORIS' ) AS isFavorite, (SELECT count(*) FROM avis WHERE formation.idFormation = formation_idFormation ) AS formation_rate_count, (SELECT count(*) FROM avis WHERE formation.idFormation = formation_idFormation and avis is not null and avis <> '' ) AS formation_avis_count,(SELECT count(*) FROM question WHERE formation.idFormation = question.formation_idcours) AS formation_question_count, (SELECT count(*) FROM interaction WHERE formation.idFormation = formation_idFormation and type = 'PARTICIPATION') AS formation_participation_count,(SELECT count(*) FROM contenu WHERE formation.idFormation = formation_idFormation) AS formation_lecon_count FROM formation inner join formateur on formation.formateur_idformateur = formateur.idformateur inner join utilisateur on formateur.utilisateur_idutilisateur = utilisateur.idutilisateur WHERE (formation.title LIKE concat('%',?,'%')) LIMIT 15 OFFSET ?  "

  await pool.query(queryString, [idutilisateur,idutilisateur, keyword, oldlimit], (err, rows, fields) => {

    if (err) {

      res.status(400).end()
      console.log(err)

    } else {

      let formations = []

      rows.forEach(element => {
        let formation = {
          idFormation: element.idFormation, covername: element.covername ?? "", trailername: element.trailername ?? "", isFavorite: element.isFavorite,owned: element.owned ?? 0, title: element.title, question_count: element.formation_question_count,creationDate:element.creationDate ?? "", descriptionFormation: element.description, author: element.firstname + " " + element.lastname, rate: parseFloat(element.formation_rate).toFixed(1) == "NaN" ? "0" : parseFloat(element.formation_rate).toFixed(1), price: element.price, level: element.level, language: element.language, isVisitor: element.isVisitor
          , isBanner: element.isBanner, avis_formation_count: element.formation_avis_count, rate_formation_count: element.formation_rate_count, formation_lecon_count: element.formation_lecon_count, formation_participation_count: element.formation_participation_count, isTrend: element.isTrend, isPopular: element.isPopular, formateur: { image: element.image ?? "", idutilisateur: rows[0].idutilisateur, firstname: element.firstname, lastname: element.lastname, email: element.email, github_link: element.github_link, youtube_link: element.youtube_link, linkedin_link: element.linkedin_link, bio: element.bio }
        }

        formations.push(formation)
      });

      res.status(200).send(formations)

    }
  })
}




const getDernierAjoutFormation = async (req, res) => {

  let idutilisateur = req.user.idutilisateur

  let index = req.body.index
  let oldlimit
  if (index == 1) {
    oldlimit = 0
  }
  else {
    oldlimit = (index - 1) * 10
  }


  const queryString = "SELECT * , (SELECT avg(rate) FROM avis WHERE formation.idFormation = formation_idFormation ) AS formation_rate,(SELECT count(*) FROM interaction WHERE formation.idFormation = formation_idFormation and utilisateur_idutilisateur = ? and type = 'FAVORIS' ) AS isFavorite, (SELECT count(*) FROM avis WHERE formation.idFormation = formation_idFormation ) AS formation_rate_count, (SELECT count(*) FROM avis WHERE formation.idFormation = formation_idFormation and avis is not null and avis <> '' ) AS formation_avis_count,(SELECT count(*) FROM question WHERE formation.idFormation = question.formation_idcours) AS formation_question_count, (SELECT count(*) FROM interaction WHERE formation.idFormation = formation_idFormation and type = 'PARTICIPATION') AS formation_participation_count,(SELECT count(*) FROM contenu WHERE formation.idFormation = formation_idFormation) AS formation_lecon_count FROM formation inner join formateur on formation.formateur_idformateur = formateur.idformateur inner join utilisateur on formateur.utilisateur_idutilisateur = utilisateur.idutilisateur ORDER BY formation.idFormation  DESC LIMIT 15 OFFSET ? "

  await pool.query(queryString, [idutilisateur, oldlimit], (err, rows, fields) => {

    if (err) {

      res.status(400).end()
      console.log(err)

    } else {

      let formations = []

      rows.forEach(element => {
        let formation = {
          idFormation: element.idFormation, covername: element.covername ?? "", trailername: element.trailername ?? "", isFavorite: element.isFavorite, title: element.title, question_count: element.formation_question_count,creationDate:element.creationDate ?? "", descriptionFormation: element.description, author: element.firstname + " " + element.lastname, rate: parseFloat(element.formation_rate).toFixed(1) == "NaN" ? "0" : parseFloat(element.formation_rate).toFixed(1), price: element.price, level: element.level, language: element.language, isVisitor: element.isVisitor
          , isBanner: element.isBanner, avis_formation_count: element.formation_avis_count, rate_formation_count: element.formation_rate_count, formation_lecon_count: element.formation_lecon_count, formation_participation_count: element.formation_participation_count, isTrend: element.isTrend, isPopular: element.isPopular, formateur: { image: element.image ?? "", idutilisateur: rows[0].idutilisateur, firstname: element.firstname, lastname: element.lastname, email: element.email, github_link: element.github_link, youtube_link: element.youtube_link, linkedin_link: element.linkedin_link, bio: element.bio }
        }

        formations.push(formation)
      });

      res.status(200).send(formations)

    }
  })
}

module.exports = {

  updateOrAddContenuHist, buyFormation
  , getAllFormationsBySubscription, getMyFavoriteFormations,
   getDernierAjoutFormation, getFormationEnCoursOnlyOne, getFormationEnCours,
    getAllFormationsOptimized, getAllFormations, postNewFormation, postNewVideoFormation, getContenu, getOneFormation, makeVideoFav, SearchForFormation

}
