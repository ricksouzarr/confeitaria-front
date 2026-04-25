import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import api from "../../services/api";

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [hoveredRow, setHoveredRow] = useState(null);
    const [search, setSearch] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        loadProducts();
    }, []);

    async function loadProducts() {
        setLoading(true);
        setError("");

        try {
            const res = await api.get("/products");
            setProducts(res.data);
        } catch {
            setError("Erro ao carregar produtos");
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(productId, productName) {
        const confirmed = window.confirm(
            `Tem certeza que deseja excluir o produto "${productName}"?`
        );

        if (!confirmed) return;

        setDeletingId(productId);
        setError("");

        try {
            await api.delete(`/products/${productId}`);
            setProducts((prev) => prev.filter((p) => p.id !== productId));
        } catch (e) {
            console.error(e);
            setError("Erro ao excluir produto.");
        } finally {
            setDeletingId(null);
        }
    }

    const filtered = products.filter((p) =>
        p.nome?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <MainLayout title="Produtos" subtitle="Gerencie seu cardápio e precificação">
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
                        placeholder="Buscar produtos..."
                        style={{
                            border: "none",
                            background: "transparent",
                            outline: "none",
                            fontSize: "13px",
                            color: "#1c1917",
                            width: "200px",

                        }}
                    />
                </div>

                <Link
                    to="/produtos/cadastro"
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
                        boxShadow: "0 2px 8px rgba(232,184,109,0.4)",
                    }}
                >
                    + Novo Produto
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
                        fontSize: "14px",
                    }}
                >
                    Carregando produtos...
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
                                Lista de Produtos
                            </span>
                            <span
                                style={{
                                    background: "#f5f0e8",
                                    color: "#8a6f3e",
                                    fontSize: "11px",
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
                                "Código do Produto",
                                "Nome",
                                "Rendimento",
                                "Markup Total",
                                "Markup Rendimento",
                                "Horas M.O.",
                                "Ações",
                            ].map((h) => (
                                <th
                                    key={h}
                                    style={{
                                        padding: "10px 16px",
                                        textAlign: "left",
                                        fontSize: "10px",
                                        color: "#9b948c",
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
                                        fontSize: "13px",
                                    }}
                                >
                                    Nenhum produto encontrado.
                                </td>
                            </tr>
                        )}

                        {filtered.map((p) => (
                            <tr
                                key={p.id}
                                onMouseEnter={() => setHoveredRow(p.id)}
                                onMouseLeave={() => setHoveredRow(null)}
                                style={{
                                    borderBottom: "1px solid #f5f2ee",
                                    background:
                                        hoveredRow === p.id ? "#fdf9f4" : "transparent",
                                    transition: "background 0.12s ease",
                                }}
                            >
                                <td
                                    style={{
                                        padding: "14px 16px",
                                        fontSize: "13px",
                                        fontWeight: "600",
                                        color: "#8a6f3e",
                                    }}
                                >
                                    #{p.id}
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
                                            🎂
                                        </div>
                                        <span
                                            style={{
                                                fontSize: "13px",
                                                fontWeight: "600",
                                                color: "#1c1917",
                                            }}
                                        >
                                                {p.nome}
                                            </span>
                                    </div>
                                </td>

                                <td
                                    style={{
                                        padding: "14px 16px",
                                        fontSize: "13px",
                                        color: "#5a5450",
                                    }}
                                >
                                    {p.rendimento}
                                </td>

                                <td
                                    style={{
                                        padding: "14px 16px",
                                        fontSize: "13px",
                                        color: "#5a5450",
                                    }}
                                >
                                    {p.markupTotal}
                                </td>

                                <td
                                    style={{
                                        padding: "14px 16px",
                                        fontSize: "13px",
                                        color: "#5a5450",
                                    }}
                                >
                                    {p.markupRendimento}
                                </td>

                                <td
                                    style={{
                                        padding: "14px 16px",
                                        fontSize: "13px",
                                        color: "#5a5450",
                                    }}
                                >
                                    {p.horasMaoDeObra}h
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
                                            to={`/produtos/${p.id}/ficha-tecnica`}
                                            style={{
                                                background: "linear-gradient(135deg, #e8b86d 0%, #c9924a 100%)",
                                                color: "#fff",
                                                borderRadius: "8px",
                                                padding: "8px 12px",
                                                fontSize: "12px",
                                                fontWeight: "600",
                                                textDecoration: "none",
                                                display: "inline-flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                boxShadow: "0 2px 8px rgba(232,184,109,0.28)",
                                            }}
                                        >
                                            Ficha Técnica
                                        </Link>

                                        <Link
                                            to={`/produtos/editar/${p.id}`}
                                            style={{
                                                border: "1px solid #e8e3da",
                                                background: "#fff",
                                                color: "#8a6f3e",
                                                borderRadius: "8px",
                                                padding: "8px 12px",
                                                fontSize: "12px",
                                                fontWeight: "600",
                                                textDecoration: "none",
                                                display: "inline-flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            Alterar
                                        </Link>

                                        <button
                                            onClick={() => handleDelete(p.id, p.nome)}
                                            disabled={deletingId === p.id}
                                            style={{
                                                border: "1px solid #f2caca",
                                                background: deletingId === p.id ? "#f9eeee" : "#fff8f8",
                                                color: "#c05050",
                                                borderRadius: "8px",
                                                padding: "8px 12px",
                                                fontSize: "12px",
                                                fontWeight: "600",
                                                cursor: deletingId === p.id ? "not-allowed" : "pointer",
                                                opacity: deletingId === p.id ? 0.7 : 1,
                                            }}
                                        >
                                            {deletingId === p.id ? "Excluindo..." : "Excluir"}
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
                            }}
                        >
                            Mostrando {filtered.length} de {products.length} produtos
                        </span>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}