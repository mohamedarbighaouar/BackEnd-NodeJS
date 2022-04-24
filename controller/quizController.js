

const storage = require('../utils/StorageHandler')
const formidable = require('formidable')
var path = require('path')
const fs = require("fs");
const { set } = require('../app');

const ajoutQuiz = async (req, res) => {

    var form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {

        let idformation = fields.idformation
        let title = fields.title
        let pass_point = fields.pass_point
        let image = files.image
        let isCertification = fields.isCertification

        let imageFileName = Date.now() + path.extname(image.name);

        const queryString = "INSERT INTO quiz(created_at,pass_point,title,image,formation_idformation,isCertification) VALUES(CURRENT_TIMESTAMP,?,?,?,?,?) "

        pool.query(queryString, [pass_point, title, imageFileName, idformation,isCertification], (err, rows, fields) => {

            if (err) {

                console.log(err)
                res.status(404).end()

            } else {

                let quizPath = storage.singleQuizPath(idformation)
                let rawDataQuiz = fs.readFileSync(image.path)
                let filePathImagequiz = quizPath + '/' + imageFileName

                fs.writeFile(filePathImagequiz, rawDataQuiz, function (err) {
                    if (err) {

                        res.status(400).end()
                        console.log(err)

                    } else {

                        res.status(200).end()


                    }
                })

            }
        })


    })
}



const getQuizByFormation = async (req, res) => {

    let idformation = req.body.idformation
    let idutilisateur = req.user.idutilisateur
    console.log(idutilisateur)
    const queryString = "SELECT * ,(select max(note) from utilisateur_has_quiz where utilisateur_has_quiz.utilisateur_idutilisateur = ? and utilisateur_has_quiz.quiz_idquiz = quiz.idquiz ) as highest_score, (select count(*) from utilisateur_has_quiz where utilisateur_has_quiz.utilisateur_idutilisateur = ? and utilisateur_has_quiz.quiz_idquiz = quiz.idquiz ) as quiz_attempt,(select count(*) from question_quiz where question_quiz.quiz_idquiz = quiz.idquiz ) as nb_quiz_question FROM quiz WHERE (quiz.formation_idformation = ? ) "
    await pool.query(queryString, [idutilisateur,idutilisateur,idformation, idutilisateur], (err, rows, fields) => {

        if (err) {

            res.status(400).end()
            console.log(err)

        } else {

            let quizArray = []

            rows.forEach(element => {

                let quizObj = { idquiz: element.idquiz,isCertification:element.isCertification, created_at: element.created_at,highest_score:element.highest_score ?? 0,nb_question:element.nb_quiz_question,nb_tentatives:element.quiz_attempt, pass_point: element.pass_point, title: element.title, image: element.image, formation_idformation: element.formation_idformation }

                quizArray.push(quizObj)

            })

            res.status(200).send(quizArray)
        }
    })

}

//reduce
const getQuestionsByQuiz = async (req, res) => {

    let idquiz = req.body.idquiz
    let idutilisateur = 10

    const queryString = "SELECT *  FROM question_quiz INNER  JOIN  reponse_quiz ON question_quiz.idquestion_quiz = reponse_quiz.question_idquestion WHERE question_quiz.quiz_idquiz = ?  "


    await pool.query(queryString, [idquiz], (err, rows, fields) => {
        if (!err) {
            
            const result = rows.reduce((acc, {idquestion_quiz,contenu_quest,length,point,quiz_idquiz, contenu_repons,idreponse_quiz,is_correct}) => {
                const existing = acc.find(i => i.idquestion_quiz === idquestion_quiz)
                if (existing) { existing.reponses.push({contenu_repons,idreponse_quiz,is_correct}) } 

                else {acc.push({idquestion_quiz,contenu_quest,length,point,quiz_idquiz, reponses: [{contenu_repons,idreponse_quiz,is_correct}]})}
                
                return acc
              }, [])
            
            res.status(200).send(result)

        }
        else
        {
            
            res.status(400).end()
            console.log(err)
        }

    })
}



const deleteQuiz = async (req, res) => {

    let idquiz = req.body.idquiz

    const queryString2 = "delete from quiz where idquiz = ?"

    pool.query(queryString2, [idquiz], (err, rows, fields) => {

        if (!err)

            res.send(200).end()

        else {
            console.log(err)
            res.send(401).end()
        }

    })

}

const createQuestion = async (req, res) => {

    let contenu = req.body.contenu
    let length = req.body.length
    let point = req.body.point
    let idquiz = req.body.idquiz

    const queryString2 = "insert into question_quiz(contenu_quest,length,point,quiz_idquiz) values(?,?,?,?)"

    pool.query(queryString2, [contenu, length, point, idquiz], (err, rows, fields) => {

        if (!err)

            res.send(200).end()

        else {
            console.log(err)
            res.send(401).end()
        }

    })

}



const createReponse = async (req, res) => {


    let arrayReponse = req.body.arrayReponse
    let question_idquestion = req.body.question_idquestion

    arrayReponse.forEach(element => {

        let contenu = element.contenu
        let is_correct = element.is_correct

        const queryString2 = "insert into reponse_quiz(contenu_repons,is_correct,question_idquestion) values(?,?,?)"

        pool.query(queryString2, [contenu, is_correct, question_idquestion], (err, rows, fields) => {

            if (err) {
                console.log(err)
                res.send(401).end()
            }


        })

    })

    res.status(203).end()


}

const finishQuiz = async (req, res) => {

    let idquiz = req.body.idquiz
    let idutilisateur = req.user.idutilisateur
    let note = req.body.note

        const queryString = "insert into utilisateur_has_quiz(utilisateur_idutilisateur,quiz_idquiz,note,quiz_date) values(?,?,?,CURRENT_TIMESTAMP)"

        pool.query(queryString, [idutilisateur, idquiz, note], (err, rows, fields) => {

            if (err) {
                console.log(err)
                res.send(401).end()
            }

            else
            {
                res.status(203).end()
            }
    })




}



module.exports = {

    ajoutQuiz, getQuizByFormation, deleteQuiz, createQuestion, createReponse,getQuestionsByQuiz,finishQuiz

}