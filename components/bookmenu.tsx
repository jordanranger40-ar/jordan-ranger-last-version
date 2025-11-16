import React, { useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import table from "@/public/images/table.jpg";
import restaurantlogo from "@/public/images/restaurantlogo.png";
import Image from "next/image";
interface FlipBookMethods {
  pageFlip: () => {
    flipNext: () => void;
    flipPrev: () => void;
  };
}
interface MenuItem {
  name: string;
  price: string;
  image: string;
}

interface MenuPage {
  title: string;
  items: MenuItem[];
  itemsPerPage: number;
}

const menuPages: MenuPage[] = [
  {
    title: "المقبلات",
    itemsPerPage: 3,
    items: [
      {
        name: "حمص",
        price: "5$",
        image:
          "https://images.unsplash.com/photo-1600891964312-0540c9a0d47b?auto=format&fit=crop&w=400&q=80",
      },
      {
        name: "تبولة",
        price: "6$",
        image:
          "https://cdn.pixabay.com/photo/2017/10/19/20/55/tabbouleh-2873251_1280.jpg",
      },
      {
        name: "ورق عنب",
        price: "7$",
        image:
          "https://cdn.pixabay.com/photo/2015/03/26/10/04/grape-leaves-690082_1280.jpg",
      },
      {
        name: "متبل",
        price: "5$",
        image:
          "https://cdn.pixabay.com/photo/2016/03/05/19/02/moutabal-1238671_1280.jpg",
      },
    ],
  },
  {
    title: "الأطباق الرئيسية",
    itemsPerPage: 2,
    items: [
      {
        name: "كباب لحم",
        price: "12$",
        image:
          "https://images.unsplash.com/photo-1600891964711-c5f54c7c1c5c?auto=format&fit=crop&w=400&q=80",
      },
      {
        name: "شاورما دجاج",
        price: "10$",
        image:
          "https://images.unsplash.com/photo-1617196033900-cdc3a1b218f2?auto=format&fit=crop&w=400&q=80",
      },
      {
        name: "مسخن فلسطيني",
        price: "14$",
        image:
          "https://images.unsplash.com/photo-1598511721593-22f5c54a5ff2?auto=format&fit=crop&w=400&q=80",
      },
      {
        name: "فتة حمص",
        price: "11$",
        image:
          "https://images.unsplash.com/photo-1617196033910-abc1b2c3d4e5?auto=format&fit=crop&w=400&q=80",
      },
    ],
  },
  {
    title: "الحلويات",
    itemsPerPage: 6,
    items: [
      {
        name: "كنافة",
        price: "6$",
        image:
          "https://images.pexels.com/photos/31484420/pexels-photo-31484420.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        name: "بقلاوة",
        price: "5$",
        image:
          "https://images.unsplash.com/photo-1600891965611-1c1f1c1c1c1c?auto=format&fit=crop&w=400&q=80",
      },
      {
        name: "أم علي",
        price: "7$",
        image:
          "https://images.unsplash.com/photo-1622495890196-2a6dc2aef3cf?auto=format&fit=crop&w=400&q=80",
      },
      {
        name: "مهلبية",
        price: "5$",
        image:
          "https://images.unsplash.com/photo-1631040515443-9a5d60b702e4?auto=format&fit=crop&w=400&q=80",
      },
      {
        name: "مهلبية",
        price: "5$",
        image:
          "https://images.unsplash.com/photo-1631040515443-9a5d60b702e4?auto=format&fit=crop&w=400&q=80",
      },
      {
        name: "مهلبية",
        price: "5$",
        image:
          "https://images.unsplash.com/photo-1631040515443-9a5d60b702e4?auto=format&fit=crop&w=400&q=80",
      },
    ],
  },
];

// تقسيم العناصر إلى صفحات حسب itemsPerPage
const splitItemsIntoPages = (menu: MenuPage) => {
  const pages = [];
  for (let i = 0; i < menu.items.length; i += menu.itemsPerPage) {
    pages.push({
      title: menu.title,
      items: menu.items.slice(i, i + menu.itemsPerPage),
    });
  }
  return pages;
};

const VintageMenu: React.FC = () => {
  // استخدام any لتجنب مشكلة TypeScript مع MemoExoticComponent
  const flipBook = useRef<FlipBookMethods>(null);

  const allPages = menuPages.flatMap(splitItemsIntoPages);

  // إذا كان عدد الصفحات فردي، أضف صفحة فارغة لضمان توازن الغلاف النهائي
  if (allPages.length % 2 !== 0) {
    allPages.push({ title: "", items: [] });
  }

  return (
    <div
      className="flex flex-col items-center p-4 min-h-screen overflow-hidden justify-center"
      style={{
        backgroundImage: `url(${table.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <HTMLFlipBook
        width={350}
        height={450}
        minWidth={300}
        maxWidth={600}
        minHeight={450}
        maxHeight={650}
        drawShadow
        flippingTime={800}
        usePortrait
        startPage={0}
        showCover
        size="fixed"
        startZIndex={0}
        autoSize
        maxShadowOpacity={0.4}
        mobileScrollSupport
        className="my-flipbook"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
        ref={flipBook}
        clickEventForward
        useMouseEvents
        swipeDistance={30}
        showPageCorners
        disableFlipByClick={false} // <-- أضفت هذه الخاصية
      >
        {/* الغلاف الأول */}
        <div className="page bg-[#fdf1e0] flex flex-col items-center justify-center border border-[#d2b48c] shadow-lg overflow-hidden">
          <Image
            src={restaurantlogo}
            alt="Restaurant Logo"
            className="mb-6 w-48 h-48 object-contain justify-self-center"
          />
          <p className="text-[#7b5e4d] text-3xl text-center">
            نكهات عربية أصيلة
          </p>
        </div>

        {/* صفحات المنيو */}
        {allPages.map((page, idx) => (
          <div
            key={idx}
            className="page border-2 border-[#d2b48c] shadow-md flex flex-col overflow-hidden bg-white p-2"
          >
            {page.title && (
              <h2 className="text-xl font-bold mb-2 border-b pb-1 text-[#5a3e2b] px-2">
                {page.title}
              </h2>
            )}
            <div className="flex-1 flex flex-col gap-2 overflow-y-auto px-1 py-1">
              {page.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center p-2 rounded-lg transition shadow-sm hover:shadow-md flex-wrap bg-[#fdf1e0]"
                  style={{
                    fontSize: `${Math.max(12, 16 - page.items.length)}px`,
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg mr-3 border border-[#d2b48c] flex-shrink-0"
                    style={{
                      maxWidth: "100%",
                      maxHeight: `${Math.max(
                        40,
                        100 - page.items.length * 10
                      )}px`,
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#5a3e2b] truncate">
                      {item.name}
                    </h3>
                    <p className="text-[#7b5e4d] truncate">{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* الغلاف النهائي */}
        <div className="page bg-[#fdf1e0] flex items-center justify-center border border-[#d2b48c] shadow-lg overflow-hidden">
          <h2 className="text-xl font-bold text-[#5a3e2b] text-center">
            نتشرف بكم
          </h2>
        </div>
      </HTMLFlipBook>

      {/* أزرار التنقل */}
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
