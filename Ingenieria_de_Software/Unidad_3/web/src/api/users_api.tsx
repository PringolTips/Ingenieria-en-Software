const API_URL = "https://adjacent-genius-appointments-zshops.trycloudflare.com";

export const users_api = {
    createUser: async (nombre_usuario: string, correo: string, nombre_rol: string) => {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/usuarios`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ nombre_usuario, correo, nombre_rol })
        });
        
        if(!res.ok) {
            const error = await res.json();
            throw new Error(error.message);
        }

        return res.json();
    },

    getAllUsers: async () => {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/usuarios/activos`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(!res.ok) {
            const error = await res.json();
            throw new Error(error.message);
        }

        return res.json();
    },

    getUserByEmail: async(email: string) => {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/usuarios/correo/${email}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(!res.ok) {
            const error = await res.json();
            throw new Error(error.message);
        }

        return res.json();
    },

    getUserByUsername: async(username: string) => {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/usuarios/${username}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(!res.ok) {
            const error = await res.json();
            throw new Error(error.message);
        }

        return res.json();
    },

    updateUser: async (nombre_usuario_actual: string, nuevo_nombre_usuario: string, correo: string) => {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/usuarios/perfil/actualizar`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ nombre_usuario_actual, nuevo_nombre_usuario, correo })
        });
        
        if(!res.ok) {
            const error = await res.json();
            throw new Error(error.message);
        }

        return res.json();
    },

    disableUser: async (user: string) => {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/usuarios/${user}/inhabilitar`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(!res.ok) {
            const error = await res.json();
            throw new Error(error.message);
        }

        return res.json();
    },

    enableUser: async (user: string) => {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/usuarios/${user}/habilitar`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(!res.ok) {
            const error = await res.json();
            throw new Error(error.message);
        }

        return res.json();
    },

    deleteUser: async (user: string) => {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/usuarios/${user}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(!res.ok) {
            const error = await res.json();
            throw new Error(error.message);
        }

        return res.json();
    }
}