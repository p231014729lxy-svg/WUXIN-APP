import React, { createContext, useContext, useState } from 'react';

const HealthContext = createContext();

export const useHealth = () => useContext(HealthContext);

export const HealthProvider = ({ children }) => {
  const [healthProfile, setHealthProfile] = useState(null);
  const [recommendations, setRecommendations] = useState(null);

  const saveProfile = (diagnosis) => {
    setHealthProfile({
      diagnosis,
      timestamp: new Date().toISOString()
    });
    // Clear old recommendations when profile updates
    setRecommendations(null);
  };

  const saveRecommendations = (recs) => {
    setRecommendations(recs);
  };

  return (
    <HealthContext.Provider value={{ 
      healthProfile, 
      saveProfile, 
      recommendations, 
      saveRecommendations 
    }}>
      {children}
    </HealthContext.Provider>
  );
};
