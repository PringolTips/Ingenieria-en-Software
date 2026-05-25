require("dotenv").config({ path: ".env.test" });
const request = require("supertest");

const API_URL = process.env.API_URL;
const LOGIN_ENDPOINT = process.env.LOGIN_ENDPOINT;

const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL;
const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD;
const TEST_USER_WRONG_PASSWORD = process.env.TEST_USER_WRONG_PASSWORD;

describe("DIGICLIN - Prueba automatizada backend - Inicio de sesión", () => {
  test("Escenario exitoso: permite iniciar sesión con credenciales válidas", async () => {
    const inicio = Date.now();

    const response = await request(API_URL)
      .post(LOGIN_ENDPOINT)
      .send({
        correo: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD
      });

    const tiempoRespuesta = Date.now() - inicio;

    console.log("\n========================================");
    console.log(" PRUEBA BACKEND - LOGIN EXITOSO");
    console.log("========================================");
    console.log("URL probada:", `${API_URL}${LOGIN_ENDPOINT}`);
    console.log("Método HTTP: POST");
    console.log("Status HTTP:", response.status);
    console.log("Tiempo de respuesta:", `${tiempoRespuesta} ms`);
    console.log("OK:", response.body.ok);
    console.log("Mensaje:", response.body.mensaje || response.body.message);
    console.log("Token recibido:", response.body.data?.token ? "Sí, token generado" : "No");

    console.log("Requiere cambio de password:", response.body.data?.requiere_cambio_password);

    console.log("Usuario recibido:");
    console.log("  ID usuario:", response.body.data?.usuario?.id_usuario);
    console.log("  Nombre usuario:", response.body.data?.usuario?.nombre_usuario);
    console.log("  Correo:", response.body.data?.usuario?.correo);
    console.log("  Rol:", response.body.data?.usuario?.nombre_rol);
    console.log("  Estatus:", response.body.data?.usuario?.nombre_estatus);

    console.log("========================================\n");

    // Aserción 1: Código HTTP esperado
    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThan(300);

    // Aserción 2: Estructura JSON esperada
    expect(response.body).toBeDefined();
    expect(typeof response.body).toBe("object");

    // Aserción 3: Confirmación de operación exitosa
    expect(response.body.ok).toBe(true);

    // Aserción 4: Mensaje esperado
    expect(response.body.mensaje).toBe("Login correcto");

    // Aserción 5: Token recibido
    expect(response.body.data).toBeDefined();
    expect(response.body.data.token).toBeDefined();
    expect(typeof response.body.data.token).toBe("string");

    // Aserción 6: Usuario recibido
    expect(response.body.data.usuario).toBeDefined();
    expect(response.body.data.usuario.correo).toBe(TEST_USER_EMAIL);
    expect(response.body.data.usuario.nombre_estatus).toBe("Activo");
  });

  test("Escenario incorrecto: rechaza inicio de sesión con contraseña inválida", async () => {
    const inicio = Date.now();

    const response = await request(API_URL)
      .post(LOGIN_ENDPOINT)
      .send({
        correo: TEST_USER_EMAIL,
        password: TEST_USER_WRONG_PASSWORD
      });

    const tiempoRespuesta = Date.now() - inicio;

    console.log("\n========================================");
    console.log(" PRUEBA BACKEND - LOGIN INCORRECTO");
    console.log("========================================");
    console.log("URL probada:", `${API_URL}${LOGIN_ENDPOINT}`);
    console.log("Método HTTP: POST");
    console.log("Status HTTP:", response.status);
    console.log("Tiempo de respuesta:", `${tiempoRespuesta} ms`);
    console.log("OK:", response.body.ok);
    console.log("Mensaje:", response.body.mensaje || response.body.message || response.body.error);
    console.log("========================================\n");

    // Aserción 1: Código HTTP de error controlado
    expect([400, 401, 403]).toContain(response.status);

    // Aserción 2: Estructura JSON esperada
    expect(response.body).toBeDefined();
    expect(typeof response.body).toBe("object");

    // Aserción 3: Confirmación de operación rechazada
    expect(
      response.body.ok === false ||
      response.body.success === false ||
      response.body.status === "error"
    ).toBeTruthy();

    // Aserción 4: Mensaje de error esperado
    expect(
      response.body.mensaje ||
      response.body.message ||
      response.body.error
    ).toBeDefined();
  });
});