import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import api from "../../services/api";

export default function UnitsList() {
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        loadUnits();
    }, []);

    async function loadUnits() {
        setLoading(true);
        setError("");

        try {
            const res = await api.get("/units");
            setUnits(res.data || []);
        } catch (e) {
            console.error(e);
            setError("Erro ao carregar unidades.");
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(unitId, unitName) {
        const confirmed = window.confirm(
            `Tem certeza que deseja excluir a unidade "${unitName}"?`
        );

        if (!confirmed) return;

        setDeletingId(unitId);
        setError("");

        try {
            await api.delete(`/units/${unitId}`);
            setUnits((prev) => prev.filter((unit) => unit.id !== unitId));
        } catch (e) {
            console.error(e);
            const backendMessage =
                e?.response?.data?.message ||
                e?.response?.data?.error ||
                "Erro ao excluir unidade.";

            setError(backendMessage);
        } finally {
            setDeletingId(null);
        }
    }

    const filteredUnits = units.filter((unit) =>
        unit.nome?.toLowerCase().includes(search.toLowerCase()) ||
        unit.sigla?.toLowerCase().includes(search.toLowerCase()) ||
        unit.tipo?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <MainLayout title="Unidades" subtitle="Unidades de medida cadastradas">
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
                        placeholder="Buscar unidades..."
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
                    to="/unidades/cadastro"
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
                    + Nova Unidade
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
                    Carregando unidades...
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
                <>
                    {filteredUnits.length === 0 ? (
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
                            Nenhuma unidade encontrada.
                        </div>
                    ) : (
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                                gap: "14px",
                            }}
                        >
                            {filteredUnits.map((unit) => (
                                <div
                                    key={unit.id}
                                    style={{
                                        background: "#fff",
                                        borderRadius: "12px",
                                        padding: "20px 22px",
                                        border: "1px solid #ede9e3",
                                        position: "relative",
                                        overflow: "hidden",
                                    }}
                                >
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            width: "3px",
                                            height: "100%",
                                            background: "#e8b86d",
                                            borderRadius: "12px 0 0 12px",
                                        }}
                                    />

                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "flex-start",
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
                                                    marginBottom: "8px",
                                                }}
                                            >
                                                {unit.nome}
                                            </div>

                                            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
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
                                                    {unit.sigla}
                                                </span>

                                                <span
                                                    style={{
                                                        background: "#f0f7f3",
                                                        color: "#4a8a6a",
                                                        fontSize: "11px",
                                                        fontFamily: "system-ui",
                                                        fontWeight: "600",
                                                        padding: "2px 8px",
                                                        borderRadius: "20px",
                                                    }}
                                                >
                                                    {unit.tipo}
                                                </span>
                                            </div>
                                        </div>

                                        <span
                                            style={{
                                                fontSize: "12px",
                                                color: "#9b948c",
                                                fontFamily: "system-ui",
                                                fontWeight: "600",
                                            }}
                                        >
                                            #{unit.id}
                                        </span>
                                    </div>

                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "8px",
                                            marginTop: "18px",
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        <Link
                                            to={`/unidades/editar/${unit.id}`}
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
                                            onClick={() => handleDelete(unit.id, unit.nome)}
                                            disabled={deletingId === unit.id}
                                            style={{
                                                border: "1px solid #f2caca",
                                                background:
                                                    deletingId === unit.id ? "#f9eeee" : "#fff8f8",
                                                color: "#c05050",
                                                borderRadius: "8px",
                                                padding: "8px 12px",
                                                fontSize: "12px",
                                                fontWeight: "600",
                                                fontFamily: "system-ui",
                                                cursor:
                                                    deletingId === unit.id
                                                        ? "not-allowed"
                                                        : "pointer",
                                                opacity: deletingId === unit.id ? 0.7 : 1,
                                            }}
                                        >
                                            {deletingId === unit.id ? "Excluindo..." : "Excluir"}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </MainLayout>
    );
}