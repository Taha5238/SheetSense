import React from 'react';
import { Mic } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="py-8 border-t border-white/10 bg-[#050505]">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">

                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#00FF94] flex items-center justify-center">
                        <Mic className="text-black w-4 h-4" />
                    </div>
                    <span className="font-bold text-lg">SheetSense</span>
                </div>

                <div className="text-gray-500 text-sm">
                    © {new Date().getFullYear()} SheetSense. All rights reserved.
                </div>

                <div className="flex gap-6 text-sm text-gray-400">
                    <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
