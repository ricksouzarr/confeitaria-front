import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import api from "../../services/api";

const initialForm = {
    nome: "",
    rendimento: "",
    markupTotal: "",
    markupRendimento: "",
    horasMaoDeObra: "",
    observacaoFichaTecnica:"",
    categoriaId: "",
    tipoId: "",
    ocasiaoId: "",
    kit: false,
};

export default function ProductForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    const [form, setForm] = useState(initialForm);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(isEditing);
    const [saving, setSaving] = useState(false);

    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);
    const [occasions, setOccasions] = useState([]);

    useEffect(() => {
        async function loadOptions() {
            const [catRes, typeRes, occRes] = await Promise.all([
                api.get("/product-categories"),
                api.get("/product-types"),
                api.get("/product-occasions"),
            ]);
            setCategories(catRes.data);
            setTypes(typeRes.data);
            setOccasions(occRes.data);
        }
        loadOptions();
    }, []);

    useEffect(() => {
        if (!isEditing) return;

        async function loadProduct() {
            setLoading(true);
            setError("");

            try {
                const res = await api.get(`/products/${id}`);
                const product = res.data;

                setForm({
                    nome: product.nome ?? "",
                    rendimento: product.rendimento ?? "",
                    markupTotal: product.markupTotal ?? "",
                    markupRendimento: product.markupRendimento ?? "",
                    horasMaoDeObra: product.horasMaoDeObra ?? "",
                    observacaoFichaTecnica: product.observacaoFichaTecnica ?? "",
                    categoriaId: product.categoria?.id ?? "",
                    tipoId: product.tipo?.id ?? "",
                    ocasiaoId: product.ocasiao?.id ?? "",
                    kit: product.kit ?? false,
                });
            } catch (e) {
                console.error(e);
                setError("Erro ao carregar produto para edição.");
            } finally {
                setLoading(false);
            }
        }

        loadProduct();
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
            rendimento: Number(form.rendimento),
            markupTotal: Number(form.markupTotal),
            markupRendimento: Number(form.markupRendimento),
            horasMaoDeObra: Number(form.horasMaoDeObra),
            observacaoFichaTecnica: form.observacaoFichaTecnica || null,
            kit: form.kit,
            categoria: form.categoriaId ? { id: Number(form.categoriaId) } : null,
            tipo: form.tipoId ? { id: Number(form.tipoId) } : null,
            ocasiao: form.ocasiaoId ? { id: Number(form.ocasiaoId) } : null,
        };

        try {
            if (isEditing) {
                await api.put(`/products/${id}`, payload);
                navigate("/produtos");
            } else {
                await api.post("/products", payload);
                setMessage("Produto cadastrado com sucesso.");
                setForm(initialForm);
            }
        } catch (e) {
            console.error(e);
            setError(
                isEditing
                    ? "Erro ao alterar produto."
                    : "Erro ao cadastrar produto."
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <MainLayout
            title={isEditing ? "Alterar Produto" : "Cadastro de Produto"}
            subtitle={
                isEditing
                    ? "Edite as informações do produto"
                    : "Cadastre um novo produto"
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
                        fontSize: "14px",
                    }}
                >
                    Carregando produto...
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
                                <label style={labelStyle}>Nome do Produto</label>
                                <input
                                    name="nome"
                                    value={form.nome}
                                    onChange={handleChange}
                                    placeholder="Ex: Bolo de chocolate"
                                    style={inputStyle}
                                />
                            </div>

                            <div>
                                <label style={labelStyle}>Rendimento</label>
                                <input
                                    name="rendimento"
                                    type="number"
                                    value={form.rendimento}
                                    onChange={handleChange}
                                    placeholder="Ex: 10"
                                    style={inputStyle}
                                />
                            </div>

                            <div>
                                <label style={labelStyle}>Horas de Mão de Obra</label>
                                <input
                                    name="horasMaoDeObra"
                                    type="number"
                                    step="0.01"
                                    value={form.horasMaoDeObra}
                                    onChange={handleChange}
                                    placeholder="Ex: 2"
                                    style={inputStyle}
                                />
                            </div>

                            <div style={{ gridColumn: "1 / -1" }}>
                                <label style={labelStyle}>Categoria</label>
                                <select name="categoriaId" value={form.categoriaId}
                                        onChange={handleChange} style={inputStyle}>
                                    <option value="">Sem categoria</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.nome}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label style={labelStyle}>Tipo</label>
                                <select name="tipoId" value={form.tipoId}
                                        onChange={handleChange} style={inputStyle}>
                                    <option value="">Sem tipo</option>
                                    {types.map(t => (
                                        <option key={t.id} value={t.id}>{t.nome}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label style={labelStyle}>Ocasião</label>
                                <select name="ocasiaoId" value={form.ocasiaoId}
                                        onChange={handleChange} style={inputStyle}>
                                    <option value="">Sem ocasião</option>
                                    {occasions.map(o => (
                                        <option key={o.id} value={o.id}>{o.nome}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ gridColumn: "1 / -1" }}>
                                <label style={{ ...labelStyle, display: "flex",
                                    alignItems: "center", gap: "10px", cursor: "pointer" }}>
                                    <input
                                        type="checkbox"
                                        name="kit"
                                        checked={form.kit}
                                        onChange={e => setForm(prev => ({
                                            ...prev, kit: e.target.checked
                                        }))}
                                        style={{ width: "16px", height: "16px", accentColor: "#c9924a" }}
                                    />
                                    Este produto é um Kit / Combo
                                </label>
                            </div>

                            <div>
                                <label style={labelStyle}>Markup Total</label>
                                <input
                                    name="markupTotal"
                                    type="number"
                                    step="0.01"
                                    value={form.markupTotal}
                                    onChange={handleChange}
                                    placeholder="Ex: 2.5"
                                    style={inputStyle}
                                />
                            </div>

                            <div>
                                <label style={labelStyle}>Markup por Rendimento</label>
                                <input
                                    name="markupRendimento"
                                    type="number"
                                    step="0.01"
                                    value={form.markupRendimento}
                                    onChange={handleChange}
                                    placeholder="Ex: 1.8"
                                    style={inputStyle}
                                />
                            </div>
                            <div style={{ gridColumn: "1 / -1" }}>
                                <label style={labelStyle}>Observações da Ficha Técnica</label>
                                <textarea
                                    name="observacaoFichaTecnica"
                                    value={form.observacaoFichaTecnica}
                                    onChange={handleChange}
                                    placeholder="Ex: Assar 35 min a 180°C. Usar forma de 20cm. Gelar por 4 horas antes de decorar."
                                    rows={4}
                                    style={{ ...inputStyle, resize: "vertical", lineHeight: "1.6" }}
                                />
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
                                style={{
                                    background:
                                        "linear-gradient(135deg, #e8b86d 0%, #c9924a 100%)",
                                    border: "none",
                                    borderRadius: "8px",
                                    padding: "10px 18px",
                                    color: "white",
                                    fontSize: "13px",
                                    fontWeight: "600",
                                    cursor: saving ? "not-allowed" : "pointer",
                                    opacity: saving ? 0.7 : 1,
                                    boxShadow: "0 2px 8px rgba(232,184,109,0.4)",
                                }}
                            >
                                {saving
                                    ? (isEditing ? "Salvando..." : "Cadastrando...")
                                    : (isEditing ? "Salvar alterações" : "Salvar produto")}
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate("/produtos")}
                                style={{
                                    background: "#fff",
                                    border: "1px solid #e8e3da",
                                    borderRadius: "8px",
                                    padding: "10px 18px",
                                    color: "#5a5450",
                                    fontSize: "13px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                }}
                            >
                                Voltar
                            </button>
                        </div>
                    </form>

                    {message && (
                        <div
                            style={{
                                marginTop: "16px",
                                background: "#f5fbf6",
                                border: "1px solid #d7eddc",
                                color: "#2f7a43",
                                borderRadius: "10px",
                                padding: "12px 14px",
                                fontSize: "13px",
                            }}
                        >
                            {message}
                        </div>
                    )}

                    {error && (
                        <div
                            style={{
                                marginTop: "16px",
                                background: "#fff8f8",
                                border: "1px solid #fddcdc",
                                color: "#c05050",
                                borderRadius: "10px",
                                padding: "12px 14px",
                                fontSize: "13px",
                            }}
                        >
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
    boxSizing: "border-box",
};