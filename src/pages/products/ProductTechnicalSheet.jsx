import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import api from "../../services/api";

export default function ProductTechnicalSheet() {
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [technicalSheet, setTechnicalSheet] = useState(null);
    const [recipeItems, setRecipeItems] = useState([]);
    const [packagingItems, setPackagingItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [ingredientModalOpen, setIngredientModalOpen] = useState(false);
    const [ingredients, setIngredients] = useState([]);
    const [selectedIngredientId, setSelectedIngredientId] = useState("");
    const [ingredientQuantity, setIngredientQuantity] = useState("");
    const [savingIngredient, setSavingIngredient] = useState(false);
    const [ingredientFormError, setIngredientFormError] = useState("");

    const [packagingModalOpen, setPackagingModalOpen] = useState(false);
    const [packagings, setPackagings] = useState([]);
    const [selectedPackagingId, setSelectedPackagingId] = useState("");
    const [packagingQuantity, setPackagingQuantity] = useState("");
    const [savingPackaging, setSavingPackaging] = useState(false);
    const [packagingFormError, setPackagingFormError] = useState("");

    useEffect(() => {
        loadData();
    }, [id]);

    async function loadData() {
        setLoading(true);
        setError("");

        try {
            const [
                productRes,
                technicalSheetRes,
                recipeItemsRes,
                packagingItemsRes,
                ingredientsRes,
                packagingsRes,
            ] = await Promise.all([
                api.get(`/products/${id}`),
                api.get(`/recipe-items/product/${id}/ficha-tecnica`),
                api.get(`/recipe-items`),
                api.get(`/packaging-items`),
                api.get(`/ingredients`),
                api.get(`/packagings`),
            ]);

            const productId = Number(id);

            const filteredRecipeItems = (recipeItemsRes.data || []).filter(
                (item) => Number(item?.product?.id) === productId
            );

            const filteredPackagingItems = (packagingItemsRes.data || []).filter(
                (item) => Number(item?.product?.id) === productId
            );

            setProduct(productRes.data);
            setTechnicalSheet(technicalSheetRes.data);
            setRecipeItems(filteredRecipeItems);
            setPackagingItems(filteredPackagingItems);
            setIngredients(ingredientsRes.data || []);
            setPackagings(packagingsRes.data || []);
        } catch (e) {
            console.error(e);

            const backendMessage =
                e?.response?.data?.message ||
                e?.response?.data?.error ||
                "Erro ao carregar a ficha técnica do produto.";

            setError(backendMessage);
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteIngredientItem(itemId, ingredientName) {
        const confirmed = window.confirm(
            `Tem certeza que deseja remover o ingrediente "${ingredientName}" da ficha técnica?`
        );

        if (!confirmed) return;

        try {
            await api.delete(`/recipe-items/${itemId}`);
            await loadData();
        } catch (e) {
            console.error(e);

            const backendMessage =
                e?.response?.data?.message ||
                e?.response?.data?.error ||
                "Erro ao remover ingrediente da ficha técnica.";

            setError(backendMessage);
        }
    }

    async function handleDeletePackagingItem(itemId, packagingName) {
        const confirmed = window.confirm(
            `Tem certeza que deseja remover a embalagem "${packagingName}" da ficha técnica?`
        );

        if (!confirmed) return;

        try {
            await api.delete(`/packaging-items/${itemId}`);
            await loadData();
        } catch (e) {
            console.error(e);

            const backendMessage =
                e?.response?.data?.message ||
                e?.response?.data?.error ||
                "Erro ao remover embalagem da ficha técnica.";

            setError(backendMessage);
        }
    }

    async function handleAddPackaging(e) {
        e.preventDefault();
        setPackagingFormError("");

        if (!selectedPackagingId) {
            setPackagingFormError("Selecione uma embalagem.");
            return;
        }

        if (!packagingQuantity || Number(packagingQuantity) <= 0) {
            setPackagingFormError("Informe uma quantidade válida.");
            return;
        }

        try {
            setSavingPackaging(true);

            await api.post("/packaging-items", {
                product: { id: Number(id) },
                packaging: { id: Number(selectedPackagingId) },
                quantidade: Number(packagingQuantity),
            });

            setPackagingModalOpen(false);
            setSelectedPackagingId("");
            setPackagingQuantity("");
            await loadData();
        } catch (e) {
            console.error(e);

            const backendMessage =
                e?.response?.data?.message ||
                e?.response?.data?.error ||
                "Erro ao adicionar embalagem.";

            setPackagingFormError(backendMessage);
        } finally {
            setSavingPackaging(false);
        }
    }

    async function handleAddIngredient(e) {
        e.preventDefault();
        setIngredientFormError("");

        if (!selectedIngredientId) {
            setIngredientFormError("Selecione um ingrediente.");
            return;
        }

        if (!ingredientQuantity || Number(ingredientQuantity) <= 0) {
            setIngredientFormError("Informe uma quantidade válida.");
            return;
        }

        try {
            setSavingIngredient(true);

            await api.post("/recipe-items", {
                product: { id: Number(id) },
                ingredient: { id: Number(selectedIngredientId) },
                quantidade: Number(ingredientQuantity),
            });

            setIngredientModalOpen(false);
            setSelectedIngredientId("");
            setIngredientQuantity("");
            await loadData();
        } catch (e) {
            console.error(e);

            const backendMessage =
                e?.response?.data?.message ||
                e?.response?.data?.error ||
                "Erro ao adicionar ingrediente.";

            setIngredientFormError(backendMessage);
        } finally {
            setSavingIngredient(false);
        }
    }

    function formatCurrency(value) {
        const number = Number(value || 0);
        return number.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    }

    function formatNumber(value) {
        const number = Number(value || 0);
        return number.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    }

    function getUnitLabel(unit) {
        if (!unit) return "-";
        return unit.sigla || unit.nome || "-";
    }

    return (
        <MainLayout
            title="Ficha Técnica"
            subtitle="Visualize custos, rendimento e sugestão de preço do produto"
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                    gap: "12px",
                    flexWrap: "wrap",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    <Link
                        to="/produtos"
                        style={{
                            border: "1px solid #e8e3da",
                            background: "#fff",
                            color: "#5a5450",
                            borderRadius: "8px",
                            padding: "9px 14px",
                            fontSize: "12px",
                            fontWeight: "600",
                            fontFamily: "system-ui",
                            textDecoration: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        ← Voltar para produtos
                    </Link>

                    {product && (
                        <span
                            style={{
                                background: "#f5f0e8",
                                color: "#8a6f3e",
                                fontSize: "11px",
                                fontFamily: "system-ui",
                                fontWeight: "600",
                                padding: "5px 10px",
                                borderRadius: "20px",
                            }}
                        >
                            Produto #{product.id}
                        </span>
                    )}
                </div>

                <button
                    onClick={loadData}
                    style={{
                        border: "1px solid #e8e3da",
                        background: "#fff",
                        color: "#8a6f3e",
                        borderRadius: "8px",
                        padding: "9px 14px",
                        fontSize: "12px",
                        fontWeight: "600",
                        fontFamily: "system-ui",
                        cursor: "pointer",
                    }}
                >
                    Atualizar
                </button>
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
                    Carregando ficha técnica...
                </div>
            )}

            {!loading && error && (
                <div
                    style={{
                        background: "#fff8f8",
                        borderRadius: "12px",
                        padding: "20px",
                        border: "1px solid #fddcdc",
                        color: "#c05050",
                        fontFamily: "system-ui",
                        fontSize: "14px",
                    }}
                >
                    {error}
                </div>
            )}

            {!loading && !error && product && technicalSheet && (
                <div style={{ display: "grid", gap: "18px" }}>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "2fr 1fr",
                            gap: "18px",
                        }}
                    >
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
                                    padding: "16px 20px",
                                    borderBottom: "1px solid #f2ede6",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: "12px",
                                    flexWrap: "wrap",
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                    <div
                                        style={{
                                            width: "42px",
                                            height: "42px",
                                            borderRadius: "12px",
                                            background: "linear-gradient(135deg, #f5e6c8, #ead4a0)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "20px",
                                            flexShrink: 0,
                                        }}
                                    >
                                        🎂
                                    </div>

                                    <div>
                                        <div
                                            style={{
                                                fontSize: "18px",
                                                fontWeight: "700",
                                                color: "#1c1917",
                                                letterSpacing: "-0.2px",
                                            }}
                                        >
                                            {product.nome}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: "12px",
                                                color: "#9b948c",
                                                fontFamily: "system-ui",
                                            }}
                                        >
                                            Configuração base do produto
                                        </div>
                                    </div>
                                </div>

                                <Link
                                    to={`/produtos/editar/${product.id}`}
                                    style={{
                                        background:
                                            "linear-gradient(135deg, #e8b86d 0%, #c9924a 100%)",
                                        borderRadius: "8px",
                                        padding: "9px 14px",
                                        color: "white",
                                        fontSize: "12px",
                                        fontWeight: "600",
                                        textDecoration: "none",
                                        fontFamily: "system-ui",
                                        boxShadow: "0 2px 8px rgba(232,184,109,0.35)",
                                    }}
                                >
                                    Editar produto
                                </Link>
                            </div>

                            <div
                                style={{
                                    padding: "20px",
                                    display: "grid",
                                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                                    gap: "14px",
                                }}
                            >
                                <InfoCard label="Rendimento" value={`${product.rendimento ?? 0}`} />
                                <InfoCard
                                    label="Horas de mão de obra"
                                    value={`${formatNumber(product.horasMaoDeObra)}h`}
                                />
                                <InfoCard
                                    label="Markup total"
                                    value={formatNumber(product.markupTotal)}
                                />
                                <InfoCard
                                    label="Markup rendimento"
                                    value={formatNumber(product.markupRendimento)}
                                />
                            </div>
                        </div>

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
                                    padding: "16px 20px",
                                    borderBottom: "1px solid #f2ede6",
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: "14px",
                                        fontWeight: "700",
                                        color: "#1c1917",
                                    }}
                                >
                                    Resumo da Ficha
                                </div>
                                <div
                                    style={{
                                        fontSize: "12px",
                                        color: "#9b948c",
                                        fontFamily: "system-ui",
                                        marginTop: "4px",
                                    }}
                                >
                                    Valores calculados pelo backend
                                </div>
                            </div>

                            <div
                                style={{
                                    padding: "18px 20px",
                                    display: "grid",
                                    gap: "14px",
                                }}
                            >
                                <SummaryItem
                                    label="Custo total"
                                    value={formatCurrency(technicalSheet.custoTotal)}
                                    strong
                                />
                                <SummaryItem
                                    label="Custo por porção"
                                    value={formatCurrency(technicalSheet.custoPorPorcao)}
                                />
                                <SummaryItem
                                    label="Preço total"
                                    value={formatCurrency(technicalSheet.precoTotal)}
                                />
                                <SummaryItem
                                    label="Preço por porção"
                                    value={formatCurrency(technicalSheet.precoPorPorcao)}
                                />
                            </div>
                        </div>
                    </div>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                            gap: "18px",
                        }}
                    >
                        <InfoCard
                            label="Custo ingredientes"
                            value={formatCurrency(technicalSheet.custoIngredientes)}
                        />
                        <InfoCard
                            label="Custo embalagem"
                            value={formatCurrency(technicalSheet.custoEmbalagem)}
                        />
                        <InfoCard
                            label="Custo mão de obra"
                            value={formatCurrency(technicalSheet.custoMaoDeObra)}
                        />
                    </div>

                    <ItemsTableCard
                        title="Ingredientes"
                        subtitle="Itens usados na receita do produto"
                        emptyText="Nenhum ingrediente vinculado a este produto."
                        actionLabel="+ Adicionar ingrediente"
                        onAction={() => setIngredientModalOpen(true)}
                        columns={[
                            { key: "nome", label: "Ingrediente" },
                            { key: "unidade", label: "Unidade" },
                            { key: "quantidade", label: "Quantidade" },
                            { key: "custoUnitario", label: "Custo unitário" },
                            { key: "custoTotal", label: "Custo total" },
                            { key: "acoes", label: "Ações" },
                        ]}
                        rows={recipeItems.map((item) => ({
                            id: item.id,
                            nome: item.ingredient?.nome || "-",
                            unidade: getUnitLabel(item.ingredient?.unidade),
                            quantidade: formatNumber(item.quantidade),
                            custoUnitario: formatCurrency(item.ingredient?.custoUnitario),
                            custoTotal: formatCurrency(item.custoTotal),
                            acoes: (
                                <button
                                    onClick={() =>
                                        handleDeleteIngredientItem(item.id, item.ingredient?.nome || "item")
                                    }
                                    style={{
                                        border: "1px solid #f2caca",
                                        background: "#fff8f8",
                                        color: "#c05050",
                                        borderRadius: "8px",
                                        padding: "8px 12px",
                                        fontSize: "12px",
                                        fontWeight: "600",
                                        fontFamily: "system-ui",
                                        cursor: "pointer",
                                    }}
                                >
                                    Excluir
                                </button>
                            ),
                        }))}

                    />

                    <ItemsTableCard
                        title="Embalagens"
                        subtitle="Itens de embalagem vinculados ao produto"
                        emptyText="Nenhuma embalagem vinculada a este produto."
                        actionLabel="+ Adicionar embalagem"
                        onAction={() => setPackagingModalOpen(true)}
                        columns={[
                            { key: "nome", label: "Embalagem" },
                            { key: "unidade", label: "Unidade" },
                            { key: "quantidade", label: "Quantidade" },
                            { key: "custoUnitario", label: "Custo unitário" },
                            { key: "custoTotal", label: "Custo total" },
                            { key: "acoes", label: "Ações" },
                        ]}
                        rows={packagingItems.map((item) => ({
                            id: item.id,
                            nome: item.packaging?.nome || "-",
                            unidade: getUnitLabel(item.packaging?.unidade),
                            quantidade: formatNumber(item.quantidade),
                            custoUnitario: formatCurrency(item.packaging?.custoUnitario),
                            custoTotal: formatCurrency(item.custoTotal),
                            acoes: (
                                <button
                                    onClick={() =>
                                        handleDeletePackagingItem(item.id, item.packaging?.nome || "item")
                                    }
                                    style={{
                                        border: "1px solid #f2caca",
                                        background: "#fff8f8",
                                        color: "#c05050",
                                        borderRadius: "8px",
                                        padding: "8px 12px",
                                        fontSize: "12px",
                                        fontWeight: "600",
                                        fontFamily: "system-ui",
                                        cursor: "pointer",
                                    }}
                                >
                                    Excluir
                                </button>
                            ),
                        }))}
                    />
                </div>
            )}

            {ingredientModalOpen && (
                <ModalOverlay onClose={() => setIngredientModalOpen(false)}>
                    <form onSubmit={handleAddIngredient}>
                        <div
                            style={{
                                padding: "20px",
                                borderBottom: "1px solid #f2ede6",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: "12px",
                            }}
                        >
                            <div>
                                <div
                                    style={{
                                        fontSize: "16px",
                                        fontWeight: "700",
                                        color: "#1c1917",
                                    }}
                                >
                                    Adicionar ingrediente
                                </div>
                                <div
                                    style={{
                                        fontSize: "12px",
                                        color: "#9b948c",
                                        fontFamily: "system-ui",
                                        marginTop: "4px",
                                    }}
                                >
                                    Vincule um ingrediente à ficha técnica do produto
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIngredientModalOpen(false)}
                                style={{
                                    border: "1px solid #e8e3da",
                                    background: "#fff",
                                    color: "#6b6257",
                                    borderRadius: "8px",
                                    padding: "8px 12px",
                                    fontSize: "12px",
                                    fontWeight: "600",
                                    fontFamily: "system-ui",
                                    cursor: "pointer",
                                }}
                            >
                                Fechar
                            </button>
                        </div>

                        <div
                            style={{
                                padding: "20px",
                                display: "grid",
                                gap: "16px",
                            }}
                        >
                            <FormField label="Ingrediente">
                                <select
                                    value={selectedIngredientId}
                                    onChange={(e) => setSelectedIngredientId(e.target.value)}
                                    style={inputStyle}
                                >
                                    <option value="">Selecione um ingrediente</option>
                                    {ingredients.map((ingredient) => (
                                        <option key={ingredient.id} value={ingredient.id}>
                                            {ingredient.nome} - {formatCurrency(ingredient.custoUnitario)} /{" "}
                                            {getUnitLabel(ingredient.unidade)}
                                        </option>
                                    ))}
                                </select>
                            </FormField>

                            <FormField label="Quantidade usada">
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={ingredientQuantity}
                                    onChange={(e) => setIngredientQuantity(e.target.value)}
                                    placeholder="Ex: 5"
                                    style={inputStyle}
                                />
                            </FormField>

                            {ingredientFormError && (
                                <div
                                    style={{
                                        background: "#fff8f8",
                                        border: "1px solid #f6d6d6",
                                        color: "#c05050",
                                        borderRadius: "10px",
                                        padding: "12px 14px",
                                        fontSize: "12px",
                                        fontFamily: "system-ui",
                                    }}
                                >
                                    {ingredientFormError}
                                </div>
                            )}
                        </div>

                        <div
                            style={{
                                padding: "20px",
                                borderTop: "1px solid #f2ede6",
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: "10px",
                            }}
                        >
                            <button
                                type="button"
                                onClick={() => setIngredientModalOpen(false)}
                                style={{
                                    border: "1px solid #e8e3da",
                                    background: "#fff",
                                    color: "#6b6257",
                                    borderRadius: "8px",
                                    padding: "10px 14px",
                                    fontSize: "12px",
                                    fontWeight: "600",
                                    fontFamily: "system-ui",
                                    cursor: "pointer",
                                }}
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                disabled={savingIngredient}
                                style={{
                                    background: "linear-gradient(135deg, #e8b86d 0%, #c9924a 100%)",
                                    border: "none",
                                    color: "#fff",
                                    borderRadius: "8px",
                                    padding: "10px 14px",
                                    fontSize: "12px",
                                    fontWeight: "700",
                                    fontFamily: "system-ui",
                                    cursor: savingIngredient ? "not-allowed" : "pointer",
                                    opacity: savingIngredient ? 0.7 : 1,
                                }}
                            >
                                {savingIngredient ? "Salvando..." : "Salvar ingrediente"}
                            </button>
                        </div>
                    </form>
                </ModalOverlay>
            )}
            {packagingModalOpen && (
                <ModalOverlay onClose={() => setPackagingModalOpen(false)}>
                    <form onSubmit={handleAddPackaging}>
                        <div
                            style={{
                                padding: "20px",
                                borderBottom: "1px solid #f2ede6",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: "12px",
                            }}
                        >
                            <div>
                                <div
                                    style={{
                                        fontSize: "16px",
                                        fontWeight: "700",
                                        color: "#1c1917",
                                    }}
                                >
                                    Adicionar embalagem
                                </div>
                                <div
                                    style={{
                                        fontSize: "12px",
                                        color: "#9b948c",
                                        fontFamily: "system-ui",
                                        marginTop: "4px",
                                    }}
                                >
                                    Vincule uma embalagem à ficha técnica do produto
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setPackagingModalOpen(false)}
                                style={{
                                    border: "1px solid #e8e3da",
                                    background: "#fff",
                                    color: "#6b6257",
                                    borderRadius: "8px",
                                    padding: "8px 12px",
                                    fontSize: "12px",
                                    fontWeight: "600",
                                    fontFamily: "system-ui",
                                    cursor: "pointer",
                                }}
                            >
                                Fechar
                            </button>
                        </div>

                        <div
                            style={{
                                padding: "20px",
                                display: "grid",
                                gap: "16px",
                            }}
                        >
                            <FormField label="Embalagem">
                                <select
                                    value={selectedPackagingId}
                                    onChange={(e) => setSelectedPackagingId(e.target.value)}
                                    style={inputStyle}
                                >
                                    <option value="">Selecione uma embalagem</option>
                                    {packagings.map((packaging) => (
                                        <option key={packaging.id} value={packaging.id}>
                                            {packaging.nome} - {formatCurrency(packaging.custoUnitario)} /{" "}
                                            {getUnitLabel(packaging.unidade)}
                                        </option>
                                    ))}
                                </select>
                            </FormField>

                            <FormField label="Quantidade usada">
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={packagingQuantity}
                                    onChange={(e) => setPackagingQuantity(e.target.value)}
                                    placeholder="Ex: 1"
                                    style={inputStyle}
                                />
                            </FormField>

                            {packagingFormError && (
                                <div
                                    style={{
                                        background: "#fff8f8",
                                        border: "1px solid #f6d6d6",
                                        color: "#c05050",
                                        borderRadius: "10px",
                                        padding: "12px 14px",
                                        fontSize: "12px",
                                        fontFamily: "system-ui",
                                    }}
                                >
                                    {packagingFormError}
                                </div>
                            )}
                        </div>

                        <div
                            style={{
                                padding: "20px",
                                borderTop: "1px solid #f2ede6",
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: "10px",
                            }}
                        >
                            <button
                                type="button"
                                onClick={() => setPackagingModalOpen(false)}
                                style={{
                                    border: "1px solid #e8e3da",
                                    background: "#fff",
                                    color: "#6b6257",
                                    borderRadius: "8px",
                                    padding: "10px 14px",
                                    fontSize: "12px",
                                    fontWeight: "600",
                                    fontFamily: "system-ui",
                                    cursor: "pointer",
                                }}
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                disabled={savingPackaging}
                                style={{
                                    background: "linear-gradient(135deg, #e8b86d 0%, #c9924a 100%)",
                                    border: "none",
                                    color: "#fff",
                                    borderRadius: "8px",
                                    padding: "10px 14px",
                                    fontSize: "12px",
                                    fontWeight: "700",
                                    fontFamily: "system-ui",
                                    cursor: savingPackaging ? "not-allowed" : "pointer",
                                    opacity: savingPackaging ? 0.7 : 1,
                                }}
                            >
                                {savingPackaging ? "Salvando..." : "Salvar embalagem"}
                            </button>
                        </div>
                    </form>
                </ModalOverlay>
            )}
        </MainLayout>
    );
}

