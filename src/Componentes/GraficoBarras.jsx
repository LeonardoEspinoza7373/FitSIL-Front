// src/pages/Estadisticas/Componentes/GraficoBarras.jsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";

export default function GraficoBarras({ data }) {
  const sinDatos = !data || data.length === 0;

  const datosDefault = [
    { nombre: "Fuerza", valor: 0 },
    { nombre: "Cardio", valor: 0 },
    { nombre: "Flexibilidad", valor: 0 },
  ];

  const datosFinales = sinDatos ? datosDefault : data;

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={datosFinales} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis 
            dataKey="nombre"
            stroke="#64748b"
            style={{ fontSize: '0.875rem' }}
          />
          <YAxis 
            allowDecimals={false}
            stroke="#64748b"
            style={{ fontSize: '0.875rem' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}
            labelStyle={{ fontWeight: 600, marginBottom: '4px' }}
          />
          <Legend />
          <Bar
            dataKey="valor"
            name="Minutos"
            fill="#f97316"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      {sinDatos && (
        <p style={{ 
          textAlign: "center", 
          fontSize: "0.875rem", 
          color: "#64748b",
          marginTop: '16px'
        }}>
          📊 Los datos se mostrarán según tus entrenamientos
        </p>
      )}
    </div>
  );
}