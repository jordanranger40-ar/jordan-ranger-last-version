import React, { useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import table from "@/public/images/table.jpg";
import restaurantlogo from "@/public/images/restaurantlogo.png";
import Image from "next/image";


interface MenuItem {
  name: string;
  price: string;
  image: string;
}

interface MenuPage {
  title: string;
  items: MenuItem[];
}

const menuPages: MenuPage[] = [
  {
    title: "المقبلات",
    items: [
      { name: "حمص", price: "5$", image: "https://images.unsplash.com/photo-1600891964312-0540c9a0d47b?auto=format&fit=crop&w=400&q=80" },
      { name: "تبولة", price: "6$", image: "https://cdn.pixabay.com/photo/2017/10/19/20/55/tabbouleh-2873251_1280.jpg" },
      { name: "ورق عنب", price: "7$", image: "https://cdn.pixabay.com/photo/2015/03/26/10/04/grape-leaves-690082_1280.jpg" },
      { name: "متبل", price: "5$", image: "https://cdn.pixabay.com/photo/2016/03/05/19/02/moutabal-1238671_1280.jpg" },
    ],
  },
  {
    title: "الأطباق الرئيسية",
    items: [
      { name: "كباب لحم", price: "12$", image: "https://images.unsplash.com/photo-1600891964711-c5f54c7c1c5c?auto=format&fit=crop&w=400&q=80" },
      { name: "شاورما دجاج", price: "10$", image: "https://images.unsplash.com/photo-1617196033900-cdc3a1b218f2?auto=format&fit=crop&w=400&q=80" },
      { name: "مسخن فلسطيني", price: "14$", image: "https://images.unsplash.com/photo-1598511721593-22f5c54a5ff2?auto=format&fit=crop&w=400&q=80" },
      { name: "فتة حمص", price: "11$", image: "https://images.unsplash.com/photo-1617196033910-abc1b2c3d4e5?auto=format&fit=crop&w=400&q=80" },
    ],
  },
  {
    title: "الأطباق الفرعية",
    items: [
      { name: "بطاطس محمرة", price: "4$", image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=400&q=80" },
      { name: "أرز بالشعيرية", price: "5$", image: "https://images.unsplash.com/photo-1617196033909-d4c2c1b1f8e0?auto=format&fit=crop&w=400&q=80" },
      { name: "سلطة خضراء", price: "6$", image: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=400&q=80" },
      { name: "شوربة عدس", price: "5$", image: "https://images.unsplash.com/photo-1603570419240-cf9c9305d9f0?auto=format&fit=crop&w=400&q=80" },
    ],
  },
  {
    title: "الحلويات",
    items: [
      { name: "كنافة", price: "6$", image: "https://images.pexels.com/photos/31484420/pexels-photo-31484420.jpeg?auto=compress&cs=tinysrgb&w=400" },
      { name: "بقلاوة", price: "5$", image: "https://images.unsplash.com/photo-1600891965611-1c1f1c1c1c1c?auto=format&fit=crop&w=400&q=80" },
      { name: "أم علي", price: "7$", image: "https://images.unsplash.com/photo-1622495890196-2a6dc2aef3cf?auto=format&fit=crop&w=400&q=80" },
      { name: "مهلبية", price: "5$", image: "https://images.unsplash.com/photo-1631040515443-9a5d60b702e4?auto=format&fit=crop&w=400&q=80" },
    ],
  },
  {
    title: "المشروبات الساخنة",
    items: [
      { name: "قهوة تركية", price: "4$", image: "https://images.unsplash.com/photo-1571689938777-d3a0c07e65ec?auto=format&fit=crop&w=400&q=80" },
      { name: "شاي أحمر", price: "2$", image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=400&q=80" },
      { name: "شاي بالنعناع", price: "3$", image: "https://images.unsplash.com/photo-1600891966111-4c1f1c1c1c1h?auto=format&fit=crop&w=400&q=80" },
      { name: "قهوة عربية", price: "5$", image: "https://images.unsplash.com/photo-1590080878951-66b67f36cf30?auto=format&fit=crop&w=400&q=80" },
    ],
  },
  {
    title: "المشروبات الباردة",
    items: [
      { name: "عصير برتقال", price: "3$", image: "https://images.unsplash.com/photo-1589927986089-35812386a49d?auto=format&fit=crop&w=400&q=80" },
      { name: "ليموناضة", price: "3$", image: "https://images.unsplash.com/photo-1561047029-3000e18e6a5e?auto=format&fit=crop&w=400&q=80" },
      { name: "عصير رمان", price: "4$", image: "https://images.unsplash.com/photo-1617196033907-6f9f3c1a3e7c?auto=format&fit=crop&w=400&q=80" },
      { name: "كوكاكولا", price: "2$", image: "https://images.unsplash.com/photo-1598511721593-22f5c54a5ff2?auto=format&fit=crop&w=400&q=80" },
    ],
  },
];


const VintageMenu: React.FC = () => {
  const flipBook = useRef<any>(null);

  return (
    <div
      className="flex flex-col items-center p-4 min-h-screen overflow-x-hidden overflow-y-hidden justify-center"
      style={{
        backgroundImage: `url(${table.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <HTMLFlipBook
        width={350}
        height={450}
        minWidth={300}
        maxWidth={600}
        minHeight={450}
        maxHeight={650}
        drawShadow={true}
        flippingTime={800}
        usePortrait={true}
        startPage={0}
        showCover={true}
        size="fixed"
        startZIndex={0}
        autoSize={true}
        maxShadowOpacity={0.4}
        mobileScrollSupport={true}
        className="my-flipbook"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
        ref={flipBook}
        clickEventForward={true}
        useMouseEvents={true}
        swipeDistance={0}
        showPageCorners={true}
        disableFlipByClick={false}
      >
        {/* الغلاف الأمامي */}
        <div className="page bg-[#fdf1e0] flex flex-col items-center justify-center border border-[#d2b48c] shadow-lg overflow-hidden">
       
          <section className="flex items-center justify-center">
          <Image
          src={restaurantlogo}
          alt="Restaurant Logo"
          className="mb-6 w-60 h-60 object-contain"
        />
        </section>
          <p className=" text-[#7b5e4d] text-3xl text-center">نكهات عربية أصيلة</p>
        </div>

        {/* صفحات المنيو */}
        {menuPages.map((page, idx) => (
          <div
            key={idx}
            className="page border border-[#d2b48c] shadow-md flex flex-col overflow-hidden bg-[#5a3e2b]"
            style={{
              width: "100%",
              maxWidth: "100%",
              boxSizing: "border-box",
              backgroundColor: "rgba(255,248,240,0.9)", // لإبراز النص على الخلفية
              backgroundImage: `url(${table.src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              padding: "10px",
            }}
          >
            <h2 className="text-xl font-bold mb-3 border-b pb-1 text-white px-2">
              {page.title}
            </h2>
            <div className="flex-1 overflow-y-auto px-2 py-1 space-y-3">
              {page.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center bg-[#fdf1e0] p-2 rounded-lg transition shadow-sm hover:shadow-md"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg mr-3 border border-[#d2b48c]"
                    style={{ maxWidth: "100%", flexShrink: 0 }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-[#5a3e2b] truncate">{item.name}</h3>
                    <p className="text-xs text-[#7b5e4d] truncate">{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* الغلاف الخلفي */}
        <div className="page bg-[#fdf1e0] flex items-center justify-center border border-[#d2b48c] shadow-lg overflow-hidden">
          <h2 className="text-xl font-bold text-[#5a3e2b] text-center">نتشرف بكم</h2>
        </div>
      </HTMLFlipBook>

      {/* أزرار التقليب */}
      <div className="flex justify-center mt-4 gap-4">
        <button
          onClick={() => flipBook.current?.pageFlip().flipPrev()}
          className="px-4 py-2 bg-[#5a3e2b] text-white rounded-lg shadow hover:bg-[#7b5e4d] transition"
        >
          السابق
        </button>
        <button
          onClick={() => flipBook.current?.pageFlip().flipNext()}
          className="px-4 py-2 bg-[#5a3e2b] text-white rounded-lg shadow hover:bg-[#7b5e4d] transition"
        >
          التالي
        </button>
      </div>
    </div>
  );
};

export default VintageMenu;
