import { useState, useEffect } from "react";
import { Sprout, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ModelUpload } from "@/components/ModelUpload";
import { ImageUpload } from "@/components/ImageUpload";
import { DiseaseResult } from "@/components/DiseaseResult";
import { WeatherSection } from "@/components/WeatherSection";
import { DownloadGuide } from "@/components/DownloadGuide";
import { predict, isModelLoaded, loadDefaultModel } from "@/lib/model";
import { getTreatment } from "@/data/treatments";

export default function Index() {
  const [modelLoaded, setModelLoaded] = useState(false);
  const [loadingModel, setLoadingModel] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [weatherAdvice, setWeatherAdvice] = useState<string | undefined>();
  const { toast } = useToast();

  useEffect(() => {
    const initModel = async () => {
      try {
        await loadDefaultModel();
        setModelLoaded(true);
      } catch (error) {
        toast({
          title: "Model Loading Failed",
          description: "Could not load the AI model. Please refresh the page.",
          variant: "destructive"
        });
      } finally {
        setLoadingModel(false);
      }
    };

    initModel();
  }, [toast]);

  const handleAnalyze = async () => {
    if (!selectedImage || !selectedFile) {
      toast({
        title: "No Image Selected",
        description: "Please upload a crop image first",
        variant: "destructive"
      });
      return;
    }

    if (!isModelLoaded()) {
      toast({
        title: "Model Not Loaded",
        description: "Please upload and load the AI model first",
        variant: "destructive"
      });
      return;
    }

    setAnalyzing(true);
    try {
      // Create image element for prediction
      const img = new Image();
      img.src = selectedImage;
      
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const prediction = await predict(img);
      const treatment = getTreatment(prediction.className);

      if (!treatment) {
        throw new Error("Unknown disease class");
      }

      setResult({
        disease: prediction.className,
        confidence: prediction.probability,
        treatment
      });

      toast({
        title: "Analysis Complete",
        description: `Detected: ${treatment.disease}`
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze image",
        variant: "destructive"
      });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-earth">
      {/* Header */}
      <header className="bg-card shadow-soft border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-3">
            <Sprout className="w-8 h-8 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              CropGPT
            </h1>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-1">
            AI Farmer's Companion
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-3xl">
        <div className="space-y-6">
          {/* Loading State */}
          {loadingModel && (
            <div className="text-center py-12 animate-in fade-in-50 duration-500">
              <Sparkles className="w-12 h-12 mx-auto text-primary animate-pulse mb-4" />
              <p className="text-lg text-foreground font-medium">Loading AI Model...</p>
              <p className="text-sm text-muted-foreground mt-2">Please wait while we prepare CropGPT</p>
            </div>
          )}

          {/* Image Upload Section */}
          {!loadingModel && modelLoaded && (
            <div className="space-y-6 animate-in fade-in-50 duration-700">
              <ImageUpload
                onImageSelected={(file, url) => {
                  setSelectedFile(file);
                  setSelectedImage(url);
                  setResult(null); // Reset result when new image is selected
                }}
                disabled={analyzing}
              />

              {selectedImage && !result && (
                <Button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  size="lg"
                  className="w-full"
                >
                  {analyzing ? (
                    <>
                      <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Analyze Crop Disease
                    </>
                  )}
                </Button>
              )}

              {/* Results Section */}
              {result && (
                <div className="space-y-6">
                  <DiseaseResult
                    disease={result.disease}
                    confidence={result.confidence}
                    treatment={result.treatment}
                  />

                  {/* Weather Section */}
                  <WeatherSection
                    onWeatherFetched={(data) => setWeatherAdvice(data.advice)}
                  />

                  {/* Download Guide */}
                  <DownloadGuide
                    disease={result.disease}
                    confidence={result.confidence}
                    treatment={result.treatment}
                    weatherAdvice={weatherAdvice}
                  />

                  {/* Analyze Another Button */}
                  <Button
                    onClick={() => {
                      setSelectedImage(null);
                      setSelectedFile(null);
                      setResult(null);
                      setWeatherAdvice(undefined);
                    }}
                    variant="outline"
                    size="lg"
                    className="w-full"
                  >
                    Analyze Another Crop
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 pb-6 text-center text-sm text-muted-foreground">
        <p>Built for farmers • Works offline • Simple & effective</p>
      </footer>
    </div>
  );
}
