import { useEffect, useState } from "react";
import { WelcomeCard } from "../components/welcome-card";
import { MetricsGrid } from "../components/metrics-grid";
import MultiStepForm from "../components/MultiStepForm"; // Importar el componente

export default function Dashboard() {
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const formStep = localStorage.getItem("FormStep");
        if (formStep !== "true") {
            setShowForm(true);
        }
    }, []);

    const closeForm = () => {
        setShowForm(false);
    };

    return (
        <div className="flex backdrop-blur-15 h-screen bg-gray-50 relative">

            
            {/* Mostrar MultiStepForm si showForm es true */}
            <main className="flex-1 overflow-y-auto p-6">
                <WelcomeCard />
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                    </div>
                </div>
            </main>
        </div>
    );
}

