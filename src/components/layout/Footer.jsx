import React from 'react';
import { Link } from 'react-router-dom';
// Ensure you have react-icons installed: npm install react-icons
import { FaFacebook, FaInstagram, FaLinkedin, FaTelegramPlane } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 px-8 text-sm">
      <div className="flex flex-col items-center justify-center px-4 py-12 text-center ">
        <h3 className="font-semibold text-white mb-6 text-3xl">About Us</h3>
        <p className="text-gray-400 max-w-xl max-w-md max-w-2xl text-lg">
          Your ultimate platform for CSIT entrance exam preparation. We provide comprehensive mock tests, detailed analytics, and a vast question bank to help you succeed.
        </p>
      </div>

      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">


        {/* Contact Information - Adapted for CSIT Prep Pro */}
        <div className="text-center md:w-1/3">
          <p className="font-semibold text-white mb-1 text-xl">Contact Us</p>
          <a href="mailto:support@csitpreppro.com" className="hover:text-white transition duration-200">
            support@csitpreppro.com
          </a>
          {/* You can add a phone number here if available and desired */}
          <p className="mt-1"> Contact No:+977 984502942</p>
        </div>



        {/* Social Media Links - Generic placeholders for your project */}
        <div className="flex justify-center space-x-6 mt-6"> {/* Centered social media links */}
          <a
            href="https://www.facebook.com/yourcsitpreppro" // Replace with your Facebook URL
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition duration-200"
            aria-label="Facebook"
          >
            <FaFacebook className="w-6 h-6" />
          </a>
          <a
            href="https://www.instagram.com/yourcsitpreppro" // Replace with your Instagram URL
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition duration-200"
            aria-label="Instagram"
          >
            <FaInstagram className="w-6 h-6" />
          </a>
          <a
            href="https://www.linkedin.com/company/yourcsitpreppro" // Replace with your LinkedIn URL
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition duration-200"
            aria-label="LinkedIn"
          >
            <FaLinkedin className="w-6 h-6" />
          </a>
          {/* Include Discord if your project has a community server */}
          <a
             href="https://t.me/your_telegram_username"// Replace with your Discord invite link
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition duration-200"
            aria-label="Telegram"
          >
            <FaTelegramPlane className="w-6 h-6" />
          </a>
        </div>
      </div>


      <div className="text-center mt-8">
        <p>&copy; {new Date().getFullYear()}, CSIT Mock Test System.All rights reserved.</p>
        {/* <p className="mt-1">All rights reserved.</p> */}
      </div>

    </footer>
  );
};


