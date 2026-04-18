import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import api from "../../services/api";

export default function UnitsList() {
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        api.get("/units")
            .then((response) => setUnits(response.data))
            .catch(() => setError("Erro ao carregar unidades."))
            .finally(() => setLoading(false));
    }, []);

    return (
        <MainLayout title="Unidades">
            {loading && (
                <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-rose-100">
                    Carregando...
                </div>
            )}

            {error && (
                <div className="rounded-3xl bg-red-50 p-6 text-red-700 shadow-sm ring-1 ring-red-100">
                    {error}
                </div>
            )}

            {!loading && !error && (
                <div className="grid gap-4">
                    {units.map((unit) => (
                        <div
                            key={unit.id}
                            className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-rose-100"
                        >
                            <p className="text-lg font-semibold text-[#5a2d3a]">{unit.nome}</p>
                            <p className="mt-2 text-sm text-stone-600">Sigla: {unit.sigla}</p>
                            <p className="text-sm text-stone-600">Tipo: {unit.tipo}</p>
                        </div>
                    ))}
                </div>
            )}
        </MainLayout>
    );
}