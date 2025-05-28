import React from 'react';
import {
  Instagram, Linkedin, Twitter, Youtube, Mail,
  Phone, MapPin
} from "lucide-react";

function Footer() {
  const socialLinks = [
    { icon: Instagram, href: "#", label: "Instagram", color: "hover:text-pink-400" },
    { icon: Linkedin, href: "#", label: "LinkedIn", color: "hover:text-blue-400" },
    { icon: Youtube, href: "#", label: "YouTube", color: "hover:text-red-400" },
    { icon: Twitter, href: "#", label: "Twitter", color: "hover:text-sky-400" }
  ];

  return (
    <footer className="bg-black text-white relative overflow-hidden">
      <div className="relative z-10 px-6 py-10 pb-5 sm:px-10 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto space-y-10">

          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Brand Section */}
            <div className="flex flex-col items-start text-left">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent mb-4">
                Camel.ai
              </h2>
              <p className="text-gray-300 mb-6">
                We are a team of AI experts dedicated to helping you unlock the power of data.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-300 hover:text-emerald-300 transition-colors">
                  <Mail className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm">support@ecoglam.com</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300 hover:text-emerald-300 transition-colors">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm">+91 1800 123 456</span>
                </div>
              </div>

              {/* Social Icons */}
              <div className="flex gap-4 mt-6">
                {socialLinks.map(({ icon: Icon, href, label, color }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className={`p-3 bg-white/10 rounded-full border border-white/20 hover:bg-white/20 ${color} transition-all duration-300 hover:scale-110 hover:shadow-lg`}
                  >
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>

            {/* Links Sections */}
            <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {/* Product */}
              <div>
                <h3 className="text-xl font-semibold mb-3 text-white">Product</h3>
                <ul className="space-y-1">
                  {["Features", "Pricing", "Blog"].map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-gray-300 hover:text-emerald-300 transition-colors duration-200 text-sm hover:translate-x-1 transform inline-block"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Use Cases */}
              <div>
                <h3 className="text-xl font-semibold mb-3 text-white">Use Cases</h3>
                <ul className="space-y-1">
                  {[
                    "For Product Sales",
                    "For HR Operation",
                    "For Marketing",
                    "For Finance"
                  ].map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-gray-300 hover:text-emerald-300 transition-colors duration-200 text-sm hover:translate-x-1 transform inline-block"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div>
                <h3 className="text-xl font-semibold mb-3 text-white">Company</h3>
                <ul className="space-y-1">
                  {[
                    "Company reg.",
                    "Our Story",
                    "Data Security",
                    "Cookie Policy",
                    "Terms of Service",
                    "Privacy Policy",
                    "Contact Us"
                  ].map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-gray-300 hover:text-emerald-300 transition-colors duration-200 text-sm hover:translate-x-1 transform inline-block"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-white/10 pt-4 text-sm text-gray-400 flex justify-center items-center">
            <span>© 2025 EcoGlam</span>
            <span className="mx-2">•</span>
            <span>All Rights Reserved</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
