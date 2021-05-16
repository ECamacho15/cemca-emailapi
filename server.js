const express = require("express");
const nodemailer = require("nodemailer");
const app = express();
const cors = require("cors");
require("dotenv").config();

const formularioAfiliacion = require('./templates/formularioAfiliacion')
const formularioContactenos = require('./templates/formularioContactenos')

// middleware
app.use(express.json());
app.use(cors());

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL,
      pass: process.env.WORD,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    },
});

transporter.verify((err, success) => {
    err
      ? console.log(err)
      : console.log(`=== Server is ready to take messages: ${success} ===`);
});

app.post("/sendForm", function (req, res) {
    let mailOptions = {
      from: `${req.body.values.email}`,
      to: 'eudescam20@gmail.com',
      subject: `Mensaje de: ${req.body.values.email}`,
      html: formularioAfiliacion(req.body.values),
    };
   
    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            res.json({
                status: "fail",
            });
        } else {
            console.log("== Message Sent ==");
            res.json({
                status: "success",
            });
        }
    });
});

app.post("/sendContact", function (req, res) {
    let mailOptions = {
      from: `${req.body.values.email}`,
      to: 'eudescam20@gmail.com',
      subject: `Mensaje WEB de: ${req.body.values.name} ${req.body.values.lastName}`,
      html: formularioContactenos(req.body.values),
    };
   
    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            res.json({
                status: "fail",
            });
        } else {
            console.log("== Message Sent ==");
            res.json({
                status: "success",
            });
        }
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
 console.log(`Server is running on port: ${PORT}`);
});