import React from 'react';
import { useTranslation } from 'react-i18next';

const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
];

const LanguageSelector = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="relative inline-block text-left">
            <div className="flex space-x-2">
                {languages.map((lng) => (
                    <button
                        key={lng.code}
                        onClick={() => changeLanguage(lng.code)}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 
              ${i18n.language === lng.code
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        {lng.nativeName}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default LanguageSelector;
