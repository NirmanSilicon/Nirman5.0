import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, MapPin, Phone, User, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';
import { otpService, complaintService, handleApiError } from '../services/api';
import Loader from '../components/Loader';

const SubmitComplaint = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    latitude: '',
    longitude: '',
    address: '',
    complaint_text: '',
  });
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const copyOtpToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(otp)
        .then(() => setSuccess('OTP copied to clipboard!'))
        .catch(err => console.error('Failed to copy OTP:', err));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
          setLoading(false);
          setSuccess('Location captured successfully!');
          setTimeout(() => setSuccess(''), 3000);
        },
        (error) => {
          setError('Unable to get your location. Please enter manually.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  const sendOTP = async () => {
    if (!formData.phone) {
      setError('Please enter your phone number');
      return;
    }

    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Please enter a valid phone number with country code (e.g., +1234567890)');
      return;
    }

    try {
      setOtpSending(true);
      setError('');
      setSuccess('');

      const response = await otpService.sendOTP(formData.phone);
      setOtpSent(true);
      setSuccess('OTP sent successfully!');
      
      if (import.meta.env.DEV && response.otp) {
        console.log('OTP for testing:', response.otp);
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setError(error.response?.data?.detail || 'Failed to send OTP. Please try again.');
    } finally {
      setOtpSending(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp) {
      setError('Please enter the OTP');
      return;
    }

    try {
      setVerifying(true);
      setError('');
      
      await otpService.verifyOTP(formData.phone, otp);
      setOtpVerified(true);
      setSuccess('Phone number verified successfully!');
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError(error.response?.data?.detail || 'Invalid OTP. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const requiredFields = ['name', 'phone', 'latitude', 'longitude', 'address', 'complaint_text'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    const lat = parseFloat(formData.latitude);
    const lng = parseFloat(formData.longitude);
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setError('Please enter valid coordinates');
      setLoading(false);
      return;
    }

    try {
      const complaintData = {
        name: formData.name,
        phone: formData.phone,
        latitude: lat,
        longitude: lng,
        address: formData.address,
        complaint_text: formData.complaint_text,
      };

      const response = await complaintService.submitComplaint(complaintData);
      setSuccess('Complaint submitted successfully!');
      setFormData({
        name: '',
        phone: '',
        latitude: '',
        longitude: '',
        address: '',
        complaint_text: '',
      });
      setOtp('');
      setOtpSent(false);
      setOtpVerified(false);
      
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Error submitting complaint:', error);
      setError(handleApiError(error, 'Failed to submit complaint'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="text-center mb-8">
        <Shield className="h-16 w-16 text-primary-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit a Complaint</h1>
        <p className="text-gray-600">Report issues in your city and help make it better</p>
      </div>

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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="mb-6">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="John Doe"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number (with country code) <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="+1234567890"
                required
                disabled={otpVerified}
              />
            </div>
            {!otpVerified && (
              <button
                type="button"
                onClick={otpSent ? verifyOTP : sendOTP}
                disabled={otpSending || verifying}
                className="btn-primary whitespace-nowrap"
              >
                {otpSending ? 'Sending...' : verifying ? 'Verifying...' : otpSent ? 'Verify OTP' : 'Send OTP'}
              </button>
            )}
          </div>
          {otpSent && !otpVerified && (
            <div className="mt-2">
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                Enter OTP <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={handleOtpChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  placeholder="Enter 6-digit OTP"
                  maxLength="6"
                />
              </div>
              {import.meta.env.DEV && (
                <button
                  type="button"
                  onClick={copyOtpToClipboard}
                  className="mt-1 text-xs text-blue-600 hover:text-blue-800"
                >
                  Copy OTP from console
                </button>
              )}
            </div>
          )}
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={getCurrentLocation}
              className="text-sm text-primary-600 hover:text-primary-800"
            >
              Use my current location
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="latitude" className="block text-xs text-gray-500 mb-1">
                Latitude
              </label>
              <input
                type="text"
                id="latitude"
                name="latitude"
                value={formData.latitude}
                onChange={handleInputChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="e.g., 28.6139"
                required
              />
            </div>
            <div>
              <label htmlFor="longitude" className="block text-xs text-gray-500 mb-1">
                Longitude
              </label>
              <input
                type="text"
                id="longitude"
                name="longitude"
                value={formData.longitude}
                onChange={handleInputChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="e.g., 77.2090"
                required
              />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-start pt-3">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows="2"
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="Enter the full address of the location"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="complaint_text" className="block text-sm font-medium text-gray-700 mb-1">
            Complaint Details <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-start pt-3">
              <MessageSquare className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              id="complaint_text"
              name="complaint_text"
              value={formData.complaint_text}
              onChange={handleInputChange}
              rows="4"
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="Describe your complaint in detail..."
              required
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={!otpVerified || loading}
            className={`btn-primary w-full ${!otpVerified || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubmitComplaint;
          setError('Unable to get your location. Please enter manually.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  const sendOTP = async () => {
    if (!formData.phone) {
      setError('Please enter your phone number');
      return;
    }

    // Basic phone validation (simple check for digits, adjust as needed)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Please enter a valid phone number with country code (e.g., +1234567890)');
      return;
    }

    setOtpSending(true);
    setError('');
    
    try {
      const response = await otpService.sendOTP(formData.phone);
      setOtpSent(true);
      
      // Store and show OTP if available in response (for development)
      if (response.otp) {
        setReceivedOtp(response.otp);
        setSuccess(`OTP sent to your phone! Your OTP is: ${response.otp}`);
      } else {
        setReceivedOtp('');
        setSuccess('OTP sent to your phone!');
      }
      setTimeout(() => setSuccess(''), 10000); // Extended timeout for OTP display
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
    } finally {
      setOtpSending(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setOtpVerifying(true);
    setError('');

    try {
      await otpService.verifyOTP(formData.phone, otp);
      setOtpVerified(true);
      setStep(2); // Move to form submission
      setSuccess('OTP verified! You can now submit your complaint.');
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
    } finally {
      setOtpVerifying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate form
    const requiredFields = ['name', 'phone', 'latitude', 'longitude', 'address', 'complaint_text'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    // Validate coordinates
    const lat = parseFloat(formData.latitude);
    const lng = parseFloat(formData.longitude);
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setError('Please enter valid coordinates');
      setLoading(false);
      return;
    }

    try {
      const complaintData = {
        name: formData.name,
        email: formData.email,
        latitude: lat,
        longitude: lng,
        address: formData.address,
        complaint_text: formData.complaint_text,
      };

      const response = await complaintService.submitComplaint(complaintData);
      setSuccess('Complaint submitted successfully!');
      setStep(3); // Success step
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          latitude: '',
          longitude: '',
          address: '',
          complaint_text: '',
        });
        setOtp('');
        setOtpSent(false);
        setOtpVerified(false);
        setStep(1);
      }, 5000);
      
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <Shield className="h-16 w-16 text-primary-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit a Complaint</h1>
        <p className="text-gray-600">Report issues in your city and help make it better</p>
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate form
    const requiredFields = ['name', 'phone', 'latitude', 'longitude', 'address', 'complaint_text'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    // Validate coordinates
    const lat = parseFloat(formData.latitude);
    const lng = parseFloat(formData.longitude);
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setError('Please enter valid coordinates');
      setLoading(false);
      return;
    }

    try {
      const complaintData = {
        name: formData.name,
        phone: formData.phone,
      latitude: lat,
      longitude: lng,
      address: formData.address,
      complaint_text: formData.complaint_text,
    };

    const response = await complaintService.submitComplaint(complaintData);
    setSuccess('Complaint submitted successfully!');
    setStep(3); // Success step
    
    // Reset form after successful submission
    setTimeout(() => {
      setFormData({
        name: '',
        phone: '',
        latitude: '',
        longitude: '',
        address: '',
        complaint_text: '',
      });
      setOtp('');
      setOtpSent(false);
      setOtpVerified(false);
      setStep(1);
    }, 5000);
    
  } catch (err) {
    const apiError = handleApiError(err);
    setError(apiError.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <Shield className="h-16 w-16 text-primary-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit a Complaint</h1>
        <p className="text-gray-600">Report issues in your city and help make it better</p>
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

    {/* Step 1: OTP Verification */}
    {step === 1 && (
      <div className="mb-6">
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number (with country code)
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            placeholder="+1234567890"
            required
            disabled={otpSent}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">We'll send a 6-digit OTP to this phone number</p>
      </div>

      {!otpSent ? (
        <button
          onClick={sendOTP}
          disabled={otpSending || !formData.phone}
          className="btn-primary w-full disabled:opacity-50"
        >
          {otpSending ? <Loader size="small" text="Sending..." /> : 'Send OTP'}
        </button>
      ) : (
        <div className="space-y-4">
          {/* Display OTP prominently if available */}
          {receivedOtp && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-sm text-green-600 font-medium mb-2">
                Your 6-digit OTP is:
              </p>
              <div className="text-3xl font-bold text-green-700 tracking-widest bg-white rounded-lg py-3 px-4 border-2 border-green-300 mb-3">
                {receivedOtp}
              </div>
              <div className="flex justify-center space-x-2">
                <button
                  onClick={copyOtpToClipboard}
                  className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 transition-colors"
                >
                  📋 Copy & Fill OTP
                </button>
              </div>
              <p className="text-xs text-green-600 mt-2">
                Enter this OTP in the field below to verify
              </p>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter 6-digit OTP
            </label>
            <input
              type="text"
              value={otp}
              onChange={handleOtpChange}
              placeholder="123456"
              className="input-field text-center text-lg tracking-widest"
              maxLength={6}
              disabled={otpVerified}
            />
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={verifyOTP}
              disabled={otpVerifying || otp.length !== 6 || otpVerified}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {otpVerifying ? <Loader size="small" text="Verifying..." /> : 'Verify OTP'}
            </button>
            
            <button
              onClick={sendOTP}
              disabled={otpSending}
              className="btn-secondary flex-1 disabled:opacity-50"
            >
              {otpSending ? <Loader size="small" text="Resending..." /> : 'Resend OTP'}
            </button>
          </div>
        </div>
      )}
    )}

    {/* Step 2: Complaint Form */}
    {step === 2 && (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Complaint Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline h-4 w-4 mr-1" />
                Your Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="inline h-4 w-4 mr-1" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1234567890"
                className="input-field"
                disabled
              />
              <p className="text-xs text-green-600 mt-1">✓ Verified</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="123 Main Street, City, State"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Get Location
              </label>
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={loading}
                className="btn-secondary w-full disabled:opacity-50"
                disabled={otpSending || !formData.phone}
                className="btn-primary w-full disabled:opacity-50"
              >
                {otpSending ? <Loader size="small" text="Sending..." /> : 'Send OTP'}
              </button>
            ) : (
              <div className="space-y-4">
                {/* Display OTP prominently if available */}
                {receivedOtp && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <p className="text-sm text-green-600 font-medium mb-2">
                      Your 6-digit OTP is:
                    </p>
                    <div className="text-3xl font-bold text-green-700 tracking-widest bg-white rounded-lg py-3 px-4 border-2 border-green-300 mb-3">
                      {receivedOtp}
                    </div>
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={copyOtpToClipboard}
                        className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 transition-colors"
                      >
                        📋 Copy & Fill OTP
                      </button>
                    </div>
                    <p className="text-xs text-green-600 mt-2">
                      Enter this OTP in the field below to verify
                    </p>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter 6-digit OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={handleOtpChange}
                    placeholder="123456"
                    className="input-field text-center text-lg tracking-widest"
                    maxLength={6}
                    disabled={otpVerified}
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={verifyOTP}
                    disabled={otpVerifying || otp.length !== 6 || otpVerified}
                    className="btn-primary flex-1 disabled:opacity-50"
                  >
                    {otpVerifying ? <Loader size="small" text="Verifying..." /> : 'Verify OTP'}
                  </button>
                  
                  <button
                    onClick={sendOTP}
                    disabled={otpSending}
                    className="btn-secondary flex-1 disabled:opacity-50"
                  >
                    {otpSending ? <Loader size="small" text="Resending..." /> : 'Resend OTP'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Complaint Form */}
      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">Complaint Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline h-4 w-4 mr-1" />
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="inline h-4 w-4 mr-1" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  className="input-field"
                  disabled
                />
                <p className="text-xs text-green-600 mt-1">✓ Verified</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="123 Main Street, City, State"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Get Location
                </label>
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={loading}
                  className="btn-secondary w-full disabled:opacity-50"
                >
                  {loading ? <Loader size="small" text="Getting..." /> : 'Use Current Location'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latitude
                </label>
                <input
                  type="number"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  placeholder="28.6139"
                  step="any"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitude
                </label>
                <input
                  type="number"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  placeholder="77.2090"
                  step="any"
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MessageSquare className="inline h-4 w-4 mr-1" />
                Complaint Description
              </label>
              <textarea
                name="complaint_text"
                value={formData.complaint_text}
                onChange={handleInputChange}
                placeholder="Please describe the issue in detail..."
                rows={6}
                className="input-field resize-none"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum 10 characters. Be specific about the issue, location, and impact.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? <Loader size="small" text="Submitting..." /> : 'Submit Complaint'}
            </button>
          </div>
        </form>
      )}

      {/* Step 3: Success */}
      {step === 3 && (
        <div className="card text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Complaint Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Your complaint has been successfully submitted and will be processed by our system.
            You will receive updates on your registered email address.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary"
          >
            View Dashboard
          </button>
        </div>
      )}
    </div>
  );
};

export default SubmitComplaint;
