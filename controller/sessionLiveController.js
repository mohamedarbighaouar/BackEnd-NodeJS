
const getAllSessionliveBySubscription = async (req, res) => { 

    let idutilisateur = req.user.idutilisateur
    
    const queryString = "SELECT *,(select GROUP_CONCAT(DISTINCT specialite.idspecialite SEPARATOR ',') from formateur_has_specialite inner join specialite on formateur_has_specialite.specialite_idspecialite = specialite.idspecialite where formateur_idformateur = formateur.idformateur) as specialite_formateur from sessionlive inner join abonnement on sessionlive.formateur_idutilisateur = abonnement.formateur_idutilisateur  inner join utilisateur on sessionlive.formateur_idutilisateur = utilisateur.idutilisateur inner join formateur on sessionlive.formateur_idutilisateur = formateur.utilisateur_idutilisateur  where abonnement.apprenant_idutilisateur = ?"

    pool.query(queryString, [idutilisateur], (err, rows, fields) => {
      
        if (err) {
        
        res.status(404).end()
        console.log(err)
          
      }else{

        let sessionsLive = []

        rows.forEach(element => {
        
        let sessionLive = {idsessionLive:element.idsessionLive,specialite:element.specialite_formateur,roomId:element.roomId,description:element.description,created_at:element.created_at ?? "",formateur: { idutilisateur: element.idutilisateur, firstname: element.firstname, lastname: element.lastname, email: element.email, github_link: element.github_link, youtube_link: element.youtube_link, linkedin_link: element.linkedin_link, image: element.image ?? "" }}
        sessionsLive.push(sessionLive)

        });

        res.status(200).send(sessionsLive)

      }
    })

}


module.exports = {

    getAllSessionliveBySubscription

}