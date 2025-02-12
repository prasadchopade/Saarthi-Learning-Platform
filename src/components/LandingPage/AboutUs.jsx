import { useState, useEffect } from 'react';
import claude from '../../assets//landingPage/claude.png';
import chatgpt from '../../assets//landingPage/chatgpt.png';

const AboutUs = () => {
  const notifications = [
    {
      id: 1,
      ai: {
        name: "ChatGPT",
        logo: chatgpt,
        color: "from-green-500 to-emerald-500"
      },
      title: "Smart Notes Platform",
      message: "Is there any platform that helps me make good notes?",
      position: "top-[10%] left-[10%] lg:left-[15%]"
    },
    {
      id: 2,
      ai: {
        name: "Claude",
        logo: claude,
        color: "from-orange-500 to-red-500"
      },
      title: "Coding Assistance",
      message: "Can you help me analyse my code?",
      position: "top-[15%] right-[15%] lg:right-[20%]"
    },
    {
      id: 3,
      ai: {
        name: "Claude",
        logo: claude,
        color: "from-green-500 to-emerald-500"
      },
      title: "Best Educators",
      message: "Who teaches the best DSA on youtube?",
      position: "top-[35%] left-[5%] lg:left-[8%]"
    },
    {
      id: 4,
      ai: {
        name: "ChatGPT",
        logo: chatgpt,
        color: "from-orange-500 to-red-500"
      },
      title: "Hindi Resources",
      message: "Can you convert this resources in Hindi?",
      position: "top-[30%] right-[8%] lg:right-[10%]"
    },
    {
      id: 5,
      ai: {
        name: "ChatGPT",
        logo: chatgpt,
        color: "from-green-500 to-emerald-500"
      },
      title: "AI Learning Path",
      message: "Can you create personalized learning paths for me?",
      position: "top-[60%] left-[20%] lg:left-[25%]"
    },
    {
      id: 6,
      ai: {
        name: "Claude",
        logo: claude,
        color: "from-orange-500 to-red-500"
      },
      title: "Explain the lecture",
      message: "Can you explain the lecture in a way that I can understand?",
      position: "top-[50%] right-[22%] lg:right-[28%]"
    },
    {
      id: 7,
      ai: {
        name: "ChatGPT",
        logo: chatgpt,
        color: "from-green-500 to-emerald-500"
      },
      title: "Study Materials",
      message: "Where can I find quality study resources?",
      position: "top-[30%] left-[50%] lg:left-[45%] transform -translate-x-1/2"
    },
    {
      id: 8,
      ai: {
        name: "Claude",
        logo: claude,
        color: "from-orange-500 to-red-500"
      },
      title: "Quick Doubts",
      message: "I need help with my lectures quickly",
      position: "top-[60%] left-[60%] lg:left-[70%] transform -translate-x-1/2"
    }
  ];

  const [visibleNotifications, setVisibleNotifications] = useState([]);

  useEffect(() => {
    // Animate notifications in one by one
    notifications.forEach((notification, index) => {
      setTimeout(() => {
        setVisibleNotifications(prev => [...prev, notification.id]);
      }, index * 150);
    });
  }, []);

  return (
    <section className="min-h-screen bg-white relative overflow-hidden font-sans">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative min-h-screen">
        {/* Header Section */}
        <div className="text-center py-16">
          <h2 className="text-6xl md:text-5xl font-semibold text-gray-900 font-['Poppins'] leading-tight tracking-tight">
          The Story Behind Us
          </h2>
        </div>

        {/* Struggle Section */}
        <div className="text-center mb-3 px-2">
          <p className="text-lg sm:text-xl text-gray-600 max-w-5xl mx-auto leading-relaxed">
            We saw your struggle to learn something new, and we're here to help you skip these conversations. <br/>
            No more endless searching, switching between platforms, and no more confusion about where to start.
          </p>
        </div>

        {/* Scattered Notifications Container */}
        <div className="relative w-full h-[500px] sm:h-[600px] mb-16">
          {notifications.map((notification, index) => {
            const isVisible = visibleNotifications.includes(notification.id);
            
            return (
              <div
                key={notification.id}
                className={`absolute ${notification.position} group transition-all duration-700 ${
                  isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
                }`}
                style={{ 
                  transitionDelay: `${index * 100}ms`,
                  zIndex: notifications.length - index
                }}
              >
                <div className="relative">
                  {/* Shadow */}
                  <div className="absolute bottom-0 left-4 right-4 h-3 bg-black/20 rounded-2xl blur-sm -z-10 group-hover:scale-110 transition-transform duration-300"></div>
                  
                  {/* Notification Card */}
                  <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-white/10 min-w-[250px] sm:min-w-[280px] max-w-[320px] group-hover:transform group-hover:-translate-y-2 group-hover:shadow-3xl group-hover:scale-105 transition-all duration-300 cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/30"></div>
                        <div className="flex items-center gap-2">
                          <img src={notification.ai.logo} alt={notification.ai.name} className="w-6 h-6 sm:w-8 sm:h-8" />
                          <span className="text-white font-semibold text-xs sm:text-sm">{notification.ai.name}</span>
                        </div>
                      </div>
                      <span className="text-white/60 text-xs font-medium">2 min ago</span>
                    </div>
                    <div className="text-white/90 text-xs sm:text-sm font-medium mb-1">
                      {notification.title}
                    </div>
                    <div className="text-white/70 text-xs leading-relaxed">
                      {notification.message}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutUs;