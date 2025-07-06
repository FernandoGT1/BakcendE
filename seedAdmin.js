require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./models/db');

// Datos del admin
const username = 'FernandoGT2';
const email = 'fernando.admin@example.com';
const password = 'T2Am4p@E'; // Contraseña original
const role = 'admin';

async function seedAdmin() {
  try {
    const [existing] = await db.execute(
      'SELECT * FROM 22393139f2_users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existing.length > 0) {
      console.log('⚠️ El admin ya está registrado.');
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      `INSERT INTO 22393139f2_users (username, email, password, role)
       VALUES (?, ?, ?, ?)`,
      [username, email, hashedPassword, role]
    );

    console.log('✅ Usuario administrador registrado con éxito.');
  } catch (error) {
    console.error('❌ Error al crear el usuario admin:', error.message);
  } finally {
    process.exit();
  }
}

seedAdmin();
