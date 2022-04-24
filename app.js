var express = require('express');
var app = express();
var morgan = require('morgan')
const bodyParser = require('body-parser')
require('dotenv').config();
var path = require('path');

var db = require('./db');

app.use(morgan(':method :url :status :res[content-length] - :response-time ms '))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var AuthRoutes = require('./routes/authentification');
app.use('/skillspace/auth', AuthRoutes);
 
var CategorieRoutes = require('./routes/categorie');
app.use('/skillspace/categorie', CategorieRoutes);

var ChatRoutes = require('./routes/chat');
app.use('/skillspace/chat', ChatRoutes);

var UserRoutes = require('./routes/user');
app.use('/skillspace/user', UserRoutes);

var FormationRoutes = require('./routes/formation');
app.use('/skillspace/formation', FormationRoutes);

var CentreInteretRoutes = require('./routes/centreInteret');
app.use('/skillspace/centreInteret', CentreInteretRoutes);

var AvisRoutes = require('./routes/avis');
app.use('/skillspace/avis', AvisRoutes);

var SpecialiteRoutes = require('./routes/specialite');
app.use('/skillspace/specialite', SpecialiteRoutes);

var CertificationRoutes = require('./routes/certification');
app.use('/skillspace/certification', CertificationRoutes);

var QuestionReponseRoutes = require('./routes/questionReponseFormation');
app.use('/skillspace/questionReponseFormation', QuestionReponseRoutes); 

var QuizRoutes = require('./routes/quiz');
app.use('/skillspace/quiz', QuizRoutes); 

var NotificationRoutes = require('./routes/notification');
app.use('/skillspace/notification', NotificationRoutes); 

var SessionLiveRoutes = require('./routes/sessionLive');
app.use('/skillspace/sessionlive', SessionLiveRoutes); 

app.use(express.static(path.join(__dirname, "/")));

module.exports = app;