const API_URL = "https://adjacent-genius-appointments-zshops.trycloudflare.com";

export const auth_api = {
    login: async (correo: string, password: string) => {
        const res = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ correo, password })
        });

        if(!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Credenciales incorrectas");
        }

        return res.json();
    },

    changePassword: async (identificador: string, password_actual: string, password_nueva: string, confirmar_password_nueva: string) => {
        const res = await fetch(`${API_URL}/api/auth/cambiar-password`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            }, 
            body: JSON.stringify({ identificador, password_actual, password_nueva, confirmar_password_nueva })
        });

        if(!res.ok) {
            const error = await res.json();
            throw new Error(error.message || "Hubo un error en la solicitud");
        }

        return res.json();
    },
}