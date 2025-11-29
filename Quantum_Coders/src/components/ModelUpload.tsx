import { useState } from "react";
import { Upload, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { loadModelFromFiles } from "@/lib/model";

interface ModelUploadProps {
  onModelLoaded: () => void;
}

export function ModelUpload({ onModelLoaded }: ModelUploadProps) {
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [weightsFile, setWeightsFile] = useState<File | null>(null);
  const [metadataFile, setMetadataFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (type: 'model' | 'weights' | 'metadata', file: File | null) => {
    if (type === 'model') setModelFile(file);
    if (type === 'weights') setWeightsFile(file);
    if (type === 'metadata') setMetadataFile(file);
  };

  const handleLoadModel = async () => {
    if (!modelFile || !weightsFile || !metadataFile) {
      toast({
        title: "Missing Files",
        description: "Please upload all three files (model.json, weights.bin, metadata.json)",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await loadModelFromFiles(modelFile, weightsFile, metadataFile);
      toast({
        title: "Model Loaded Successfully",
        description: "You can now start analyzing crop images"
      });
      onModelLoaded();
    } catch (error) {
      toast({
        title: "Error Loading Model",
        description: error instanceof Error ? error.message : "Failed to load model",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 shadow-soft">
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <Upload className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Upload AI Model</h2>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          Upload your Teachable Machine model files (exported as TensorFlow.js)
        </p>

        <div className="space-y-3">
          <FileInput
            label="model.json"
            file={modelFile}
            onChange={(file) => handleFileChange('model', file)}
            accept=".json"
          />
          <FileInput
            label="weights.bin"
            file={weightsFile}
            onChange={(file) => handleFileChange('weights', file)}
            accept=".bin"
          />
          <FileInput
            label="metadata.json"
            file={metadataFile}
            onChange={(file) => handleFileChange('metadata', file)}
            accept=".json"
          />
        </div>

        <Button
          onClick={handleLoadModel}
          disabled={!modelFile || !weightsFile || !metadataFile || loading}
          className="w-full mt-4"
          size="lg"
        >
          {loading ? "Loading Model..." : "Load Model"}
        </Button>
      </div>
    </Card>
  );
}

interface FileInputProps {
  label: string;
  file: File | null;
  onChange: (file: File | null) => void;
  accept: string;
}

function FileInput({ label, file, onChange, accept }: FileInputProps) {
  return (
    <div className="flex items-center gap-3 p-3 border border-border rounded-lg bg-card">
      <input
        type="file"
        accept={accept}
        onChange={(e) => onChange(e.target.files?.[0] || null)}
        className="hidden"
        id={`file-${label}`}
      />
      <label
        htmlFor={`file-${label}`}
        className="flex-1 cursor-pointer flex items-center gap-2"
      >
        {file ? (
          <>
            <CheckCircle2 className="w-5 h-5 text-success" />
            <span className="text-sm font-medium text-foreground">{file.name}</span>
          </>
        ) : (
          <>
            <Upload className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{label}</span>
          </>
        )}
      </label>
    </div>
  );
}
