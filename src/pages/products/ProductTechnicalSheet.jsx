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
    const [ingredientSearch, setIngredientSearch] = useState("");
    const [savingIngredient, setSavingIngredient] = useState(false);
    const [ingredientFormError, setIngredientFormError] = useState("");

    const [packagingModalOpen, setPackagingModalOpen] = useState(false);
    const [packagings, setPackagings] = useState([]);
    const [selectedPackagingId, setSelectedPackagingId] = useState("");
    const [packagingQuantity, setPackagingQuantity] = useState("");
    const [packagingSearch, setPackagingSearch] = useState("");
    const [savingPackaging, setSavingPackaging] = useState(false);
    const [packagingFormError, setPackagingFormError] = useState("");

    const [kitItems, setKitItems] = useState([]);
    const [kitModalOpen, setKitModalOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [selectedKitProductId, setSelectedKitProductId] = useState("");
    const [kitQuantity, setKitQuantity] = useState("");
    const [kitSearch, setKitSearch] = useState("");
    const [savingKit, setSavingKit] = useState(false);
    const [kitFormError, setKitFormError] = useState("");

    useEffect(() => { loadData(); }, [id]);

    const filteredIngredients = ingredients.filter((i) =>
        i.nome?.toLowerCase().includes(ingredientSearch.toLowerCase())
    );
    const filteredPackagings = packagings.filter((p) =>
        p.nome?.toLowerCase().includes(packagingSearch.toLowerCase())
    );
    const filteredProducts = products.filter((p) =>
        !p.kit &&
        Number(p.id) !== Number(id) &&
        p.nome?.toLowerCase().includes(kitSearch.toLowerCase())
    );

    async function loadData() {
        setLoading(true);
        setError("");
        try {
            const [productRes, technicalSheetRes, recipeItemsRes, packagingItemsRes, ingredientsRes, packagingsRes, productsRes] =
                await Promise.all([
                    api.get(`/products/${id}`),
                    api.get(`/recipe-items/product/${id}/ficha-tecnica`),
                    api.get(`/recipe-items`),
                    api.get(`/packaging-items`),
                    api.get(`/ingredients`),
                    api.get(`/packagings`),
                    api.get(`/products`),
                ]);

            setProducts(productsRes.data || []);

            const productId = Number(id);
            setProduct(productRes.data);
            setTechnicalSheet(technicalSheetRes.data);
            setRecipeItems((recipeItemsRes.data || []).filter((item) => Number(item?.product?.id) === productId));
            setPackagingItems((packagingItemsRes.data || []).filter((item) => Number(item?.product?.id) === productId));
            setIngredients(ingredientsRes.data || []);
            setPackagings(packagingsRes.data || []);

            if (productRes.data?.kit === true) {
                const kitItemsRes = await api.get(`/kit-items/kit/${id}`);
                setKitItems(kitItemsRes.data || []);
            } else {
                setKitItems([]);
            }
        } catch (e) {
            console.error(e);
            setError(e?.response?.data?.message || e?.response?.data?.error || "Erro ao carregar a ficha técnica.");
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteIngredientItem(itemId, ingredientName) {
        if (!window.confirm(`Remover "${ingredientName}" da ficha técnica?`)) return;
        try {
            await api.delete(`/recipe-items/${itemId}`);
            await loadData();
        } catch { setError("Erro ao remover ingrediente."); }
    }

    async function handleDeletePackagingItem(itemId, packagingName) {
        if (!window.confirm(`Remover "${packagingName}" da ficha técnica?`)) return;
        try {
            await api.delete(`/packaging-items/${itemId}`);
            await loadData();
        } catch { setError("Erro ao remover embalagem."); }
    }

    async function handleAddIngredient(e) {
        e.preventDefault();
        setIngredientFormError("");
        if (!selectedIngredientId) { setIngredientFormError("Selecione um ingrediente."); return; }
        if (!ingredientQuantity || Number(ingredientQuantity) <= 0) { setIngredientFormError("Informe uma quantidade válida."); return; }
        try {
            setSavingIngredient(true);
            await api.post("/recipe-items", {
                product: { id: Number(id) },
                ingredient: { id: Number(selectedIngredientId) },
                quantidade: Number(ingredientQuantity),
            });
            setIngredientModalOpen(false);
            setSelectedIngredientId(""); setIngredientQuantity(""); setIngredientSearch("");
            await loadData();
        } catch { setIngredientFormError("Erro ao adicionar ingrediente."); }
        finally { setSavingIngredient(false); }
    }

    async function handleAddPackaging(e) {
        e.preventDefault();
        setPackagingFormError("");
        if (!selectedPackagingId) { setPackagingFormError("Selecione uma embalagem."); return; }
        if (!packagingQuantity || Number(packagingQuantity) <= 0) { setPackagingFormError("Informe uma quantidade válida."); return; }
        try {
            setSavingPackaging(true);
            await api.post("/packaging-items", {
                product: { id: Number(id) },
                packaging: { id: Number(selectedPackagingId) },
                quantidade: Number(packagingQuantity),
            });
            setPackagingModalOpen(false);
            setSelectedPackagingId(""); setPackagingQuantity(""); setPackagingSearch("");
            await loadData();
        } catch { setPackagingFormError("Erro ao adicionar embalagem."); }
        finally { setSavingPackaging(false); }
    }

    async function handleDeleteKitItem(itemId) {
        if (!window.confirm("Remover este produto do kit?")) return;
        try {
            await api.delete(`/kit-items/${itemId}`);
            await loadData();
        } catch { setError("Erro ao remover produto do kit."); }
    }

    async function handleAddKitItem(e) {
        e.preventDefault();
        setKitFormError("");

        if (!selectedKitProductId) {
            setKitFormError("Selecione um produto acabado.");
            return;
        }

        if (!kitQuantity || Number(kitQuantity) <= 0) {
            setKitFormError("Informe uma quantidade válida.");
            return;
        }

        try {
            setSavingKit(true);

            await api.post("/kit-items", {
                kit: { id: Number(id) },
                produto: { id: Number(selectedKitProductId) },
                quantidade: Number(kitQuantity),
            });

            setKitModalOpen(false);
            setSelectedKitProductId("");
            setKitQuantity("");
            setKitSearch("");

            await loadData();
        } catch {
            setKitFormError("Erro ao adicionar produto ao kit.");
        } finally {
            setSavingKit(false);
        }
    }

    function formatCurrency(value) {
        return Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    }
    function formatNumber(value) {
        return Number(value || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
            {/* ── layout wrapper: ocupa toda a altura disponível do main ── */}
            <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 0 }}>

                {/* ── barra superior ── */}
                <div style={topBarStyle}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                        <Link to="/produtos" style={secondaryActionStyle}>← Voltar para produtos</Link>
                        {product && <span style={badgeStyle}>Produto #{product.id}</span>}
                    </div>
                    <button onClick={loadData} style={secondaryActionStyle}>Atualizar</button>
                </div>

                {/* ── área de scroll central ── */}
                <div style={scrollAreaStyle}>
                    {loading && <div style={loadingStyle}>Carregando ficha técnica...</div>}
                    {!loading && error && <div style={errorStyle}>{error}</div>}

                    {!loading && !error && product && technicalSheet && (
                        <div style={{ display: "grid", gap: "18px" }}>

                            {/* Linha 1: info do produto + resumo */}
                            <div style={mainGridStyle}>
                                {/* Card produto */}
                                <div style={cardStyle}>
                                    <div style={cardHeaderStyle}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                            <div style={productIconStyle}>🎂</div>
                                            <div>
                                                <div style={productNameStyle}>{product.nome}</div>
                                                <div style={mutedTextStyle}>Configuração base do produto</div>
                                            </div>
                                        </div>
                                        <Link to={`/produtos/editar/${product.id}`} style={primaryActionStyle}>
                                            Editar produto
                                        </Link>
                                    </div>
                                    <div style={productInfoGridStyle}>
                                        <InfoCard label="Rendimento" value={`${product.rendimento ?? 0}`} />
                                        <InfoCard label="Horas de mão de obra" value={`${formatNumber(product.horasMaoDeObra)}h`} />
                                        <InfoCard label="Markup total" value={formatNumber(product.markupTotal)} />
                                        <InfoCard label="Markup rendimento" value={formatNumber(product.markupRendimento)} />
                                    </div>
                                </div>

                                {/* Card resumo */}
                                <div style={cardStyle}>
                                    <div style={{ padding: "16px 20px", borderBottom: "1px solid #f2ede6" }}>
                                        <div style={sectionTitleStyle}>Resumo da Ficha</div>
                                        <div style={mutedTextStyle}>Valores calculados pelo backend</div>
                                    </div>
                                    <div style={{ padding: "18px 20px", display: "grid", gap: "14px" }}>
                                        <SummaryItem label="Custo total" value={formatCurrency(technicalSheet.custoTotal)} strong />
                                        <SummaryItem label="Custo por porção" value={formatCurrency(technicalSheet.custoPorPorcao)} />
                                        <SummaryItem label="Preço total" value={formatCurrency(technicalSheet.precoTotal)} />
                                        <SummaryItem label="Preço por porção" value={formatCurrency(technicalSheet.precoPorPorcao)} />
                                    </div>
                                </div>
                            </div>

                            {/* Linha 2: custos breakdown */}
                            <div style={costGridStyle}>
                                <InfoCard label="Custo ingredientes" value={formatCurrency(technicalSheet.custoIngredientes)} />
                                <InfoCard label="Custo embalagem" value={formatCurrency(technicalSheet.custoEmbalagem)} />
                                <InfoCard label="Custo mão de obra" value={formatCurrency(technicalSheet.custoMaoDeObra)} />
                            </div>

                            {/* Observações */}
                            {product.observacaoFichaTecnica && (
                                <div style={cardStyle}>
                                    <div style={{ padding: "16px 20px", borderBottom: "1px solid #f2ede6" }}>
                                        <div style={{ fontSize: "14px", fontWeight: "700", color: "#1c1917" }}>
                                            Observações da Ficha Técnica
                                        </div>
                                        <div style={{ fontSize: "12px", color: "#9b948c", marginTop: "4px" }}>
                                            Instruções e notas técnicas de produção
                                        </div>
                                    </div>
                                    <div style={{ padding: "20px", fontSize: "14px", color: "#3f3a36", lineHeight: "1.7", whiteSpace: "pre-wrap" }}>
                                        {product.observacaoFichaTecnica}
                                    </div>
                                </div>
                            )}

                            {/* Tabela ingredientes */}
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
                                        <button onClick={() => handleDeleteIngredientItem(item.id, item.ingredient?.nome || "item")} style={deleteButtonStyle}>
                                            Excluir
                                        </button>
                                    ),
                                }))}
                            />

                            {/* Tabela embalagens */}
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
                                        <button onClick={() => handleDeletePackagingItem(item.id, item.packaging?.nome || "item")} style={deleteButtonStyle}>
                                            Excluir
                                        </button>
                                    ),
                                }))}
                            />

                            {/* Tabela kit — DENTRO da mesma área de scroll */}
                            {product?.kit && (
                                <ItemsTableCard
                                    title="Produtos do Kit"
                                    subtitle="Produtos acabados que compõem este kit"
                                    emptyText="Nenhum produto vinculado a este kit."
                                    actionLabel="+ Adicionar produto"
                                    onAction={() => setKitModalOpen(true)}
                                    columns={[
                                        { key: "nome", label: "Produto" },
                                        { key: "quantidade", label: "Quantidade" },
                                        { key: "custoUnit", label: "Custo unitário" },
                                        { key: "custoTotal", label: "Custo total" },
                                        { key: "acoes", label: "Ações" },
                                    ]}
                                    rows={kitItems.map((item) => ({
                                        id: item.id,
                                        nome: item.produto?.nome || "-",
                                        quantidade: formatNumber(item.quantidade),
                                        custoUnit: formatCurrency(item.custoProduto),
                                        custoTotal: formatCurrency(item.custoTotal),
                                        acoes: (
                                            <button onClick={() => handleDeleteKitItem(item.id)} style={deleteButtonStyle}>
                                                Excluir
                                            </button>
                                        ),
                                    }))}
                                />
                            )}
                        </div>
                    )}
                </div>

                {/* ── footer fixo ── */}
                {!loading && !error && product && technicalSheet && (
                    <footer style={footerStyle}>
                        {/* esquerda: identidade */}
                        <div style={footerLeftStyle}>
                            <div style={footerProductDotStyle}>🎂</div>
                            <div>
                                <div style={footerProductNameStyle}>{product.nome}</div>
                                <div style={footerProductMetaStyle}>
                                    Rendimento: {product.rendimento} unid. &nbsp;·&nbsp; Mão de obra: {formatNumber(product.horasMaoDeObra)}h
                                </div>
                            </div>
                        </div>

                        {/* centro: custos breakdown compacto */}
                        <div style={footerCenterStyle}>
                            <FooterStat label="Ingredientes" value={formatCurrency(technicalSheet.custoIngredientes)} />
                            <FooterDivider />

                            <FooterStat label="Embalagem" value={formatCurrency(technicalSheet.custoEmbalagem)} />
                            <FooterDivider />

                            {product?.kit && (
                                <>
                                    <FooterStat
                                        label="Produtos do kit"
                                        value={formatCurrency(kitItems.reduce((total, item) => total + Number(item.custoTotal || 0), 0))}
                                    />
                                    <FooterDivider />
                                </>
                            )}

                            <FooterStat label="Mão de obra" value={formatCurrency(technicalSheet.custoMaoDeObra)} />
                            <FooterDivider />

                            <FooterStat label="Custo total" value={formatCurrency(technicalSheet.custoTotal)} highlight />
                        </div>

                        {/* direita: preços sugeridos */}
                        <div style={footerRightStyle}>
                            <div style={footerPriceGroupStyle}>
                                <div style={footerPriceLabelStyle}>Preço total sugerido</div>
                                <div style={footerPriceValueStyle}>{formatCurrency(technicalSheet.precoTotal)}</div>
                            </div>
                            <div style={footerPriceDividerStyle} />
                            <div style={footerPriceGroupStyle}>
                                <div style={footerPriceLabelStyle}>Preço por porção</div>
                                <div style={{ ...footerPriceValueStyle, fontSize: "16px", color: "#c9924a" }}>
                                    {formatCurrency(technicalSheet.precoPorPorcao)}
                                </div>
                            </div>
                        </div>
                    </footer>
                )}
            </div>

            {/* ── Modais ── */}
            {ingredientModalOpen && (
                <ModalOverlay onClose={() => setIngredientModalOpen(false)}>
                    <form onSubmit={handleAddIngredient}>
                        <ModalHeader title="Adicionar ingrediente" subtitle="Busque e vincule um ingrediente à ficha técnica" onClose={() => setIngredientModalOpen(false)} />
                        <div style={modalBodyStyle}>
                            <FormField label="Ingrediente">
                                <input
                                    value={ingredientSearch}
                                    onChange={(e) => { setIngredientSearch(e.target.value); setSelectedIngredientId(""); }}
                                    placeholder="Buscar ingrediente..."
                                    style={inputStyle}
                                />
                                <SearchList
                                    items={filteredIngredients}
                                    selectedId={selectedIngredientId}
                                    emptyText="Nenhum ingrediente encontrado."
                                    renderLabel={(i) => `${i.nome} - ${Number(i.custoUnitario || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} / ${getUnitLabel(i.unidade)}`}
                                    onSelect={(i) => { setSelectedIngredientId(i.id); setIngredientSearch(`${i.nome}`); }}
                                />
                            </FormField>
                            <FormField label="Quantidade usada">
                                <input type="number" step="0.01" min="0" value={ingredientQuantity} onChange={(e) => setIngredientQuantity(e.target.value)} placeholder="Ex: 5" style={inputStyle} />
                            </FormField>
                            {ingredientFormError && <div style={modalErrorStyle}>{ingredientFormError}</div>}
                        </div>
                        <ModalFooter onCancel={() => setIngredientModalOpen(false)} saving={savingIngredient} submitLabel="Salvar ingrediente" savingLabel="Salvando..." />
                    </form>
                </ModalOverlay>
            )}

            {packagingModalOpen && (
                <ModalOverlay onClose={() => setPackagingModalOpen(false)}>
                    <form onSubmit={handleAddPackaging}>
                        <ModalHeader title="Adicionar embalagem" subtitle="Busque e vincule uma embalagem à ficha técnica" onClose={() => setPackagingModalOpen(false)} />
                        <div style={modalBodyStyle}>
                            <FormField label="Embalagem">
                                <input
                                    value={packagingSearch}
                                    onChange={(e) => { setPackagingSearch(e.target.value); setSelectedPackagingId(""); }}
                                    placeholder="Buscar embalagem..."
                                    style={inputStyle}
                                />
                                <SearchList
                                    items={filteredPackagings}
                                    selectedId={selectedPackagingId}
                                    emptyText="Nenhuma embalagem encontrada."
                                    renderLabel={(p) => `${p.nome} - ${Number(p.custoUnitario || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} / ${getUnitLabel(p.unidade)}`}
                                    onSelect={(p) => { setSelectedPackagingId(p.id); setPackagingSearch(`${p.nome}`); }}
                                />
                            </FormField>
                            <FormField label="Quantidade usada">
                                <input type="number" step="0.01" min="0" value={packagingQuantity} onChange={(e) => setPackagingQuantity(e.target.value)} placeholder="Ex: 1" style={inputStyle} />
                            </FormField>
                            {packagingFormError && <div style={modalErrorStyle}>{packagingFormError}</div>}
                        </div>
                        <ModalFooter onCancel={() => setPackagingModalOpen(false)} saving={savingPackaging} submitLabel="Salvar embalagem" savingLabel="Salvando..." />
                    </form>
                </ModalOverlay>
            )}
            {kitModalOpen && (
                <ModalOverlay onClose={() => setKitModalOpen(false)}>
                    <form onSubmit={handleAddKitItem}>
                        <ModalHeader
                            title="Adicionar produto ao kit"
                            subtitle="Busque e vincule um produto acabado a este kit"
                            onClose={() => setKitModalOpen(false)}
                        />

                        <div style={modalBodyStyle}>
                            <FormField label="Produto acabado">
                                <input
                                    value={kitSearch}
                                    onChange={(e) => {
                                        setKitSearch(e.target.value);
                                        setSelectedKitProductId("");
                                    }}
                                    placeholder="Buscar produto acabado..."
                                    style={inputStyle}
                                />

                                <SearchList
                                    items={filteredProducts}
                                    selectedId={selectedKitProductId}
                                    emptyText="Nenhum produto acabado encontrado."
                                    renderLabel={(p) => p.nome}
                                    onSelect={(p) => {
                                        setSelectedKitProductId(p.id);
                                        setKitSearch(p.nome);
                                    }}
                                />
                            </FormField>

                            <FormField label="Quantidade usada">
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={kitQuantity}
                                    onChange={(e) => setKitQuantity(e.target.value)}
                                    placeholder="Ex: 6"
                                    style={inputStyle}
                                />
                            </FormField>

                            {kitFormError && <div style={modalErrorStyle}>{kitFormError}</div>}
                        </div>

                        <ModalFooter
                            onCancel={() => setKitModalOpen(false)}
                            saving={savingKit}
                            submitLabel="Salvar produto"
                            savingLabel="Salvando..."
                        />
                    </form>
                </ModalOverlay>
            )}
        </MainLayout>
    );
}

