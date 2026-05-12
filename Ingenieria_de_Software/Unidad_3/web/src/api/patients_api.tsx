const API_URL = "https://adjacent-genius-appointments-zshops.trycloudflare.com";

export const patients_api = {
    createPatient: async (
        nombre_p: string,
        apellido_pat: string,
        apellido_mat: string,
        fecha_nacimiento: string,
        nombre_sexo: string,
        curp: string,
        domicilio: string,
        nombre_estado_civil: string,
        correo: string,
        ocupacion: string,
        telefono: string,
        contacto_emergencia: string,
        nombre_tipo_sangre: string
    ) => {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/pacientes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                nombre_p,
                apellido_pat,
                apellido_mat,
                fecha_nacimiento,
                nombre_sexo,
                curp,
                domicilio,
                nombre_estado_civil,
                correo,
                ocupacion,
                telefono,
                contacto_emergencia,
                nombre_tipo_sangre
            })
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message);
        }

        return res.json();
    },
}