import { FaBullseye, FaEye, FaHeart } from "react-icons/fa";

const items = [
  {
    title: "Our Mission",
    icon: <FaBullseye className="text-white text-3xl" />,
    description:
      "To empower organizations and communities with insights that foster informed decision-making and promote positive societal impact.",
    from: "from-[#125892]",
    to: "to-[#1F6AA5]",
    center: false,
  },
  {
    title: "Our Vision",
    icon: <FaEye className="text-white text-3xl" />,
    description:
      "To drive sustainable change in development and humanitarian efforts through actionable insights from data.",
    from: "from-[#0A3556]",
    to: "to-[#0F4C75]",
    center: true,
  },
  {
    title: "Our Values",
    icon: <FaHeart className="text-white text-3xl" />,
    description:
      "We emphasize evidence-based practices, integrity, inclusiveness, and continuous learning to ensure impact and effectiveness.",
    from: "from-[#1B4F72]",
    to: "to-[#2E86C1]",
    center: false,
  },
];

export default function MissionVisionValues() {
  return (
    <section className="py-20 px-6 md:px-12 bg-gray-50 w-full">
      <h2 className="text-4xl font-bold text-center text-[#125892] mb-16">
        Mission, Vision & Values
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {items.map((item, index) => (
          <div
            key={index}
            className={`p-8 rounded-xl bg-gradient-to-br ${item.from} ${item.to} text-white shadow-xl transform transition duration-300
              flex flex-col items-center text-center cursor-pointer
              ${
                item.center
                  ? "md:scale-105 md:-translate-y-4 z-10 hover:scale-110 hover:shadow-2xl"
                  : "hover:scale-105 hover:shadow-xl"
              }`}
          >
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white/20 mb-4">
              {item.icon}
            </div>
            <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
            <p className="text-sm sm:text-base leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
