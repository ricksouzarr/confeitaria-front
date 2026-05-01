import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
    { label: "Home",        path: "/",                          icon: "⊞" },
    { label: "Produtos",    path: "/produtos",                  icon: "🎂" },
    { label: "Ingredientes",path: "/ingredientes",              icon: "🥛" },
    { label: "Embalagens",  path: "/embalagens",                icon: "📦" },
    { label: "Unidades",    path: "/unidades",                  icon: "📏" },
    { label: "Mão de Obra", path: "/configuracoes/mao-de-obra", icon: "⏱️" },
    { label: "Categorias",  path: "/configuracoes/categorias",  icon: "🏷️" },
    { label: "Tipos",       path: "/configuracoes/tipos",       icon: "📋" },
    { label: "Ocasiões",    path: "/configuracoes/ocasioes",    icon: "🎉" },
];

export default function MainLayout({ title, subtitle, children }) {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        window.location.href = "/login";
    }

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#faf8f5", fontFamily: "'Poppins', system-ui, sans-serif" }}>

            {/* ── Sidebar ── */}
            <aside style={{
                width: collapsed ? "64px" : "216px",
                background: "#18120e",
                display: "flex",
                flexDirection: "column",
                transition: "width 0.28s cubic-bezier(.4,0,.2,1)",
                overflow: "hidden",
                flexShrink: 0,
                position: "relative",
                zIndex: 10,
                borderRight: "1px solid #2a1f18",
            }}>

                {/* Logo / Brand */}
                <div style={{
                    padding: collapsed ? "20px 14px" : "20px 16px",
                    borderBottom: "1px solid #2a1f18",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    minHeight: "68px",
                }}>
                    {/* Logo mark — "C" estilizado */}
                    <div style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "10px",
                        background: "linear-gradient(135deg, #e8b86d 0%, #c9924a 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        boxShadow: "0 2px 12px rgba(232,184,109,0.4)",
                        fontFamily: "Georgia, serif",
                        fontWeight: "900",
                        fontSize: "18px",
                        color: "#fff",
                        letterSpacing: "-1px",
                    }}>
                        C
                    </div>

                    {!collapsed && (
                        <div style={{ overflow: "hidden" }}>
                            <div style={{
                                color: "#f5f0e8",
                                fontSize: "16px",
                                fontWeight: "700",
                                letterSpacing: "-0.3px",
                                whiteSpace: "nowrap",
                                lineHeight: 1.1,
                            }}>
                                Confyx
                            </div>
                            <div style={{
                                color: "#5a4a3a",
                                fontSize: "9px",
                                letterSpacing: "2px",
                                textTransform: "uppercase",
                                whiteSpace: "nowrap",
                                marginTop: "2px",
                            }}>
                                Gestão de Confeitaria
                            </div>
                        </div>
                    )}
                </div>

                {/* Nav */}
                <nav style={{ padding: "10px 8px", flex: 1, overflowY: "auto" }}>
                    {menuItems.map((item) => {
                        const active =
                            item.path === "/"
                                ? location.pathname === item.path
                                : location.pathname.startsWith(item.path);

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                title={collapsed ? item.label : undefined}
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "9px",
                                    padding: collapsed ? "10px 0" : "9px 10px",
                                    justifyContent: collapsed ? "center" : "flex-start",
                                    borderRadius: "8px",
                                    textDecoration: "none",
                                    marginBottom: "2px",
                                    background: active
                                        ? "linear-gradient(135deg, rgba(232,184,109,0.16) 0%, rgba(201,146,74,0.08) 100%)"
                                        : "transparent",
                                    color: active ? "#e8b86d" : "#6b5e54",
                                    borderLeft: active && !collapsed ? "2px solid #e8b86d" : "2px solid transparent",
                                    transition: "all 0.15s ease",
                                }}
                            >
                                <span style={{ fontSize: "15px", flexShrink: 0 }}>
                                    {item.icon}
                                </span>
                                {!collapsed && (
                                    <span style={{
                                        fontSize: "12px",
                                        fontWeight: active ? "600" : "400",
                                        whiteSpace: "nowrap",
                                    }}>
                                        {item.label}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User footer */}
                <div style={{
                    padding: collapsed ? "14px 0" : "14px 12px",
                    borderTop: "1px solid #2a1f18",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    justifyContent: collapsed ? "center" : "flex-start",
                }}>
                    <div style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        flexShrink: 0,
                        background: "linear-gradient(135deg, #8db4a0, #5d9078)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        color: "white",
                        fontWeight: "700",
                    }}>
                        {usuario.nome?.charAt(0).toUpperCase() || "U"}
                    </div>

                    {!collapsed && (
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                                color: "#c4bdb5",
                                fontSize: "11px",
                                fontWeight: "600",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}>
                                {usuario.nome || "Usuário"}
                            </div>
                            <button onClick={handleLogout} style={{
                                background: "none",
                                border: "none",
                                color: "#4a3e38",
                                fontSize: "10px",
                                cursor: "pointer",
                                padding: 0,
                                fontFamily: "'Poppins', system-ui, sans-serif",
                            }}>
                                Sair
                            </button>
                        </div>
                    )}
                </div>
            </aside>

            {/* ── Main area ── */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

                {/* Top header */}
                <header style={{
                    background: "#fff",
                    borderBottom: "1px solid #ede9e3",
                    padding: "0 28px",
                    height: "58px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexShrink: 0,
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                        {/* Hamburguer */}
                        <button
                            onClick={() => setCollapsed((c) => !c)}
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "#9b948c",
                                fontSize: "18px",
                                padding: "4px",
                                display: "flex",
                                alignItems: "center",
                                lineHeight: 1,
                            }}
                        >
                            ☰
                        </button>

                        {/* Breadcrumb / page title */}
                        <div>
                            <div style={{ fontSize: "15px", fontWeight: "700", color: "#1c1917", letterSpacing: "-0.2px" }}>
                                {title}
                            </div>
                            {subtitle && (
                                <div style={{ fontSize: "11px", color: "#9b948c", marginTop: "1px" }}>
                                    {subtitle}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Header right — versão + brand */}
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                        <span style={{
                            fontSize: "10px",
                            color: "#c4bdb5",
                            letterSpacing: "0.5px",
                            fontWeight: "500",
                        }}>
                            v1.0.0
                        </span>

                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "5px 10px",
                            background: "linear-gradient(135deg, rgba(232,184,109,0.12) 0%, rgba(201,146,74,0.06) 100%)",
                            borderRadius: "20px",
                            border: "1px solid rgba(232,184,109,0.25)",
                        }}>
                            <div style={{
                                width: "18px",
                                height: "18px",
                                borderRadius: "5px",
                                background: "linear-gradient(135deg, #e8b86d 0%, #c9924a 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontFamily: "Georgia, serif",
                                fontWeight: "900",
                                fontSize: "10px",
                                color: "#fff",
                            }}>
                                C
                            </div>
                            <span style={{ fontSize: "11px", fontWeight: "700", color: "#8a6f3e" }}>
                                Confyx
                            </span>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main style={{
                    flex: 1,
                    overflow: "auto",
                    padding: "24px 28px",
                }}>
                    {children}
                </main>

                {/* Footer bar */}
                <footer style={{
                    background: "#fff",
                    borderTop: "1px solid #ede9e3",
                    padding: "8px 28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexShrink: 0,
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        {/* Brand */}
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <div style={{
                                width: "20px",
                                height: "20px",
                                borderRadius: "5px",
                                background: "linear-gradient(135deg, #e8b86d 0%, #c9924a 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontFamily: "Georgia, serif",
                                fontWeight: "900",
                                fontSize: "11px",
                                color: "#fff",
                            }}>
                                C
                            </div>
                            <span style={{ fontSize: "12px", fontWeight: "700", color: "#8a6f3e" }}>
                                Confyx
                            </span>
                            <span style={{
                                fontSize: "10px",
                                color: "#c4bdb5",
                                background: "#f5f0e8",
                                padding: "1px 6px",
                                borderRadius: "10px",
                            }}>
                                v1.0.0
                            </span>
                        </div>

                        {/* Usuário logado */}
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <div style={{
                                width: "18px",
                                height: "18px",
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #8db4a0, #5d9078)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "9px",
                                color: "white",
                                fontWeight: "700",
                            }}>
                                {usuario.nome?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <div>
                                <span style={{ fontSize: "10px", color: "#9b948c" }}>USUÁRIO LOGADO</span>
                                <br />
                                <span style={{ fontSize: "11px", fontWeight: "600", color: "#3f3a36" }}>
                                    {usuario.nome || "Usuário"}
                                </span>
                            </div>
                        </div>

                        {/* Data/Hora */}
                        <FooterClock />
                    </div>

                    <div style={{ fontSize: "10px", color: "#c4bdb5" }}>
                        Desenvolvido por{" "}
                        <span style={{ color: "#8a6f3e", fontWeight: "600" }}>Henrique Souza</span>
                    </div>
                </footer>
            </div>
        </div>
    );
}

/* Clock component para o footer */
function FooterClock() {
    const [now, setNow] = useState(new Date());

    useState(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    });

    const dateStr = now.toLocaleDateString("pt-BR", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).toUpperCase();

    const timeStr = now.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    return (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "13px" }}>⏰</span>
            <div>
                <span style={{ fontSize: "10px", color: "#9b948c" }}>{dateStr}</span>
                <br />
                <span style={{ fontSize: "11px", fontWeight: "600", color: "#3f3a36" }}>{timeStr}</span>
            </div>
        </div>
    );
}
