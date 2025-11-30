"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { Video, VideoOff, AlertTriangle } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";

interface VideoDisplayProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  interviewerImg: string;
  isVideoEnabled: boolean;
  activeTurn: string;
  themeColor: string;
  onToggleVideo: () => void;
  violationCount?: number;
  showViolations?: boolean;
}

export function VideoDisplay({
  videoRef,
  interviewerImg,
  isVideoEnabled,
  activeTurn,
  themeColor,
  onToggleVideo,
  violationCount = 0,
  showViolations = true,
}: VideoDisplayProps) {
  // Ensure video plays when it's enabled
  useEffect(() => {
    if (isVideoEnabled && videoRef.current && videoRef.current.srcObject) {
      videoRef.current.play().catch((err) => {
        console.error("Error playing video:", err);
      });
    }
  }, [isVideoEnabled, videoRef]);

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 w-full">
      {/* Interviewer Video/Image */}
      <Card className="flex-1 relative overflow-hidden border-2">
        <div className="aspect-video relative bg-gray-100 flex items-center justify-center">
          <Image
            src={interviewerImg}
            alt="Interviewer"
            width={200}
            height={200}
            className={`object-cover rounded-full ${
              activeTurn === "agent" ? `border-4 ring-4 ring-offset-2` : ""
            }`}
            style={{
              borderColor: activeTurn === "agent" ? themeColor : "transparent",
              boxShadow:
                activeTurn === "agent" ? `0 0 20px ${themeColor}` : "none",
            }}
          />
        </div>
        <div className="absolute bottom-2 left-2 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
          Interviewer
        </div>
      </Card>

      {/* Candidate Video */}
      <Card className="flex-1 relative overflow-hidden border-2">
        <div className="aspect-video relative bg-gray-900 flex items-center justify-center">
          {isVideoEnabled ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${
                  activeTurn === "user" ? "ring-4 ring-offset-2" : ""
                }`}
                style={{
                  transform: "scaleX(-1)", // Mirror effect
                  borderColor:
                    activeTurn === "user" ? themeColor : "transparent",
                  boxShadow:
                    activeTurn === "user" ? `0 0 20px ${themeColor}` : "none",
                }}
              />
              {showViolations && violationCount > 0 && (
                <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 animate-pulse">
                  <AlertTriangle className="w-3 h-3" />
                  {violationCount} Warning{violationCount !== 1 ? "s" : ""}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-white">
              <VideoOff className="w-16 h-16 mb-2" />
              <p className="text-sm">Camera Off</p>
            </div>
          )}
        </div>
        <div className="absolute bottom-2 left-2 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
          You
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 hover:bg-white/20"
            onClick={onToggleVideo}
          >
            {isVideoEnabled ? (
              <Video className="w-4 h-4" />
            ) : (
              <VideoOff className="w-4 h-4" />
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
