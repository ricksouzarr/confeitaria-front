import { useEffect, useState } from "react";
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

const APP_VERSION = "1.0.0";

function useClock() {
    const [now, setNow] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);
    return now;
}

export default function MainLayout({ title, subtitle, children }) {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
    const now = useClock();

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        window.location.href = "/login";
    }

    const formattedDate = now.toLocaleDateString("pt-BR", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

    const formattedTime = now.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    return (
        <div
            style={{
                display: "flex",
                height: "100vh",
                overflow: "hidden",
                background: "#faf8f5",
                fontFamily: "Georgia, 'Times New Roman', serif",
            }}
        >
            {/* ── Sidebar ───────────────────────────────────────────────── */}
            <aside
                style={{
                    width: collapsed ? "68px" : "220px",
                    background: "#1c1917",
                    display: "flex",
                    flexDirection: "column",
                    transition: "width 0.3s cubic-bezier(.4,0,.2,1)",
                    overflow: "hidden",
                    flexShrink: 0,
                    zIndex: 10,
                }}
            >
                {/* Logo */}
                <div style={{
                    padding: "24px 18px 20px",
                    borderBottom: "1px solid #2d2926",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                }}>
                    <div style={{
                        width: "34px", height: "34px", borderRadius: "10px",
                        background: "linear-gradient(135deg, #e8b86d 0%, #c9924a 100%)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "17px", flexShrink: 0,
                        boxShadow: "0 2px 8px rgba(232,184,109,0.35)",
                    }}>🎂</div>
                    {!collapsed && (
                        <div>
                            <div style={{ color: "#f5f0e8", fontSize: "14px", fontWeight: "700", letterSpacing: "0.3px", whiteSpace: "nowrap" }}>
                                Doce Gestão
                            </div>
                            <div style={{ color: "#6b6560", fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                                Confeitaria
                            </div>
                        </div>
                    )}
                </div>

                {/* Nav */}
                <nav style={{ padding: "12px 10px", flex: 1, overflowY: "auto" }}>
                    {menuItems.map((item) => {
                        const active =
                            item.path === "/"
                                ? location.pathname === item.path
                                : location.pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                style={{
                                    width: "100%", display: "flex", alignItems: "center",
                                    gap: "10px", padding: "10px 10px", borderRadius: "8px",
                                    textDecoration: "none", marginBottom: "2px",
                                    background: active
                                        ? "linear-gradient(135deg, rgba(232,184,109,0.18) 0%, rgba(201,146,74,0.10) 100%)"
                                        : "transparent",
                                    color: active ? "#e8b86d" : "#7a736c",
                                    borderLeft: active ? "2px solid #e8b86d" : "2px solid transparent",
                                    transition: "all 0.15s ease",
                                }}
                            >
                                <span style={{ fontSize: "16px", flexShrink: 0, width: "20px", textAlign: "center" }}>
                                    {item.icon}
                                </span>
                                {!collapsed && (
                                    <span style={{ fontSize: "13px", fontWeight: active ? "600" : "400", whiteSpace: "nowrap" }}>
                                        {item.label}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Usuário */}
                <div style={{
                    padding: "14px 14px",
                    borderTop: "1px solid #2d2926",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                }}>
                    <div style={{
                        width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0,
                        background: "linear-gradient(135deg, #8db4a0, #5d9078)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "13px", color: "white", fontWeight: "700",
                    }}>
                        {usuario.nome?.charAt(0).toUpperCase() || "U"}
                    </div>
                    {!collapsed && (
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                                color: "#d4cfc9", fontSize: "12px", fontWeight: "600",
                                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                            }}>
                                {usuario.nome || "Usuário"}
                            </div>
                            <button onClick={handleLogout} style={{
                                background: "none", border: "none", color: "#5a5450",
                                fontSize: "10px", cursor: "pointer", padding: 0,
                                fontFamily: "'Poppins', system-ui, sans-serif",
                            }}>
                                Sair
                            </button>
                        </div>
                    )}
                </div>
            </aside>

            {/* ── Coluna direita: header + main + footer ─────────────────── */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

                {/* Header */}
                <header style={{
                    background: "#fff",
                    borderBottom: "1px solid #ede9e3",
                    padding: "0 28px",
                    height: "60px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexShrink: 0,
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", fontFamily: "'Poppins', system-ui, sans-serif" }}>
                        <button
                            onClick={() => setCollapsed(c => !c)}
                            style={{
                                background: "none", border: "none", cursor: "pointer",
                                color: "#9b948c", fontSize: "18px", padding: "4px",
                                display: "flex", alignItems: "center", lineHeight: 1,
                            }}
                        >☰</button>
                        <div>
                            <div style={{ fontSize: "17px", fontWeight: "700", color: "#1c1917", letterSpacing: "-0.3px" }}>
                                {title}
                            </div>
                            {subtitle && (
                                <div style={{ fontSize: "11px", color: "#9b948c" }}>
                                    {subtitle}
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main — área de scroll de cada página */}
                <main style={{
                    flex: 1,
                    overflow: "auto",
                    padding: "24px 28px",
                }}>
                    {children}
                </main>

                {/* ── Footer fixo ───────────────────────────────────────── */}
                <footer style={footerStyle}>
                    {/* Esquerda: produto + versão */}
                    <div style={footerSectionStyle}>
                        <div style={footerDotStyle}>🎂</div>
                        <div>
                            <span style={footerBrandStyle}>Doce Gestão</span>
                            <span style={footerVersionBadgeStyle}>v{APP_VERSION}</span>
                        </div>
                    </div>

                    <FooterDivider />

                    {/* Centro: usuário logado */}
                    <div style={footerSectionStyle}>
                        <div style={footerAvatarStyle}>
                            {usuario.nome?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div>
                            <div style={footerLabelStyle}>Usuário logado</div>
                            <div style={footerValueStyle}>{usuario.nome || "—"}</div>
                        </div>
                    </div>

                    <FooterDivider />

                    {/* Centro-direita: data e hora */}
                    <div style={footerSectionStyle}>
                        <span style={{ fontSize: "16px" }}>🕐</span>
                        <div>
                            <div style={footerLabelStyle}>{formattedDate}</div>
                            <div style={{ ...footerValueStyle, fontFamily: "monospace", letterSpacing: "0.5px" }}>
                                {formattedTime}
                            </div>
                        </div>
                    </div>

                    {/* Direita: créditos — empurrado para a direita */}
                    <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={footerLabelStyle}>Desenvolvido por</span>
                        <a
                            href="https://www.linkedin.com/in/henrique-souzar/"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={footerCreditLinkStyle}
                        >
                            Henrique Souza
                        </a>
                    </div>
                </footer>
            </div>
        </div>
    );
}

function FooterDivider() {
    return (
        <div style={{ width: "1px", height: "28px", background: "#ede9e3", flexShrink: 0 }} />
    );
}

// ─── Estilos do footer ────────────────────────────────────────────────────────

const footerStyle = {
    flexShrink: 0,
    height: "48px",
    background: "#fff",
    borderTop: "1px solid #ede9e3",
    padding: "0 24px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    fontFamily: "'Poppins', system-ui, sans-serif",
};

const footerSectionStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexShrink: 0,
};

const footerDotStyle = {
    width: "24px", height: "24px", borderRadius: "6px",
    background: "linear-gradient(135deg, #e8b86d 0%, #c9924a 100%)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "12px", flexShrink: 0,
};

const footerAvatarStyle = {
    width: "24px", height: "24px", borderRadius: "50%", flexShrink: 0,
    background: "linear-gradient(135deg, #8db4a0, #5d9078)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "10px", color: "white", fontWeight: "700",
};

const footerBrandStyle = {
    fontSize: "12px", fontWeight: "700", color: "#1c1917",
};

const footerVersionBadgeStyle = {
    marginLeft: "6px",
    fontSize: "10px", fontWeight: "600",
    background: "#f5f0e8", color: "#8a6f3e",
    padding: "1px 6px", borderRadius: "20px",
};

const footerLabelStyle = {
    fontSize: "10px", color: "#9b948c",
    textTransform: "uppercase", letterSpacing: "0.4px", fontWeight: "600",
};

const footerValueStyle = {
    fontSize: "12px", fontWeight: "600", color: "#1c1917",
};

const footerCreditLinkStyle = {
    fontSize: "12px", fontWeight: "600",
    color: "#c9924a", textDecoration: "none",
    borderBottom: "1px solid transparent",
    transition: "border-color 0.15s ease",
};