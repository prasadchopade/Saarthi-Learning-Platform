import { HeartIcon } from '@heroicons/react/24/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  const links = [
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms of Service', href: '/terms-of-service' },
  ];

  const socials = [
    {name: 'Instagram', href: 'https://www.instagram.com/gowebier/', icon: faInstagram },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/company/webier/', icon: faLinkedin },
  ];

  return (
    <footer className="bg-white border-t border-gray-100 z-50">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Logo & Tagline */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-gray-900 mb-3 font-['Poppins']">Saarthi</h3>
            <p className="text-gray-600 mb-4 max-w-md font-['Inter']">
              Empowering Everyone to Learn
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h4>
            <div className="space-y-3">
              {links.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block text-gray-600 hover:text-indigo-600 transition-colors duration-300"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Follow Us</h4>
            <div className="flex gap-1">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-gray-400 hover:text-indigo-600 transition-colors duration-300 p-1 rounded-lg hover:bg-gray-50"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="sr-only">{social.name}</span>
                  <FontAwesomeIcon icon={social.icon} className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;