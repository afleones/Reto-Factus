function MetricCard({ title, amount, subItems }) {
    return (
        <div className="bg-white p-4 rounded-lg border">
            <h3 className="text-sm font-medium border-b pb-2 mb-3">{title}</h3>
            <p className="text-2xl font-semibold mb-4">${amount}</p>
            {subItems && (
                <div className="space-y-2">
                    {subItems.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <div className={`w-1 h-4 ${index === 0 ? "bg-teal-500" : "bg-red-500"}`} />
                                <span className="text-gray-600">{item.label}</span>
                            </div>
                            <div>
                                <p className="font-medium">${item.value}</p>
                                <p className="text-gray-500 text-xs">{item.count} documentos</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export function MetricsGrid() {
    return (
        <div className="grid grid-cols-3 gap-4">
            <MetricCard
                title="Cuentas por cobrar"
                amount="0,00"
                subItems={[
                    { label: "Vigentes", value: "0,00", count: "0" },
                    { label: "Vencidas", value: "0,00", count: "0" },
                ]}
            />
            <MetricCard
                title="Cuentas por pagar"
                amount="0,00"
                subItems={[
                    { label: "Vigentes", value: "0,00", count: "0" },
                    { label: "Vencidas", value: "0,00", count: "0" },
                ]}
            />
            <div className="grid grid-cols-2 gap-4">
                <MetricCard title="Impuestos en venta" amount="0,00" />
                <MetricCard title="Productos vendidos" amount="0" />
                <MetricCard title="Devoluciones de clientes" amount="0,00" />
                <MetricCard title="Clientes con ventas" amount="0" />
            </div>
        </div>
    )
}

