import { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = [
  '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981',
  '#06b6d4', '#6366f1', '#f43f5e', '#84cc16', '#14b8a6',
];

/**
 * Portfolio allocation doughnut chart.
 * @param {Object[]} holdings - Array of { symbol, value }
 */
export default function PortfolioChart({ holdings = [] }) {
  const chartData = useMemo(() => {
    if (!holdings.length) return null;

    return {
      labels: holdings.map((h) => h.symbol),
      datasets: [
        {
          data: holdings.map((h) => h.value),
          backgroundColor: COLORS.slice(0, holdings.length),
          borderColor: 'rgba(10, 14, 23, 0.8)',
          borderWidth: 3,
          hoverOffset: 8,
        },
      ],
    };
  }, [holdings]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94a3b8',
          padding: 16,
          usePointStyle: true,
          pointStyle: 'circle',
          font: { size: 11, family: 'Inter' },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        cornerRadius: 12,
        padding: 12,
        callbacks: {
          label: (ctx) => {
            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
            const pct = ((ctx.parsed / total) * 100).toFixed(1);
            return ` ${ctx.label}: $${ctx.parsed.toFixed(2)} (${pct}%)`;
          },
        },
      },
    },
  };

  if (!chartData) {
    return (
      <div className="flex items-center justify-center h-64 text-dark-500 text-sm">
        No portfolio data
      </div>
    );
  }

  return (
    <div className="h-64">
      <Doughnut data={chartData} options={options} />
    </div>
  );
}
