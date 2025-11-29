import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// --- ASSETS ---
import elderlyCouple from '../assets/elderly-couple.png';
import doctorVideo from '../assets/doctor-video.png';
import deliveryPerson from '../assets/delivery-person.png';

export default function SignUpPage() {
  const { t, i18n } = useTranslation();
  const changeLanguage = (lng) => i18n.changeLanguage(lng);

  return (
    <div className="w-full h-screen flex items-center justify-center px-6 bg-gradient-to-br from-teal-700 via-teal-400 to-yellow-400 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute w-[130%] h-[130%] rounded-[50%] bg-white/10 top-[-30%] left-[-30%] blur-3xl opacity-20 pointer-events-none"></div>

      {/* MAIN WRAPPER - Updated justify and gap for better centering */}
      <div className="w-full max-w-[1650px] flex items-center justify-center gap-20 z-20">

        {/* LEFT CONTENT - Updated width constraint */}
        <div className="flex flex-col items-center justify-center w-[50%] min-w-0">
          
          <div className="flex items-center justify-center gap-10 text-white mb-12">
            <div className="w-28 h-28 flex flex-col items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:scale-105 transition-transform shadow-md">
              <span className="text-5xl">🌿</span>
              <p className="mt-1 text-lg font-semibold">Ayurveda</p>
            </div>
            <div className="w-28 h-28 flex flex-col items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:scale-105 transition-transform shadow-md">
              <span className="text-5xl">🩺</span>
              <p className="mt-1 text-lg font-semibold">Allopathy</p>
            </div>
            <div className="w-28 h-28 flex flex-col items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:scale-105 transition-transform shadow-md">
              <span className="text-5xl">🧪</span>
              <p className="mt-1 text-lg font-semibold">Homeopathy</p>
            </div>
          </div>

          <div className="text-white text-center mb-8 px-4">
            <h1 className="text-6xl sm:text-7xl font-extrabold drop-shadow-2xl tracking-tight leading-tight">Trivexa</h1>
            <p className="text-lg sm:text-2xl mt-3 font-light opacity-95">Unified Healthcare. For Everyone.</p>
          </div>

          <div className="flex items-center justify-center gap-6 mt-8">
            <img src={elderlyCouple} alt="Elderly couple" className="w-40 h-40 sm:w-48 sm:h-48 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform"/>
            <img src={doctorVideo} alt="Doctor video" className="w-40 h-40 sm:w-48 sm:h-48 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform"/>
            <img src={deliveryPerson} alt="Delivery person" className="w-40 h-40 sm:w-48 sm:h-48 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform"/>
          </div>
        </div>

        {/* RIGHT — SIGNUP CARD - Added translate-x-[-30px] */}
        <div className="flex-shrink-0 w-full max-w-md bg-white rounded-3xl shadow-[0_30px_60px_-10px_rgba(0,0,0,0.35)] border border-gray-100 p-8 relative
                        h-[86vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent translate-x-[-30px]">

          {/* LANGUAGE SWITCHER */}
          <div className="absolute top-4 right-4 flex space-x-2 text-sm font-semibold z-10">
            <button
              onClick={() => changeLanguage('en')}
              className={`px-2 py-1 rounded-lg transition-colors ${i18n.language === 'en' ? 'bg-teal-100 text-teal-700' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              EN
            </button>
            <button
              onClick={() => changeLanguage('hi')}
              className={`px-2 py-1 rounded-lg transition-colors ${i18n.language === 'hi' ? 'bg-teal-100 text-teal-700' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              HI
            </button>
          </div>

          {/* TITLE */}
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-1 text-gray-900">
            {t('signup')}
          </h2>

          <p className="text-gray-500 mb-6 font-light">
            {t('signupSubtitle') || 'Join Trivexa for better care'}
          </p>

          {/* FORM */}
          <form className="space-y-5">

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">{t('name')}</label>
              <input
                type="text"
                placeholder={t('enterName')}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-teal-200 focus:border-teal-500 transition-all placeholder-gray-400"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">{t('email')}</label>
              <input
                type="email"
                placeholder={t('enterEmail')}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-teal-200 focus:border-teal-500 transition-all placeholder-gray-400 bg-gray-50"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">{t('phone')}</label>
              <input
                type="text"
                placeholder={t('enterPhone')}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-teal-200 focus:border-teal-500 transition-all placeholder-gray-400"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">{t('password')}</label>
              <input
                type="password"
                placeholder={t('enterPassword')}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-teal-200 focus:border-teal-500 transition-all placeholder-gray-400 bg-gray-50"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">{t('confirmPassword')}</label>
              <input
                type="password"
                placeholder={t('enterConfirmPassword')}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-teal-200 focus:border-teal-500 transition-all placeholder-gray-400"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-1 bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl text-lg font-bold transition-transform transform hover:scale-[1.01] hover:shadow-lg"
            >
              {t('createAccount')}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <span className="flex-1 h-px bg-gray-200"></span>
            <span className="px-3 text-gray-400 text-sm font-medium">{t('or') || 'or'}</span>
            <span className="flex-1 h-px bg-gray-200"></span>
          </div>

          {/* Login redirect */}
          <p className="text-center text-gray-600 text-sm">
            {t('alreadyHaveAccount')}{" "}
            <Link to="/" className="text-teal-700 font-extrabold hover:text-teal-600 hover:underline">
              {t('login')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

