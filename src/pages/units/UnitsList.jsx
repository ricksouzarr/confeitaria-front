import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import api from "../../services/api";

export default function UnitsList() {
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        api.get("/units")
            .then((res) => setUnits(res.data))
            .catch(() => setError("Erro ao carregar unidades."))
            .finally(() => setLoading(false));
    }, []);

    return (
        <MainLayout title="Unidades" subtitle="Unidades de medida cadastradas">

            {loading && (
                <div style={{ background: "#fff", borderRadius: "12px", padding: "32px", textAlign: "center", border: "1px solid #ede9e3", color: "#9b948c", fontFamily: "system-ui", fontSize: "14px" }}>
                    Carregando unidades...
                </div>
            )}

            {error && (
                <div style={{ background: "#fff8f8", borderRadius: "12px", padding: "20px", border: "1px solid #fddcdc", color: "#c05050", fontFamily: "system-ui", fontSize: "14px" }}>
                    {error}
                </div>
            )}

            {!loading && !error && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "14px" }}>
                    {units.map((unit) => (
                        <div
                            key={unit.id}
                            style={{
                                background: "#fff", borderRadius: "12px",
                                padding: "20px 22px", border: "1px solid #ede9e3",
                                position: "relative", overflow: "hidden",
                            }}
                        >
                            <div style={{
                                position: "absolute", top: 0, left: 0,
                                width: "3px", height: "100%",
                                background: "#e8b86d", borderRadius: "12px 0 0 12px",
                            }} />
                            <div style={{ fontSize: "16px", fontWeight: "700", color: "#1c1917", marginBottom: "8px" }}>
                                {unit.nome}
                            </div>
                            <div style={{ display: "flex", gap: "8px" }}>
                                <span style={{
                                    background: "#f5f0e8", color: "#8a6f3e", fontSize: "11px",
                                    fontFamily: "system-ui", fontWeight: "600", padding: "2px 8px", borderRadius: "20px",
                                }}>
                                    {unit.sigla}
                                </span>
                                <span style={{
                                    background: "#f0f7f3", color: "#4a8a6a", fontSize: "11px",
                                    fontFamily: "system-ui", fontWeight: "600", padding: "2px 8px", borderRadius: "20px",
                                }}>
                                    {unit.tipo}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </MainLayout>
    );
}
