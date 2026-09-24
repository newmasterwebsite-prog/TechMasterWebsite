import React, { createContext, useContext, useState } from 'react';
import { GlobalMediaManager } from '../components/ui/GlobalMediaManager';

const MediaContext = createContext();

export const useMediaManager = () => {
  const context = useContext(MediaContext);
  if (!context) throw new Error("useMediaManager must be used within MediaProvider");
  return context;
};

export const MediaProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [onSelectCallback, setOnSelectCallback] = useState(null);
  const [mediaTypeFilter, setMediaTypeFilter] = useState(null);

  const openMediaManager = ({ onSelect, type = null }) => {
    setOnSelectCallback(() => onSelect);
    setMediaTypeFilter(type);
    setIsOpen(true);
  };

  const closeMediaManager = () => {
    setIsOpen(false);
    setOnSelectCallback(null);
    setMediaTypeFilter(null);
  };

  const handleSelectMedia = (url) => {
    if (onSelectCallback) onSelectCallback(url);
    closeMediaManager();
  };

  return (
    <MediaContext.Provider value={{ openMediaManager, closeMediaManager }}>
      {children}
      {isOpen && (
        <GlobalMediaManager 
          onClose={closeMediaManager} 
          onSelect={handleSelectMedia}
          defaultTypeFilter={mediaTypeFilter}
        />
      )}
    </MediaContext.Provider>
  );
};
