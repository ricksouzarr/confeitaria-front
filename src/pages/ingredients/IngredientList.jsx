import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import api from "../../services/api";

export default function IngredientList() {
    const [ingredients, setIngredients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [hoveredRow, setHoveredRow] = useState(null);
    const [search, setSearch] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        loadIngredients();
    }, []);

    async function loadIngredients() {
        setLoading(true);
        setError("");

        try {
            const res = await api.get("/ingredients");
            setIngredients(res.data);
        } catch (e) {
            console.error(e);
            setError("Erro ao carregar ingredientes");
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(ingredientId, ingredientName) {
        const confirmed = window.confirm(
            `Tem certeza que deseja excluir o ingrediente "${ingredientName}"?`
        );

        if (!confirmed) return;

        setDeletingId(ingredientId);
        setError("");

        try {
            await api.delete(`/ingredients/${ingredientId}`);
            setIngredients((prev) => prev.filter((item) => item.id !== ingredientId));
        } catch (e) {
            console.error(e);
            setError("Erro ao excluir ingrediente.");
        } finally {
            setDeletingId(null);
        }
    }

    const filtered = ingredients.filter((item) =>
        item.nome?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <MainLayout
            title="Ingredientes"
            subtitle="Gerencie os ingredientes usados nas fichas técnicas"
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                }}
            >
                <div
                    style={{
                        background: "#fff",
                        border: "1px solid #e8e3da",
                        borderRadius: "8px",
                        padding: "8px 14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                    }}
                >
                    <span style={{ color: "#9b948c", fontSize: "13px" }}>🔍</span>
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar ingredientes..."
                        style={{
                            border: "none",
                            background: "transparent",
                            outline: "none",
                            fontSize: "13px",
                            color: "#1c1917",
                            width: "220px",
                            fontFamily: "system-ui",
                        }}
                    />
                </div>

                <Link
                    to="/ingredientes/cadastro"
                    style={{
                        background: "linear-gradient(135deg, #e8b86d 0%, #c9924a 100%)",
                        borderRadius: "8px",
                        padding: "9px 18px",
                        color: "white",
                        fontSize: "13px",
                        fontWeight: "600",
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontFamily: "system-ui",
                        boxShadow: "0 2px 8px rgba(232,184,109,0.4)",
                    }}
                >
                    + Novo Ingrediente
                </Link>
            </div>

            {loading && (
                <div
                    style={{
                        background: "#fff",
                        borderRadius: "12px",
                        padding: "32px",
                        textAlign: "center",
                        border: "1px solid #ede9e3",
                        color: "#9b948c",
                        fontFamily: "system-ui",
                        fontSize: "14px",
                    }}
                >
                    Carregando ingredientes...
                </div>
            )}

            {error && (
                <div
                    style={{
                        background: "#fff8f8",
                        borderRadius: "12px",
                        padding: "20px",
                        border: "1px solid #fddcdc",
                        color: "#c05050",
                        fontFamily: "system-ui",
                        fontSize: "14px",
                        marginBottom: "16px",
                    }}
                >
                    {error}
                </div>
            )}

            {!loading && !error && (
                <div
                    style={{
                        background: "#fff",
                        borderRadius: "14px",
                        border: "1px solid #ede9e3",
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            padding: "14px 20px",
                            borderBottom: "1px solid #f2ede6",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span
                                style={{
                                    fontSize: "14px",
                                    fontWeight: "700",
                                    color: "#1c1917",
                                }}
                            >
                                Lista de Ingredientes
                            </span>
                            <span
                                style={{
                                    background: "#f5f0e8",
                                    color: "#8a6f3e",
                                    fontSize: "11px",
                                    fontFamily: "system-ui",
                                    fontWeight: "600",
                                    padding: "2px 8px",
                                    borderRadius: "20px",
                                }}
                            >
                                {filtered.length} {filtered.length === 1 ? "item" : "itens"}
                            </span>
                        </div>
                    </div>

                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                        <tr style={{ background: "#faf8f5" }}>
                            {[
                                "Código",
                                "Nome",
                                "Unidade",
                                "Preço do Pacote",
                                "Qtd. do Pacote",
                                "Custo Unitário",
                                "Ações",
                            ].map((h) => (
                                <th
                                    key={h}
                                    style={{
                                        padding: "10px 16px",
                                        textAlign: "left",
                                        fontSize: "10px",
                                        color: "#9b948c",
                                        fontFamily: "system-ui",
                                        fontWeight: "700",
                                        letterSpacing: "0.8px",
                                        textTransform: "uppercase",
                                        borderBottom: "1px solid #ede9e3",
                                    }}
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                        </thead>

                        <tbody>
                        {filtered.length === 0 && (
                            <tr>
                                <td
                                    colSpan={7}
                                    style={{
                                        padding: "32px 16px",
                                        textAlign: "center",
                                        color: "#9b948c",
                                        fontFamily: "system-ui",
                                        fontSize: "13px",
                                    }}
                                >
                                    Nenhum ingrediente encontrado.
                                </td>
                            </tr>
                        )}

                        {filtered.map((item) => (
                            <tr
                                key={item.id}
                                onMouseEnter={() => setHoveredRow(item.id)}
                                onMouseLeave={() => setHoveredRow(null)}
                                style={{
                                    borderBottom: "1px solid #f5f2ee",
                                    background:
                                        hoveredRow === item.id ? "#fdf9f4" : "transparent",
                                    transition: "background 0.12s ease",
                                }}
                            >
                                <td
                                    style={{
                                        padding: "14px 16px",
                                        fontSize: "13px",
                                        fontWeight: "600",
                                        color: "#8a6f3e",
                                        fontFamily: "system-ui",
                                    }}
                                >
                                    #{item.id}
                                </td>

                                <td style={{ padding: "14px 16px" }}>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "10px",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: "32px",
                                                height: "32px",
                                                borderRadius: "8px",
                                                background:
                                                    "linear-gradient(135deg, #f5e6c8, #ead4a0)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: "15px",
                                                flexShrink: 0,
                                            }}
                                        >
                                            🧈
                                        </div>
                                        <span
                                            style={{
                                                fontSize: "13px",
                                                fontWeight: "600",
                                                color: "#1c1917",
                                            }}
                                        >
                                                {item.nome}
                                            </span>
                                    </div>
                                </td>

                                <td
                                    style={{
                                        padding: "14px 16px",
                                        fontSize: "13px",
                                        color: "#5a5450",
                                        fontFamily: "system-ui",
                                    }}
                                >
                                    {item.unidade?.sigla ?? "-"}
                                </td>

                                <td
                                    style={{
                                        padding: "14px 16px",
                                        fontSize: "13px",
                                        color: "#5a5450",
                                        fontFamily: "system-ui",
                                    }}
                                >
                                    R$ {Number(item.precoPacote ?? 0).toFixed(2)}
                                </td>

                                <td
                                    style={{
                                        padding: "14px 16px",
                                        fontSize: "13px",
                                        color: "#5a5450",
                                        fontFamily: "system-ui",
                                    }}
                                >
                                    {Number(item.quantidadePacote ?? 0).toFixed(2)}
                                </td>

                                <td
                                    style={{
                                        padding: "14px 16px",
                                        fontSize: "13px",
                                        fontWeight: "600",
                                        color: "#5a5450",
                                        fontFamily: "system-ui",
                                    }}
                                >
                                    R$ {Number(item.custoUnitario ?? 0).toFixed(2)}
                                </td>

                                <td style={{ padding: "14px 16px" }}>
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "8px",
                                            alignItems: "center",
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        <Link
                                            to={`/ingredientes/editar/${item.id}`}
                                            style={{
                                                border: "1px solid #e8e3da",
                                                background: "#fff",
                                                color: "#8a6f3e",
                                                borderRadius: "8px",
                                                padding: "8px 12px",
                                                fontSize: "12px",
                                                fontWeight: "600",
                                                fontFamily: "system-ui",
                                                textDecoration: "none",
                                                display: "inline-flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            Alterar
                                        </Link>

                                        <button
                                            onClick={() => handleDelete(item.id, item.nome)}
                                            disabled={deletingId === item.id}
                                            style={{
                                                border: "1px solid #f2caca",
                                                background:
                                                    deletingId === item.id
                                                        ? "#f9eeee"
                                                        : "#fff8f8",
                                                color: "#c05050",
                                                borderRadius: "8px",
                                                padding: "8px 12px",
                                                fontSize: "12px",
                                                fontWeight: "600",
                                                fontFamily: "system-ui",
                                                cursor:
                                                    deletingId === item.id
                                                        ? "not-allowed"
                                                        : "pointer",
                                                opacity: deletingId === item.id ? 0.7 : 1,
                                            }}
                                        >
                                            {deletingId === item.id ? "Excluindo..." : "Excluir"}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <div
                        style={{
                            padding: "12px 20px",
                            borderTop: "1px solid #f2ede6",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <span
                            style={{
                                fontSize: "11px",
                                color: "#9b948c",
                                fontFamily: "system-ui",
                            }}
                        >
                            Mostrando {filtered.length} de {ingredients.length} ingredientes
                        </span>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}