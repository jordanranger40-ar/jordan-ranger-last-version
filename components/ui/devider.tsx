// components/ShapeDivider.tsx
import React from "react";

interface ShapeDividerProps {
  color?: string; // لون الفاصل الأساسي
  height?: string; // ارتفاع الفاصل
  className?: string; // أي كلاس إضافي
}

const ShapeDivider: React.FC<ShapeDividerProps> = ({
  color = "#484d23",
  height = "h-24",
  className = "",
}) => {
  return (
    <div className={`relative overflow-hidden ${height} ${className}`}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 90px",
          backgroundPosition: "50% 0%",
          backgroundImage: `url('data:image/svg+xml;charset=utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35.28 2.17" preserveAspectRatio="none"><path d="M0 .5c3.07.55 9.27-.42 16.14 0 6.88.4 13.75.57 19.14-.11V0H0z" fill="%23${color.replace(
            "#",
            ""
          )}"/><path d="M0 1c3.17.8 7.29-.38 10.04-.55 2.75-.17 9.25 1.47 12.67 1.3 3.43-.17 4.65-.84 7.05-.87 2.4-.02 5.52.88 5.52.88V0H0z" opacity=".5" fill="%23${color.replace(
            "#",
            ""
          )}"/><path d="M0 1.85c2.56-.83 7.68-.3 11.79-.42 4.1-.12 6.86-.61 9.58-.28 2.73.33 5.61 1.17 8.61 1 3-.19 4.73-.82 5.3-.84V.1H0z" opacity=".5" fill="%23${color.replace(
            "#",
            ""
          )}"/></svg>')`,
        }}
      />
    </div>
  );
};

export default ShapeDivider;
