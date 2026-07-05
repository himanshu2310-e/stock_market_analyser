import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlineX,
} from 'react-icons/hi';
import usePortfolio from '../hooks/usePortfolio';
import PortfolioChart from '../components/charts/PortfolioChart';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { formatCurrency, formatDate } from '../utils/formatters';

function AddInvestmentModal({ onClose, onSubmit, isLoading }) {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="glass-card p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Add Investment</h3>
          <button onClick={onClose} className="p-1 text-dark-400 hover:text-white"><HiOutlineX className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm text-dark-300 mb-1">Stock Symbol</label>
            <input className="input-field" placeholder="AAPL" {...register('symbol', { required: 'Required' })} />
            {errors.symbol && <p className="text-danger-400 text-xs mt-1">{errors.symbol.message}</p>}
          </div>
          <div>
            <label className="block text-sm text-dark-300 mb-1">Company Name</label>
            <input className="input-field" placeholder="Apple Inc." {...register('companyName')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-dark-300 mb-1">Quantity</label>
              <input type="number" step="any" className="input-field" placeholder="10" {...register('quantity', { required: 'Required', min: { value: 0.0001, message: 'Must be positive' } })} />
              {errors.quantity && <p className="text-danger-400 text-xs mt-1">{errors.quantity.message}</p>}
            </div>
            <div>
              <label className="block text-sm text-dark-300 mb-1">Purchase Price</label>
              <input type="number" step="any" className="input-field" placeholder="150.00" {...register('purchasePrice', { required: 'Required', min: { value: 0, message: 'Must be non-negative' } })} />
              {errors.purchasePrice && <p className="text-danger-400 text-xs mt-1">{errors.purchasePrice.message}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm text-dark-300 mb-1">Purchase Date</label>
            <input type="date" className="input-field" {...register('purchaseDate', { required: 'Required' })} />
            {errors.purchaseDate && <p className="text-danger-400 text-xs mt-1">{errors.purchaseDate.message}</p>}
          </div>
          <div>
            <label className="block text-sm text-dark-300 mb-1">Notes (optional)</label>
            <textarea className="input-field" rows={2} placeholder="Long-term hold..." {...register('notes')} />
          </div>
          <button type="submit" disabled={isLoading} className="w-full btn-primary disabled:opacity-50">
            {isLoading ? 'Adding...' : 'Add Investment'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function PortfolioPage() {
  const { portfolio, isLoading, addInvestment, deleteInvestment, isAdding } = usePortfolio();
  const [showModal, setShowModal] = useState(false);

  const totalInvested = portfolio.reduce((s, p) => s + p.quantity * p.purchasePrice, 0);
  const holdings = portfolio.map((p) => ({
    symbol: p.symbol,
    value: p.quantity * p.purchasePrice,
  }));

  /* Group by symbol for summary */
  const grouped = {};
  portfolio.forEach((p) => {
    if (!grouped[p.symbol]) grouped[p.symbol] = { symbol: p.symbol, name: p.companyName, totalQty: 0, totalCost: 0 };
    grouped[p.symbol].totalQty += p.quantity;
    grouped[p.symbol].totalCost += p.quantity * p.purchasePrice;
  });

  const handleAdd = (data) => {
    addInvestment({
      ...data,
      quantity: parseFloat(data.quantity),
      purchasePrice: parseFloat(data.purchasePrice),
    });
    setShowModal(false);
  };

  if (isLoading) return <LoadingSkeleton type="card" count={3} />;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Portfolio</h1>
          <p className="text-dark-400 text-sm">{portfolio.length} investment{portfolio.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary text-sm py-2 flex items-center gap-2">
          <HiOutlinePlus className="w-4 h-4" />
          Add Investment
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5">
          <p className="text-sm text-dark-400 mb-1">Total Invested</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(totalInvested)}</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-sm text-dark-400 mb-1">Holdings</p>
          <p className="text-2xl font-bold text-white">{Object.keys(grouped).length}</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-sm text-dark-400 mb-1">Investments</p>
          <p className="text-2xl font-bold text-white">{portfolio.length}</p>
        </div>
      </div>

      {/* Allocation chart */}
      {holdings.length > 0 && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Allocation</h2>
          <PortfolioChart holdings={holdings} />
        </div>
      )}

      {/* Investment list */}
      {portfolio.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-dark-400 mb-2">No investments yet</p>
          <p className="text-dark-500 text-sm mb-4">Start tracking your portfolio by adding investments.</p>
          <button onClick={() => setShowModal(true)} className="btn-primary text-sm inline-flex items-center gap-2">
            <HiOutlinePlus className="w-4 h-4" /> Add First Investment
          </button>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['Symbol', 'Company', 'Qty', 'Purchase Price', 'Total Cost', 'Date', 'Actions'].map((h) => (
                    <th key={h} className="text-left text-xs text-dark-500 font-medium px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {portfolio.map((item) => (
                  <tr key={item._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-sm font-semibold text-white">{item.symbol}</td>
                    <td className="px-4 py-3 text-sm text-dark-300 truncate max-w-[150px]">{item.companyName}</td>
                    <td className="px-4 py-3 text-sm text-dark-200">{item.quantity}</td>
                    <td className="px-4 py-3 text-sm text-dark-200">{formatCurrency(item.purchasePrice)}</td>
                    <td className="px-4 py-3 text-sm font-medium text-white">{formatCurrency(item.quantity * item.purchasePrice)}</td>
                    <td className="px-4 py-3 text-xs text-dark-400">{formatDate(item.purchaseDate)}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => deleteInvestment(item._id)} className="p-1.5 text-dark-500 hover:text-danger-400 rounded-lg hover:bg-danger-500/10 transition-colors">
                        <HiOutlineTrash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add modal */}
      <AnimatePresence>
        {showModal && (
          <AddInvestmentModal onClose={() => setShowModal(false)} onSubmit={handleAdd} isLoading={isAdding} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
