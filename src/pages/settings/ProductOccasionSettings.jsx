import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import api from "../../services/api";

export default function ProductOccasionSettings() {
    const [items, setItems] = useState([]);
    const [nome, setNome] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [editingId, setEditingId] = useState(null);

    useEffect(() => { load(); }, []);

    async function load() {
        setLoading(true);
        try {
            const res = await api.get("/product-occasions");
            setItems(res.data);
        } catch {
            setError("Erro ao carregar ocasião.");
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError(""); setSuccess("");
        if (!nome.trim()) { setError("Informe um nome."); return; }
        setSaving(true);
        try {
            if (editingId) {
                await api.put(`/product-occasions/${editingId}`,
                    { nome, ativo: true });
                setSuccess("Ocasião atualizada.");
            } else {
                await api.post("/product-occasions", { nome, ativo: true });
                setSuccess("Ocasião cadastrada.");
            }
            setNome(""); setEditingId(null);
            await load();
        } catch {
            setError("Erro ao salvar ocasião.");
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id) {
        if (!window.confirm("Deseja excluir esta ocasião?")) return;
        try {
            await api.delete(`/product-occasions/${id}`);
            await load();
        } catch {
            setError("Erro ao excluir ocasião.");
        }
    }

    function handleEdit(item) {
        setEditingId(item.id);
        setNome(item.nome);
        setError(""); setSuccess("");
    }

    function handleCancel() {
        setEditingId(null);
        setNome("");
        setError(""); setSuccess("");
    }

    return (
        <MainLayout
            title="Ocasião de Produto"
            subtitle="Gerencie as ocasiões disponíveis para os produtos"
        >
            <div style={{ maxWidth: "720px", display: "grid", gap: "18px" }}>
                <div style={cardStyle}>
                    <div style={cardHeaderStyle}>
                        <div style={{ fontSize: "15px", fontWeight: "700",
                            color: "#1c1917" }}>
                            {editingId ? "Editar ocasião" : "Nova ocasião"}
                        </div>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div style={{ padding: "20px", display: "grid", gap: "16px" }}>
                            <div style={{ display: "grid", gap: "8px" }}>
                                <label style={labelStyle}>Nome</label>
                                <input
                                    value={nome}
                                    onChange={e => setNome(e.target.value)}
                                    placeholder="Ex: Bolos, Doces, Sobremesas"
                                    style={inputStyle}
                                />
                            </div>
                            {error && <div style={errorStyle}>{error}</div>}
                            {success && <div style={successStyle}>{success}</div>}
                        </div>
                        <div style={{ padding: "20px", borderTop: "1px solid #f2ede6",
                            display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                            {editingId && (
                                <button type="button" onClick={handleCancel}
                                        style={secondaryButtonStyle}>
                                    Cancelar
                                </button>
                            )}
                            <button type="submit" disabled={saving}
                                    style={primaryButtonStyle(saving)}>
                                {saving ? "Salvando..."
                                    : editingId ? "Salvar alteração" : "Cadastrar"}
                            </button>
                        </div>
                    </form>
                </div>

                {!loading && items.length > 0 && (
                    <div style={cardStyle}>
                        <div style={cardHeaderStyle}>
                            <div style={{ fontSize: "15px", fontWeight: "700",
                                color: "#1c1917" }}>
                                Ocasiões cadastradas
                            </div>
                        </div>
                        <div style={{ padding: "8px 0" }}>
                            {items.map((item, index) => (
                                <div key={item.id} style={{
                                    padding: "14px 20px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    borderBottom: index !== items.length - 1
                                        ? "1px solid #f5f2ee" : "none",
                                }}>
                                    <span style={{ fontSize: "14px", color: "#1c1917",
                                        fontFamily: "system-ui" }}>
                                        {item.nome}
                                    </span>
                                    <div style={{ display: "flex", gap: "8px" }}>
                                        <button onClick={() => handleEdit(item)}
                                                style={editButtonStyle}>
                                            Editar
                                        </button>
                                        <button onClick={() => handleDelete(item.id)}
                                                style={deleteButtonStyle}>
                                            Excluir
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
const cardStyle = {
    background: "#fff", borderRadius: "14px",
    border: "1px solid #ede9e3", overflow: "hidden",
};
const cardHeaderStyle = {
    padding: "16px 20px", borderBottom: "1px solid #f2ede6",
};
const labelStyle = {
    fontSize: "12px", fontWeight: "700", color: "#6b6257",
    fontFamily: "system-ui", textTransform: "uppercase", letterSpacing: "0.4px",
};
const inputStyle = {
    width: "100%", padding: "12px 14px", borderRadius: "10px",
    border: "1px solid #e8e3da", background: "#fff", fontSize: "14px",
    color: "#3f3a36", fontFamily: "system-ui", outline: "none",
    boxSizing: "border-box",
};
const primaryButtonStyle = (saving) => ({
    background: "linear-gradient(135deg, #e8b86d 0%, #c9924a 100%)",
    border: "none", color: "#fff", borderRadius: "8px",
    padding: "10px 16px", fontSize: "12px", fontWeight: "700",
    fontFamily: "system-ui", cursor: saving ? "not-allowed" : "pointer",
    opacity: saving ? 0.7 : 1, boxShadow: "0 2px 8px rgba(232,184,109,0.28)",
});
const secondaryButtonStyle = {
    background: "#fff", border: "1px solid #e8e3da", borderRadius: "8px",
    padding: "10px 16px", color: "#5a5450", fontSize: "12px",
    fontWeight: "600", fontFamily: "system-ui", cursor: "pointer",
};
const editButtonStyle = {
    border: "1px solid #e8e3da", background: "#fff", color: "#8a6f3e",
    borderRadius: "8px", padding: "7px 12px", fontSize: "12px",
    fontWeight: "600", fontFamily: "system-ui", cursor: "pointer",
};
const deleteButtonStyle = {
    border: "1px solid #f2caca", background: "#fff8f8", color: "#c05050",
    borderRadius: "8px", padding: "7px 12px", fontSize: "12px",
    fontWeight: "600", fontFamily: "system-ui", cursor: "pointer",
};
const errorStyle = {
    background: "#fff8f8", border: "1px solid #f6d6d6", color: "#c05050",
    borderRadius: "10px", padding: "12px 14px", fontSize: "12px",
    fontFamily: "system-ui",
};
const successStyle = {
    background: "#f7fbf7", border: "1px solid #d8ead8", color: "#4f8a4f",
    borderRadius: "10px", padding: "12px 14px", fontSize: "12px",
    fontFamily: "system-ui",
};