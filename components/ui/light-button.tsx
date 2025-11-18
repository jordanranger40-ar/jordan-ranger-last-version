import React from 'react';

interface LightButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export default function LightButton({ children, className = '', ...props }: LightButtonProps) {
  return (
    <button
      className={`mt-4 px-6 py-3 bg-white text-[#484d23] font-semibold rounded-full shadow-md hover:bg-[#dcdca8] hover:scale-105 transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
