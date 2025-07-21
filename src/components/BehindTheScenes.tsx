import React, { useState, useEffect } from 'react';
import { ExternalLink, Instagram, Twitter, Facebook, X } from 'lucide-react';
import { Movie, getImageUrl } from '../services/tmdb';

interface BehindTheScenesProps {
  movie: Movie;
}

const BehindTheScenes: React.FC<BehindTheScenesProps> = ({ movie }) => {
  const [selectedImageType, setSelectedImageType] = useState<'backdrops' | 'posters'>('backdrops');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showAllImages, setShowAllImages] = useState(false);

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <Instagram size={16} />;
      case 'twitter':
        return <Twitter size={16} />;
      case 'facebook':
        return <Facebook size={16} />;
      default:
        return <ExternalLink size={16} />;
    }
  };

  const getSocialUrl = (platform: string, id: string) => {
    switch (platform) {
      case 'instagram':
        return `https://instagram.com/${id}`;
      case 'twitter':
        return `https://twitter.com/${id}`;
      case 'facebook':
        return `https://facebook.com/${id}`;
      default:
        return '#';
    }
  };

  const images = movie.images?.[selectedImageType] || [];
  const socialLinks = movie.external_ids;
  const displayImages = showAllImages ? images : images.slice(0, 8);

  return (
    <div className="mt-8">
      <h3 className="text-white text-xl font-semibold mb-4">Behind the Scenes</h3>
      
      {/* Social Media Links */}
      {socialLinks && (
        <div className="mb-6">
          <h4 className="text-gray-300 text-lg font-medium mb-3">Follow</h4>
          <div className="flex space-x-4">
            {socialLinks.instagram_id && (
              <a
                href={getSocialUrl('instagram', socialLinks.instagram_id)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full hover:opacity-80 transition-opacity"
              >
                {getSocialIcon('instagram')}
                <span>Instagram</span>
              </a>
            )}
            
            {socialLinks.twitter_id && (
              <a
                href={getSocialUrl('twitter', socialLinks.twitter_id)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-full hover:opacity-80 transition-opacity"
              >
                {getSocialIcon('twitter')}
                <span>Twitter</span>
              </a>
            )}
            
            {socialLinks.facebook_id && (
              <a
                href={getSocialUrl('facebook', socialLinks.facebook_id)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-full hover:opacity-80 transition-opacity"
              >
                {getSocialIcon('facebook')}
                <span>Facebook</span>
              </a>
            )}
            
            {socialLinks.imdb_id && (
              <a
                href={`https://imdb.com/title/${socialLinks.imdb_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-yellow-600 text-white px-4 py-2 rounded-full hover:opacity-80 transition-opacity"
              >
                {getSocialIcon('imdb')}
                <span>IMDb</span>
              </a>
            )}
          </div>
        </div>
      )}

      {/* Image Gallery */}
      {images.length > 0 && (
        <div>
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setSelectedImageType('backdrops')}
              className={`px-4 py-2 rounded transition-colors ${
                selectedImageType === 'backdrops'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Behind the Scenes ({movie.images?.backdrops?.length || 0})
            </button>
            <button
              onClick={() => setSelectedImageType('posters')}
              className={`px-4 py-2 rounded transition-colors ${
                selectedImageType === 'posters'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Posters ({movie.images?.posters?.length || 0})
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayImages.map((image, index) => (
              <div key={index} className="relative group cursor-pointer">
                <img
                  src={getImageUrl(image.file_path)}
                  alt={`${selectedImageType} ${index + 1}`}
                  className="w-full h-32 md:h-40 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                  onClick={() => setSelectedImage(getImageUrl(image.file_path, 'original'))}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 rounded-lg" />
              </div>
            ))}
          </div>
          
          {images.length > 8 && (
            <div className="text-center mt-4">
              <button
                onClick={() => setShowAllImages(!showAllImages)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded transition-colors"
              >
                {showAllImages ? 'Show Less' : `Show All ${images.length} Images`}
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Full Screen Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-colors z-10"
            >
              <X size={20} />
            </button>
            <img
              src={selectedImage}
              alt="Full size image"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BehindTheScenes;