import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const { resetPassword } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = async (formData) => {
    setIsLoading(true);
    try {
      await resetPassword(token, formData.password);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed. Token may have expired.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <h2 className="text-2xl font-bold text-white mb-2">Reset password</h2>
      <p className="text-dark-400 text-sm mb-8">Enter your new password below.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-1.5">New Password</label>
          <div className="relative">
            <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
            <input type={showPassword ? 'text' : 'password'} placeholder="Min 6 characters" className="input-field pl-10 pr-10"
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })} />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300">
              {showPassword ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && <p className="text-danger-400 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-300 mb-1.5">Confirm Password</label>
          <div className="relative">
            <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
            <input type="password" placeholder="Re-enter password" className="input-field pl-10"
              {...register('confirmPassword', {
                required: 'Please confirm password',
                validate: (val) => val === watch('password') || 'Passwords do not match',
              })} />
          </div>
          {errors.confirmPassword && <p className="text-danger-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <button type="submit" disabled={isLoading} className="w-full btn-primary disabled:opacity-50">
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>

      <p className="text-center text-sm text-dark-400 mt-6">
        <Link to="/login" className="text-primary-400 hover:text-primary-300 transition-colors">
          Back to Sign In
        </Link>
      </p>
    </motion.div>
  );
}
