import { useState, useEffect, useRef, useCallback } from "react";
import { FaceDetector, FilesetResolver } from "@mediapipe/tasks-vision";

export interface MotionViolation {
  type: "no_face" | "multiple_faces" | "looking_away" | "suspicious_movement";
  timestamp: number;
  description: string;
}

export interface MotionDetectionStats {
  violations: MotionViolation[];
  noFaceDetectedCount: number;
  multipleFacesCount: number;
  lookingAwayCount: number;
  suspiciousMovementCount: number;
}

interface UseMotionDetectionOptions {
  enabled: boolean;
  videoElement: HTMLVideoElement | null;
  onViolation?: (violation: MotionViolation) => void;
}

interface UseMotionDetectionReturn {
  stats: MotionDetectionStats;
  isDetecting: boolean;
  error: string | null;
}

export function useMotionDetection({
  enabled,
  videoElement,
  onViolation,
}: UseMotionDetectionOptions): UseMotionDetectionReturn {
  const [stats, setStats] = useState<MotionDetectionStats>({
    violations: [],
    noFaceDetectedCount: 0,
    multipleFacesCount: 0,
    lookingAwayCount: 0,
    suspiciousMovementCount: 0,
  });
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const faceDetectorRef = useRef<FaceDetector | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastPositionRef = useRef<{ x: number; y: number } | null>(null);
  const noFaceFramesRef = useRef<number>(0);
  const lastViolationTimeRef = useRef<number>(0);

  // Initialize FaceDetector
  useEffect(() => {
    let isMounted = true;

    const initializeFaceDetector = async () => {
      try {
        console.log("Initializing MediaPipe face detector...");
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
        );

        const detector = await FaceDetector.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          minDetectionConfidence: 0.5,
        });

        if (isMounted) {
          faceDetectorRef.current = detector;
          console.log("Face detector initialized successfully");
        }
      } catch (err) {
        console.error("Failed to initialize face detector:", err);
        if (isMounted) {
          setError("Failed to initialize motion detection");
        }
      }
    };

    initializeFaceDetector();

    return () => {
      isMounted = false;
      if (faceDetectorRef.current) {
        faceDetectorRef.current.close();
      }
    };
  }, []);

  const addViolation = useCallback(
    (type: MotionViolation["type"], description: string) => {
      const now = Date.now();

      console.log(
        `Violation attempt: ${type} - ${description}, last violation: ${now - lastViolationTimeRef.current}ms ago`,
      );

      // Throttle violations - only report same type every 5 seconds
      if (now - lastViolationTimeRef.current < 5000) {
        console.log("Violation throttled (too soon)");
        return;
      }

      const violation: MotionViolation = {
        type,
        timestamp: now,
        description,
      };

      console.log("Violation recorded:", violation);

      setStats((prev) => ({
        ...prev,
        violations: [...prev.violations, violation],
        noFaceDetectedCount:
          type === "no_face"
            ? prev.noFaceDetectedCount + 1
            : prev.noFaceDetectedCount,
        multipleFacesCount:
          type === "multiple_faces"
            ? prev.multipleFacesCount + 1
            : prev.multipleFacesCount,
        lookingAwayCount:
          type === "looking_away"
            ? prev.lookingAwayCount + 1
            : prev.lookingAwayCount,
        suspiciousMovementCount:
          type === "suspicious_movement"
            ? prev.suspiciousMovementCount + 1
            : prev.suspiciousMovementCount,
      }));

      lastViolationTimeRef.current = now;
      onViolation?.(violation);
    },
    [onViolation],
  );

  const detectFaces = useCallback(
    (timestamp: number) => {
      if (!enabled || !videoElement || !faceDetectorRef.current) {
        if (enabled && !videoElement) {
          console.warn("Motion detection enabled but no video element");
        }
        if (enabled && !faceDetectorRef.current) {
          console.warn("Motion detection enabled but detector not initialized");
        }
        return;
      }

      // Check if video is actually playing
      if (videoElement.paused) {
        console.warn("Video is paused, waiting for playback...");
        animationFrameRef.current = requestAnimationFrame(detectFaces);
        return;
      }
      
      if (videoElement.readyState < 2) {
        console.warn(`Video not ready (readyState: ${videoElement.readyState}), waiting...`);
        animationFrameRef.current = requestAnimationFrame(detectFaces);
        return;
      }

      try {
        const detections = faceDetectorRef.current.detectForVideo(
          videoElement,
          timestamp,
        );
        const faceCount = detections.detections.length;

        // Log every 30 frames (~1 second)
        if (Math.floor(timestamp / 1000) % 1 < 0.05) {
          console.log(`Face detection running - Faces detected: ${faceCount}`);
        }

        if (detections.detections.length === 0) {
          noFaceFramesRef.current += 1;

          // If no face detected for 30 consecutive frames (~1 second at 30fps)
          if (noFaceFramesRef.current > 30) {
            addViolation("no_face", "No face detected in frame");
            noFaceFramesRef.current = 0;
          }
        } else if (detections.detections.length > 1) {
          noFaceFramesRef.current = 0;
          addViolation(
            "multiple_faces",
            `${detections.detections.length} faces detected`,
          );
        } else {
          noFaceFramesRef.current = 0;
          const detection = detections.detections[0];

          // Check face position for looking away
          const boundingBox = detection.boundingBox;
          if (boundingBox) {
            const centerX = boundingBox.originX + boundingBox.width / 2;
            const centerY = boundingBox.originY + boundingBox.height / 2;

            // Check if face is centered (looking at camera)
            const isLookingAway =
              centerX < videoElement.videoWidth * 0.2 ||
              centerX > videoElement.videoWidth * 0.8 ||
              centerY < videoElement.videoHeight * 0.2 ||
              centerY > videoElement.videoHeight * 0.8;

            if (isLookingAway) {
              addViolation(
                "looking_away",
                "Candidate appears to be looking away from camera",
              );
            }

            // Check for suspicious movement (rapid position changes)
            if (lastPositionRef.current) {
              const deltaX = Math.abs(centerX - lastPositionRef.current.x);
              const deltaY = Math.abs(centerY - lastPositionRef.current.y);
              const movement = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

              // If movement is too large between frames
              if (movement > videoElement.videoWidth * 0.3) {
                addViolation(
                  "suspicious_movement",
                  "Rapid or suspicious movement detected",
                );
              }
            }

            lastPositionRef.current = { x: centerX, y: centerY };
          }
        }
      } catch (err) {
        console.error("Error during face detection:", err);
      }

      // Continue detection loop
      animationFrameRef.current = requestAnimationFrame(detectFaces);
    },
    [enabled, videoElement, addViolation],
  );

  // Start/stop detection based on enabled state
  useEffect(() => {
    if (enabled && videoElement && faceDetectorRef.current) {
      console.log("Starting motion detection...");
      setIsDetecting(true);
      animationFrameRef.current = requestAnimationFrame(detectFaces);
    } else {
      if (isDetecting) {
        console.log("Stopping motion detection...");
      }
      setIsDetecting(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [enabled, videoElement, detectFaces, isDetecting]);

  return {
    stats,
    isDetecting,
    error,
  };
}
