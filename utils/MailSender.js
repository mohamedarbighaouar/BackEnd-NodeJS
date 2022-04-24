var nodeMailer = require('nodemailer')

module.exports = {transporter:nodeMailer.createTransport({
  service: process.env.NODE_MAILER_SERVICE,
  auth: {
    user: process.env.NODE_MAILER_USER,
    pass: process.env.NODE_MAILER_PASSWORD
  }
})
}
