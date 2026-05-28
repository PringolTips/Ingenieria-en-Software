# Prueba automatizada Backend - DIGICLIN

## Caso de uso probado

Inicio de sesión de usuario.

Esta prueba automatizada valida el endpoint de login del backend de DIGICLIN. Se prueban dos escenarios:

1. Inicio de sesión exitoso con credenciales válidas.
2. Rechazo de inicio de sesión con contraseña incorrecta.

---

## Herramientas utilizadas

- Node.js
- Jest
- Supertest
- Dotenv

Jest se utiliza para ejecutar las pruebas y realizar las aserciones mediante `expect()`.  
Supertest se utiliza para enviar peticiones HTTP reales al endpoint del backend.

---

## Endpoint probado

```text
POST http://18.220.93.246:3000/api/v1/auth/login
```

---

## Datos de prueba

Usuario de prueba:

```text
Correo: pringol@digiclin.com
Rol: Medico
Estatus: Activo
```

Nota: el usuario Pringol es un usuario ficticio/controlado creado únicamente para pruebas automatizadas. No representa a una persona real ni contiene datos personales reales.

---

## Estado inicial requerido

Antes de ejecutar la prueba, el backend debe estar activo y accesible desde internet.

También debe existir en la base de datos el usuario de prueba con estatus activo.

---

## Archivos principales

```text
tests/backend/
├── auth.login.test.js
├── package.json
├── .env.test.example
└── README.md
```

---

## Instrucciones para ejecutar la prueba

### 1. Clonar el repositorio

```bash
git clone URL_DEL_REPOSITORIO
```

### 2. Entrar a la carpeta del proyecto

```bash
cd Ingenieria-en-Software/Ingenieria_de_Software
```

### 3. Entrar a la carpeta de pruebas backend

```bash
cd tests/backend
```

### 4. Instalar dependencias

```bash
npm install
```

### 5. Ejecutar la prueba

```bash
npm test
```

---

## Resultado esperado

Si la prueba se ejecuta correctamente, la consola debe mostrar un resultado similar al siguiente:

```text
PASS ./auth.login.test.js

DIGICLIN - Prueba automatizada backend - Inicio de sesión
  √ Escenario exitoso: permite iniciar sesión con credenciales válidas
  √ Escenario incorrecto: rechaza inicio de sesión con contraseña inválida

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
```

Además, la salida de consola mostrará información detallada del escenario exitoso:

```text
PRUEBA BACKEND - LOGIN EXITOSO
URL probada: http://18.220.93.246:3000/api/v1/auth/login
Método HTTP: POST
Status HTTP: 200
Mensaje: Login correcto
Token recibido: Sí, token generado
Usuario recibido:
  ID usuario: 5
  Nombre usuario: Pringol
  Correo: pringol@digiclin.com
  Rol: Medico
  Estatus: Activo
```

Y también mostrará el escenario incorrecto:

```text
PRUEBA BACKEND - LOGIN INCORRECTO
URL probada: http://18.220.93.246:3000/api/v1/auth/login
Método HTTP: POST
Status HTTP: 401
OK: false
Mensaje: Credenciales inválidas
```

---

---

## Generar reporte de evidencia

Para generar un reporte JSON de la ejecución:

```bash
npm run test:report
```

El reporte se guardará en:

```text
tests/evidencias/backend/reporte-backend.json
```