// ─── Sub-componentes ─────────────────────────────────────────────────────────

function SearchList({ items, selectedId, renderLabel, onSelect, emptyText }) {
    return (
        <div style={searchListStyle}>
            {items.length === 0
                ? <div style={searchEmptyStyle}>{emptyText}</div>
                : items.map((item) => {
                    const selected = String(selectedId) === String(item.id);
                    return (
                        <button key={item.id} type="button" onClick={() => onSelect(item)}
                                style={{ ...searchItemStyle, background: selected ? "#f5f0e8" : "#fff", color: selected ? "#8a6f3e" : "#3f3a36", fontWeight: selected ? "700" : "500" }}>
                            {renderLabel(item)}
                        </button>
                    );
                })}
        </div>
    );
}

function InfoCard({ label, value }) {
    return (
        <div style={infoCardStyle}>
            <div style={infoCardLabelStyle}>{label}</div>
            <div style={infoCardValueStyle}>{value}</div>
        </div>
    );
}

function SummaryItem({ label, value, strong = false }) {
    return (
        <div style={summaryItemStyle}>
            <span style={summaryLabelStyle}>{label}</span>
            <span style={{ fontSize: strong ? "17px" : "14px", color: strong ? "#8a6f3e" : "#1c1917", fontWeight: "700" }}>
                {value}
            </span>
        </div>
    );
}

