"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { createContactSchema } from "./schema/emailSchema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Mail, Phone, Loader2 } from "lucide-react"; 
import DarkButton from "../ui/dark-button";

type EmailFormValues = z.infer<ReturnType<typeof createContactSchema>>;

interface Props {
  locale: "en" | "ar";
  action: (
    data: EmailFormValues,
  ) => Promise<{ success: boolean; message: string }>;
}

const ContactSection = ({ locale, action }: Props) => {
  const isRtl = locale === "ar";
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailFormValues>({
    resolver: zodResolver(createContactSchema(locale)),
  });

  const onSubmit: SubmitHandler<EmailFormValues> = async (data) => {
    try {
      const result = await action(data);
      if (result.success) {
        toast.success(result.message);
        router.replace("/");
        return;
      }
      toast.error(result.message);
    } catch (error) {
      toast.error(
        locale === "en" ? "Error sending email" : "خطأ في إرسال البريد",
      );
    }
  };

  // Translations object for UI elements
  const t = {
    title: isRtl ? "تواصل معنا" : "Contact Us",
    name: isRtl ? "الاسم" : "Name",
    email: isRtl ? "البريد الإلكتروني" : "Email",
    subject: isRtl ? "الموضوع" : "Subject",
    message: isRtl ? "الرسالة" : "Message",
    send: isRtl ? "إرسال" : "Send",
    sending: isRtl ? "جاري الإرسال..." : "Sending...",
    contactInfo: isRtl ? "معلومات الاتصال" : "Contact Information",
  };

  const phoneNumber1= process.env.NEXT_PUBLIC_PHONE_NUMBER1
  const phoneNumber2= process.env.NEXT_PUBLIC_PHONE_NUMBER2
  const contactEmail= process.env.NEXT_PUBLIC_CONTACT_EMAIL



  return (
    <div
      className="container my-24 mx-auto px-4 md:px-6"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <section className="mb-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#515151] inline-block relative after:content-[''] after:absolute after:-bottom-4 after:left-1/2 after:-translate-x-1/2 after:w-16 after:h-1 after:bg-[#676e32]">
            {t.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Form Side */}
          <form
            className="lg:col-span-5 bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label
                  className="block font-semibold mb-1.5 text-[#676e32] text-sm"
                  htmlFor="name"
                >
                  {t.name}
                </label>
                <input
                  {...register("name")}
                  type="text"
                  className={`w-full px-4 py-3 rounded-lg border bg-[#f5f5f5] text-[#515151] outline-none transition-all focus:ring-2 focus:ring-[#676e32]/20 focus:border-[#676e32] ${errors.name ? "border-red-500" : "border-transparent"}`}
                  placeholder={t.name}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  className="block font-semibold mb-1.5 text-[#676e32] text-sm"
                  htmlFor="email"
                >
                  {t.email}
                </label>
                <input
                  {...register("email")}
                  type="email"
                  className={`w-full px-4 py-3 rounded-lg border bg-[#f5f5f5] text-[#515151] outline-none transition-all focus:ring-2 focus:ring-[#676e32]/20 focus:border-[#676e32] ${errors.email ? "border-red-500" : "border-transparent"}`}
                  placeholder="example@mail.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Subject */}
              <div>
                <label
                  className="block font-semibold mb-1.5 text-[#676e32] text-sm"
                  htmlFor="subject"
                >
                  {t.subject}
                </label>
                <input
                  {...register("subject")}
                  type="text"
                  className={`w-full px-4 py-3 rounded-lg border bg-[#f5f5f5] text-[#515151] outline-none transition-all focus:ring-2 focus:ring-[#676e32]/20 focus:border-[#676e32] ${errors.subject ? "border-red-500" : "border-transparent"}`}
                  placeholder={t.subject}
                />
                {errors.subject && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.subject.message}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label
                  className="block font-semibold mb-1.5 text-[#676e32] text-sm"
                  htmlFor="message"
                >
                  {t.message}
                </label>
                <textarea
                  {...register("message")}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-lg border bg-[#f5f5f5] text-[#515151] outline-none transition-all focus:ring-2 focus:ring-[#676e32]/20 focus:border-[#676e32] resize-none ${errors.message ? "border-red-500" : "border-transparent"}`}
                ></textarea>
                {errors.message && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <DarkButton disabled={isSubmitting} type="submit" className="w-full">
                {isSubmitting ? (
                  <span className="flex flex-row justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t.sending}
                  </span>
                ) : (
                  t.send
                )}
              </DarkButton>
            </div>
          </form>

          {/* Info Side */}
          <div className="lg:col-span-7 flex flex-col justify-center  lg:pl-12">
            <h3 className="text-2xl font-bold text-[#515151] mb-8">
              {t.contactInfo}
            </h3>

            <div className="grid gap-8 sm:grid-cols-2">
              

              {/* Phone Info */}
              <div className="flex items-start gap-4">
                <div className="bg-[#676e32]/10 p-3 rounded-xl text-[#676e32]">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-[#515151] mb-1">
                    {isRtl ? "رقم هاتف الحجوزات" : "Reservation Phone Number"}
                  </h4>
                  <div className="flex flex-col gap-1">
                    <a
                      href={`tel:${phoneNumber1}`}
                      className="text-[#676e32] hover:underline hover:text-[#515151] transition-colors font-medium block"
                      dir="ltr"
                    >
                      {phoneNumber1}
                    </a>
                    
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-[#676e32]/10 p-3 rounded-xl text-[#676e32]">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-[#515151] mb-1">
                    {isRtl ? " رقم هاتف الإدارة" : "Adminstration Phone Number"}
                  </h4>
                  <div className="flex flex-col gap-1">
                    
                    <a
                      href={`tel:${phoneNumber2}`}
                      className="text-[#676e32] hover:underline hover:text-[#515151] transition-colors font-medium block"
                      dir="ltr"
                    >
                      {phoneNumber2}
                    </a>
                  </div>
                </div>
              </div>
              {/* Email Info */}
              <div className="flex items-start gap-4">
                <div className="bg-[#676e32]/10 p-3 rounded-xl text-[#676e32]">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-[#515151] mb-1">{t.email}</h4>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="text-[#676e32] hover:underline hover:text-[#515151] transition-colors font-medium block"
                  >
                    {contactEmail}
                  </a>
                </div>
              </div>
            </div>

            {/* Feedback Note */}
            <div className="mt-12 p-6 bg-[#f5f5f5] rounded-2xl border-l-4 border-[#676e32] ">
              <p className="text-[#515151] italic text-sm leading-relaxed">
                {isRtl
                  ? "نحن نرد عادةً خلال 24 ساعة عمل. يسعدنا سماع صوتك!"
                  : "We usually respond within 24 business hours. Looking forward to hearing from you!"}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactSection;
