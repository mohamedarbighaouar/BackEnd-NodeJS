
const getMessages = async (req, res) => {

  let me = req.body.sender
  let other = req.body.receiver

  const queryString = "SELECT * , (select firstname from utilisateur where idutilisateur = messages.sender) as sender_firstname ,(select lastname from utilisateur where idutilisateur = messages.sender) as sender_lastname,(select firstname from utilisateur where idutilisateur = messages.receiver) as receiver_firstname,(select lastname from utilisateur where idutilisateur = messages.receiver) as receiver_lastname from messages where (sender = ? and receiver = ?) or (sender = ? and receiver = ?) order by  idmessages asc"

  pool.query(queryString, [me, other, other, me], (err, rows, fields) => {

    if (err) {

      console.log(err)
      res.status(404).end()


    } else {

      let messages = []

      rows.forEach(element => {
        let isMe

        if (me == element.sender) {

          isMe = true

        } else {

          isMe = false

        }

        let username = element.sender_firstname + " " + element.sender_lastname
        let msg = { idmessages: element.idmessages, dateMessage:element.created_at ?? "", message: element.content, username, isMe }

        messages.push(msg)
      });

      res.status(200).send(messages)

    }
  })

}

const getDiscussions = async (req, res) => {

  let idutilisateur = req.user.idutilisateur

  const queryString = "select * from messages inner join utilisateur on utilisateur.idutilisateur = (if (sender = ?,receiver,sender) ) where (sender = ? or receiver = ?) and idmessages in (select max(idmessages) from messages m group by receiver,sender having idmessages in ( select max(idmessages) from messages where (receiver = m.receiver and sender = m.sender) or (receiver = m.sender and sender = m.receiver)) ) order by idmessages desc;"

  pool.query(queryString, [idutilisateur,idutilisateur,idutilisateur], (err, rows, fields) => {

    if (err) {

      console.log(err)
      res.status(404).end()

    } else { 

      let discussions = []

      rows.forEach(element => {

        
        let discu = { idmessages: element.idmessages,created_at:element.created_at ?? "", content: element.content, sender:element.sender, receiver:element.receiver,other:{idutilisateur:element.idutilisateur,email:element.email,firstname:element.firstname,lastname:element.lastname,image:element.image ?? ""} }
      
        discussions.push(discu)
        
          
      });

      res.status(200).send(discussions)

    }
  })

}


module.exports = {
  getMessages,getDiscussions
}