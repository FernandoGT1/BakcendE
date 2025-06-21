## 🚀 Requisitos Previos
- Node.js (v18+)

- MySQL (v8.0+)

- npm o yarn

## 🔧 Instalación

- *1.-Clonar el repositorio*

```bash
git clone https://github.com/FernandoGT1/BakcendE.git
cd BackendE
```
- *2.-Instalar dependencias*

```bash

npm install

```

- *3.-Configurar variables de entorno*

***Crea un archivo .env en la raiz del proyecto con:***

```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=backend_contactos
DB_PORT=3306
PORT=3000

```

- *4.-Crea una base de datos y tabla*

*Ejecuta en MySQL:*

```sql

CREATE DATABASE backend_contactos;
USE backend_contactos;

CREATE TABLE contactos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(100) NOT NULL,
  telefono VARCHAR(20),
  mensaje TEXT,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

```
- *5.-Inicia el servidor*

```bash

node app.js

```
## 📚 Endpoints
### POST /api/contacto

-*Envía datos de contacto para almacenar en MySQL, Ejemplo:*

```json
{
  "nombre": "Juan Pérez",
  "correo": "juan@example.com",
  "telefono": "5512345678",
  "mensaje": "Hola, necesito información."
}

```


# 👨‍💻 Autor
*Fernando GT - FernandoGT1*

# 🛡️ Licencia
 *Este proyecto está bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.*


