const { remote } = require('webdriverio');
const fs = require('fs');
const path = require('path');

// Configuración de la ruta del archivo de resultados
const rutaLog = path.join(__dirname, 'resultado_ejecucion_digiclin.txt');

// Función asistente para imprimir en consola y guardar en el archivo de texto
function registrarLog(mensaje, tipo = "INFO") {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const lineaLog = `[${timestamp}] [${tipo}] ${mensaje}\n`;
    console.log(mensaje); // Mantiene la salida visual en tu PowerShell
    fs.appendFileSync(rutaLog, lineaLog, 'utf8');
}

const capacidades = {
    hostname: '127.0.0.1',
    port: 4723,
    path: '/',
    capabilities: {
        platformName: 'Android',
        'appium:automationName': 'UiAutomator2',
        'appium:deviceName': 'Dispositivo_DIGICLIN_WiFi',
        'appium:appPackage': 'host.exp.exponent', 
        'appium:appActivity': 'host.exp.exponent.LauncherActivity',
        'appium:noReset': true
    }
};

async function ejecutarMegaFlujoIntegralCompleto() {
    // Inicializar el reporte limpio con un encabezado institucional
    fs.writeFileSync(rutaLog, `=================================================================\n` +
                             `   AUDITORÍA DE PRUEBAS AUTOMATIZADAS - SISTEMA DIGICLIN         \n` +
                             `   Fecha de inicio: ${new Date().toLocaleString()}              \n` +
                             `=================================================================\n\n`, 'utf8');

    registrarLog("📡 Conectando al canal inalámbrico del Oppo Reno 10...", "SISTEMA");
    let driver;
    
    try {
        driver = await remote(capacidades);
    } catch (err) {
        registrarLog(`Fallo crítico al conectar con Appium Server: ${err.message}`, "ERROR");
        return;
    }

    // 🎯 GENERACIÓN DINÁMICA: Crea un ID único de 4 dígitos por cada corrida
    const ID_DINAMICO = Math.floor(1000 + Math.random() * 9000).toString(); 
    const USUARIO_MEDICO = `doc.villeda${ID_DINAMICO}`;
    const CORREO_MEDICO = `villeda.${ID_DINAMICO}@digiclin.com`;
    const CURP_DINAMICA = `VIMA020310HQTRJS${ID_DINAMICO.slice(-2)}`; 
    
    const CONTRASENA_ADMIN = "1234@abc";
    const CONTRASENA_TEMPORAL = "12345678"; 
    const CONTRASENA_NUEVA = "12345678A";     

    const SELECTOR_ALERT_OK = '//*[@text="OK" or @text="Aceptar" or @text="ACEPTAR" or @text="ok" or @text="Ok" or @text="Cerrar"]';

    try {
        registrarLog(`🚀 Datos Únicos Generados para esta corrida: ID [${ID_DINAMICO}]`, "DATA");
        registrarLog(`🔹 Médico: ${USUARIO_MEDICO} | Correo: ${CORREO_MEDICO}`, "DATA");
        registrarLog(`🔹 Paciente CURP: ${CURP_DINAMICA}`, "DATA");

        // ==========================================================
        // PASO -1: PURGA DE ENTORNO
        // ==========================================================
        registrarLog("🧹 Pasarela de Seguridad: Validando estado de pantalla inicial...", "PASO");
        await driver.pause(3000);
        
        const enDashboardMedico = await driver.$('//*[@text="Registrar Paciente" or @text="Consultar Pacientes"]').isExisting();
        if (enDashboardMedico) {
            registrarLog("🔄 Sesión remanente abierta detectada. Forzando Logout preventivo...", "BIFURCACIÓN");
            const { width: wW, height: wH } = await driver.getWindowSize();
            await driver.action('pointer').move({ duration: 0, x: Math.round(wW * 0.90), y: Math.round(wH * 0.06) }).down({ button: 0 }).pause(100).up({ button: 0 }).perform();
            await driver.pause(2000);
            try { await (await driver.$('//*[contains(translate(@text, "SÍ", "si"), "si")]')).click(); await driver.pause(3000); } catch {}
        }

        // ==========================================================
        // PASO 0: COMPROBACIÓN DE LOGUEO
        // ==========================================================
        registrarLog("🔍 Paso 0: Ejecutando Comprobación de Vuelo Inicial...", "PASO");
        const inputUser = await driver.$('android=new UiSelector().className("android.widget.EditText").instance(0)');
        await inputUser.waitForExist({ timeout: 15000 });

        await inputUser.setValue(CORREO_MEDICO);
        await (await driver.$('android=new UiSelector().className("android.widget.EditText").instance(1)')).setValue(CONTRASENA_NUEVA);
        await (await driver.$('//*[@text="Ingresar"]')).click();
        await driver.pause(5000);

        const loginExitoso = await driver.$('//*[@text="Registrar Paciente"]').isExisting();

        if (!loginExitoso) {
            registrarLog("⚠️ Al ser datos completamente nuevos, el ingreso falló correctamente. Saltando a FASE 1...", "INFO");
            try { await (await driver.$(SELECTOR_ALERT_OK)).click(); } catch {}
            await driver.pause(1500);

            // ==========================================================
            // FASE 1: ADMINISTRADOR - CREAR USUARIO
            // ==========================================================
            registrarLog("👑 --- FASE 1: SECCIÓN ADMINISTRADOR ---", "PASO");
            const inputAdminUser = await driver.$('android=new UiSelector().className("android.widget.EditText").instance(0)');
            await inputAdminUser.setValue("admin@digiclin.com"); 
            await (await driver.$('android=new UiSelector().className("android.widget.EditText").instance(1)')).setValue(CONTRASENA_ADMIN); 
            await (await driver.$('//*[@text="Ingresar"]')).click();
            await driver.pause(5000);

            registrarLog("📍 Abriendo Menú Administrativo...", "INFO");
            const btnMenu = await driver.$('//*[@text="Menú"]');
            await btnMenu.waitForExist({ timeout: 10000 });
            await btnMenu.click(); 
            await driver.pause(2000);

            registrarLog("📍 Seleccionando Alta de Personal...", "INFO");
            const btnAlta = await driver.$('//*[@text="Alta de Personal"]');
            await btnAlta.waitForExist({ timeout: 10000 });
            await btnAlta.click(); 
            await driver.pause(2500);

            registrarLog(`✍️ Registrando al médico en la plataforma: ${USUARIO_MEDICO}...`, "INFO");
            await (await driver.$('//android.widget.EditText[@text="ej. dr.ramirez"]')).setValue(USUARIO_MEDICO);
            await (await driver.$('//android.widget.EditText[@text="nombre.apellido"]')).setValue(`villeda.${ID_DINAMICO}`);
            await (await driver.$('//*[@text="Medico"]')).click(); await driver.pause(1000);
            await (await driver.$('//android.widget.EditText[@text="ej. ABC12375"]')).setValue(`CED${ID_DINAMICO}MX`);
            
            if (await driver.isKeyboardShown()) await driver.hideKeyboard();

            registrarLog("📜 SCROLL NATIVO: Desplazando formulario de administración...", "INFO");
            const btnRegistrarPersonal = await driver.$('android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().text("Registrar Personal"))');
            await btnRegistrarPersonal.click();
            await driver.pause(3000);
            
            registrarLog("💥 Validando confirmación administrativa (opcional)...", "INFO");
            try {
                const AlertaAdminOk = await driver.$(SELECTOR_ALERT_OK);
                await AlertaAdminOk.waitForExist({ timeout: 3000 });
                await AlertaAdminOk.click();
                registrarLog("✅ Confirmación administrativa aceptada exitosamente.", "PASS");
            } catch (err) {
                registrarLog("ℹ️ No se detectó diálogo secundario, continuando flujo...", "INFO");
            }
            await driver.pause(2000);

            registrarLog("🔓 FASE 1.5: Presionando el icono de salida del Administrador en el Header...", "PASO");
            const { width, height } = await driver.getWindowSize();
            await driver.action('pointer').move({ duration: 0, x: Math.round(width * 0.92), y: Math.round(height * 0.08) }).down({ button: 0 }).pause(150).up({ button: 0 }).perform();
            await driver.pause(2000);
            await (await driver.$('//*[@text="Sí" or @text="SÍ" or @text="SI"]')).click();
            await driver.deleteSession(); await driver.pause(2000);

            // ==========================================================
            // FASE 2: PRIMER INICIO DE SESIÓN DEL MÉDICO Y CAMBIO DE CLAVE
            // ==========================================================
            registrarLog("🛡️ --- FASE 2: PRIMER LOGIN DEL MÉDICO Y POLÍTICA DE SEGURIDAD ---", "PASO");
            driver = await remote(capacidades); 

            const inputMedUser = await driver.$('android=new UiSelector().className("android.widget.EditText").instance(0)');
            await inputMedUser.waitForExist({ timeout: 10000 });
            await inputMedUser.setValue(CORREO_MEDICO);
            await (await driver.$('android=new UiSelector().className("android.widget.EditText").instance(1)')).setValue(CONTRASENA_TEMPORAL);
            await (await driver.$('//*[@text="Ingresar"]')).click();
            await driver.pause(5000);

            registrarLog("🔒 Llenando los 3 campos obligatorios de cambio de contraseña...", "INFO");
            await (await driver.$('android=new UiSelector().className("android.widget.EditText").instance(0)')).setValue(CONTRASENA_TEMPORAL);
            await (await driver.$('android=new UiSelector().className("android.widget.EditText").instance(1)')).setValue(CONTRASENA_NUEVA);
            await (await driver.$('android=new UiSelector().className("android.widget.EditText").instance(2)')).setValue(CONTRASENA_NUEVA);
            if (await driver.isKeyboardShown()) await driver.hideKeyboard();
            
            await (await driver.$('//*[@text="Actualizar"]')).click(); await driver.pause(3000);
            
            try {
                const AlertaPassOk = await driver.$(SELECTOR_ALERT_OK);
                if (await AlertaPassOk.isExisting()) await AlertaPassOk.click();
            } catch {}
            await driver.pause(4000);

            registrarLog("🔐 Autenticando de forma definitiva con credenciales permanentes...", "INFO");
            await (await driver.$('android=new UiSelector().className("android.widget.EditText").instance(0)')).setValue(CORREO_MEDICO);
            await (await driver.$('android=new UiSelector().className("android.widget.EditText").instance(1)')).setValue(CONTRASENA_NUEVA);
            await (await driver.$('//*[@text="Ingresar"]')).click(); await driver.pause(5000);
        } else {
            registrarLog("🎉 [BIFURCACIÓN OPTIMIZADA]: La cuenta médica ya estaba activa. Saltando directo al Panel Clínico.", "BIFURCACIÓN");
        }

        // ==========================================================
        // FASE 3: REGISTRO DE PACIENTE (RF-01)
        // ==========================================================
        registrarLog("📋 --- FASE 3: MÓDULO CLÍNICO (RF-01) ---", "PASO");
        const optRegistrarPac = await driver.$('//*[@text="Registrar Paciente"]');
        await optRegistrarPac.waitForExist({ timeout: 10000 });
        await optRegistrarPac.click(); await driver.pause(2500);

        registrarLog(`✍️ Volcando expediente clínico del paciente Luis Antonio...`, "INFO");
        await (await driver.$('//android.widget.EditText[@text="Nombre"]')).setValue("Luis Antonio");
        await (await driver.$('//android.widget.EditText[@text="Paterno"]')).setValue("Carrillo");
        await (await driver.$('//android.widget.EditText[@text="Materno"]')).setValue("Tejas");

        await (await driver.$('//*[@text="FECHA DE NACIMIENTO"]')).click(); await driver.pause(1500);
        const btnCalOK = await driver.$('//*[@text="ACEPTAR" or @text="OK" or @text="Aceptar" or @text="Set"]');
        if (await btnCalOK.isDisplayed()) await btnCalOK.click(); await driver.pause(1000);

        await (await driver.$('//*[@text="Selecciona"]')).click(); await driver.pause(1000);
        await (await driver.$('//*[@text="Masculino"]')).click(); await driver.pause(1000);
        await (await driver.$('//*[@text="Selecciona"]')).click(); await driver.pause(1000);
        await (await driver.$('//*[@text="A+"]')).click(); await driver.pause(1000);

        await (await driver.$('//android.widget.EditText[@text="18 caracteres"]')).setValue(CURP_DINAMICA); 
        await (await driver.$('//android.widget.EditText[@text="correo@ejemplo.com"]')).setValue("luis.carrillo@gmail.com");
        await (await driver.$('//android.widget.EditText[@text="10 dígitos"]')).setValue("4421234567"); 
        await (await driver.$('//android.widget.EditText[@text="Ocupación"]')).setValue("Ingeniero de Software");

        await (await driver.$('//*[@text="Selecciona"]')).click(); await driver.pause(1000);
        await (await driver.$('//*[@text="Soltero"]')).click(); await driver.pause(1000);

        await (await driver.$('android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().text("Calle, número, colonia"))')).setValue("Av. Tecnológico #2000, Querétaro");
        await (await driver.$('//android.widget.EditText[@text="Teléfono de contacto familiar"]')).setValue("4429876543"); 

        if (await driver.isKeyboardShown()) await driver.hideKeyboard();

        registrarLog("💾 Custodiando Guardado: Presionando botón 'Registrar'...", "INFO");
        await (await driver.$('//*[@text="Registrar"]')).click(); await driver.pause(4000);

        const alertaErrorPaciente = await driver.$('//*[@text="Error de Registro" or @text="Error" or @text="Atención" or contains(@text, "ya existe")]').isExisting();
        if (alertaErrorPaciente) {
            registrarLog("⚠️ [BIFURCACIÓN]: La CURP ya existía. Despachando alerta y retornando...", "INFO");
            await (await driver.$(SELECTOR_ALERT_OK)).click(); await driver.pause(1500);
            await driver.back(); 
        } else {
            registrarLog("🎉 ¡Paciente nuevo registrado con éxito total!", "PASS");
            await (await driver.$(SELECTOR_ALERT_OK)).click();
        }
        await driver.pause(4000);

        // ==========================================================
        // FASE 4: CONSULTA Y APERTURA DE EXPEDIENTE CLÍNICO
        // ==========================================================
        registrarLog("🔍 --- FASE 4: VERIFICACIÓN Y APERTURA DE EXPEDIENTE ---", "PASO");
        await (await driver.$('//*[@text="Consultar Pacientes"]')).click(); await driver.pause(3000);

        registrarLog("🔍 Filtrando padrón clínico por la CURP dinámica...", "INFO");
        await (await driver.$('//android.widget.EditText[@text="Buscar por Nombre o CURP..."]')).setValue(CURP_DINAMICA);
        await driver.pause(2000);

        registrarLog("👤 Entrando al dossier clínico del paciente...", "INFO");
        await (await driver.$('//*[@text="Luis Antonio Carrillo Tejas" or contains(@text, "Luis Antonio")]')).click();
        await driver.pause(4000);

        registrarLog("📜 SCROLL NATIVO: Desplazando Dossier Clínico hacia el fondo...", "INFO");
        const btnNuevaConsulta = await driver.$('android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().text("Nueva Consulta"))');
        await btnNuevaConsulta.waitForExist({ timeout: 10000 });
        await btnNuevaConsulta.click();
        await driver.pause(4000);

        // ==========================================================
        // FASE 5: LLENADO DE EXPEDIENTE CLÍNICO (CREATE.TSX INTEGRADO)
        // ==========================================================
        registrarLog("🩺 --- FASE 5: REGISTRO Y VOLCADO DE EXPEDIENTE CLÍNICO (RF-02) ---", "PASO");
        
        registrarLog("✍️ Llenando datos anamnesis inicial...", "INFO");
        await (await driver.$('//android.widget.EditText[@text="Motivo de la consulta (Obligatorio)"]')).setValue("Control anual preventivo de salud ocupacional");
        await (await driver.$('//android.widget.EditText[@text="Antecedentes Personales"]')).setValue("Paciente masculino clínicamente sano, niega alergias.");
        await (await driver.$('//android.widget.EditText[@text="Antecedentes Familiares"]')).setValue("Diabetes mellitus tipo 2 presente en abuela materna.");

        registrarLog("✍️ Inyectando somatometría y signos vitales primarios...", "INFO");
        await (await driver.$('//android.widget.EditText[@text="P. Arterial (120/80)"]')).setValue("120/80");
        await (await driver.$('//android.widget.EditText[@text="Frec. Cardíaca (bpm)"]')).setValue("76");
        await (await driver.$('//android.widget.EditText[@text="Frec. Respiratoria (rpm)"]')).setValue("17");
        await (await driver.$('//android.widget.EditText[@text="Temperatura (°C)"]')).setValue("36.6");

        if (await driver.isKeyboardShown()) await driver.hideKeyboard();
        await driver.pause(1000);

        registrarLog("📜 SCROLL NATIVO MAESTRO: Bajando hoja del expediente para campos somatometría inferior...", "INFO");
        const txtObservaciones = await driver.$('android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().text("Observaciones generales y tratamiento..."))');
        await txtObservaciones.waitForExist({ timeout: 5000 });

        registrarLog("✍️ Inyectando campos inferiores somatometría...", "INFO");
        await (await driver.$('//android.widget.EditText[@text="Sat. Oxígeno (%)"]')).setValue("98");
        await (await driver.$('//android.widget.EditText[@text="Peso (kg)"]')).setValue("73.4");
        await (await driver.$('//android.widget.EditText[@text="Talla Cinta (cm)"]')).setValue("86");
        await (await driver.$('//android.widget.EditText[@text="Altura (m - ej 1.65)"]')).setValue("1.74");
        
        await txtObservaciones.setValue("Signos vitales óptimos. Se indica mantener hidratación y ejercicio regular.");

        if (await driver.isKeyboardShown()) await driver.hideKeyboard();
        await driver.pause(1000);

        registrarLog("💾 Guardando consulta médica en el expediente central...", "INFO");
        const btnGuardarConsulta = await driver.$('android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().text("Guardar Consulta"))');
        await btnGuardarConsulta.click();
        
        registrarLog("💥 Despachando cuadro de éxito del expediente...", "INFO");
        try {
            const AlertaExpedienteOk = await driver.$(SELECTOR_ALERT_OK);
            if (await AlertaExpedienteOk.isExisting()) await AlertaExpedienteOk.click();
            registrarLog("✅ Expediente clínico guardado exitosamente en BD.", "PASS");
        } catch {}
        await driver.pause(4000); 

        // ==========================================================
        // FASE 5.5: RE-ENTRADA Y VERIFICACIÓN EN HISTORIAL CLÍNICO
        // ==========================================================
        registrarLog("📋 --- FASE 5.5: RE-ENTRADA Y VERIFICACIÓN EN HISTORIAL CLÍNICO ---", "PASO");
        registrarLog("🔙 Regresando una pantalla atrás por router.back()...", "INFO");
        await driver.back(); 
        await driver.pause(2500);

        registrarLog("👤 Re-seleccionando al paciente de la lista de búsqueda persistente...", "INFO");
        const filaPaciente = await driver.$('//*[@text="Luis Antonio Carrillo Tejas" or contains(@text, "Luis Antonio")]');
        await filaPaciente.waitForExist({ timeout: 5000 });
        await filaPaciente.click();
        await driver.pause(4000);

        registrarLog("📜 SCROLL NATIVO: Buscando la tarjeta creada en la lista del historial...", "INFO");
        const tarjetaHistorial = await driver.$('android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().text("Control anual preventivo de salud ocupacional"))');
        await tarjetaHistorial.waitForExist({ timeout: 10000 });
        registrarLog("🎉 ¡Consulta visualizada en el historial clínico con éxito total!", "PASS");
        await driver.pause(4000); 

        // ==========================================================
        // FASE 6: LOGOUT DEL MÉDICO
        // ==========================================================
        registrarLog("🔒 --- FASE 6: CIERRE DE SESIÓN DEL MÉDICO ---", "PASO");
        await driver.back(); await driver.pause(1500); 
        await driver.back(); await driver.pause(1500); 

        registrarLog("🖱️ Presionando el botón de Logout superior...", "INFO");
        const { width: wW, height: wH } = await driver.getWindowSize();
        await driver.action('pointer')
            .move({ duration: 0, x: Math.round(wW * 0.90), y: Math.round(wH * 0.06) })
            .down({ button: 0 }).pause(150).up({ button: 0 }).perform();
        await driver.pause(2500);

        registrarLog("💥 Confirmando cuadro de salida institucional...", "INFO");
        const btnConfirmarSalidaFinal = await driver.$('//*[@text="Sí" or @text="SÍ" or @text="SI" or @text="Aceptar"]');
        await btnConfirmarSalidaFinal.waitForExist({ timeout: 5000 });
        await btnConfirmarSalidaFinal.click();
        await driver.deleteSession(); await driver.pause(3000);

        // ==========================================================
        // FASE 7: ELIMINACIÓN LÓGICA POR ADMINISTRADOR
        // ==========================================================
        registrarLog("👑 --- FASE 7: ELIMINACIÓN LÓGICA (ADMINISTRADOR) ---", "PASO");
        driver = await remote(capacidades);

        const inputAdminFinal = await driver.$('android=new UiSelector().className("android.widget.EditText").instance(0)');
        await inputAdminFinal.waitForExist({ timeout: 15000 });
        await inputAdminFinal.setValue("admin@digiclin.com");
        await (await driver.$('android=new UiSelector().className("android.widget.EditText").instance(1)')).setValue(CONTRASENA_ADMIN);
        await (await driver.$('//*[@text="Ingresar"]')).click();
        await driver.pause(5000);

        await (await driver.$('//*[@text="Menú"]')).click(); await driver.pause(1500);
        await (await driver.$('//*[@text="Alta de Personal"]')).click(); await driver.pause(2500);

        registrarLog(`🔍 Buscando al médico villeda.${ID_DINAMICO} en la nómina activa...`, "INFO");
        const celdaMedico = await driver.$(`android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().textContains("${ID_DINAMICO}"))`);
        await celdaMedico.waitForExist({ timeout: 10000 });

        registrarLog("🗑️ Ejecutando acción de Eliminación Lógica (Baja de Personal)...", "INFO");
        const btnBajaLogica = await driver.$('//*[contains(@text, "Baja") or contains(@text, "Inactivar") or contains(@text, "Desactivar")]');
        await btnBajaLogica.waitForExist({ timeout: 5000 });
        await btnBajaLogica.click();
        await driver.pause(2000);

        registrarLog("💥 Despachando cuadro de diálogo de confirmación de baja...", "INFO");
        try {
            const alertaBajaOk = await driver.$(SELECTOR_ALERT_OK);
            if (await alertaBajaOk.isExisting()) await alertaBajaOk.click();
        } catch {}
        await driver.pause(3000);

        registrarLog("📋 Saltando a la pestaña de personal INACTIVOS...", "INFO");
        const tabInactivos = await driver.$('//*[contains(@text, "Inactivos") or contains(@text, "INACTIVOS")]');
        await tabInactivos.waitForExist({ timeout: 5000 });
        await tabInactivos.click();
        await driver.pause(3000);

        registrarLog("🕵️ Verificando persistencia del estado inactivo del Médico...", "INFO");
        const registroInactivo = await driver.$(`//*[contains(@text, "${ID_DINAMICO}")]`);
        await driver.waitUntil(async () => await registroInactivo.isDisplayed(), {
            timeout: 10000,
            timeoutMsg: "El usuario médico dado de baja no aparece en la nómina de inactivos."
        });
        registrarLog(`🎉 [ÉXITO TOTAL]: ¡El usuario médico villeda.${ID_DINAMICO} fue inactivado correctamente!`, "PASS");
        await driver.pause(2000);

        registrarLog("🔓 Cerrando sesión del Administrador global...", "INFO");
        const { width: finalW, height: finalH } = await driver.getWindowSize();
        await driver.action('pointer').move({ duration: 0, x: Math.round(finalW * 0.92), y: Math.round(finalH * 0.08) }).down({ button: 0 }).pause(150).up({ finalW }).perform();
        await driver.pause(2000);
        await (await driver.$('//*[@text="Sí" or @text="SÍ" or @text="SI"]')).click();
        await driver.pause(2000);

        registrarLog("\n🏁 =================================================================", "SISTEMA");
        registrarLog("🏁 [SISTEMA INTEGRAL COMPLETADO DE EXTREMO A EXTREMO EN LIMPIO]", "PASS");
        registrarLog("🏁 =================================================================", "SISTEMA");

    } catch (error) {
        registrarLog(`❌ Flujo interrumpido por error imprevisto: ${error.message}`, "ERROR");
    } finally {
        if (driver) {
            await driver.deleteSession();
            registrarLog("🔒 Sesión de automatización cerrada de forma segura.", "SISTEMA");
        }
    }
}

ejecutarMegaFlujoIntegralCompleto();