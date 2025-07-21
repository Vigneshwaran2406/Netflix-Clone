import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

interface TrailerPlayerProps {
  videoKey: string;
  onClose: () => void;
}

const TrailerPlayer: React.FC<TrailerPlayerProps> = ({ videoKey, onClose }) => {
  if (!videoKey) {
    return (
      <div className="w-full h-64 md:h-80 bg-gray-800 flex flex-col items-center justify-center rounded-t-lg">
        <AlertCircle className="text-gray-400 mb-4" size={48} />
        <p className="text-gray-400 text-center">
          Trailer not available
        </p>
        <button
          onClick={onClose}
          className="mt-4 text-red-600 hover:text-red-400 transition-colors"
        >
          Close Trailer
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-64 md:h-80 rounded-t-lg overflow-hidden">
      <iframe
        src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0`}
        title="Trailer"
        className="w-full h-full"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default TrailerPlayer;