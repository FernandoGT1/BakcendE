const connection = require("../db/connection");

const saveContact = (req, res) => {
  const { nombre, correo, telefono, mensaje } = req.body;

  const query = "INSERT INTO contactos (nombre, correo, telefono, mensaje) VALUES (?, ?, ?, ?)";
  connection.query(query, [nombre, correo, telefono, mensaje], (err, result) => {
    if (err) {
      console.error("Error saving contact:", err);
      return res.status(500).json({ error: "Error al guardar el contacto" });
    }
    res.status(201).json({ message: "Contacto guardado correctamente" });
  });
};

module.exports = { saveContact };