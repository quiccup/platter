'use client'
import Link from 'next/link';
import React, { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="font-display text-2xl">
            Restaurant Name
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link href="/menu" className="hover:text-blue-600 transition-colors">
              Menu
            </Link>
            <Link href="/chefs-feed" className="hover:text-blue-600 transition-colors">
              Chef's Feed
            </Link>
            <Link href="/community" className="hover:text-blue-600 transition-colors">
              Community
            </Link>
            <Link href="/events" className="hover:text-blue-600 transition-colors">
              Events
            </Link>
            <Link href="/play" className="hover:text-blue-600 transition-colors">
              Play & Win
            </Link>
            <Link 
              href="/reservations" 
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Reserve
            </Link>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="sr-only">Open menu</span>
            {/* Hamburger icon */}
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              <Link href="/menu" className="hover:text-blue-600 transition-colors">
                Menu
              </Link>
              <Link href="/chefs-feed" className="hover:text-blue-600 transition-colors">
                Chef's Feed
              </Link>
              <Link href="/community" className="hover:text-blue-600 transition-colors">
                Community
              </Link>
              <Link href="/events" className="hover:text-blue-600 transition-colors">
                Events
              </Link>
              <Link href="/play" className="hover:text-blue-600 transition-colors">
                Play & Win
              </Link>
              <Link 
                href="/reservations" 
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors inline-block"
              >
                Reserve
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;