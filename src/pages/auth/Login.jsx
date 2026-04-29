import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", senha: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await api.post("/auth/login", form);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("usuario", JSON.stringify({
                nome: res.data.nome,
                email: res.data.email,
            }));

            // Redireciona para onde o usuário estava antes de expirar
            const redirectTo = sessionStorage.getItem("redirectAfterLogin") || "/";
            sessionStorage.removeItem("redirectAfterLogin");
            navigate(redirectTo);
        } catch {
            setError("Email ou senha incorretos.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>

                {/* Logo */}
                <div style={logoAreaStyle}>
                    <div style={logoIconStyle}>🎂</div>
                    <div>
                        <div style={logoTitleStyle}>Doce Gestão</div>
                        <div style={logoSubtitleStyle}>Confeitaria</div>
                    </div>
                </div>

                <div style={headerStyle}>
                    <div style={titleStyle}>Bem-vindo de volta</div>
                    <div style={subtitleStyle}>
                        Entre com sua conta para continuar
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={formStyle}>
                    <div style={fieldStyle}>
                        <label style={labelStyle}>Email</label>
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="seu@email.com"
                            style={inputStyle}
                            required
                        />
                    </div>

                    <div style={fieldStyle}>
                        <label style={labelStyle}>Senha</label>
                        <input
                            name="senha"
                            type="password"
                            value={form.senha}
                            onChange={handleChange}
                            placeholder="••••••••"
                            style={inputStyle}
                            required
                        />
                    </div>

                    {error && <div style={errorStyle}>{error}</div>}

                    <button
                        type="submit"
                        disabled={loading}
                        style={buttonStyle(loading)}
                    >
                        {loading ? "Entrando..." : "Entrar"}
                    </button>
                </form>
            </div>
        </div>
    );
}

const containerStyle = {
    minHeight: "100vh",
    background: "#faf8f5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "'Poppins', system-ui, sans-serif",
};

const cardStyle = {
    background: "#fff",
    borderRadius: "20px",
    border: "1px solid #ede9e3",
    padding: "40px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 8px 40px rgba(0,0,0,0.06)",
};

const logoAreaStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "32px",
};

const logoIconStyle = {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #e8b86d 0%, #c9924a 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    boxShadow: "0 2px 8px rgba(232,184,109,0.4)",
};

const logoTitleStyle = {
    fontSize: "16px",
    fontWeight: "700",
    color: "#1c1917",
};

const logoSubtitleStyle = {
    fontSize: "11px",
    color: "#9b948c",
    letterSpacing: "1px",
    textTransform: "uppercase",
};

const headerStyle = {
    marginBottom: "28px",
};

const titleStyle = {
    fontSize: "22px",
    fontWeight: "700",
    color: "#1c1917",
    marginBottom: "6px",
};

const subtitleStyle = {
    fontSize: "13px",
    color: "#9b948c",
};

const formStyle = {
    display: "grid",
    gap: "16px",
};

const fieldStyle = {
    display: "grid",
    gap: "8px",
};

const labelStyle = {
    fontSize: "12px",
    fontWeight: "700",
    color: "#6b6257",
    textTransform: "uppercase",
    letterSpacing: "0.4px",
};

const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #e8e3da",
    background: "#fff",
    fontSize: "14px",
    color: "#1c1917",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "'Poppins', system-ui, sans-serif",
};

const errorStyle = {
    background: "#fff8f8",
    border: "1px solid #f6d6d6",
    color: "#c05050",
    borderRadius: "10px",
    padding: "12px 14px",
    fontSize: "13px",
};

const buttonStyle = (loading) => ({
    background: "linear-gradient(135deg, #e8b86d 0%, #c9924a 100%)",
    border: "none",
    borderRadius: "10px",
    padding: "14px",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "700",
    cursor: loading ? "not-allowed" : "pointer",
    opacity: loading ? 0.7 : 1,
    boxShadow: "0 2px 8px rgba(232,184,109,0.4)",
    fontFamily: "'Poppins', system-ui, sans-serif",
    marginTop: "4px",
});