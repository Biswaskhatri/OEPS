import React from 'react';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-6 px-4 text-base">
      <div className="flex flex-col items-center justify-center px-4 py-6 text-center">
        <h3 className="font-semibold text-white mb-4 text-3xl tracking-wide">
          About Us
        </h3>
        <p className="text-gray-400 max-w-2xl text-lg tracking-wide">
          We are a team of CSIT students dedicated to building this platform that makes entrance exam preparation easier, more effective, and accessible. Our website offers full and subject-wise mock tests, adaptive difficulty levels, instant feedback, and detailed performance tracking — all designed to help you prepare confidently and succeed.
        </p>
      </div>

      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="text-center md:w-1/3">
          <p className="font-semibold text-white mb-1 text-xl tracking-wide">
            Contact Us
          </p>
          <a
            href="mailto:support@csitpreppro.com"
            className="hover:text-white transition duration-200 tracking-wide"
          >
            support@csitpreppro.com
          </a>
          <p className="mt-1 text-lg tracking-wide">Contact No: +977 984502942</p>
        </div>

        <div className="flex justify-center space-x-6 mt-4">
          <a
            href="https://www.facebook.com/pra.besh.1217727"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition duration-200"
            aria-label="Facebook"
          >
            <FaFacebook className="w-6 h-6" />
          </a>
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition duration-200"
            aria-label="Instagram"
          >
            <FaInstagram className="w-6 h-6" />
          </a>
          <a
            href="https://www.linkedin.com/company/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition duration-200"
            aria-label="LinkedIn"
          >
            <FaLinkedin className="w-6 h-6" />
          </a>
        </div>
      </div>

      <div className="text-center mt-6 text-lg tracking-wide">
        <p>&copy; {new Date().getFullYear()}, CSIT Mock Test System. All rights reserved.</p>
      </div>
    </footer>
  );
}
