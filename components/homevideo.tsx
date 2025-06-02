"use client";

import { Card } from "./ui/card";

interface Props {
  videoUrl: string;
  posterUrl?: string;
}

export const Carousel = ({ videoUrl, posterUrl }: Props) => {
  return (
    <div className="flex justify-center items-center w-full">
      <Card className="relative overflow-hidden rounded-lg shadow-md border-gray-300 w-full max-w-6xl aspect-[16/6]">
        <video
          src={videoUrl}
          poster={posterUrl}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        />
        {/* Optional overlay for text or branding */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
      </Card>
    </div>
  );
};