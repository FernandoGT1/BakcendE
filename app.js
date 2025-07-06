const express = require('express');
const cors = require('cors');
const contactRoutes = require('./routes/contactRoutes');
// const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/authRoutes');
const { swaggerUi, swaggerSpec } = require('./config/swagger');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas principales
app.use('/api', contactRoutes);
// app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
