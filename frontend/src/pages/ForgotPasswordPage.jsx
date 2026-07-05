import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlineArrowLeft } from 'react-icons/hi';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (formData) => {
    setIsLoading(true);
    try {
      await forgotPassword(formData.email);
      setSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (sent) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-success-500/10 flex items-center justify-center">
          <HiOutlineMail className="w-8 h-8 text-success-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Check your email</h2>
        <p className="text-dark-400 text-sm mb-6">
          If an account exists with that email, we&apos;ve sent password reset instructions.
        </p>
        <Link to="/login" className="btn-primary inline-block">Back to Sign In</Link>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <Link to="/login" className="inline-flex items-center gap-1 text-sm text-dark-400 hover:text-white mb-6 transition-colors">
        <HiOutlineArrowLeft className="w-4 h-4" /> Back to Sign In
      </Link>
      <h2 className="text-2xl font-bold text-white mb-2">Forgot password?</h2>
      <p className="text-dark-400 text-sm mb-8">Enter your email and we&apos;ll send you a reset link.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-1.5">Email</label>
          <div className="relative">
            <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
            <input type="email" placeholder="you@example.com" className="input-field pl-10"
              {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })} />
          </div>
          {errors.email && <p className="text-danger-400 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <button type="submit" disabled={isLoading} className="w-full btn-primary disabled:opacity-50">
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
    </motion.div>
  );
}
