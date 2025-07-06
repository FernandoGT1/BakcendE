const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS
  }
});

async function sendNotificationEmail(data) {
  const mailOptions = {
    from: `"Formulario Web" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    subject: 'Nuevo contacto registrado',
    text: `Nombre: ${data.nombre}\nCorreo: ${data.correo}\nTeléfono: ${data.telefono}\nMensaje: ${data.mensaje}`
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendNotificationEmail };
