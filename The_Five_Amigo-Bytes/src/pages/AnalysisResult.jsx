import React from 'react';
import { ArrowLeft, CheckCircle, Leaf, Activity, Shield, XCircle } from 'lucide-react';

/**
 * AnalysisResult.jsx
 * Displays the plant health diagnosis, severity score, and remedial actions.
 * * Props:
 * - result: { label: string, severity_percent: number, recommendations: string[], confidence: number }
 * - onBack: function to call to return to the scanner screen.
 */

const getSeverityColor = (percent) => {
    if (percent <= 30) return { bar: "bg-green-500", text: "text-green-600", emoji: "✅ Healthy" };
    if (percent <= 70) return { bar: "bg-yellow-500", text: "text-yellow-600", emoji: "⚠️ Moderate" };
    return { bar: "bg-red-500", text: "text-red-600", emoji: "🚨 Severe" };
};

const mockResult = {
    label: "Tomato - Early Blight",
    severity_percent: 37, // Example data
    recommendations: [
        "Isolate and remove affected leaves immediately to prevent spread.",
        "Apply organic copper fungicide once every seven days.",
        "Improve air circulation and reduce leaf wetness during irrigation."
    ],
    confidence: 0.94,
    notes: "Requires immediate attention but is highly treatable with localized measures."
};

export default function AnalysisResult({ result = mockResult, onBack }) {
    const { label, severity_percent, recommendations, confidence, notes } = result;
    const severity = getSeverityColor(severity_percent);

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-lime-50 via-green-100 to-emerald-100 p-4 sm:p-8">
            <div className="max-w-3xl mx-auto flex flex-col space-y-6">
                
                {/* Header and Back Button */}
                <header className="flex items-center justify-between mb-4">
                    <button
                        onClick={onBack}
                        className="bg-white/90 text-green-800 p-3 rounded-full shadow-lg transition transform hover:scale-105 border border-green-200"
                        title="Back to Scanner"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h2 className="text-3xl font-extrabold text-green-800 text-center flex-grow -ml-10">
                        Leafify Analysis
                    </h2>
                    <div className="w-10"></div> {/* Placeholder for alignment */}
                </header>

                {/* Main Diagnosis Card */}
                <div className="bg-white rounded-3xl p-6 shadow-2xl border-t-4 border-green-600">
                    <div className="flex items-center space-x-4 mb-4">
                        <Leaf size={40} className="text-green-600" />
                        <div>
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Diagnosis Result</p>
                            <h3 className="text-3xl font-bold text-slate-900">{label}</h3>
                        </div>
                    </div>

                    {/* Severity Score */}
                    <div className="mt-6">
                        <div className="flex justify-between items-center mb-2">
                            <p className="font-semibold text-lg text-slate-700 flex items-center gap-2">
                                <Activity size={20} className={severity.text} />
                                Severity: <span className={severity.text}>{severity.emoji}</span>
                            </p>
                            <p className="font-bold text-2xl text-slate-900">{severity_percent}%</p>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                                className={`h-3 rounded-full transition-all duration-500 ${severity.bar}`} 
                                style={{ width: `${severity_percent}%` }}
                            ></div>
                        </div>
                    </div>
                    
                    {/* Confidence Score */}
                    <p className="mt-4 text-sm text-gray-600">
                        <span className="font-semibold">Confidence:</span> {(confidence * 100).toFixed(1)}%. <span className="italic">{notes || 'The model is highly confident in this diagnosis.'}</span>
                    </p>
                </div>

                {/* Action Plan / Remedies Card */}
                <div className="bg-white rounded-3xl p-6 shadow-2xl border-t-4 border-indigo-600">
                    <h3 className="text-2xl font-bold text-indigo-700 flex items-center gap-3 mb-4">
                        <Shield size={28} /> Recommended Action Plan
                    </h3>

                    {recommendations.length > 0 ? (
                        <ol className="list-decimal list-outside space-y-4 pl-5 text-lg text-slate-700">
                            {recommendations.map((rec, index) => (
                                <li key={index} className="pl-2 relative">
                                    <CheckCircle size={18} className="text-green-500 absolute left-[-22px] top-1" />
                                    {rec}
                                </li>
                            ))}
                        </ol>
                    ) : (
                        <div className="p-4 bg-gray-50 rounded-xl flex items-center gap-3">
                            <XCircle size={20} className="text-red-500" />
                            <p className="text-sm text-slate-600">No specific action required at this time, continue monitoring.</p>
                        </div>
                    )}
                </div>

                {/* Follow-up CTA */}
                <button
                    onClick={onBack}
                    className="w-full bg-lime-600 hover:bg-lime-700 text-white font-extrabold text-xl uppercase px-4 py-4 rounded-2xl shadow-xl transition transform hover:scale-[1.01]"
                >
                    Return to Scanner
                </button>

            </div>
        </div>
    );
}