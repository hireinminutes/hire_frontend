import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-bold text-slate-700 mb-2.5 ml-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-5 py-3.5 rounded-xl border-2 border-slate-100 bg-slate-50 text-slate-900 placeholder-slate-400
            focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:outline-none transition-all duration-200
            disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''} ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1.5 ml-1 text-sm font-medium text-red-500 animate-slide-in-left">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
