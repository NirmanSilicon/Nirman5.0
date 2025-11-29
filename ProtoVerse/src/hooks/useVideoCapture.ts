import { useState, useEffect, useRef, useCallback } from "react";

interface UseVideoCaptureReturn {
  videoRef: React.RefObject<HTMLVideoElement>;
  stream: MediaStream | null;
  isVideoEnabled: boolean;
  error: string | null;
  startVideo: () => Promise<void>;
  stopVideo: () => void;
  toggleVideo: () => void;
}

export function useVideoCapture(): UseVideoCaptureReturn {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasStartedRef = useRef<boolean>(false);

  const startVideo = useCallback(async () => {
    try {
      if (hasStartedRef.current) {
        console.log("Video already started; skipping getUserMedia");
        // Ensure video element is playing if stream exists
        if (videoRef.current && stream) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(console.error);
        }
        return;
      }
      setError(null);
      console.log("Requesting camera access...");

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: false, // Audio is handled separately by Retell
      });

      console.log("Camera access granted, setting up video...");
      setStream(mediaStream);
      setIsVideoEnabled(true);
      hasStartedRef.current = true;

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        // Force video to play immediately
        const playVideo = async () => {
          try {
            console.log("Attempting to play video...");
            await videoRef.current!.play();
            console.log("Video playing successfully");
          } catch (err) {
            console.error("Error playing video:", err);
            // Retry after a short delay
            setTimeout(() => {
              videoRef.current?.play().catch(console.error);
            }, 100);
          }
        };

        // Try to play immediately
        playVideo();
        
        // Also set up loadedmetadata handler as backup
        videoRef.current.onloadedmetadata = () => {
          console.log("Video metadata loaded");
          videoRef.current?.play().catch(console.error);
        };
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to access camera";
      setError(errorMessage);
      console.error("Error accessing video:", err);
    }
  }, [stream]);

  const stopVideo = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setIsVideoEnabled(false);
      hasStartedRef.current = false;

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  }, [stream]);

  const toggleVideo = useCallback(() => {
    if (stream) {
      stream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoEnabled((prev) => !prev);
    }
  }, [stream]);

  useEffect(() => {
    return () => {
      stopVideo();
    };
  }, [stopVideo]);

  return {
    videoRef,
    stream,
    isVideoEnabled,
    error,
    startVideo,
    stopVideo,
    toggleVideo,
  };
}
