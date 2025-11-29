'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  ArrowLeft,
  Share2,
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Heart,
  Eye,
  Users
} from 'lucide-react';

export default function ClinicUploadSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="border-b border-border bg-white/80 backdrop-blur-sm">
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
              <CheckCircle className="h-6 w-6 text-green-600" />
              <h1 className="text-xl font-bold">Upload Successful</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Success Message */}
        <Card className="mb-8 border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-green-800 mb-2">
                  Thank You! Your Video is Uploaded
                </h2>
                <p className="text-lg text-green-700">
                  Your treatment video has been successfully uploaded and is now live across all social media platforms!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Media Stats */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Share2 className="h-5 w-5" />
              <span>Social Media Performance</span>
            </CardTitle>
            <CardDescription>
              Your video is gaining traction across all platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Eye className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-800">1,247</div>
                <div className="text-sm text-blue-600">Total Views</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <Heart className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-800">89</div>
                <div className="text-sm text-red-600">Likes</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Share2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-800">23</div>
                <div className="text-sm text-green-600">Shares</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-800">12</div>
                <div className="text-sm text-purple-600">Comments</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Media Platforms */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Live on Social Media</CardTitle>
            <CardDescription>
              Your video is now available on all major social media platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border-2 border-dashed bg-blue-50 hover:border-solid transition-all cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Facebook className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Facebook</h3>
                    <p className="text-sm text-gray-600">Video is live and gaining views</p>
                  </div>
                  <div className="ml-auto">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg border-2 border-dashed bg-blue-50 hover:border-solid transition-all cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Twitter className="h-8 w-8 text-blue-400" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Twitter</h3>
                    <p className="text-sm text-gray-600">Video is live and gaining views</p>
                  </div>
                  <div className="ml-auto">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg border-2 border-dashed bg-pink-50 hover:border-solid transition-all cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Instagram className="h-8 w-8 text-pink-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Instagram</h3>
                    <p className="text-sm text-gray-600">Video is live and gaining views</p>
                  </div>
                  <div className="ml-auto">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-lg border-2 border-dashed bg-red-50 hover:border-solid transition-all cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Youtube className="h-8 w-8 text-red-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">YouTube</h3>
                    <p className="text-sm text-gray-600">Video is live and gaining views</p>
                  </div>
                  <div className="ml-auto">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => window.location.href = '/clinic-dashboard'}
            className="bg-primary hover:bg-primary/90"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <Button
            onClick={() => window.location.href = '/clinic-upload-video'}
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-white"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Upload Another Video
          </Button>
        </div>

        {/* Footer Message */}
        <div className="text-center mt-8 text-gray-600">
          <p>
            Your video will continue to reach more people and help others discover 
            the benefits of Ayurvedic treatments. Keep sharing your success stories!
          </p>
        </div>
      </main>
    </div>
  );
}