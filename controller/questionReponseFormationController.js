


const postNewQuestion = async (req, res) => {

  let idutilisateur = req.user.idutilisateur
  let content = req.body.content
  let formation_idcours = req.body.formation_idcours


  const queryString = "INSERT into question(content,formation_idcours,utilisateur_idutilisateur,created_at) values(?,?,?,CURRENT_TIMESTAMP)"

  pool.query(queryString, [content, formation_idcours, idutilisateur], (err, rows, fields) => {

    if (!err)
    {
      const queryString2 = "select *,(select count(*) from reponse where question_idquestion = question.idquestion) as nb_reponse,(select count(*) from like_question where question_idquestion = question.idquestion) as nb_like_question from question inner join utilisateur on question.utilisateur_idutilisateur =  utilisateur.idutilisateur where question.idquestion = ?"

      pool.query(queryString2, [rows.insertId], (err, rows2, fields) => {

        if (!err)
        {
          let question = { idquestion: rows2[0].idquestion, content: rows2[0].content, nb_reponse: rows2[0].nb_reponse, nb_like_question: rows2[0].nb_like_question, user: { firstname: rows2[0].firstname, lastname: rows2[0].lastname, idutilisateur: rows2[0].idutilisateur,image:rows2[0].image } }
          res.status(200).send(question)
        }
        else 
        {

          res.send(401).end()
          console.log(err)
        }

    })
  }

    else {
      res.send(401).end()
      console.log(err)
    }

  })


}



const postNewReponse = async (req, res) => {

  let idutilisateur = req.user.idutilisateur
  let content = req.body.content
  let question_idquestion = req.body.question_idquestion

  const queryString = "INSERT into reponse(content,question_idquestion,utilisateur_idutilisateur,reponse_created_at) values(?,?,?,CURRENT_TIMESTAMP)"

  pool.query(queryString, [content, question_idquestion, idutilisateur], (err, rows, fields) => {

    if (!err)

      res.send(200).end()

    else {
      res.send(401).end()
      console.log(err)
    }

  })

}

const getAllQuestions = async (req, res) => {

  let idformation = req.body.idformation
  let idutilisateur = req.user.idutilisateur

  const queryString = "select *,(SELECT count(*) from like_question WHERE (id_user = ? AND question_idquestion = question.idquestion) ) as loved,(select count(*) from reponse where question_idquestion = question.idquestion) as nb_reponse,(select count(*) from like_question where question_idquestion = question.idquestion) as nb_like_question from question inner join utilisateur on question.utilisateur_idutilisateur =  utilisateur.idutilisateur where formation_idcours = ?"
 
  pool.query(queryString, [idutilisateur,idformation], (err, rows, fields) => {

    if (!err) {
      let questions = []

      rows.forEach(element => {

        let question = { idquestion: element.idquestion, content: element.content,love:element.loved, nb_reponse: element.nb_reponse,created_at:element.created_at, nb_like_question: element.nb_like_question, user: { firstname: element.firstname, lastname: element.lastname, idutilisateur: element.idutilisateur ,image:element.image ?? "" } }
        questions.push(question)

      });

      res.status(200).send(questions)
    }
    else {
      res.send(401).end()
      console.log(err)
    }

  })


}


const getQuestionById = async (req,res) => {

  let idquestion = req.body.idquestion
  let idutilisateur = req.user.idutilisateur

  const queryString = "select *,(SELECT count(*) from like_question WHERE (id_user = ? AND question_idquestion = question.idquestion) ) as loved,(select count(*) from reponse where question_idquestion = question.idquestion) as nb_reponse,(select count(*) from like_question where question_idquestion = question.idquestion) as nb_like_question from question inner join utilisateur on question.utilisateur_idutilisateur =  utilisateur.idutilisateur where question.idquestion = ?"

  pool.query(queryString, [idutilisateur,idquestion], (err, rows, fields) => {

    if (!err) {
      let questions = []

      rows.forEach(element => {

        let question = { idquestion: element.idquestion, content: element.content,love:element.loved, nb_reponse: element.nb_reponse, nb_like_question: element.nb_like_question, user: { firstname: element.firstname, lastname: element.lastname, idutilisateur: element.idutilisateur,image:element.image } }
        questions.push(question)

      });

      res.status(200).send(questions)
    }
    else {
      res.send(401).end()
      console.log(err)
    }

  })

}




const getReponsesOfQuestion = async (req, res) => {


  let idquestion = req.body.idquestion
  let idutilisateur = req.user.idutilisateur
  
  const queryString = "select *,(SELECT count(*) from like_reponse WHERE (id_user = ?  AND reponse_idreponse = reponse.idreponse)) as loved, (select count(*) from like_reponse where reponse_idreponse = reponse.idreponse) as nb_like_reponse from reponse inner join utilisateur on reponse.utilisateur_idutilisateur =  utilisateur.idutilisateur where question_idquestion = ?"

  pool.query(queryString, [idutilisateur,idquestion], (err, rows, fields) => {

    if (!err) {
      let reponses = []

      rows.forEach(element => {

        let reponse = { idreponse: element.idreponse, content: element.content,love:element.loved,reponse_created_at:element.reponse_created_at, nb_like_reponse: element.nb_like_reponse, user: { firstname: element.firstname, lastname: element.lastname, idutilisateur: element.idutilisateur,image:element.image ?? "" } }
        reponses.push(reponse)

      });

      res.status(200).send(reponses)
    }
    else {
      res.send(401).end()
      console.log(err)
    }

  })


}


const likeOrdislikeQuestion = async (req, res) => {

  let idquestion = req.body.idquestion
  let idutilisateur = req.user.idutilisateur

  const queryString = "select * from like_question where (question_idquestion = ? AND id_user = ?)"

  pool.query(queryString, [idquestion,idutilisateur], (err, rows, fields) => {

    if (!err) {

      if (rows.length != 0) {


        const queryString = "delete from like_question where (question_idquestion = ? AND id_user = ?)"

        pool.query(queryString, [idquestion,idutilisateur], (err, rows, fields) => {

          res.status(200).send("Good").end()
          
        })

      } else {

        const queryString = "insert into like_question(question_idquestion,id_user) values(?,?)"

        pool.query(queryString, [idquestion,idutilisateur], (err, rows, fields) => {

          res.status(201).send("Good").end()
          
        })


      }


    }
    else {
      res.status(401).end()
      console.log(err)
    }

  })


}

const likeOrdislikeReponse = async (req, res) => {

  let idreponse = req.body.idreponse
  let idutilisateur = req.user.idutilisateur

  const queryString = "select * from like_reponse where (reponse_idreponse = ? AND id_user= ?)"

  pool.query(queryString, [idreponse,idutilisateur], (err, rows, fields) => {

    if (!err) {

      if (rows.length != 0) {

        const queryString = "delete from like_reponse where (reponse_idreponse = ? AND id_user= ?)"

        pool.query(queryString, [idreponse,idutilisateur], (err, rows, fields) => {

          res.status(201).send("Good").end()
          
        })

      } else {

        const queryString = "insert into like_reponse(reponse_idreponse,id_user) values(?,?)"

        pool.query(queryString, [idreponse,idutilisateur], (err, rows, fields) => {

          res.status(202).send("Good").end()
          
        })


      }


    }
    else {
      res.send(401).end()
      console.log(err)
    }

  })


}






module.exports = {

  postNewQuestion, postNewReponse, getAllQuestions, getReponsesOfQuestion,likeOrdislikeReponse,likeOrdislikeQuestion,getQuestionById

}