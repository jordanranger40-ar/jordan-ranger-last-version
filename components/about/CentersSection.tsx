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
        className={`grid grid-cols-1 md:grid-cols-2 gap-16 text-lg  ${
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

        <div className="col-span-2">
          <h3 className="text-2xl font-bold text-[#b3c820] mb-4">
            {isArabic ? "منتجع إيكو فيو" : "Eco-View Resort"}
          </h3>
          <p >
            {isArabic
            ?"تأسس منتجع Jordan Ranger عام 2015 وافتُتح رسميًا في عام 2019 في منطقة كفر خال – جرش، ليقدّم تجربة سياحية بيئية فريدة من نوعها من خلال بيوت شجر مصممة بطابع ريفي يعكس جمال طبيعة جرش الخلابة. يجمع المنتجع بين السياحة والترفيه والتدريب البيئي، مع تركيز خاص على تنمية المهارات الحياتية، والعمل الجماعي، وبناء الشخصية.يمتد المنتجع على مساحة 1100 متر مربع، ويضم 10 وحدات سكنية بسعة تصل إلى 40 شخصًا، تشمل 8 بيوت شجر ووحدتين حجريتين مستوحيتين من البيئة الأردنية القديمة وحياة الكهوف. كما يحتوي على مرافق صحية متكاملة، ومطعم سياحي فاخر، وقاعات تدريب متعددة الاستخدامات، ومواقف للسيارات، ويقع بجوار Jordan Ranger Camp. يستقبل المنتجع العائلات والأفراد والسياح، بالإضافة إلى المؤسسات المحلية والدولية التي تشترك في حب الطبيعة والمغامرة، ويهدف إلى توفير تجارب ملهمة تساعد الزوار على تحقيق أهدافهم الشخصية والاستمتاع بروح التحدي والاكتشاف."
              : "Founded in 2015 and opened in 2019 in Kufr Khal–Jarash, Jordan Ranger Resort offers a unique eco-experience through rustic treehouses set in the natural beauty of Jerash. The resort combines tourism, training, and environmental activities, focusing on life skills, teamwork, and personal development. Spanning 1,100 square meters, it includes 10 cabins accommodating up to 40 guests—eight treehouses and two stone lodges inspired by ancient Jordanian living. The resort features modern facilities, a luxury restaurant, training halls, parking, and is located next to Jordan Ranger Camp. It welcomes families, tourists, and organizations seeking nature, adventure, and meaningful experiences."}
          </p>
         
        </div>
      </div>
    </section>
  );
}
