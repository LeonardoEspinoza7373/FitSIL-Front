// src/pages/Estadisticas/Componentes/GraficoLinea.jsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";

export default function GraficoLinea({ data }) {
  const sinDatos = !data || data.length === 0;

  const datosDefault = [
    { fecha: "Lun", valor: 0 },
    { fecha: "Mar", valor: 0 },
    { fecha: "Mié", valor: 0 },
    { fecha: "Jue", valor: 0 },
    { fecha: "Vie", valor: 0 },
    { fecha: "Sáb", valor: 0 },
    { fecha: "Dom", valor: 0 },
  ];

  const datosFinales = sinDatos ? datosDefault : data;

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={datosFinales} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis 
            dataKey="fecha" 
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
          <Line
            type="monotone"
            dataKey="valor"
            name="Minutos"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ r: 5, fill: '#3b82f6' }}
            activeDot={{ r: 7, fill: '#2563eb' }}
          />
        </LineChart>
      </ResponsiveContainer>

      {sinDatos && (
        <p style={{ 
          textAlign: "center", 
          fontSize: "0.875rem", 
          color: "#64748b",
          marginTop: '16px'
        }}>
          📊 Completa ejercicios para ver tu actividad semanal
        </p>
      )}
    </div>
  );
}