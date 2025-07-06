const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { verifyToken, requireAdmin } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Contactos
 *   description: Endpoints para gestionar los contactos desde el formulario y el CRM
 */

/**
 * @swagger
 * /api/contacto:
 *   post:
 *     summary: Guardar un nuevo contacto desde el formulario
 *     tags: [Contactos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - correo
 *               - telefono
 *               - mensaje
 *               - g-recaptcha-response
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Juan Pérez
 *               correo:
 *                 type: string
 *                 example: juan@example.com
 *               telefono:
 *                 type: string
 *                 example: 5551234567
 *               mensaje:
 *                 type: string
 *                 example: Me interesa el producto.
 *               g-recaptcha-response:
 *                 type: string
 *                 example: token_del_recaptcha
 *     responses:
 *       201:
 *         description: Contacto guardado exitosamente
 *       400:
 *         description: Validación o datos incorrectos
 */
router.post('/contacto', contactController.saveContact);

/**
 * @swagger
 * /api/contactos:
 *   get:
 *     summary: Obtener todos los contactos (solo admin)
 *     tags: [Contactos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de contactos
 *       401:
 *         description: No autorizado
 */
router.get('/contactos', verifyToken, requireAdmin, contactController.getContacts);

/**
 * @swagger
 * /api/contactos/{id}:
 *   get:
 *     summary: Obtener contacto por ID (solo admin)
 *     tags: [Contactos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Datos del contacto
 *       404:
 *         description: Contacto no encontrado
 */
router.get('/contactos/:id', verifyToken, requireAdmin, contactController.getContactById);

/**
 * @swagger
 * /api/contactos/{id}:
 *   delete:
 *     summary: Eliminar contacto por ID (solo admin)
 *     tags: [Contactos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Contacto eliminado
 *       404:
 *         description: Contacto no encontrado
 */
router.delete('/contactos/:id', verifyToken, requireAdmin, contactController.deleteContact);

/**
 * @swagger
 * /api/contactos/{id}:
 *   put:
 *     summary: Actualizar contacto por ID (solo admin)
 *     tags: [Contactos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Nuevo Nombre
 *               correo:
 *                 type: string
 *                 example: nuevo@email.com
 *               telefono:
 *                 type: string
 *                 example: 5559999999
 *               mensaje:
 *                 type: string
 *                 example: Mensaje actualizado
 *     responses:
 *       200:
 *         description: Contacto actualizado
 *       404:
 *         description: Contacto no encontrado
 */
router.put('/contactos/:id', verifyToken, requireAdmin, contactController.updateContact);

module.exports = router;
