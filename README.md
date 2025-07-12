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
# Configuración de MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=22393139FGT_backend_contactos
DB_PORT=3306

# Configuración del servidor Node.js
PORT=3000

# Configuración de reCAPTCHA v2 (agregar esto)
RECAPTCHA_SECRET_KEY=6LctkGwrAAAAAExsOHBibMh-k_8KOzGjnqPfVE5g

# Gmail
GMAIL_USER=gomeztoledofernando14@gmail.com
GMAIL_APP_PASS=hrtqjivjdrpitnbh

# JWT
JWT_SECRET=9347c638e1d93ddb10dd9db21ded08219eaa39d01232d92aed641172a201504c0ea5ce0fb0cbed3f81b53d9ccb44a71cc68a6dce600370a9430c3955790693d2

```

- *4.-Crea una base de datos y tabla*

*Ejecuta en MySQL:*

```sql

-- Si quieres eliminar la base primero (opcional)
DROP DATABASE IF EXISTS 22393139FGT_backend_contactos;

-- Crear base de datos limpia
CREATE DATABASE 22393139FGT_backend_contactos;

-- Usar la base
USE 22393139FGT_backend_contactos;

CREATE TABLE 22393139f2_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Crear tabla con nombre simple para evitar errores
CREATE TABLE 22393139f1_contactos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(100) NOT NULL,
  telefono VARCHAR(20),
  mensaje TEXT,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- Cambiar el rol del usuario FernandoGT2 a 'admin'
UPDATE 22393139f2_users
SET role = 'admin'
WHERE username = 'FernandoGT2';





-- Consultar datos (vacía por ahora)
SELECT * FROM 22393139f1_contactos;
SELECT * FROM 22393139f2_users;

-- Ver tablas
SHOW TABLES;


```
- *5.-Inicia el servidor*

```bash

node app.js

```
## 📚 Endpoints

## SWAGGER
```
http://localhost:3000/api-docs

```

# 👨‍💻 Autor
*Fernando GT - FernandoGT1*

# 🛡️ Licencia
 *Este proyecto está bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.*


