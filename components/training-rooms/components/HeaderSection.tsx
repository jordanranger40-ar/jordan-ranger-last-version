import React from "react";
import { BookOpen } from "lucide-react";

interface Props {
  isArabic: boolean;
}

function HeaderSection({ isArabic }: Props) {
  return (
    <div className="mt-16 mb-10 flex flex-col items-center justify-center">
      <BookOpen width={50} height={50} color="#676e32" />
      <h1 className="text-lg md:text-3xl text-justify text-gray-700 ">
        {" "}
        {isArabic ? "قاعات التدريب" : "Training Rooms"}
      </h1>
      <p className="text-sm md:text-lg text-justify text-gray-500 w-[60%] mt-2 ">
        {" "}
        {isArabic
          ? `لوريم إيبسوم ألم سيت أميت كونسيكتيتور أديبيسينج إليت. لطف، أميت!
لماذا لا تتشابه هذه الضرورات الجسدية، سأشرح طرقًا حكيمة لتجنب الأخطاء المتسرعة
باستثناء إيلو؟ لأن المتعة تُقال إنها آلام. اللذة تُعيق الحكمة نفسها التي نقود بها، ولا تحتقر ولا تُولد معظم الحوادث الألم، والآلام ليست مجرد بعض المكاتب الصغيرة أو الكبيرة التي تُحل إيلو!`
          : `Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia, amet!
        Unde similique numquam tempora a aliquid harum totam perspiciatis
        corporis necessitatibus, explicabo modi sapiente ab expedita culpa sunt
        excepturi illo? Enim quidem voluptas dicta doloribus. Deleniti placeat
        impedit sapiente ipsum ducimus, aspernatur neque maxime incidunt
        pariatur dolore sunt cumque dolores iusto non aliquam quae minus vel
        magni officia soluta illo!`}
      </p>
    </div>
  );
}

export default HeaderSection;
