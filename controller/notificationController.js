const request = require('request');

function sendNotificationToTopic(notif) {
    
    let topic = notif.topic
    let title = notif.title
    let body_content = notif.body

    request({
        url: 'https://fcm.googleapis.com/fcm/send',
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": ['key', process.env.FIREBASE_PROJECT_TOKEN].join('=')
        },
        json: {

            //to: 'd3q3tjFhvkBtkOQjJQwee5:APA91bEruLikvbRVO0fXqEkM8sFAcVkEurZ3kvZsRiCdAlRn5G52CsM1t-ZZdpcRaubxCfArnEqd6M2jDv0AEmUcuzQhiNw4s1W-hkLsJ5uK-Tj0Vio3CfdJQN2WtUKrPhGAwQM9rcn2',
            to: '/topics/' + topic,
            content_available: true,
            priority: "high",
            notification: {

                title: title,
                body: body_content,
            }

        }

    }, (error, response, body) => {

        if (error) {
            console.log(error)

        } else {

            addNotification(notif)

        }

    })

}

function addNotification(notificationSkillSpace) {

    let title = notificationSkillSpace.title
    let body = notificationSkillSpace.body
    let idutilisateur = notificationSkillSpace.idutilisateur

    const queryString = "INSERT INTO NOTIFICATION (title,body,idutilisateur,created_at) values (?,?,?,CURRENT_TIMESTAMP)"
    pool.query(queryString, [title, body, idutilisateur], (err, rows, fields) => {

        if (err) {


        } else {


        }

    })

}

const updateNotification = async (req, res) => {

    let idutilisateur = req.user.idutilisateur

    const queryString = "UPDATE NOTIFICATION SET SEEN = 1 WHERE idutilisateur = ?"
    pool.query(queryString, [idutilisateur], (err, rows, fields) => {

        if (err) {

            res.status(404).end()

        } else {

            res.status(200).end()

        }

    })

}

const getAllNotification = async (req, res) => {

    let idutilisateur = req.user.idutilisateur

    const queryString = "select * from notification WHERE idutilisateur = ?"
    pool.query(queryString, [idutilisateur], (err, rows, fields) => {

        if (err) {

            res.status(404).end()

        } else {


            let notificationArray = []

            rows.forEach(element => {

                let notifObj = { title: element.title,body:element.body,seen:element.seen, created_at: element.created_at ?? "" }

                notificationArray.push(notifObj)

            })  

            res.status(200).json(notificationArray)

        }

    })

}

const deleteNotification = async (req, res) => {

    let idutilisateur = req.user.idutilisateur

    const queryString = "delete from notification WHERE idutilisateur = ?"
    pool.query(queryString, [idutilisateur], (err, rows, fields) => {

        if (err) {


            res.status(404).end()

        } else {


            res.status(200).end()
        }

    })

}

module.exports = { sendNotificationToTopic,deleteNotification,updateNotification,getAllNotification }