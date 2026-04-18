import MainLayout from "../components/layout/MainLayout";

export default function Home() {
    return (
        <MainLayout title="Home">
            <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-rose-100">
                    <p className="text-sm text-stone-500">Produtos</p>
                    <h3 className="mt-3 text-3xl font-bold text-[#5a2d3a]">12</h3>
                    <p className="mt-2 text-sm text-stone-500">
                        Cadastros ativos no sistema
                    </p>
                </div>

                <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-rose-100">
                    <p className="text-sm text-stone-500">Pedidos</p>
                    <h3 className="mt-3 text-3xl font-bold text-[#5a2d3a]">8</h3>
                    <p className="mt-2 text-sm text-stone-500">
                        Pedidos em acompanhamento
                    </p>
                </div>

                <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-rose-100">
                    <p className="text-sm text-stone-500">Lucro estimado</p>
                    <h3 className="mt-3 text-3xl font-bold text-[#5a2d3a]">R$ 1.240</h3>
                    <p className="mt-2 text-sm text-stone-500">
                        Baseado nos produtos cadastrados
                    </p>
                </div>
            </div>

            <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-rose-100">
                <h3 className="text-xl font-semibold text-[#5a2d3a]">
                    Bem-vindo ao sistema
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
                    Aqui você vai organizar produtos, custos, preços e outros dados da
                    confeitaria em uma estrutura mais profissional, com visual leve,
                    elegante e fácil de usar.
                </p>
            </div>
        </MainLayout>
    );
}