import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import api from "../../services/api";

const initialForm = {
    nome: "",
    sigla: "",
    tipo: "",
};

const tiposUnidade = [
    { value: "PESO", label: "Peso" },
    { value: "VOLUME", label: "Volume" },
    { value: "UNIDADE", label: "Unidade" },
];

export default function UnitsForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    const [form, setForm] = useState(initialForm);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(isEditing);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isEditing) return;

        async function loadUnit() {
            setLoading(true);
            setError("");

            try {
                const res = await api.get(`/units/${id}`);
                const unit = res.data;

                setForm({
                    nome: unit.nome ?? "",
                    sigla: unit.sigla ?? "",
                    tipo: unit.tipo ?? "",
                });
            } catch (e) {
                console.error(e);
                setError("Erro ao carregar unidade para edição.");
            } finally {
                setLoading(false);
            }
        }

        loadUnit();
    }, [id, isEditing]);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === "sigla" ? value.toUpperCase() : value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage("");
        setError("");
        setSaving(true);

        const payload = {
            nome: form.nome,
            sigla: form.sigla,
            tipo: form.tipo,
        };

        try {
            if (isEditing) {
                await api.put(`/units/${id}`, payload);
                navigate("/unidades");
            } else {
                await api.post("/units", payload);
                setMessage("Unidade cadastrada com sucesso.");
                setForm(initialForm);
            }
        } catch (e) {
            console.error(e);
            setError(
                isEditing
                    ? "Erro ao alterar unidade."
                    : "Erro ao cadastrar unidade."
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <MainLayout
            title={isEditing ? "Alterar Unidade" : "Cadastro de Unidade"}
            subtitle={
                isEditing
                    ? "Edite as informações da unidade de medida"
                    : "Cadastre uma nova unidade de medida"
            }
        >
            {loading ? (
                <div
                    style={{
                        background: "#fff",
                        borderRadius: "14px",
                        border: "1px solid #ede9e3",
                        padding: "32px",
                        color: "#9b948c",
                        fontFamily: "system-ui",
                        fontSize: "14px",
                    }}
                >
                    Carregando unidade...
                </div>
            ) : (
                <div
                    style={{
                        background: "#fff",
                        borderRadius: "14px",
                        border: "1px solid #ede9e3",
                        padding: "24px",
                        maxWidth: "720px",
                    }}
                >
                    <form onSubmit={handleSubmit}>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: "16px",
                            }}
                        >
                            <div style={{ gridColumn: "1 / -1" }}>
                                <label style={labelStyle}>Nome da Unidade</label>
                                <input
                                    name="nome"
                                    value={form.nome}
                                    onChange={handleChange}
                                    placeholder="Ex: Grama"
                                    style={inputStyle}
                                />
                            </div>

                            <div>
                                <label style={labelStyle}>Sigla</label>
                                <input
                                    name="sigla"
                                    value={form.sigla}
                                    onChange={handleChange}
                                    placeholder="Ex: G"
                                    maxLength={10}
                                    style={inputStyle}
                                />
                            </div>

                            <div>
                                <label style={labelStyle}>Tipo</label>
                                <select
                                    name="tipo"
                                    value={form.tipo}
                                    onChange={handleChange}
                                    style={inputStyle}
                                >
                                    <option value="">Selecione um tipo</option>
                                    {tiposUnidade.map((tipo) => (
                                        <option key={tipo.value} value={tipo.value}>
                                            {tipo.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div
                            style={{
                                display: "flex",
                                gap: "10px",
                                marginTop: "24px",
                            }}
                        >
                            <button
                                type="submit"
                                disabled={saving}
                                style={primaryButtonStyle(saving)}
                            >
                                {saving
                                    ? (isEditing ? "Salvando..." : "Cadastrando...")
                                    : (isEditing ? "Salvar alterações" : "Salvar unidade")}
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate("/unidades")}
                                style={secondaryButtonStyle}
                            >
                                Voltar
                            </button>
                        </div>
                    </form>

                    {message && <div style={successMessageStyle}>{message}</div>}
                    {error && <div style={errorMessageStyle}>{error}</div>}
                </div>
            )}
        </MainLayout>
    );
}

const labelStyle = {
    display: "block",
    marginBottom: "6px",
    fontSize: "12px",
    fontWeight: "700",
    color: "#6b6257",
    fontFamily: "system-ui",
    textTransform: "uppercase",
    letterSpacing: "0.4px",
};

const inputStyle = {
    width: "100%",
    border: "1px solid #e8e3da",
    borderRadius: "10px",
    padding: "11px 12px",
    fontSize: "14px",
    color: "#1c1917",
    background: "#fff",
    outline: "none",
    fontFamily: "system-ui",
    boxSizing: "border-box",
};

const secondaryButtonStyle = {
    background: "#fff",
    border: "1px solid #e8e3da",
    borderRadius: "8px",
    padding: "10px 18px",
    color: "#5a5450",
    fontSize: "13px",
    fontWeight: "600",
    fontFamily: "system-ui",
    cursor: "pointer",
};

const successMessageStyle = {
    marginTop: "16px",
    background: "#f5fbf6",
    border: "1px solid #d7eddc",
    color: "#2f7a43",
    borderRadius: "10px",
    padding: "12px 14px",
    fontSize: "13px",
    fontFamily: "system-ui",
};

const errorMessageStyle = {
    marginTop: "16px",
    background: "#fff8f8",
    border: "1px solid #fddcdc",
    color: "#c05050",
    borderRadius: "10px",
    padding: "12px 14px",
    fontSize: "13px",
    fontFamily: "system-ui",
};

function primaryButtonStyle(saving) {
    return {
        background: "linear-gradient(135deg, #e8b86d 0%, #c9924a 100%)",
        border: "none",
        borderRadius: "8px",
        padding: "10px 18px",
        color: "white",
        fontSize: "13px",
        fontWeight: "600",
        fontFamily: "system-ui",
        cursor: saving ? "not-allowed" : "pointer",
        opacity: saving ? 0.7 : 1,
        boxShadow: "0 2px 8px rgba(232,184,109,0.4)",
    };
}