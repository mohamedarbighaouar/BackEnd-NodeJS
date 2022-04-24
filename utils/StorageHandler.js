var path = require('path')
const fs = require("fs")

const profileImagePath = function profileImagePath()
{

    let serverRootPath = path.join(__dirname, '..')
    let imageUploadsPath = serverRootPath+process.env.PROFILE_IMAGE_PATH

    if (!fs.existsSync(imageUploadsPath)) {
        
        fs.mkdirSync(imageUploadsPath, { recursive: true }, (err) => {
            if (err) {
                throw err;
            }
        })
        
    }

    return imageUploadsPath

}

function formationpath()
{
    let serverRootPath = path.join(__dirname, '..')
    let formationPath = serverRootPath+process.env.FORMATION_PATH

    if (!fs.existsSync(formationPath)) {
        
        fs.mkdirSync(formationPath, { recursive: true }, (err) => {
            if (err) {
                throw err;
            }
        })
        
    }

    return formationPath
}


const singleFormationPath = function singleFormationPath(id)
{

    let singleFormationPath = formationpath() +"/"+id

    if (!fs.existsSync(singleFormationPath)) {
        
        fs.mkdirSync(singleFormationPath, { recursive: true }, (err) => {
            if (err) {
                throw err;
            }
        })
        
    }

    return singleFormationPath
}


const singleQuizPath = function singleQuizPath(id)
{

    let singleQuizPath = formationpath() +"/"+id + "/quiz"

    if (!fs.existsSync(singleQuizPath)) {
        
        fs.mkdirSync(singleQuizPath, { recursive: true }, (err) => {
            if (err) {
                throw err;
            }
        })
        
    }

    return singleQuizPath
}

const singleCertificationPath = function singleCertificationPath(idformation)
{

    let singleCertificationPath = formationpath() +"/"+idformation + "/certification"

    if (!fs.existsSync(singleCertificationPath)) {
        
        fs.mkdirSync(singleCertificationPath, { recursive: true }, (err) => {
            if (err) {
                throw err;
            }
        })
        
    }

    return singleCertificationPath
}


const videoFormationPath = function videoFormationPath(id,idcontenu)
{

    let videoFormationPath = formationpath() +id+"/video/"+idcontenu+"/"

    if (!fs.existsSync(videoFormationPath)) {
        
        fs.mkdirSync(videoFormationPath, { recursive: true }, (err) => {
            if (err) {
                throw err;
            }
        })
        
    }

    return videoFormationPath

}


module.exports = {

    profileImagePath,singleFormationPath,videoFormationPath,singleQuizPath,singleCertificationPath

}
