const axios = require('axios');
const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Conexión a la BD
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Sanitizar inputs
const sanitizeInput = (input) => {
  if (!input) return input;
  return input.toString()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\$/g, '&#36;')
    .replace(/\|/g, '&#124;');
};

// Guardar contacto (POST)
const saveContact = async (req, res) => {
  const nombre = sanitizeInput(req.body.nombre);
  const correo = sanitizeInput(req.body.correo);
  const telefono = sanitizeInput(req.body.telefono);
  const mensaje = sanitizeInput(req.body.mensaje);
  const token = req.body['g-recaptcha-response'];

  if (!token) return res.status(400).json({ error: "Validación requerida", message: "Por favor completa el reCAPTCHA" });
  if (!nombre || !correo || !telefono || !mensaje)
    return res.status(400).json({ error: "Datos incompletos", message: "Todos los campos son requeridos" });

  try {
    const recaptchaResponse = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: token,
        remoteip: req.ip
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, timeout: 5000 }
    );

    if (!recaptchaResponse.data.success) {
      return res.status(400).json({ error: "Validación fallida", message: "No pudimos verificar que eres humano" });
    }

    if (recaptchaResponse.data.score !== undefined && recaptchaResponse.data.score < 0.5) {
      return res.status(400).json({ error: "Actividad sospechosa", message: "Score bajo de reCAPTCHA" });
    }

    const [result] = await pool.execute(
      "INSERT INTO 22393139f1_contactos (nombre, correo, telefono, mensaje) VALUES (?, ?, ?, ?)",
      [nombre, correo, telefono, mensaje]
    );

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS
      }
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      subject: '📬 Nuevo contacto desde la landing',
      text: `
        ¡Nuevo contacto recibido!

        Nombre: ${nombre}
        Correo: ${correo}
        Teléfono: ${telefono}
        Mensaje: ${mensaje}
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Contacto guardado y correo enviado. ID: ${result.insertId}`);

    return res.status(201).json({
      success: true,
      message: "Contacto guardado y correo enviado",
      data: {
        id: result.insertId,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error("❌ Error al guardar contacto:", error);
    return res.status(500).json({ error: "Error en el servidor", message: error.message });
  }
};

// Obtener todos los contactos (GET)
const getContacts = async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM 22393139f1_contactos ORDER BY fecha_creacion DESC");
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los contactos" });
  }
};

// Obtener contacto por ID (GET)
const getContactById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.execute("SELECT * FROM 22393139f1_contactos WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ error: "Contacto no encontrado" });
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el contacto" });
  }
};

// Actualizar contacto (PUT)
const updateContact = async (req, res) => {
  const { id } = req.params;
  const { nombre, correo, telefono, mensaje } = req.body;
  try {
    const [result] = await pool.execute(
      "UPDATE 22393139f1_contactos SET nombre = ?, correo = ?, telefono = ?, mensaje = ? WHERE id = ?",
      [nombre, correo, telefono, mensaje, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: "Contacto no encontrado" });
    res.status(200).json({ message: "Contacto actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar contacto" });
  }
};

// Eliminar contacto (DELETE)
const deleteContact = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.execute("DELETE FROM 22393139f1_contactos WHERE id = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Contacto no encontrado" });
    res.status(200).json({ message: "Contacto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar contacto" });
  }
};

// Exportar
module.exports = {
  saveContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
  sanitizeInput
};
