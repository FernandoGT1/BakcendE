const axios = require('axios');
const mysql = require('mysql2/promise'); // Usaremos la versión promise-based
require('dotenv').config();

// Configuración de la conexión MySQL
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

// Función para sanitizar inputs
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

const saveContact = async (req, res) => {
  // Sanitizar y validar inputs
  const nombre = sanitizeInput(req.body.nombre);
  const correo = sanitizeInput(req.body.correo);
  const telefono = sanitizeInput(req.body.telefono);
  const mensaje = sanitizeInput(req.body.mensaje);
  const token = req.body['g-recaptcha-response'];

  // Validaciones básicas
  if (!token) {
    return res.status(400).json({ 
      error: "Validación requerida",
      message: "Por favor completa el reCAPTCHA" 
    });
  }

  if (!nombre || !correo || !telefono || !mensaje) {
    return res.status(400).json({ 
      error: "Datos incompletos",
      message: "Todos los campos son requeridos" 
    });
  }

  try {
    // Validar reCAPTCHA con Google
    const recaptchaResponse = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: token,
        remoteip: req.ip // Opcional: validar IP del cliente
      }),
      { 
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded' 
        },
        timeout: 5000 // Timeout de 5 segundos
      }
    );

    if (!recaptchaResponse.data.success) {
      console.warn('Intento fallido de reCAPTCHA:', {
        errors: recaptchaResponse.data['error-codes'],
        ip: req.ip
      });
      
      return res.status(400).json({ 
        error: "Validación fallida",
        message: "Por favor verifica que no eres un robot",
        code: "INVALID_RECAPTCHA"
      });
    }

    // Validación adicional del score (opcional para v3)
    if (recaptchaResponse.data.score < 0.5) { // Si estás usando v3
      console.warn('Score bajo de reCAPTCHA:', recaptchaResponse.data.score);
      return res.status(400).json({ 
        error: "Actividad sospechosa",
        message: "No pudimos verificar tu identidad",
        code: "LOW_RECAPTCHA_SCORE"
      });
    }

    // Guardar en MySQL usando connection pool
   const [result] = await pool.execute(
  "INSERT INTO contactos (nombre, correo, telefono, mensaje) VALUES (?, ?, ?, ?)",
  [nombre, correo, telefono, mensaje]
);

    // Log exitoso
    console.log(`Nuevo contacto guardado ID: ${result.insertId}`);

    return res.status(201).json({ 
      success: true,
      message: "Contacto guardado exitosamente",
      data: {
        id: result.insertId,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error("Error en el servidor:", {
      error: error.message,
      stack: error.stack,
      body: req.body
    });

    // Manejo específico de errores de MySQL
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        error: "Entrada duplicada",
        message: "Este contacto ya existe en nuestro sistema"
      });
    }

    return res.status(500).json({ 
      error: "Error en el servidor",
      message: "Ocurrió un error al procesar tu solicitud",
      code: "SERVER_ERROR"
    });
  }
};

module.exports = { 
  saveContact,
  sanitizeInput // Exportamos para testing
};