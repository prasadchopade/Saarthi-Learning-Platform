import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faLightbulb,
  faNoteSticky,
  faUsers,
  faGraduationCap,
  faMicrochip,
  faUser
} from "@fortawesome/free-solid-svg-icons";
import { useSidebar } from "../../context/SideBarContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { collapsed } = useSidebar();

  const menuSections = [
    {
      title: "Main",
      items: [
        { icon: faHome, label: "For Me", path: "/for-me" },
        { icon: faLightbulb, label: "AI Roadmaps", path: "/roadmaps" },
        { icon: faMicrochip, label: "Create", path: "/creator" },
      ]
    },
    {
      title: "Library",
      items: [
        { icon: faNoteSticky, label: "My Notes", path: "/notes" },
        { icon: faUser, label: "Profile", path: "/profile" },
      ]
    },
    {
      title: "Resources",
      items: [
        { icon: faGraduationCap, label: "Resources", path: "/resources" },
        { icon: faUsers, label: "Community", path: "/community" },
      ]
    }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside
      className="bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-none
               h-screen transition-all duration-300 
               fixed top-16 left-0 overflow-y-auto font-['Inter'] z-40 shadow-sm
               w-[240px] dark:shadow-none"
      style={{ width: collapsed ? '72px' : '240px' }}
    >
      <nav className="py-3">
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6">
            {!collapsed && (
              <p className="text-[12px] font-medium text-black dark:text-gray-400
                          uppercase tracking-wider px-6 mb-2">
                {section.title}
              </p>
            )}

            <div className="space-y-0.5 px-2">
              {section.items.map((item, itemIndex) => (
                <button
                  key={itemIndex}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-all
                            ${isActive(item.path)
                      ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/60'
                    } ${collapsed ? 'justify-center' : 'justify-start'}`}
                  title={collapsed ? item.label : ''}
                >
                  <FontAwesomeIcon
                    icon={item.icon}
                    className={`${isActive(item.path)
                      ? 'text-black dark:text-white'
                      : 'text-black dark:text-white'} 
                      ${collapsed ? 'text-xl' : 'text-lg'} min-w-[24px]
                      transition-colors duration-200`}
                    fixedWidth
                  />

                  {!collapsed && (
                    <span className={`ml-5 text-[14px] tracking-wide
                      ${isActive(item.path)
                        ? 'text-black dark:text-white font-medium'
                        : 'text-black dark:text-white font-normal'}
                      transition-colors duration-200`}>
                      {item.label}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;