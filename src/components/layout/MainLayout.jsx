import { Link, useLocation } from "react-router-dom";

const menuItems = [
    { label: "Home", path: "/" },
    { label: "Produtos", path: "/produtos" },
    { label: "Cadastrar Produtos", path: "/produtos/cadastro" },
    { label: "Unidades", path: "/unidades" },
];

export default function MainLayout({ title, children }) {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-rose-50 text-stone-800">
            <div className="flex min-h-screen">
                <aside className="w-72 bg-[#5a2d3a] text-white shadow-xl">
                    <div className="border-b border-white/10 px-6 py-6">
                        <h1 className="text-2xl font-bold tracking-wide">Confeitaria</h1>
                        <p className="mt-1 text-sm text-rose-100/80">
                            Gestão de produtos e cadastros
                        </p>
                    </div>

                    <nav className="flex flex-col gap-2 p-4">
                        {menuItems.map((item) => {
                            const active = location.pathname === item.path;

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
                                        active
                                            ? "bg-rose-200 text-[#5a2d3a]"
                                            : "text-white/90 hover:bg-white/10"
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                <main className="flex-1 p-8">
                    <header className="mb-8">
                        <h2 className="text-3xl font-bold text-[#5a2d3a]">{title}</h2>
                        <p className="mt-2 text-sm text-stone-500">
                            Painel administrativo da confeitaria
                        </p>
                    </header>

                    {children}
                </main>
            </div>
        </div>
    );
}