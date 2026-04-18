import MainLayout from "../components/layout/MainLayout";

const stats = [
    { label: "Produtos Ativos", value: "12", delta: "cadastros no sistema", color: "#e8b86d" },
    { label: "Pedidos", value: "8", delta: "em acompanhamento", color: "#8db4a0" },
    { label: "Lucro Estimado", value: "R$ 1.240", delta: "baseado nos produtos", color: "#c4a0c8" },
];

export default function Home() {
    return (
        <MainLayout title="Home" subtitle="Visão geral da confeitaria">

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", marginBottom: "24px" }}>
                {stats.map((stat) => (
                    <div key={stat.label} style={{
                        background: "#fff", borderRadius: "12px",
                        padding: "20px 22px", border: "1px solid #ede9e3",
                        position: "relative", overflow: "hidden",
                    }}>
                        <div style={{
                            position: "absolute", top: 0, left: 0,
                            width: "3px", height: "100%",
                            background: stat.color, borderRadius: "12px 0 0 12px",
                        }} />
                        <div style={{ fontSize: "11px", color: "#9b948c", fontFamily: "system-ui", marginBottom: "8px", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                            {stat.label}
                        </div>
                        <div style={{ fontSize: "28px", fontWeight: "700", color: "#1c1917", letterSpacing: "-1px", lineHeight: 1 }}>
                            {stat.value}
                        </div>
                        <div style={{ fontSize: "11px", color: "#9b948c", marginTop: "6px", fontFamily: "system-ui" }}>
                            {stat.delta}
                        </div>
                    </div>
                ))}
            </div>

            {/* Welcome card */}
            <div style={{
                background: "#fff", borderRadius: "12px",
                padding: "28px 32px", border: "1px solid #ede9e3",
            }}>
                <div style={{ fontSize: "18px", fontWeight: "700", color: "#1c1917", marginBottom: "10px" }}>
                    Bem-vindo ao sistema
                </div>
                <p style={{ fontSize: "14px", color: "#7a736c", lineHeight: "1.7", maxWidth: "600px", fontFamily: "system-ui" }}>
                    Aqui você organiza produtos, custos, preços e outros dados da confeitaria de forma profissional,
                    com visual leve, elegante e fácil de usar.
                </p>
            </div>
        </MainLayout>
    );
}