function InfoCard({ label, value }) {
    return (
        <div
            style={{
                background: "#fff",
                borderRadius: "14px",
                border: "1px solid #ede9e3",
                padding: "16px",
            }}
        >
            <div
                style={{
                    fontSize: "11px",
                    color: "#9b948c",
                    fontFamily: "system-ui",
                    textTransform: "uppercase",
                    letterSpacing: "0.6px",
                    fontWeight: "700",
                    marginBottom: "8px",
                }}
            >
                {label}
            </div>
            <div
                style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    color: "#1c1917",
                }}
            >
                {value}
            </div>
        </div>
    );
}

function SummaryItem({ label, value, strong = false }) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
                paddingBottom: "12px",
                borderBottom: "1px solid #f4efe8",
            }}
        >
            <span
                style={{
                    fontSize: "12px",
                    color: "#6b6257",
                    fontFamily: "system-ui",
                    fontWeight: "600",
                }}
            >
                {label}
            </span>

            <span
                style={{
                    fontSize: strong ? "17px" : "14px",
                    color: strong ? "#8a6f3e" : "#1c1917",
                    fontWeight: "700",
                    fontFamily: "system-ui",
                }}
            >
                {value}
            </span>
        </div>
    );
}

function ItemsTableCard({
                            title,
                            subtitle,
                            columns,
                            rows,
                            emptyText,
                            actionLabel = "Em breve",
                            onAction,
                        }) {
    const isDisabled = !onAction;

    return (
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
                    padding: "16px 20px",
                    borderBottom: "1px solid #f2ede6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                    flexWrap: "wrap",
                }}
            >
                <div>
                    <div
                        style={{
                            fontSize: "14px",
                            fontWeight: "700",
                            color: "#1c1917",
                        }}
                    >
                        {title}
                    </div>
                    <div
                        style={{
                            fontSize: "12px",
                            color: "#9b948c",
                            fontFamily: "system-ui",
                            marginTop: "4px",
                        }}
                    >
                        {subtitle}
                    </div>
                </div>

                <button
                    onClick={onAction}
                    disabled={isDisabled}
                    style={{
                        background: isDisabled
                            ? "#f7f3ed"
                            : "linear-gradient(135deg, #e8b86d 0%, #c9924a 100%)",
                        border: isDisabled ? "1px solid #ebe4da" : "none",
                        borderRadius: "8px",
                        padding: "9px 14px",
                        color: isDisabled ? "#b7aea3" : "white",
                        fontSize: "12px",
                        fontWeight: "600",
                        fontFamily: "system-ui",
                        cursor: isDisabled ? "not-allowed" : "pointer",
                        boxShadow: isDisabled
                            ? "none"
                            : "0 2px 8px rgba(232,184,109,0.28)",
                    }}
                >
                    {actionLabel}
                </button>
            </div>

            {rows.length === 0 ? (
                <div
                    style={{
                        padding: "24px 20px",
                        color: "#8b8175",
                        fontSize: "13px",
                        fontFamily: "system-ui",
                    }}
                >
                    {emptyText}
                </div>
            ) : (
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                        <tr style={{ background: "#faf8f5" }}>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    style={{
                                        textAlign: "left",
                                        padding: "14px 16px",
                                        fontSize: "11px",
                                        color: "#9b948c",
                                        fontFamily: "system-ui",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.5px",
                                        fontWeight: "700",
                                        borderBottom: "1px solid #f0ebe4",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {column.label}
                                </th>
                            ))}
                        </tr>
                        </thead>

                        <tbody>
                        {rows.map((row, index) => (
                            <tr key={row.id || index}>
                                {columns.map((column) => (
                                    <td
                                        key={column.key}
                                        style={{
                                            padding: "14px 16px",
                                            borderBottom:
                                                index !== rows.length - 1
                                                    ? "1px solid #f5f1eb"
                                                    : "none",
                                            fontSize: "13px",
                                            color: "#3f3a36",
                                            fontFamily: "system-ui",
                                            whiteSpace: column.key === "acoes" ? "normal" : "nowrap",
                                        }}
                                    >
                                        {row[column.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #e8e3da",
    background: "#fff",
    fontSize: "14px",
    color: "#3f3a36",
    fontFamily: "system-ui",
    outline: "none",
    boxSizing: "border-box",
};

function ModalOverlay({ children, onClose }) {
    return (
        <div
            onClick={onClose}
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(28, 25, 23, 0.38)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
                zIndex: 999,
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: "100%",
                    maxWidth: "560px",
                    background: "#fff",
                    borderRadius: "16px",
                    border: "1px solid #ede9e3",
                    overflow: "hidden",
                    boxShadow: "0 18px 50px rgba(0,0,0,0.18)",
                }}
            >
                {children}
            </div>
        </div>
    );
}

function FormField({ label, children }) {
    return (
        <div style={{ display: "grid", gap: "8px" }}>
            <label
                style={{
                    fontSize: "12px",
                    fontWeight: "700",
                    color: "#6b6257",
                    fontFamily: "system-ui",
                }}
            >
                {label}
            </label>
            {children}
        </div>
    );
}