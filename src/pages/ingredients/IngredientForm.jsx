import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import api from "../../services/api";

const initialForm = {
    nome: "",
    precoPacote: "",
    quantidadePacote: "",
    unidadeId: "",
};

export default function IngredientForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    const [form, setForm] = useState(initialForm);
    const [units, setUnits] = useState([]);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(isEditing);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function loadUnits() {
            try {
                const res = await api.get("/units");
                setUnits(res.data);
            } catch (e) {
                console.error(e);
                setError("Erro ao carregar unidades.");
            }
        }

        loadUnits();
    }, []);

    useEffect(() => {
        if (!isEditing) return;

        async function loadIngredient() {
            setLoading(true);
            setError("");

            try {
                const res = await api.get(`/ingredients/${id}`);
                const ingredient = res.data;

                setForm({
                    nome: ingredient.nome ?? "",
                    precoPacote: ingredient.precoPacote ?? "",
                    quantidadePacote: ingredient.quantidadePacote ?? "",
                    unidadeId: ingredient.unidade?.id ?? "",
                });
            } catch (e) {
                console.error(e);
                setError("Erro ao carregar ingrediente para edição.");
            } finally {
                setLoading(false);
            }
        }

        loadIngredient();
    }, [id, isEditing]);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage("");
        setError("");
        setSaving(true);

        const payload = {
            nome: form.nome,
            precoPacote: Number(form.precoPacote),
            quantidadePacote: Number(form.quantidadePacote),
            unidade: {
                id: Number(form.unidadeId),
            },
        };

        try {
            if (isEditing) {
                await api.put(`/ingredients/${id}`, payload);
                navigate("/ingredientes");
            } else {
                await api.post("/ingredients", payload);
                setMessage("Ingrediente cadastrado com sucesso.");
                setForm(initialForm);
            }
        } catch (e) {
            console.error(e);
            setError(
                isEditing
                    ? "Erro ao alterar ingrediente."
                    : "Erro ao cadastrar ingrediente."
            );
        } finally {
            setSaving(false);
        }
    }

    const custoUnitarioCalculado = useMemo(() => {
        const preco = Number(form.precoPacote);
        const quantidade = Number(form.quantidadePacote);

        if (!preco || !quantidade) return "0.00";
        return (preco / quantidade).toFixed(2);
    }, [form.precoPacote, form.quantidadePacote]);

    return (
        <MainLayout
            title={isEditing ? "Alterar Ingrediente" : "Cadastro de Ingrediente"}
            subtitle={
                isEditing
                    ? "Edite as informações do ingrediente"
                    : "Cadastre um novo ingrediente"
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
                    Carregando ingrediente...
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
                                <label style={labelStyle}>Nome do Ingrediente</label>
                                <input
                                    name="nome"
                                    value={form.nome}
                                    onChange={handleChange}
                                    placeholder="Ex: Leite condensado"
                                    style={inputStyle}
                                />
                            </div>

                            <div>
                                <label style={labelStyle}>Preço do Pacote</label>
                                <input
                                    name="precoPacote"
                                    type="number"
                                    step="0.01"
                                    value={form.precoPacote}
                                    onChange={handleChange}
                                    placeholder="Ex: 12.90"
                                    style={inputStyle}
                                />
                            </div>

                            <div>
                                <label style={labelStyle}>Quantidade do Pacote</label>
                                <input
                                    name="quantidadePacote"
                                    type="number"
                                    step="0.01"
                                    value={form.quantidadePacote}
                                    onChange={handleChange}
                                    placeholder="Ex: 395"
                                    style={inputStyle}
                                />
                            </div>

                            <div style={{ gridColumn: "1 / -1" }}>
                                <label style={labelStyle}>Unidade</label>
                                <select
                                    name="unidadeId"
                                    value={form.unidadeId}
                                    onChange={handleChange}
                                    style={inputStyle}
                                >
                                    <option value="">Selecione uma unidade</option>
                                    {units.map((unit) => (
                                        <option key={unit.id} value={unit.id}>
                                            {unit.nome} ({unit.sigla})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ gridColumn: "1 / -1" }}>
                                <div
                                    style={{
                                        background: "#fcfaf7",
                                        border: "1px solid #ede9e3",
                                        borderRadius: "10px",
                                        padding: "14px 16px",
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: "12px",
                                            fontWeight: "700",
                                            color: "#6b6257",
                                            fontFamily: "system-ui",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.4px",
                                            marginBottom: "6px",
                                        }}
                                    >
                                        Custo unitário calculado
                                    </div>

                                    <div
                                        style={{
                                            fontSize: "18px",
                                            fontWeight: "700",
                                            color: "#1c1917",
                                            fontFamily: "system-ui",
                                        }}
                                    >
                                        R$ {custoUnitarioCalculado}
                                    </div>
                                </div>
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
                                    : (isEditing ? "Salvar alterações" : "Salvar ingrediente")}
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate("/ingredientes")}
                                style={secondaryButtonStyle}
                            >
                                Voltar
                            </button>
                        </div>
                    </form>

                    {message && (
                        <div style={successMessageStyle}>
                            {message}
                        </div>
                    )}

                    {error && (
                        <div style={errorMessageStyle}>
                            {error}
                        </div>
                    )}
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