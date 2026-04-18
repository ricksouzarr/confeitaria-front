import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import api from "../../services/api";

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        api.get("/products")
            .then((res) => setProducts(res.data))
            .catch(() => setError("Erro ao carregar produtos"))
            .finally(() => setLoading(false));
    }, []);

    return (
        <MainLayout title="Produtos">
            {loading && <p>Carregando...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && (
                <div className="overflow-x-auto">
                    <table className="w-full bg-white rounded-3xl shadow-sm ring-1 ring-rose-100 overflow-hidden">
                        <thead className="bg-rose-100 text-[#5a2d3a]">
                        <tr>
                            <th className="px-4 py-3 text-left">Nome</th>
                            <th className="px-4 py-3 text-left">Rendimento</th>
                            <th className="px-4 py-3 text-left">Markup Total</th>
                            <th className="px-4 py-3 text-left">Markup Rendimento</th>
                            <th className="px-4 py-3 text-left">Horas</th>
                        </tr>
                        </thead>

                        <tbody>
                        {products.map((p) => (
                            <tr key={p.id} className="border-t">
                                <td className="px-4 py-3">{p.nome}</td>
                                <td className="px-4 py-3">{p.rendimento}</td>
                                <td className="px-4 py-3">{p.markupTotal}</td>
                                <td className="px-4 py-3">{p.markupRendimento}</td>
                                <td className="px-4 py-3">{p.horasMaoDeObra}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </MainLayout>
    );
}