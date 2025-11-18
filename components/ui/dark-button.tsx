import React from 'react';

interface LightButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export default function DarkButton({ children, className = '', ...props }: LightButtonProps) {
  return (
    <button
      className={`mt-4 px-6 py-3 bg-[#484d23] text-white font-semibold rounded-full shadow-md 
                 hover:bg-[#5a5e3a] hover:text-[#fdfdfd] hover:scale-105 
                 transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
