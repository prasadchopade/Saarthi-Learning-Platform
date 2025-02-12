import { motion } from 'framer-motion';
import creator from "../../assets/landingPage/creator.webp";
import notebook from "../../assets/landingPage/notebook.webp";
import chatbot from "../../assets/landingPage/chatbot.webp";
import roadmap from "../../assets/landingPage/roadmap.webp";

const Features = () => {
  const features = [
    {
      headline: "Generate the right lectures!",
      solution: "Create personalized video lectures on any topic tailored to your learning goals.",
      image: creator,
    },
    {
      headline: "Create your own Roadmaps!",
      solution: "Create personalized learning roadmaps for your exams, projects, hobbies, certifications and more.",
      image: roadmap,
    },
    {
      headline: "Create notes with AI!",
      solution: "Generate personalized notes from your favourite lectures with just one click. Add diagrams, code snippets and more to your notes.",
      image: notebook,
    },  
    {
      headline: "Ask your doubts!",
      solution: "Get instant answers, quizzes and more resources while learning from your favourite lectures.",
      image: chatbot,
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-100 to-gray-50 sm:py-24 md:py-32 bg-white overflow-hidden relative">
      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 sm:mb-20 md:mb-24 lg:mb-32"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 font-['Manrope'] leading-tight tracking-tight">
            Look into our Imagination
          </h2>
          <p className="mt-4 sm:mt-6 md:mt-8 max-w-xl sm:max-w-2xl md:max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed font-['Inter'] font-light px-4">
            We've reimagined what learning can be. No more generic courses, no more one-size-fits-all approaches. 
            Just intelligent, personalized education that actually works.
          </p>
        </motion.div>

        {/* Features */}
        <div className="space-y-32 sm:space-y-40 md:space-y-48">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="relative"
            >
              
              <div className={`flex flex-col lg:flex-row items-center gap-12 md:gap-16 lg:gap-28 lg:flex-row-reverse `}>
                <div className="w-full md:w-4/5 lg:w-3/5 relative group">
                  <div className="relative rounded-md transform scale-125 md:scale-140 lg:scale-150 transition-all duration-500 overflow-hidden shadow-xl">
                    <img
                      src={feature.image}
                      alt={feature.headline}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    /> 
                  </div>
                </div>

                {/* Content Section */}
                <div className="w-full lg:w-2/5 px-4 mr-6 md:px-8 lg:px-12 mt-8 lg:mt-0">
                  <div className="max-w-md mx-auto lg:mx-0">
                    {/* Headline */}
                    <h3 className="text-2xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 font-['Poppins'] leading-tight">
                      {feature.headline}
                    </h3>
                    
                    {/* Solution - minimized */}
                    <p className="text-sm md:text-base text-gray-700 leading-relaxed font-['Inter']">
                      {feature.solution}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;