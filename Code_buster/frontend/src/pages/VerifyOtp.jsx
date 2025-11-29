import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Phone, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { otpService, handleApiError } from '../services/api';
import Loader from '../components/Loader';

const VerifyOtp = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
    setError('');
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
    setError('');
  };

  const sendOTP = async () => {
    if (!phone) {
      setError('Please enter your phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await otpService.sendOTP(phone);
      setOtpSent(true);
      setSuccess('OTP sent to your phone!');
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await otpService.verifyOTP(phone, otp);
      setSuccess('OTP verified successfully! You can now submit complaints.');
      setTimeout(() => {
        navigate('/submit');
      }, 2000);
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setPhone('');
    setOtp('');
    setOtpSent(false);
    setError('');
    setSuccess('');
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <Shield className="h-16 w-16 text-primary-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify OTP</h1>
        <p className="text-gray-600">Verify your phone number to submit complaints</p>
      </div>

      {/* Error and Success Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
          <span className="text-green-700">{success}</span>
        </div>
      )}

      <div className="card">
        <button
          onClick={() => navigate('/')}
          className="mb-4 flex items-center text-gray-600 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Home
        </button>

        {!otpSent ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Enter Phone Number</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="inline h-4 w-4 mr-1" />
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="+1234567890"
                className="input-field"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">Include country code (e.g., +1 for US)</p>
            </div>

            <button
              onClick={sendOTP}
              disabled={loading || !phone}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? <Loader size="small" text="Sending..." /> : 'Send OTP'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Enter OTP</h2>
            <p className="text-sm text-gray-600">
              We've sent a 6-digit OTP to {phone}
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                OTP Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={handleOtpChange}
                placeholder="123456"
                className="input-field text-center text-lg tracking-widest"
                maxLength={6}
                disabled={loading}
                autoFocus
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={verifyOTP}
                disabled={loading || otp.length !== 6}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                {loading ? <Loader size="small" text="Verifying..." /> : 'Verify OTP'}
              </button>
              
              <button
                onClick={sendOTP}
                disabled={loading}
                className="btn-secondary flex-1 disabled:opacity-50"
              >
                {loading ? <Loader size="small" text="Resending..." /> : 'Resend OTP'}
              </button>
            </div>

            <button
              onClick={reset}
              className="w-full text-sm text-gray-600 hover:text-primary-600 transition-colors"
            >
              Change Phone Number
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyOtp;
