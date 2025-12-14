import React, { useState, useEffect } from 'react';
import { Mic, Menu, X } from 'lucide-react';
import { Link } from 'react-scroll';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Features', to: 'features' },
        { name: 'How it Works', to: 'how-it-works' },
        { name: 'Pricing', to: 'pricing' },
        { name: 'Contact', to: 'contact' },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/50 backdrop-blur-md border-b border-white/5' : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#00FF94] to-[#A855F7] flex items-center justify-center">
                        <Mic className="text-black w-5 h-5" />
                    </div>
                    <div className="text-2xl font-bold">
                        <span className="text-white">Sheet</span>
                        <span className="text-[#00FF94]">Sense</span>
                    </div>
                </div>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.to}
                            smooth={true}
                            duration={800}
                            className="text-gray-400 hover:text-white cursor-pointer transition-colors text-sm font-medium"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* CTA Button */}
                <div className="hidden md:block">
                    <button className="bg-white text-black px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors flex items-center gap-2">
                        Get Early Access
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M5 12h14m-7-7 7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-white p-2"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-black border-t border-white/10"
                    >
                        <div className="p-6 flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.to}
                                    smooth={true}
                                    duration={800}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-gray-300 hover:text-white py-2 text-lg font-medium"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <button className="bg-[#00FF94] text-black w-full py-3 rounded-lg font-bold mt-4">
                                Get Early Access
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
