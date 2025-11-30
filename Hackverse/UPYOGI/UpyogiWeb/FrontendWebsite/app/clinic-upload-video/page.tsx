'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Upload, 
  Video, 
  ArrowLeft,
  CheckCircle
} from 'lucide-react';

export default function ClinicUploadVideo() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [videoDescription, setVideoDescription] = useState('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
    } else {
      alert('Please select a video file');
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    
    // Simulate upload with description
    console.log('Uploading video:', selectedFile.name);
    console.log('Description:', videoDescription);
    
    setTimeout(() => {
      setIsUploading(false);
      // Redirect to success page
      window.location.href = '/clinic-upload-success';
    }, 2000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.href = '/clinic-dashboard'}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Video className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Upload Treatment Video</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Share Your Best Treatment</CardTitle>
            <CardDescription className="text-lg">
              Upload a video showcasing your most successful treatment to inspire others
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
              {selectedFile ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-2 text-green-600">
                    <CheckCircle className="h-8 w-8" />
                    <span className="text-lg font-semibold">Video Selected</span>
                  </div>
                  <div className="bg-white rounded-lg p-4 border">
                    <div className="flex items-center justify-center space-x-3">
                      <Video className="h-8 w-8 text-blue-500" />
                      <div className="text-left">
                        <p className="font-medium">{selectedFile.name}</p>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(selectedFile.size)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <Upload className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Choose your video file
                    </h3>
                    <p className="text-gray-500">
                      Support for MP4, MOV, AVI, and other video formats
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* File Input */}
            <div className="text-center">
              <input
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
                id="video-upload"
              />
              <label
                htmlFor="video-upload"
                className="inline-block bg-primary text-white px-6 py-2 rounded-md cursor-pointer hover:bg-primary/90 transition-colors"
              >
                {selectedFile ? 'Change Video' : 'Choose Video File'}
              </label>
            </div>

            {/* Video Description */}
            <div className="space-y-2">
              <label htmlFor="video-description" className="block text-sm font-medium text-gray-700">
                Video Description
              </label>
              <textarea
                id="video-description"
                value={videoDescription}
                onChange={(e) => setVideoDescription(e.target.value)}
                placeholder="Describe your treatment video... What makes this treatment special? What results did you achieve? Share the story behind this success!"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
                maxLength={500}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Help others understand your treatment approach</span>
                <span>{videoDescription.length}/500 characters</span>
              </div>
            </div>

            {/* Upload Guidelines */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Upload Guidelines</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Video should be between 30 seconds to 5 minutes</li>
                <li>• Maximum file size: 100MB</li>
                <li>• Ensure good lighting and clear audio</li>
                <li>• Focus on the treatment process and results</li>
                <li>• Avoid showing patient faces without consent</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {/* Requirements Check */}
              {(!selectedFile || !videoDescription.trim()) && (
                <div className="text-center text-sm text-gray-600">
                  {!selectedFile && !videoDescription.trim() && (
                    <p>Please select a video file and add a description to continue</p>
                  )}
                  {!selectedFile && videoDescription.trim() && (
                    <p>Please select a video file to continue</p>
                  )}
                  {selectedFile && !videoDescription.trim() && (
                    <p>Please add a description about your treatment video</p>
                  )}
                </div>
              )}
              
              <div className="flex justify-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/clinic-dashboard'}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || !videoDescription.trim() || isUploading}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Video
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}