import { useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import api from "../../services/api";

export default function ProductForm() {
    const [form, setForm] = useState({
        nome: "",
        rendimento: "",
        markupTotal: "",
        markupRendimento: "",
        horasMaoDeObra: "",
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            await api.post("/products", {
                nome: form.nome,
                rendimento: Number(form.rendimento),
                markupTotal: Number(form.markupTotal),
                markupRendimento: Number(form.markupRendimento),
                horasMaoDeObra: Number(form.horasMaoDeObra),
            });

            setMessage("Produto cadastrado com sucesso.");
            setForm({
                nome: "",
                rendimento: "",
                markupTotal: "",
                markupRendimento: "",
                horasMaoDeObra: "",
            });

        } catch (e) {
            setError("Erro ao cadastrar produto.");
            console.error(e);
        }
    }

    return (
        <MainLayout title="Cadastro de Produto">
            <div className="max-w-2xl rounded-3xl bg-white p-8 shadow-sm ring-1 ring-rose-100">

                <form onSubmit={handleSubmit} className="space-y-5">

                    <input
                        name="nome"
                        placeholder="Nome do produto"
                        value={form.nome}
                        onChange={handleChange}
                        className="w-full rounded-2xl border px-4 py-3"
                    />

                    <input
                        name="rendimento"
                        type="number"
                        placeholder="Rendimento (ex: 6 fatias)"
                        value={form.rendimento}
                        onChange={handleChange}
                        className="w-full rounded-2xl border px-4 py-3"
                    />

                    <input
                        name="markupTotal"
                        type="number"
                        step="0.01"
                        placeholder="Markup Total"
                        value={form.markupTotal}
                        onChange={handleChange}
                        className="w-full rounded-2xl border px-4 py-3"
                    />

                    <input
                        name="markupRendimento"
                        type="number"
                        step="0.01"
                        placeholder="Markup por rendimento"
                        value={form.markupRendimento}
                        onChange={handleChange}
                        className="w-full rounded-2xl border px-4 py-3"
                    />

                    <input
                        name="horasMaoDeObra"
                        type="number"
                        step="0.01"
                        placeholder="Horas de mão de obra"
                        value={form.horasMaoDeObra}
                        onChange={handleChange}
                        className="w-full rounded-2xl border px-4 py-3"
                    />

                    <button
                        type="submit"
                        className="rounded-2xl bg-[#5a2d3a] px-6 py-3 text-white"
                    >
                        Salvar produto
                    </button>
                </form>

                {message && <p className="mt-4 text-green-600">{message}</p>}
                {error && <p className="mt-4 text-red-600">{error}</p>}
            </div>
        </MainLayout>
    );
}