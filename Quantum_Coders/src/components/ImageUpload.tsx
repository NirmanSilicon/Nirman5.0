import { useState, useRef } from "react";
import { Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ImageUploadProps {
  onImageSelected: (image: File, imageUrl: string) => void;
  disabled?: boolean;
}

export function ImageUpload({ onImageSelected, disabled }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      onImageSelected(file, url);
    }
  };

  return (
    <Card className="p-6 shadow-soft">
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <Camera className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Upload Crop Image</h2>
        </div>

        {preview ? (
          <div className="space-y-4">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-64 object-cover rounded-lg border-2 border-border"
            />
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => cameraInputRef.current?.click()}
                variant="outline"
                size="lg"
                disabled={disabled}
              >
                <Camera className="w-5 h-5 mr-2" />
                Take New Photo
              </Button>
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                size="lg"
                disabled={disabled}
              >
                <Upload className="w-5 h-5 mr-2" />
                Choose File
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center bg-muted/30">
              <Camera className="w-12 h-12 mx-auto mb-3 text-primary" />
              <p className="text-lg font-medium text-foreground mb-2">
                Capture or Upload Leaf Image
              </p>
              <p className="text-sm text-muted-foreground">
                For best results, take a clear photo of the leaf
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => cameraInputRef.current?.click()}
                size="lg"
                disabled={disabled}
                className="w-full"
              >
                <Camera className="w-5 h-5 mr-2" />
                Take Photo
              </Button>
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                size="lg"
                disabled={disabled}
                className="w-full"
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload File
              </Button>
            </div>
          </div>
        )}

        {/* Camera input - opens camera on mobile */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />
        
        {/* File input - opens gallery */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />
      </div>
    </Card>
  );
}
