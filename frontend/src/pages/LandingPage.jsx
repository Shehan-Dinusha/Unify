import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';

const LandingPage = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-900">
            <Navbar />
            <main className="flex-grow">
                <Hero />
            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;