function ItemsTableCard({ title, subtitle, columns, rows, emptyText, actionLabel = "Em breve", onAction }) {
    const isDisabled = !onAction;
    return (
        <div style={cardStyle}>
            <div style={cardHeaderStyle}>
                <div>
                    <div style={tableTitleStyle}>{title}</div>
                    <div style={tableSubtitleStyle}>{subtitle}</div>
                </div>
                <button onClick={onAction} disabled={isDisabled}
                        style={{ background: isDisabled ? "#f7f3ed" : "linear-gradient(135deg, #e8b86d 0%, #c9924a 100%)", border: isDisabled ? "1px solid #ebe4da" : "none", borderRadius: "8px", padding: "9px 14px", color: isDisabled ? "#b7aea3" : "white", fontSize: "12px", fontWeight: "600", cursor: isDisabled ? "not-allowed" : "pointer", boxShadow: isDisabled ? "none" : "0 2px 8px rgba(232,184,109,0.28)" }}>
                    {actionLabel}
                </button>
            </div>
            {rows.length === 0
                ? <div style={emptyTableStyle}>{emptyText}</div>
                : (
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", minWidth: "660px", borderCollapse: "collapse" }}>
                            <thead>
                            <tr style={{ background: "#faf8f5" }}>
                                {columns.map((col) => (
                                    <th key={col.key} style={tableHeaderCellStyle}>{col.label}</th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {rows.map((row, index) => (
                                <tr key={row.id || index}>
                                    {columns.map((col) => (
                                        <td key={col.key} style={{ padding: "14px 16px", borderBottom: index !== rows.length - 1 ? "1px solid #f5f1eb" : "none", fontSize: "13px", color: "#3f3a36", whiteSpace: col.key === "acoes" ? "normal" : "nowrap" }}>
                                            {row[col.key]}
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

function ModalHeader({ title, subtitle, onClose }) {
    return (
        <div style={modalHeaderStyle}>
            <div>
                <div style={modalTitleStyle}>{title}</div>
                <div style={modalSubtitleStyle}>{subtitle}</div>
            </div>
            <button type="button" onClick={onClose} style={modalCloseButtonStyle}>Fechar</button>
        </div>
    );
}

function ModalFooter({ onCancel, saving, submitLabel, savingLabel }) {
    return (
        <div style={modalFooterStyle}>
            <button type="button" onClick={onCancel} style={modalCancelButtonStyle}>Cancelar</button>
            <button type="submit" disabled={saving} style={modalSubmitButtonStyle(saving)}>
                {saving ? savingLabel : submitLabel}
            </button>
        </div>
    );
}

function ModalOverlay({ children, onClose }) {
    return (
        <div onClick={onClose} style={modalOverlayStyle}>
            <div onClick={(e) => e.stopPropagation()} style={modalContentStyle}>
                {children}
            </div>
        </div>
    );
}

function FormField({ label, children }) {
    return (
        <div style={{ display: "grid", gap: "8px" }}>
            <label style={formLabelStyle}>{label}</label>
            {children}
        </div>
    );
}

function FooterStat({ label, value, highlight = false }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
            <span style={{ fontSize: "10px", color: "#9b948c", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: "600" }}>
                {label}
            </span>
            <span style={{ fontSize: "13px", fontWeight: "700", color: highlight ? "#c9924a" : "#1c1917" }}>
                {value}
            </span>
        </div>
    );
}

function FooterDivider() {
    return <div style={{ width: "1px", height: "28px", background: "#ede9e3", flexShrink: 0 }} />;
}

// ─── Estilos ─────────────────────────────────────────────────────────────────

const topBarStyle = {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    marginBottom: "16px", gap: "12px", flexWrap: "wrap", flexShrink: 0,
};

// Área de scroll: ocupa todo o espaço restante entre topBar e footer
const scrollAreaStyle = {
    flex: 1,
    overflowY: "auto",
    paddingRight: "4px",
    // espaço extra embaixo para o footer não cobrir o último card
    paddingBottom: "8px",
};

const mainGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "18px",
};

const productInfoGridStyle = {
    padding: "20px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "14px",
};

const costGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
};

const cardStyle = {
    background: "#fff", borderRadius: "14px",
    border: "1px solid #ede9e3", overflow: "hidden",
};

const cardHeaderStyle = {
    padding: "16px 20px", borderBottom: "1px solid #f2ede6",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    gap: "12px", flexWrap: "wrap",
};

const productIconStyle = {
    width: "42px", height: "42px", borderRadius: "12px",
    background: "linear-gradient(135deg, #f5e6c8, #ead4a0)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "20px", flexShrink: 0,
};

const productNameStyle = { fontSize: "18px", fontWeight: "700", color: "#1c1917", letterSpacing: "-0.2px" };
const sectionTitleStyle = { fontSize: "14px", fontWeight: "700", color: "#1c1917" };
const mutedTextStyle = { fontSize: "12px", color: "#9b948c", marginTop: "4px" };

const secondaryActionStyle = {
    border: "1px solid #e8e3da", background: "#fff", color: "#5a5450",
    borderRadius: "8px", padding: "9px 14px", fontSize: "12px", fontWeight: "600",
    textDecoration: "none", display: "inline-flex", alignItems: "center",
    justifyContent: "center", cursor: "pointer",
};

const primaryActionStyle = {
    background: "linear-gradient(135deg, #e8b86d 0%, #c9924a 100%)",
    borderRadius: "8px", padding: "9px 14px", color: "white",
    fontSize: "12px", fontWeight: "600", textDecoration: "none",
    boxShadow: "0 2px 8px rgba(232,184,109,0.35)",
};

const badgeStyle = {
    background: "#f5f0e8", color: "#8a6f3e", fontSize: "11px",
    fontWeight: "600", padding: "5px 10px", borderRadius: "20px",
};

const loadingStyle = {
    background: "#fff", borderRadius: "12px", padding: "32px",
    textAlign: "center", border: "1px solid #ede9e3",
    color: "#9b948c", fontSize: "14px",
};

const errorStyle = {
    background: "#fff8f8", borderRadius: "12px", padding: "20px",
    border: "1px solid #fddcdc", color: "#c05050", fontSize: "14px",
};

const infoCardStyle = {
    background: "#fff", borderRadius: "14px",
    border: "1px solid #ede9e3", padding: "16px",
};

const infoCardLabelStyle = {
    fontSize: "11px", color: "#9b948c", textTransform: "uppercase",
    letterSpacing: "0.6px", fontWeight: "700", marginBottom: "8px",
};

const infoCardValueStyle = { fontSize: "18px", fontWeight: "700", color: "#1c1917" };

const summaryItemStyle = {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    gap: "12px", paddingBottom: "12px", borderBottom: "1px solid #f4efe8",
};

const summaryLabelStyle = { fontSize: "12px", color: "#6b6257", fontWeight: "600" };
const tableTitleStyle = { fontSize: "14px", fontWeight: "700", color: "#1c1917" };
const tableSubtitleStyle = { fontSize: "12px", color: "#9b948c", marginTop: "4px" };

const tableHeaderCellStyle = {
    textAlign: "left", padding: "14px 16px", fontSize: "11px",
    color: "#9b948c", textTransform: "uppercase", letterSpacing: "0.5px",
    fontWeight: "700", borderBottom: "1px solid #f0ebe4", whiteSpace: "nowrap",
    background: "#faf8f5",
};

const emptyTableStyle = { padding: "24px 20px", color: "#8b8175", fontSize: "13px" };

const deleteButtonStyle = {
    border: "1px solid #f2caca", background: "#fff8f8", color: "#c05050",
    borderRadius: "8px", padding: "8px 12px", fontSize: "12px",
    fontWeight: "600", cursor: "pointer",
};

const inputStyle = {
    width: "100%", padding: "12px 14px", borderRadius: "10px",
    border: "1px solid #e8e3da", background: "#fff", fontSize: "14px",
    color: "#3f3a36", outline: "none", boxSizing: "border-box",
};

const searchListStyle = {
    border: "1px solid #e8e3da", borderRadius: "10px",
    maxHeight: "200px", overflowY: "auto", background: "#fff",
};

const searchItemStyle = {
    width: "100%", textAlign: "left", padding: "10px 14px",
    border: "none", borderBottom: "1px solid #f3eee8", fontSize: "13px", cursor: "pointer",
};

const searchEmptyStyle = { padding: "12px 14px", fontSize: "13px", color: "#9b948c" };

const modalBodyStyle = { padding: "20px", display: "grid", gap: "16px" };

const modalErrorStyle = {
    background: "#fff8f8", border: "1px solid #f6d6d6", color: "#c05050",
    borderRadius: "10px", padding: "12px 14px", fontSize: "12px",
};

const modalHeaderStyle = {
    padding: "20px", borderBottom: "1px solid #f2ede6",
    display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px",
};

const modalTitleStyle = { fontSize: "16px", fontWeight: "700", color: "#1c1917" };
const modalSubtitleStyle = { fontSize: "12px", color: "#9b948c", marginTop: "4px" };

const modalCloseButtonStyle = {
    border: "1px solid #e8e3da", background: "#fff", color: "#6b6257",
    borderRadius: "8px", padding: "8px 12px", fontSize: "12px",
    fontWeight: "600", cursor: "pointer",
};

const modalFooterStyle = {
    padding: "20px", borderTop: "1px solid #f2ede6",
    display: "flex", justifyContent: "flex-end", gap: "10px",
};

const modalCancelButtonStyle = {
    border: "1px solid #e8e3da", background: "#fff", color: "#6b6257",
    borderRadius: "8px", padding: "10px 14px", fontSize: "12px",
    fontWeight: "600", cursor: "pointer",
};

function modalSubmitButtonStyle(saving) {
    return {
        background: "linear-gradient(135deg, #e8b86d 0%, #c9924a 100%)",
        border: "none", color: "#fff", borderRadius: "8px",
        padding: "10px 14px", fontSize: "12px", fontWeight: "700",
        cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1,
    };
}

const modalOverlayStyle = {
    position: "fixed", inset: 0, background: "rgba(28,25,23,0.38)",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "20px", zIndex: 999,
};

const modalContentStyle = {
    width: "100%", maxWidth: "560px", background: "#fff",
    borderRadius: "16px", border: "1px solid #ede9e3",
    overflow: "hidden", boxShadow: "0 18px 50px rgba(0,0,0,0.18)",
};

const formLabelStyle = { fontSize: "12px", fontWeight: "700", color: "#6b6257" };

// ─── Footer styles ────────────────────────────────────────────────────────────

const footerStyle = {
    flexShrink: 0,
    marginTop: "12px",
    background: "#fff",
    border: "1px solid #ede9e3",
    borderRadius: "14px",
    padding: "14px 20px",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
};

const footerLeftStyle = {
    display: "flex", alignItems: "center", gap: "10px",
    minWidth: "160px", flex: "1 1 160px",
};

const footerProductDotStyle = {
    width: "32px", height: "32px", borderRadius: "8px",
    background: "linear-gradient(135deg, #f5e6c8, #ead4a0)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "15px", flexShrink: 0,
};

const footerProductNameStyle = {
    fontSize: "13px", fontWeight: "700", color: "#1c1917",
    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "160px",
};

const footerProductMetaStyle = {
    fontSize: "11px", color: "#9b948c", marginTop: "1px",
};

const footerCenterStyle = {
    display: "flex", alignItems: "center", gap: "16px",
    flex: "2 1 400px", justifyContent: "center", flexWrap: "wrap",
};

const footerRightStyle = {
    display: "flex", alignItems: "center", gap: "16px",
    flex: "1 1 200px", justifyContent: "flex-end",
};

const footerPriceGroupStyle = { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "1px" };
const footerPriceLabelStyle = { fontSize: "10px", color: "#9b948c", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: "600" };
const footerPriceValueStyle = { fontSize: "18px", fontWeight: "700", color: "#1c1917" };
const footerPriceDividerStyle = { width: "1px", height: "32px", background: "#ede9e3" };
