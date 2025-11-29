import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";   // ✅ Added Link

// --- ASSETS ---
import elderlyCouple from '../assets/elderly-couple.png';
import doctorVideo from '../assets/doctor-video.png';
import deliveryPerson from '../assets/delivery-person.png';

export default function LoginPage() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => i18n.changeLanguage(lng);

  return (
   <div className="w-full h-screen flex items-center justify-center px-10 bg-gradient-to-br from-[#78adb7ff] via-[#7eb9d3ff] to-yellow-400 relative overflow-hidden">


      {/* Soft background glow */}
      <div className="absolute w-[130%] h-[130%] rounded-[50%] bg-white/10 top-[-30%] left-[-30%] blur-3xl opacity-20"></div>

      {/* --- MAIN WRAPPER --- */}
      <div className="w-full max-w-[1650px] flex items-center justify-center gap-20 z-20">

        {/* LEFT SIDE */}
        <div className="flex flex-col items-center justify-center w-[52%]">

          {/* ICONS */}
          <div className="flex items-center justify-center gap-12 text-white mb-14">

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

          {/* TITLE */}
          <div className="text-white text-center mb-10">
            <h1 className="text-7xl font-extrabold drop-shadow-2xl tracking-tight">Trivexa</h1>
            <p className="text-2xl mt-3 font-light opacity-95">
              Unified Healthcare. For Everyone.
            </p>
          </div>

          {/* IMAGES */}
          <div className="flex items-center justify-center gap-6 mt-10">
            <img src={elderlyCouple} alt="Elderly couple" className="w-48 h-48 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform" />
            <img src={doctorVideo} alt="Doctor video" className="w-48 h-48 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform" />
            <img src={deliveryPerson} alt="Delivery person" className="w-48 h-48 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform" />
          </div>
        </div>

        {/* RIGHT SIDE — LOGIN BOX */}
        <div className="w-full max-w-sm bg-white shadow-[0_30px_60px_-10px_rgba(0,0,0,0.35)] rounded-3xl p-10 border border-gray-100 relative translate-x-[-30px]">

          {/* LANGUAGE SWITCHER */}
          <div className="absolute top-4 right-4 flex space-x-2 text-sm font-semibold">
            <button
              onClick={() => changeLanguage('en')}
              className={`px-2 py-1 rounded-lg transition-colors ${
                i18n.language === 'en'
                  ? 'bg-teal-100 text-teal-700'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              EN
            </button>

            <button
              onClick={() => changeLanguage('hi')}
              className={`px-2 py-1 rounded-lg transition-colors ${
                i18n.language === 'hi'
                  ? 'bg-teal-100 text-teal-700'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              HI
            </button>
          </div>

          {/* TITLE */}
          <h2 className="text-3xl font-extrabold mb-2 text-gray-900">
            {t('login')}
          </h2>
          <p className="text-gray-500 mb-8 font-light">
            {t('welcome_slogan') || "Sign in to continue"}
          </p>

          {/* FORM */}
          <form className="space-y-6">
            <div>
              <label className="text-sm font-semibold text-gray-700">
                {t('email_phone')}
              </label>
              <input
                type="text"
                className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-teal-200 focus:border-teal-500 transition-all"
                placeholder={t('email_phone')}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                {t('password')}
              </label>
              <input
                type="password"
                className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-teal-200 focus:border-teal-500 transition-all"
                placeholder={t('password')}
              />
              <a
                href="/forgot-password"
                className="text-xs text-teal-600 font-medium hover:text-teal-700 float-right mt-1"
              >
                {t('forgot_password')}
              </a>
            </div>

            <Link to="/home">
             <button
               type="button"
               className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl text-lg font-bold transition-all transform hover:scale-[1.01] hover:shadow-lg mt-8"
              >
              {t('login')}
              </button>
            </Link>

          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <span className="flex-1 h-px bg-gray-200"></span>
            <span className="px-3 text-gray-400 text-sm font-medium">
              {t('or_login_with')}
            </span>
            <span className="flex-1 h-px bg-gray-200"></span>
          </div>

          {/* SIGNUP REDIRECT — UPDATED */}
          <p className="text-center text-gray-600 text-sm">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-teal-700 font-extrabold hover:text-teal-600 hover:underline"
            >
              {t('signup')}
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
