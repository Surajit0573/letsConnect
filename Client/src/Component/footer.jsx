import * as React from 'react';
import { NavLink } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-800 text-gray-300 py-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 md:px-10">

        {/* Branding Section */}
        <div className="branding">
          <h2 className="text-3xl font-bold text-white mb-4">Let's Connect</h2>
          <p className="text-gray-400">Empowering creativity through connection.</p>
          <p className="text-gray-400 mt-2">© 2024 Let's Connect. All rights reserved.</p>
        </div>

        {/* Quick Links */}
        <div className="quick-links">
          <h3 className="text-xl font-semibold text-white mb-4">Quick Links</h3>
          <ul>
            <li className="mb-2"><NavLink to="/" className="hover:text-blue-400">Home</NavLink></li>
            <li className="mb-2"><NavLink to="/" className="hover:text-blue-400">About Us</NavLink></li>
            <li className="mb-2"><NavLink to="/" className="hover:text-blue-400">Contact Us</NavLink></li>
          </ul>
        </div>

        {/* Social Media Section */}
        <div className="social-media">
          <h3 className="text-xl font-semibold text-white mb-4">Follow Me</h3>
          <div className="flex space-x-4">
            <a href="https://github.com/Surajit0573" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
              <i className="fab fa-github fa-2x"></i>
            </a>
            <a href="https://www.linkedin.com/in/surajit-maity23/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
              <i className="fab fa-linkedin fa-2x"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
              <i className="fab fa-twitter fa-2x"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
              <i className="fab fa-instagram fa-2x"></i>
            </a>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="newsletter">
          <h3 className="text-xl font-semibold text-white mb-4">Stay Updated</h3>
          <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest updates and offers.</p>
          <form>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 mb-4 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Legal Links */}
      <div className="mt-10 border-t border-gray-700 pt-6 text-center">
        <NavLink to="/" className="text-gray-400 hover:text-blue-400 mx-4">Terms of Service</NavLink>
        <NavLink to="/" className="text-gray-400 hover:text-blue-400 mx-4">Privacy Policy</NavLink>
      </div>
    </footer>
  );
}
