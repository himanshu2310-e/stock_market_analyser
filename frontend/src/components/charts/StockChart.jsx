import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Line, Bar } from 'react-chartjs-2';
import { CHART_COLORS } from '../../utils/constants';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
  Tooltip,
  Legend,
  TimeScale,
  zoomPlugin
);

/**
 * Versatile stock chart component.
 * Supports Line, Area, and Bar (volume) display modes.
 *
 * @param {Object[]} data - Array of { date, open, high, low, close, volume }
 * @param {string} type - 'line' | 'area' | 'bar'
 * @param {Object[]} indicators - Array of { key, label, data, color }
 * @param {number} height - Chart height in px
 */
export default function StockChart({
  data = [],
  type = 'area',
  indicators = [],
  height = 400,
}) {
  const chartData = useMemo(() => {
    if (!data.length) return { labels: [], datasets: [] };

    const labels = data.map((d) => d.date);
    const closes = data.map((d) => d.close);
    const isPositive = closes.length >= 2 && closes[closes.length - 1] >= closes[0];

    const mainColor = isPositive ? CHART_COLORS.success : CHART_COLORS.danger;

    const datasets = [
      {
        label: 'Price',
        data: closes,
        borderColor: mainColor,
        backgroundColor:
          type === 'area'
            ? (ctx) => {
                const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, height);
                gradient.addColorStop(0, isPositive ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)');
                gradient.addColorStop(1, 'rgba(0,0,0,0)');
                return gradient;
              }
            : 'transparent',
        borderWidth: 2,
        fill: type === 'area',
        tension: 0.1,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: mainColor,
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
      },
    ];

    /* Overlay indicator datasets */
    indicators.forEach((ind) => {
      datasets.push({
        label: ind.label,
        data: ind.data,
        borderColor: ind.color,
        borderWidth: 1.5,
        borderDash: ind.dashed ? [5, 5] : [],
        fill: ind.fill || false,
        backgroundColor: ind.fillColor || 'transparent',
        tension: 0.1,
        pointRadius: 0,
        pointHoverRadius: 4,
      });
    });

    return { labels, datasets };
  }, [data, type, indicators, height]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          display: indicators.length > 0,
          position: 'top',
          labels: {
            color: '#94a3b8',
            usePointStyle: true,
            pointStyle: 'line',
            padding: 20,
            font: { size: 11, family: 'Inter' },
          },
        },
        tooltip: {
          backgroundColor: CHART_COLORS.tooltip,
          titleColor: '#f1f5f9',
          bodyColor: '#cbd5e1',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          cornerRadius: 12,
          padding: 12,
          titleFont: { size: 13, weight: '600', family: 'Inter' },
          bodyFont: { size: 12, family: 'Inter' },
          callbacks: {
            label: (ctx) => {
              return `${ctx.dataset.label}: $${ctx.parsed.y?.toFixed(2) || '0.00'}`;
            },
          },
        },
        zoom: {
          pan: { enabled: true, mode: 'x' },
          zoom: {
            wheel: { enabled: true },
            pinch: { enabled: true },
            mode: 'x',
          },
        },
      },
      scales: {
        x: {
          grid: { color: CHART_COLORS.gridLight, drawBorder: false },
          ticks: {
            color: '#64748b',
            maxRotation: 0,
            maxTicksLimit: 8,
            font: { size: 10, family: 'Inter' },
          },
          border: { display: false },
        },
        y: {
          position: 'right',
          grid: { color: CHART_COLORS.gridLight, drawBorder: false },
          ticks: {
            color: '#64748b',
            font: { size: 10, family: 'Inter' },
            callback: (v) => '$' + v.toFixed(2),
          },
          border: { display: false },
        },
      },
    }),
    [indicators]
  );

  if (!data.length) {
    return (
      <div
        className="flex items-center justify-center text-dark-500 text-sm"
        style={{ height }}
      >
        No chart data available
      </div>
    );
  }

  return (
    <div style={{ height }} className="relative">
      <Line data={chartData} options={options} />
    </div>
  );
}
