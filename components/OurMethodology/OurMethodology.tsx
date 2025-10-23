export default function OurMethodology() {
    const items = [
      {
        title: "What We Stand For",
        text: "We are committed to getting you where you need to go and we’ll be with you every step of the way.",
      },
      {
        title: "What We Value",
        text: "We believe success comes from working together to do good work and serve those around us.",
      },
      {
        title: "Why We’re Here",
        text: "We’re deeply committed to everything we do and it shows in the events we host, causes we support and awards we win.",
      },
    ];
  
    return (
      <section className="relative w-full bg-[#125892] sm:h-[90vh] mb-60 mt-20 flex flex-col justify-center items-center py-20 sm:py-40">
        <div className="relative md:top-[20vh] w-[90%] sm:w-[85%] md:w-[80%] bg-gray-200 rounded-2xl shadow-black shadow-2xl flex flex-col justify-center items-center p-6 sm:p-10">
          <h1 className="text-center text-2xl sm:text-3xl md:text-5xl font-bold font-poppins text-[#125892] mb-4 sm:mb-6">
            Our Methodology
          </h1>
  
          <p className="text-center text-base sm:text-lg md:text-xl mb-6 sm:mb-8">
            We combine evidence-based insights with innovative solutions to drive
            meaningful, sustainable impact through collaboration and adaptability.
          </p>
  
          <div className="border-t border-black w-full my-6" />
  
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 w-full">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex flex-col justify-center items-center text-center"
              >
                <div className="font-bold text-xl sm:text-2xl mb-2 sm:mb-4 text-[#125892]">
                  {item.title}
                </div>
                <div className="w-[90%] sm:w-[75%] text-sm sm:text-base">{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  