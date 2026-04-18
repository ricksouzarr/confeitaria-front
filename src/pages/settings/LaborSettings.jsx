import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import api from "../../services/api";

export default function LaborSettings() {
    const [labor, setLabor] = useState(null);
    const [custoHora, setCustoHora] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        loadLabor();
    }, []);

    async function loadLabor() {
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await api.get("/labor");
            const data = response?.data ?? null;

            setLabor(data);

            if (data && data.custoHora !== undefined && data.custoHora !== null) {
                setCustoHora(String(data.custoHora));
            } else {
                setCustoHora("");
            }
        } catch (e) {
            console.error("Erro ao carregar labor:", e);

            const backendMessage =
                e?.response?.data?.message ||
                e?.response?.data?.error ||
                "";

            if (backendMessage) {
                setError(backendMessage);
            }
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!custoHora || Number(custoHora) <= 0) {
            setError("Informe um custo por hora válido.");
            return;
        }

        try {
            setSaving(true);

            const payload = {
                custoHora: Number(custoHora),
            };

            const response = await api.post("/labor", payload);
            const savedData = response?.data ?? payload;

            setLabor(savedData);
            setCustoHora(String(savedData?.custoHora ?? custoHora));
            setSuccess("Mão de obra salva com sucesso.");
        } catch (e) {
            console.error("Erro ao salvar labor:", e);

            const backendMessage =
                e?.response?.data?.message ||
                e?.response?.data?.error ||
                "Erro ao salvar a mão de obra.";

            setError(backendMessage);
        } finally {
            setSaving(false);
        }
    }

    function formatCurrency(value) {
        const number = Number(value || 0);
        return number.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    }

    return (
        <MainLayout
            title="Mão de Obra"
            subtitle="Configure o custo por hora usado no cálculo da ficha técnica"
        >
            <div
                style={{
                    maxWidth: "720px",
                    display: "grid",
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
                        }}
                    >
                        <div
                            style={{
                                fontSize: "15px",
                                fontWeight: "700",
                                color: "#1c1917",
                            }}
                        >
                            Configuração global de mão de obra
                        </div>
                        <div
                            style={{
                                fontSize: "12px",
                                color: "#9b948c",
                                fontFamily: "system-ui",
                                marginTop: "4px",
                                lineHeight: 1.5,
                            }}
                        >
                            Este valor será usado no cálculo da ficha técnica de todos os produtos.
                        </div>
                    </div>

                    {loading ? (
                        <div
                            style={{
                                padding: "24px 20px",
                                color: "#8b8175",
                                fontSize: "13px",
                                fontFamily: "system-ui",
                            }}
                        >
                            Carregando configuração...
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div
                                style={{
                                    padding: "20px",
                                    display: "grid",
                                    gap: "16px",
                                }}
                            >
                                <div style={{ display: "grid", gap: "8px" }}>
                                    <label
                                        style={{
                                            fontSize: "12px",
                                            fontWeight: "700",
                                            color: "#6b6257",
                                            fontFamily: "system-ui",
                                        }}
                                    >
                                        Custo por hora
                                    </label>

                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={custoHora}
                                        onChange={(e) => setCustoHora(e.target.value)}
                                        placeholder="Ex: 12"
                                        style={{
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
                                        }}
                                    />
                                </div>

                                {labor && labor.custoHora !== undefined && labor.custoHora !== null && (
                                    <div
                                        style={{
                                            background: "#faf8f5",
                                            border: "1px solid #f0ebe4",
                                            borderRadius: "12px",
                                            padding: "14px",
                                            display: "grid",
                                            gap: "6px",
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
                                            }}
                                        >
                                            Valor atual
                                        </div>
                                        <div
                                            style={{
                                                fontSize: "18px",
                                                fontWeight: "700",
                                                color: "#1c1917",
                                            }}
                                        >
                                            {formatCurrency(labor.custoHora)}
                                        </div>
                                    </div>
                                )}

                                {error && (
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
                                        {error}
                                    </div>
                                )}

                                {success && (
                                    <div
                                        style={{
                                            background: "#f7fbf7",
                                            border: "1px solid #d8ead8",
                                            color: "#4f8a4f",
                                            borderRadius: "10px",
                                            padding: "12px 14px",
                                            fontSize: "12px",
                                            fontFamily: "system-ui",
                                        }}
                                    >
                                        {success}
                                    </div>
                                )}
                            </div>

                            <div
                                style={{
                                    padding: "20px",
                                    borderTop: "1px solid #f2ede6",
                                    display: "flex",
                                    justifyContent: "flex-end",
                                }}
                            >
                                <button
                                    type="submit"
                                    disabled={saving}
                                    style={{
                                        background: "linear-gradient(135deg, #e8b86d 0%, #c9924a 100%)",
                                        border: "none",
                                        color: "#fff",
                                        borderRadius: "8px",
                                        padding: "10px 16px",
                                        fontSize: "12px",
                                        fontWeight: "700",
                                        fontFamily: "system-ui",
                                        cursor: saving ? "not-allowed" : "pointer",
                                        opacity: saving ? 0.7 : 1,
                                        boxShadow: "0 2px 8px rgba(232,184,109,0.28)",
                                    }}
                                >
                                    {saving ? "Salvando..." : "Salvar configuração"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}