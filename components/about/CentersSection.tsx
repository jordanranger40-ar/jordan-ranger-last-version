"use client"
interface Props {
  isArabic: boolean;
}

export default function CentersSection({ isArabic }: Props) {
  const lang = isArabic ? "ar" : "en";

  // Full original texts preserved exactly (cleaned for whitespace)
  const COPY = {
    en: {
      title: "Our Story",
      aboutHeading: "About Ranger Entrepreneurial Entities",
      about: `Entrepreneurial entities registered with the Ministry of Industry Trade & Supply and licensed according to Jordanian law, working to develop local communities.

Jordan Ranger is considered a SOCIAL ENTERPRISE and ECO-TOURISM entity. We seek to make a meaningful change by inspiring and educating individuals to lead boldly, serve generously, and act with compassion.

We offer an adventurous lifestyle that inspires people of all ages to stretch beyond their perceived abilities and reconnect with mother nature, helping them clear their minds, become more independent, flexible, and capable of generating new ideas and solutions.

We also provide a fully immersive natural experience for families, individuals, and organizations.`,
      includesLabel: "Jordan Ranger includes:",
      list: [
        "The Jordanian Adventure and Exploration Center",
        "Adventure and Challenge Forest Camp",
        "Eco-View Resort",
      ],
      centers: {
        center: {
          heading: "The Jordanian Adventure and Exploration Center",
          body: `was founded in 2006 in Amman-Jordan, it is a non-governmental training and educational institution that emphasize human development and life coaching to the participants, in addition to its interest in spreading the environmental knowledge, culture and conservation. Also it aims to build leadership skills and capacity building for the youth, to earn a courageous and challenging spirt that able to adventure and discover, as well as reinforcing the values of national belonging.`,
        },
        camp: {
          heading: "Adventure and Challenge Forest Camp",
          body: `was founded in 2012 in Kufr Khal-Jarash and opened in May 2014, it is a unique permanent camp and the first of its kind in Arab world. It is set up on 1400 square meters of land in the middle of a breathtaking forest, it contains a tent yard, health care facilities, showers, a kitchen, an outdoor restaurant court, parking area, interesting adventure fields, training yards, five-a-side soccer field, a bonfire yard and seats under the trees. It is prepared to accommodate more than 150 participants who like camping, hiking and adventure, they are also given the opportunity to carry out challenging and adventurous activities, overcome obstacles and training, as well as enjoy the beauty of nature. In 2020, a representative branch/office was established in Ajloun, which works on programs and activities that integrate tourists with local communities, it also works on employed the housewives and young men and women. Moreover, provide an optimal opportunity for women to participate in various events.`,
        },
        resort: {
          heading: "Eco-View Resort",
          body: `Founded in 2015 and opened in 2019 in Kufr Khal–Jarash, Jordan Ranger Resort offers a unique eco-experience through rustic treehouses set in the natural beauty of Jerash. The resort combines tourism, training, and environmental activities, focusing on life skills, teamwork, and personal development. Spanning 1,100 square meters, it includes 10 cabins accommodating up to 40 guests—eight treehouses and two stone lodges inspired by ancient Jordanian living. The resort features modern facilities, a luxury restaurant, training halls, parking, and is located next to Jordan Ranger Camp. It welcomes families, tourists, and organizations seeking nature, adventure, and meaningful experiences.`,
        },
      },
    },

    ar: {
      title: "قصتنا",
      aboutHeading: "عن كياننا",
      about: `كيانات ريادية مسجلة لدى وزارة الصناعة والتجارة والتموين ومرخصة وفقاً للقانون الأردني، تعمل على تطوير المجتمعات المحلية.

تُعد جوردان رينجر مؤسسة ذات أثر اجتماعي وسياحة بيئية، ونسعى إلى إحداث تغيير إيجابي من خلال الإلهام والتعليم، وتشجيع الأفراد على القيادة بشجاعة، والعطاء بسخاء، والعمل بروح من التعاطف.

نقدّم أسلوب حياة مليء بالمغامرة يلهم جميع الفئات العمرية لتجاوز حدودهم المتصورة، والتواصل مع الطبيعة الأم، مما يساعدهم على صفاء الذهن، وتعزيز الاستقلالية والمرونة في التفكير، والقدرة على ابتكار أفكار وحلول جديدة.

كما نعمل على توفير تجربة طبيعية فريدة ومتكاملة للعائلات، والأفراد، والمؤسسات.`,
      includesLabel: "تشمل جوردان رينجر:",
      list: [
        "المركز الأردني للمغامرة والاستكشاف",
        "مخيم غابة التحدي والمغامرة",
        "منتجع إيكو فيو",
      ],
      centers: {
        center: {
          heading: "مركز المغامرة والاستكشاف الأردني",
          body: `تم تأسيس جوردن رينجر في عام 2006 كمؤسسة تدريبية وتعليمية متخصصة في المهارات الحياتية والتنمية البشرية في مرتفعات ثغرة عصفور وهي من أجمل الغابات الخلابة في جرش. حيث يعتبر جوردن رينجر من أهم المنتجعات في الوطن العربي الذي يمكنك من خوض تجربة ممتعة ومنعشة في الطبيعة. وبعد مرور أكثر من 10 سنوات، يقدم منتجع جوردان رينجر لمرتاديه خدمات فندقية ونشاطات ترفيهية للشركات والأفراد وتمنحكم الحرية للتواصل مع جميع العناصر المحيطة بكم وإعادة ضبط أسلوب حياتكم. يوفر جوردن رينجر قاعات داخلية وخارجية لاجتماعات الشركات وبناء الأفرقة ومجموعة من النشاطات الخارجية كالتخييم و تسلق الأبراج و ركوب الخيل وألعاب التحدي و العبارة الهوائية والمزيد من النشاطات. بالاضافة الى المنامات المميزة والفريدة من نوعها والمأكولات بنكهة محلية ومنتجات طبيعية.`,
        },
        camp: {
          heading: "مخيم الغابة للمغامرات والتحديات",
          body: `تم تأسيس مخيم غابة التحدي والمغامرة عام 2012 في كفر خال – جرش، وافتُتح رسميًا في شهر أيار عام 2014، ليكون مخيمًا دائمًا وفريدًا من نوعه، وهو الأول من هذا النوع في العالم العربي.
يقع المخيم على مساحة تبلغ 1400 متر مربع في قلب غابة طبيعية خلابة تخطف الأنظار.

يضم المخيم ساحة مخصصة للخيام، ومرافق رعاية صحية، وحمّامات، ومطبخًا، وساحة مطعم خارجي، ومواقف للسيارات، ومناطق متنوعة للأنشطة والمغامرات، وساحات تدريب، وملعب كرة قدم خماسي، وساحة للنيران المسائية، إضافة إلى أماكن جلوس مريحة تحت الأشجار.

تم تجهيز المخيم لاستيعاب أكثر من 150 مشاركًا من محبي التخييم والمشي والمغامرات، حيث يوفر أنشطة مليئة بالتحدي، وتجاوز العقبات، والتدريب، مع الاستمتاع بجمال الطبيعة المحيطة.
في عام 2020، تم إنشاء فرع في عجلون لدعم برامج تدمج السياح مع المجتمعات المحلية...`,
        },
        resort: {
          heading: "منتجع إيكو فيو",
          body: `تأسس منتجع Jordan Ranger عام 2015 وافتُتح رسميًا في عام 2019 في منطقة كفر خال – جرش، ليقدّم تجربة سياحية بيئية فريدة من نوعها من خلال بيوت شجر مصممة بطابع ريفي يعكس جمال طبيعة جرش الخلابة. يجمع المنتجع بين السياحة والترفيه والتدريب البيئي، مع تركيز خاص على تنمية المهارات الحياتية، والعمل الجماعي، وبناء الشخصية.
يمتد المنتجع على مساحة 1100 متر مربع، ويضم 10 وحدات سكنية بسعة تصل إلى 40 شخصًا، تشمل 8 بيوت شجر ووحدتين حجريتين مستوحيتين من البيئة الأردنية القديمة وحياة الكهوف. كما يحتوي على مرافق صحية متكاملة، ومطعم سياحي فاخر، وقاعات تدريب متعددة الاستخدامات، ومواقف للسيارات، ويقع بجوار Jordan Ranger Camp. يستقبل المنتجع العائلات والأفراد والسياح، بالإضافة إلى المؤسسات المحلية والدولية التي تشترك في حب الطبيعة والمغامرة، ويهدف إلى توفير تجارب ملهمة تساعد الزوار على تحقيق أهدافهم الشخصية والاستمتاع بروح التحدي والاكتشاف.`,
        },
      },
    },
  } as const;

  const t = COPY[lang as "en" | "ar"];

  return (
    <section className="max-w-6xl mx-auto px-6 py-24" dir={isArabic ? "rtl" : "ltr"}>
      <h2 className="text-5xl font-extrabold text-[#515151] text-center mb-16">{t.title}</h2>

      <div className={`grid grid-cols-1 md:grid-cols-2 gap-16 text-lg ${
        isArabic ? "text-gray-700 dark:text-gray-300 text-right" : "text-gray-700 dark:text-gray-300 text-left"
      }`}>
        <div className="col-span-2 space-y-4">
          <h3 className="text-2xl font-bold text-[#b3c820]">{t.aboutHeading}</h3>

          <p className="text-base leading-relaxed text-gray-700 whitespace-pre-line">{t.about}</p>

          <div>
            <p className="font-semibold text-gray-800 mb-2">{t.includesLabel}</p>

            <ol className={`list-decimal ${isArabic ? "pr-6 text-right" : "pl-6 text-left"} space-y-1 text-gray-700`}>
              {t.list.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ol>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-[#b3c820] mb-4">{t.centers.center.heading}</h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{t.centers.center.body}</p>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-[#b3c820] mb-4">{t.centers.camp.heading}</h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{t.centers.camp.body}</p>
        </div>

        <div className="col-span-2 space-y-4">
          <h3 className="text-2xl font-bold text-[#b3c820] mb-4">{t.centers.resort.heading}</h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{t.centers.resort.body}</p>
        </div>
      </div>

      <style jsx>{`
        /* Minor RTL tweak to keep ordered list numbers aligned */
        :global([dir=\"rtl\"]) ol {
          direction: rtl;
        }
      `}</style>
    </section>
  );
}
