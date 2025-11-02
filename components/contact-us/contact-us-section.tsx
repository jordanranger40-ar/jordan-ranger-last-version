import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

type Props = {
  isArabic?: boolean;
};

export default function ContactUsSection({ isArabic }: Props) {
  return (
    <section
      id="contact"
      className="bg-[#0f172a] text-white py-16 px-6 md:px-12 lg:px-24 w-full "
    >
      <h2 className="text-center text-4xl font-bold mb-12">
        {isArabic ? "اتصل بنا" : "Contact Us"}
      </h2>

      <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* 📨 نموذج التواصل */}
        <form className="bg-[#1e293b] p-8 rounded-lg shadow-lg space-y-6">
          <div>
            <label className="block mb-2 font-semibold">
              {isArabic ? "الاسم الكامل" : "Full Name"}
            </label>
            <input
              type="text"
              className="w-full p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={isArabic ? "اكتب اسمك الكامل" : "Enter your full name"}
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">
              {isArabic ? "البريد الإلكتروني" : "Email Address"}
            </label>
            <input
              type="email"
              className="w-full p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={isArabic ? "اكتب بريدك الإلكتروني" : "Enter your email"}
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">
              {isArabic ? "الرسالة" : "Message"}
            </label>
            <textarea
              rows={5}
              className="w-full p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={isArabic ? "اكتب رسالتك هنا..." : "Write your message here..."}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 w-full py-3 rounded font-semibold transition"
          >
            {isArabic ? "إرسال" : "Send Message"}
          </button>
        </form>

        {/* 📞 معلومات التواصل */}
        <div className="space-y-8 flex flex-col justify-center">
          <div className="flex items-center gap-4">
            <FaPhoneAlt className="text-blue-500 text-2xl" />
            <span className="text-lg">+971 50 123 4567</span>
          </div>

          <div className="flex items-center gap-4">
            <FaEnvelope className="text-blue-500 text-2xl" />
            <span className="text-lg">info@yourcompany.com</span>
          </div>

          <div className="flex items-center gap-4">
            <FaMapMarkerAlt className="text-blue-500 text-2xl" />
            <span className="text-lg">
              {isArabic ? "دبي، الإمارات العربية المتحدة" : "Dubai, UAE"}
            </span>
          </div>

          {/* 🌐 روابط السوشيال ميديا */}
          <div className="flex items-center gap-6 mt-8">
            <a href="https://facebook.com" target="_blank" className="hover:text-blue-500 text-2xl">
              <FaFacebook />
            </a>
            <a href="https://instagram.com" target="_blank" className="hover:text-pink-500 text-2xl">
              <FaInstagram />
            </a>
            <a href="https://twitter.com" target="_blank" className="hover:text-sky-400 text-2xl">
              <FaTwitter />
            </a>
            <a href="https://linkedin.com" target="_blank" className="hover:text-blue-400 text-2xl">
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
