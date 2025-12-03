import React from "react";

interface Props {
  isArabic: boolean;
}

export default function CentersSection({ isArabic }: Props) {
  return (
    <section
      className="max-w-6xl mx-auto px-6 py-24"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <h2 className={`text-5xl font-extrabold text-[#515151] text-center mb-16`}>
        {isArabic ? "قصتنا" : "Our Story"}
      </h2>

      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-16 text-lg leading-relaxed ${
          isArabic
            ? "text-gray-700 dark:text-gray-300 text-right"
            : "text-gray-700 dark:text-gray-300 text-left"
        }`}
      >
        <div>
          <h3 className="text-2xl font-bold text-[#b3c820] mb-4">
            {isArabic ? "عن كياننا" : "About Ranger Entrepreneurial Entities"}
          </h3>
          <p>
            {isArabic
              ? "كيانات مسجلة في وزارة الصناعة والتجارة والتموين ومرخصة وفقاً للقانون الأردني، تعمل على تطوير المجتمعات المحلية..."
              : "Entrepreneurial entities registered in the Ministry of Industry Trade & Supply and licensed according to Jordanian law..."}
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-[#b3c820] mb-4">
            {isArabic ? "مراكزنا ومخيماتنا" : "Our Centers and Camps"}
          </h3>
          <p>
            {isArabic
              ? "تضم كيان الأردن رانجر ثلاثة مكونات رئيسية: مركز المغامرة والاستكشاف الأردني، مخيم الغابة للمغامرات والتحديات، ومنتجع إيكو فيو..."
              : "Jordan Ranger includes three main components: The Jordanian Adventure and Exploration Center, Adventure and Challenge Forest Camp, and Eco-View Resort..."}
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-[#b3c820] mb-4">
            {isArabic
              ? "مركز المغامرة والاستكشاف الأردني"
              : "The Jordanian Adventure and Exploration Center"}
          </h3>
          <p>
            {isArabic
              ? "تأسس عام 2006 في عمّان، وهو مؤسسة غير حكومية للتدريب والتعليم تركز على تطوير الإنسان والتوجيه الحياتي..."
              : "Founded in 2006 in Amman, it is a non-governmental training and educational institution emphasizing human development..."}
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-[#b3c820] mb-4">
            {isArabic ? "مخيم الغابة للمغامرات والتحديات" : "Adventure and Challenge Forest Camp"}
          </h3>
          <p>
            {isArabic
              ? "تأسس عام 2012 في كفر خل/جرش، وهو أول مخيم دائم من نوعه في العالم العربي..."
              : "Founded in 2012 in Kufr Khal-Jarash, it is the first permanent camp of its kind in the Arab world..."}
          </p>
          <p>
            {isArabic
              ? "في عام 2020، تم إنشاء فرع في عجلون لدعم برامج تدمج السياح مع المجتمعات المحلية..."
              : "In 2020, a branch was established in Ajloun to support programs integrating tourists with local communities..."}
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-[#b3c820] mb-4">
            {isArabic ? "منتجع إيكو فيو" : "Eco-View Resort"}
          </h3>
          <p>
            {isArabic
              ? "تأسس عام 2015 في كفر خل/جرش وافتتح في ديسمبر 2019، يقدم تجربة العيش في بيوت الأشجار المصممة لتعكس جمال طبيعة جرش..."
              : "Founded in 2015 in Kufr Khal-Jarash and opened in December 2019, it offers treehouse living experiences showcasing the beauty of Jarash nature..."}
          </p>
          <p>
            {isArabic
              ? "يعد المنتجع وجهة سياحية مثالية للعائلات والأفراد والمنظمات المحلية والدولية..."
              : "The resort is a perfect tourist destination for families, individuals, and local and international organizations..."}
          </p>
        </div>
      </div>
    </section>
  );
}
