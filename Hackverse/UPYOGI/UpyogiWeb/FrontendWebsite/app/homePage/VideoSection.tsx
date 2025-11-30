"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const VideoSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <section className="relative pt-8 pb-20 lg:pt-12 lg:pb-32 bg-gradient-to-br from-background via-muted/20 to-accent/5 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge
            variant="secondary"
            className="mb-6 px-4 py-2 bg-primary/10 text-primary border-primary/20"
          >
            Platform Demo
          </Badge>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6">
            See upyogi in
            <br />
            <span className="bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
              Action
            </span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-body max-w-3xl mx-auto">
            Watch how our comprehensive Panchakarma management platform
            transforms traditional Ayurvedic healthcare with modern technology,
            streamlining every aspect of patient care from scheduling to
            recovery tracking.
          </p>
        </motion.div>

        {/* Video Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative group"
        >
          <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl bg-card border border-border/50">
            {/* Video Element */}
            <video
              ref={videoRef}
              className="w-full aspect-video object-cover"
              src="https://ayusutra.vercel.app/mainvideo.mp4"
              muted={isMuted}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              poster="/hero_img.jpg" // Using your hero image as poster
            >
              Your browser does not support the video tag.
            </video>

            {/* Video Controls Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  onClick={togglePlay}
                  size="lg"
                  className="w-16 h-16 rounded-full bg-white/90 hover:bg-white text-black hover:text-black shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-110"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 ml-0.5" />
                  ) : (
                    <Play className="w-6 h-6 ml-1" />
                  )}
                </Button>
              </div>

              {/* Bottom Controls */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={toggleMute}
                    size="sm"
                    variant="secondary"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-sm"
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                <Button
                  onClick={toggleFullscreen}
                  size="sm"
                  variant="secondary"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-sm"
                >
                  <Maximize className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Play button for initial state */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                {/* Ripple Effect Rings */}
                <div className="absolute">
                  <div className="w-20 h-20 rounded-full bg-white/20 animate-ping"></div>
                </div>
                <div className="absolute">
                  <div className="w-32 h-32 rounded-full bg-white/10 animate-ping animation-delay-75"></div>
                </div>
                <div className="absolute">
                  <div className="w-44 h-44 rounded-full bg-white/5 animate-ping animation-delay-150"></div>
                </div>

                {/* Play Button */}
                <Button
                  onClick={togglePlay}
                  size="lg"
                  className="relative z-10 w-20 h-20 rounded-full bg-white/90 hover:bg-white text-black hover:text-black shadow-xl transition-all duration-300 hover:scale-110"
                >
                  <Play className="w-8 h-8 ml-1" />
                </Button>
              </div>
            )}

            {/* Gradient border effect */}
            <div className="absolute inset-0 rounded-2xl lg:rounded-3xl bg-gradient-to-r from-primary/20 via-transparent to-accent/20 p-[2px] pointer-events-none">
              <div className="w-full h-full rounded-2xl lg:rounded-3xl bg-transparent" />
            </div>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground font-body mb-6">
            Ready to transform your Ayurvedic practice?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8 py-3 text-base">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-3 text-base">
              Schedule Demo
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
