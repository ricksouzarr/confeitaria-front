import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import api from "../../services/api";

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [fichaTecnicas, setFichaTecnicas] = useState({});
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
            const prods = res.data;
            setProducts(prods);

            // Busca ficha técnica de cada produto para pegar preços de venda
            const fichaPromises = prods.map((p) =>
                api
                    .get(`/recipe-items/product/${p.id}/ficha-tecnica`)
                    .then((r) => ({ id: p.id, data: r.data }))
                    .catch(() => ({ id: p.id, data: null }))
            );
            const fichas = await Promise.all(fichaPromises);
            const fichaMap = {};
            fichas.forEach(({ id, data }) => {
                fichaMap[id] = data;
            });
            setFichaTecnicas(fichaMap);
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
        } catch {
            setError("Erro ao excluir produto.");
        } finally {
            setDeletingId(null);
        }
    }

    function formatCurrency(value) {
        const number = Number(value || 0);
        return number.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    }

    const filtered = products.filter((p) =>
        p.nome?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <MainLayout title="Produtos" subtitle="Gerencie seu cardápio e precificação">
            {/* Top bar */}
            <div style={topBarStyle}>
                <div style={searchBoxStyle}>
                    <span style={{ color: "#9b948c", fontSize: "13px" }}>🔍</span>
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar produtos..."
                        style={searchInputStyle}
                    />
                </div>

                <Link to="/produtos/cadastro" style={newButtonStyle}>
                    + Novo Produto
                </Link>
            </div>

            {/* Loading */}
            {loading && <div style={loadingStyle}>Carregando produtos...</div>}

            {/* Error */}
            {error && <div style={errorBannerStyle}>{error}</div>}

            {/* Table */}
            {!loading && !error && (
                <div style={tableWrapperStyle}>
                    {/* Table header */}
                    <div style={tableHeaderBarStyle}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span style={tableHeaderTitleStyle}>Lista de Produtos</span>
                            <span style={badgeStyle}>
                                {filtered.length}{" "}
                                {filtered.length === 1 ? "item" : "itens"}
                            </span>
                        </div>
                    </div>

                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                        <tr style={{ background: "#faf8f5" }}>
                            {[
                                { label: "ID",              width: "60px"  },
                                { label: "Nome",            width: "auto"  },
                                { label: "Rendimento",      width: "110px" },
                                { label: "Preço de Venda",  width: "140px" },
                                { label: "Preço/Porção",    width: "140px" },
                                { label: "Kit",             width: "70px"  },
                                { label: "Ações",           width: "240px" },
                            ].map((h) => (
                                <th
                                    key={h.label}
                                    style={{
                                        ...thStyle,
                                        width: h.width,
                                    }}
                                >
                                    {h.label}
                                </th>
                            ))}
                        </tr>
                        </thead>

                        <tbody>
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={7} style={emptyRowStyle}>
                                    Nenhum produto encontrado.
                                </td>
                            </tr>
                        )}

                        {filtered.map((p) => {
                            const ficha = fichaTecnicas[p.id];
                            const precoTotal  = ficha?.precoTotal   ?? null;
                            const precoPorcao = ficha?.precoPorPorcao ?? null;

                            return (
                                <tr
                                    key={p.id}
                                    onMouseEnter={() => setHoveredRow(p.id)}
                                    onMouseLeave={() => setHoveredRow(null)}
                                    style={{
                                        borderBottom: "1px solid #f5f2ee",
                                        background:
                                            hoveredRow === p.id
                                                ? "#fdf9f4"
                                                : "transparent",
                                        transition: "background 0.12s ease",
                                    }}
                                >
                                    {/* ID — compacto, sem # */}
                                    <td style={{ ...tdStyle, color: "#b0a89e", fontWeight: "600", fontSize: "12px" }}>
                                        {p.id}
                                    </td>

                                    {/* Nome — sem ícone de bolo */}
                                    <td style={tdStyle}>
                                            <span style={{ fontSize: "13px", fontWeight: "600", color: "#1c1917" }}>
                                                {p.nome}
                                            </span>
                                    </td>

                                    {/* Rendimento */}
                                    <td style={{ ...tdStyle, color: "#5a5450" }}>
                                        {p.rendimento}
                                    </td>

                                    {/* Preço de venda total */}
                                    <td style={tdStyle}>
                                        {precoTotal !== null ? (
                                            <span style={priceChipStyle}>
                                                    {formatCurrency(precoTotal)}
                                                </span>
                                        ) : (
                                            <span style={noPriceStyle}>—</span>
                                        )}
                                    </td>

                                    {/* Preço por porção */}
                                    <td style={tdStyle}>
                                        {precoPorcao !== null ? (
                                            <span style={pricePorcaoChipStyle}>
                                                    {formatCurrency(precoPorcao)}
                                                </span>
                                        ) : (
                                            <span style={noPriceStyle}>—</span>
                                        )}
                                    </td>

                                    {/* Kit badge */}
                                    <td style={{ ...tdStyle, textAlign: "center" }}>
                                        {p.kit ? (
                                            <span style={kitBadgeStyle}>Kit</span>
                                        ) : (
                                            <span style={notKitBadgeStyle}>—</span>
                                        )}
                                    </td>

                                    {/* Ações */}
                                    <td style={tdStyle}>
                                        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                                            <Link
                                                to={`/produtos/${p.id}/ficha-tecnica`}
                                                style={btnFichaTecnicaStyle}
                                            >
                                                Ficha Técnica
                                            </Link>

                                            <Link
                                                to={`/produtos/editar/${p.id}`}
                                                style={btnAlterarStyle}
                                            >
                                                Alterar
                                            </Link>

                                            <button
                                                onClick={() => handleDelete(p.id, p.nome)}
                                                disabled={deletingId === p.id}
                                                style={btnExcluirStyle(deletingId === p.id)}
                                            >
                                                {deletingId === p.id ? "..." : "Excluir"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>

                    {/* Footer */}
                    <div style={tableFooterStyle}>
                        <span style={{ fontSize: "11px", color: "#9b948c" }}>
                            Mostrando {filtered.length} de {products.length} produtos
                        </span>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}

/* ─── Styles ─── */

const topBarStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "20px",
};

const searchBoxStyle = {
    background: "#fff",
    border: "1px solid #e8e3da",
    borderRadius: "8px",
    padding: "8px 14px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
};

const searchInputStyle = {
    border: "none",
    background: "transparent",
    outline: "none",
    fontSize: "13px",
    color: "#1c1917",
    width: "200px",
};

const newButtonStyle = {
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
};

const loadingStyle = {
    background: "#fff",
    borderRadius: "12px",
    padding: "32px",
    textAlign: "center",
    border: "1px solid #ede9e3",
    color: "#9b948c",
    fontSize: "14px",
};

const errorBannerStyle = {
    background: "#fff8f8",
    borderRadius: "12px",
    padding: "20px",
    border: "1px solid #fddcdc",
    color: "#c05050",
    fontSize: "14px",
    marginBottom: "16px",
};

const tableWrapperStyle = {
    background: "#fff",
    borderRadius: "14px",
    border: "1px solid #ede9e3",
    overflow: "hidden",
};

const tableHeaderBarStyle = {
    padding: "14px 20px",
    borderBottom: "1px solid #f2ede6",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
};

const tableHeaderTitleStyle = {
    fontSize: "14px",
    fontWeight: "700",
    color: "#1c1917",
};

const badgeStyle = {
    background: "#f5f0e8",
    color: "#8a6f3e",
    fontSize: "11px",
    fontWeight: "600",
    padding: "2px 8px",
    borderRadius: "20px",
};

const thStyle = {
    padding: "10px 16px",
    textAlign: "left",
    fontSize: "10px",
    color: "#9b948c",
    fontWeight: "700",
    letterSpacing: "0.8px",
    textTransform: "uppercase",
    borderBottom: "1px solid #ede9e3",
};

const tdStyle = {
    padding: "13px 16px",
    fontSize: "13px",
    color: "#5a5450",
};

const emptyRowStyle = {
    padding: "32px 16px",
    textAlign: "center",
    color: "#9b948c",
    fontSize: "13px",
};

const tableFooterStyle = {
    padding: "12px 20px",
    borderTop: "1px solid #f2ede6",
};

/* Price chips */
const priceChipStyle = {
    display: "inline-block",
    background: "linear-gradient(135deg, rgba(232,184,109,0.15) 0%, rgba(201,146,74,0.1) 100%)",
    color: "#8a6f3e",
    fontWeight: "700",
    fontSize: "13px",
    padding: "3px 10px",
    borderRadius: "20px",
    border: "1px solid rgba(232,184,109,0.3)",
};

const pricePorcaoChipStyle = {
    display: "inline-block",
    background: "rgba(141,180,160,0.12)",
    color: "#4a7a62",
    fontWeight: "700",
    fontSize: "13px",
    padding: "3px 10px",
    borderRadius: "20px",
    border: "1px solid rgba(141,180,160,0.3)",
};

const noPriceStyle = {
    color: "#c4bdb7",
    fontSize: "14px",
};

/* Kit badges */
const kitBadgeStyle = {
    display: "inline-block",
    background: "rgba(130,100,200,0.12)",
    color: "#6a4fa0",
    fontWeight: "700",
    fontSize: "10px",
    padding: "3px 8px",
    borderRadius: "20px",
    border: "1px solid rgba(130,100,200,0.25)",
    letterSpacing: "0.3px",
};

const notKitBadgeStyle = {
    color: "#c4bdb7",
    fontSize: "14px",
};

/* Action buttons */
const btnFichaTecnicaStyle = {
    background: "linear-gradient(135deg, #e8b86d 0%, #c9924a 100%)",
    color: "#fff",
    borderRadius: "7px",
    padding: "8px 20px",
    fontSize: "11px",
    fontWeight: "600",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    whiteSpace: "nowrap",
    minWidth: "120px",
    boxShadow: "0 2px 6px rgba(232,184,109,0.28)",
};

const btnAlterarStyle = {
    border: "1px solid #e8e3da",
    background: "#fff",
    color: "#8a6f3e",
    borderRadius: "7px",
    padding: "7px 11px",
    fontSize: "11px",
    fontWeight: "600",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
};

const btnExcluirStyle = (disabled) => ({
    border: "1px solid #f2caca",
    background: disabled ? "#f9eeee" : "#fff8f8",
    color: "#c05050",
    borderRadius: "7px",
    padding: "7px 11px",
    fontSize: "11px",
    fontWeight: "600",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.7 : 1,
});
