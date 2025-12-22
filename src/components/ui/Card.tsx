import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({ hover = false, className = '', children, ...props }: CardProps) {
  const hoverStyles = hover ? 'hover:shadow-2xl hover:-translate-y-1 hover:border-blue-100 cursor-pointer' : 'shadow-sm';

  return (
    <div
      className={`bg-white border border-slate-100/80 rounded-[28px] p-6 sm:p-8 transition-all duration-300 ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
