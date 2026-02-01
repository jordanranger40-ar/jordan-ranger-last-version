// This goes in /[locale]/loading.tsx
export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#fcfaf7]">
      <div className="relative flex items-center justify-center">
        
        {/* Animated Topographic Rings */}
        <div className="absolute h-32 w-32 animate-[ping_2s_linear_infinite] rounded-full border-2 border-[#676e32]/30"></div>
        <div className="absolute h-48 w-48 animate-[ping_3s_linear_infinite] rounded-full border border-[#676e32]/10"></div>

        {/* Central Adventure Icon */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="animate-bounce">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="#676e32" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="h-16 w-16"
            >
              <path d="M2 20h20" />
              <path d="m12 10 4 10H8l4-10Z" />
              <path d="m12 3 3 5H9l3-5Z" />
            </svg>
          </div>
          
          <h2 className="mt-6 text-xl font-black tracking-[0.2em] text-[#676e32] uppercase">
            Jordan Ranger
          </h2>
          
          <div className="mt-4 flex gap-1">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#676e32] [animation-delay:-0.3s]"></span>
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#676e32] [animation-delay:-0.15s]"></span>
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#676e32]"></span>
          </div>
        </div>
      </div>
    </div>
  );
}