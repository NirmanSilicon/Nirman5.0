"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MessageSquare, CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function TestWhatsAppPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);

  const handleTestWhatsApp = async () => {
    if (!phoneNumber.trim()) {
      setResult({
        success: false,
        message: "Please enter a phone number"
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/whatsapp/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber.trim()
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: data.message,
          details: data
        });
      } else {
        setResult({
          success: false,
          message: data.error || 'Failed to send test message',
          details: data
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Network error. Please check your connection.',
        details: error
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-6 h-6" />
                WhatsApp Integration Test
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone Number *
                  </label>
                  <Input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter phone number (e.g., 9876543210 or +919876543210)"
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter your WhatsApp number to receive a test message
                  </p>
                </div>

                <Button 
                  onClick={handleTestWhatsApp}
                  disabled={isLoading || !phoneNumber.trim()}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending Test Message...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Send Test WhatsApp Message
                    </>
                  )}
                </Button>
              </div>

              {/* Environment Variables Check */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Environment Variables Status:</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    {process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span>TWILIO_ACCOUNT_SID: {process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID ? 'Set' : 'Not Set'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {process.env.NEXT_PUBLIC_TWILIO_AUTH_TOKEN ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span>TWILIO_AUTH_TOKEN: {process.env.NEXT_PUBLIC_TWILIO_AUTH_TOKEN ? 'Set' : 'Not Set'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {process.env.NEXT_PUBLIC_TWILIO_WHATSAPP_NUMBER ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span>TWILIO_WHATSAPP_NUMBER: {process.env.NEXT_PUBLIC_TWILIO_WHATSAPP_NUMBER || 'Not Set'}</span>
                  </div>
                </div>
              </div>

              {/* Result Display */}
              {result && (
                <Alert className={result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                  <div className="flex items-center gap-2">
                    {result.success ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <AlertDescription className={result.success ? "text-green-800" : "text-red-800"}>
                      {result.message}
                    </AlertDescription>
                  </div>
                  {result.details && (
                    <div className="mt-2 text-xs">
                      <details>
                        <summary className="cursor-pointer">View Details</summary>
                        <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                          {JSON.stringify(result.details, null, 2)}
                        </pre>
                      </details>
                    </div>
                  )}
                </Alert>
              )}

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Setup Instructions:</h3>
                <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                  <li>Add your Twilio credentials to <code>.env.local</code> file</li>
                  <li>Ensure your Twilio WhatsApp sandbox is configured</li>
                  <li>Add your phone number to the sandbox (send "join [sandbox-code]" to Twilio WhatsApp number)</li>
                  <li>Test the integration using this page</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
