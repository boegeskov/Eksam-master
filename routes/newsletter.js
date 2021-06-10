const router = require("express").Router(); // den sidste parantes instansere linjen. // dummy route
require('dotenv').config();
const nodemailer = require("nodemailer");


//get route to send mail, from form
router.post("/contacts/sendMail", async (req, res) => {
    
    const subject = req.body.subject
    const message = req.body.message

    sendMail(subject, message);

    console.log(subject, message);

res.redirect("/");
});


// async..await is not allowed in global scope, must use a wrapper
async function sendMail(subject, message) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  const testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    },
    tls: {
        ciphers:'SSLv3'
    },
    logger: true,
    debug: true
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Nicklas" <nick003h@stud.kea.dk>', // sender address
    to: "nick003h@stud.kea.dk", // list of receivers
    subject: subject, // Subject line
    text: message, // plain text body
    html: "<b>" + message + "</b>" // html body
  }, function(error, response) {
    if (error) {
        console.log(error);
    } else {
        console.log('Message sent');
    }
});

} 



router.get("/api/newsletter", (req, res) => {
    
});


// a variable you assaign something too
module.exports = {
    router
};