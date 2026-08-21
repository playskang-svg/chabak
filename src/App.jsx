import React, { useState, useEffect } from 'react';
import Map from './components/Map';
import ItineraryPanel from './components/ItineraryPanel';
import { itinerary as initialItinerary } from './data/itinerary';
import { Map as MapIcon, X } from 'lucide-react';

function App() {
  const [activePoint, setActivePoint] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMap, setShowMobileMap] = useState(false);
  
  // Load itinerary from localStorage, fallback to initialItinerary
  const [itineraryState, setItineraryState] = useState(() => {
    const saved = localStorage.getItem('itineraryState');
    return saved ? JSON.parse(saved) : initialItinerary;
  });

  const [visitedPoints, setVisitedPoints] = useState(() => {
    const saved = localStorage.getItem('visitedPoints');
    return saved ? JSON.parse(saved) : [];
  });

  const [memos, setMemos] = useState(() => {
    const saved = localStorage.getItem('itineraryMemos');
    return saved ? JSON.parse(saved) : {};
  });

  const [checklist, setChecklist] = useState(() => {
    const saved = localStorage.getItem('itineraryChecklist');
    const parsed = saved ? JSON.parse(saved) : null;
    if (parsed && parsed.length > 0 && parsed[0].category) {
      return parsed; // already migrated
    }
    // Default categorized list
    return [
      { id: 'h1', text: '여벌 옷 및 세면도구', completed: false, category: 'human' },
      { id: 'h2', text: '차박용 평탄화 매트 & 침낭', completed: false, category: 'human' },
      { id: 'h3', text: '랜턴 및 보조배터리', completed: false, category: 'human' },
      { id: 'd1', text: '아토 롱리드줄 & 원반 장난감', completed: false, category: 'dog' },
      { id: 'd2', text: '에너지 넘치는 아토를 위한 충분한 사료 및 간식', completed: false, category: 'dog' },
      { id: 'd3', text: '배변봉투 넉넉히', completed: false, category: 'dog' },
      { id: 'd4', text: '아토 전용 수건 및 물통', completed: false, category: 'dog' },
    ];
  });

  const [photos, setPhotos] = useState(() => {
    const saved = localStorage.getItem('itineraryPhotos');
    return saved ? JSON.parse(saved) : {};
  });

  const [selectedRoutePoints, setSelectedRoutePoints] = useState(() => {
    const saved = localStorage.getItem('itinerarySelectedRoute');
    if (saved) return JSON.parse(saved);
    // 기본적으로 모든 포인트 ID를 선택 상태로 초기화
    return initialItinerary.flatMap(day => day.points.map(p => p.id));
  });

  // Force sync itinerary to apply new data if no facilities are present in day1 stay
  useEffect(() => {
    if (itineraryState[0] && itineraryState[0].points) {
      const stayPoint = itineraryState[0].points.find(p => p.type === 'stay');
      if (stayPoint && !stayPoint.facilities) {
        setItineraryState(initialItinerary);
      }
    }
  }, [itineraryState]);

  // Persist states
  useEffect(() => {
    localStorage.setItem('itineraryState', JSON.stringify(itineraryState));
  }, [itineraryState]);

  useEffect(() => {
    localStorage.setItem('visitedPoints', JSON.stringify(visitedPoints));
  }, [visitedPoints]);

  useEffect(() => {
    localStorage.setItem('itineraryMemos', JSON.stringify(memos));
  }, [memos]);

  useEffect(() => {
    localStorage.setItem('itineraryChecklist', JSON.stringify(checklist));
  }, [checklist]);

  useEffect(() => {
    localStorage.setItem('itineraryPhotos', JSON.stringify(photos));
  }, [photos]);

  useEffect(() => {
    localStorage.setItem('itinerarySelectedRoute', JSON.stringify(selectedRoutePoints));
  }, [selectedRoutePoints]);

  const toggleVisit = (id) => {
    setVisitedPoints(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const toggleRoutePoint = (id) => {
    setSelectedRoutePoints(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const updateMemo = (id, text) => {
    setMemos(prev => ({
      ...prev,
      [id]: text
    }));
  };

  const addChecklistItem = (text, category) => {
    const newItem = { id: Date.now().toString(), text, completed: false, category };
    setChecklist(prev => [...prev, newItem]);
  };

  const toggleChecklistItem = (id) => {
    setChecklist(prev => 
      prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item)
    );
  };

  const deleteChecklistItem = (id) => {
    setChecklist(prev => prev.filter(item => item.id !== id));
  };

  // Itinerary Editing Functions
  const updatePoint = (dayIndex, pointId, newName, newDesc) => {
    setItineraryState(prev => {
      const newState = [...prev];
      const points = newState[dayIndex].points.map(p => 
        p.id === pointId ? { ...p, name: newName, desc: newDesc } : p
      );
      newState[dayIndex] = { ...newState[dayIndex], points };
      return newState;
    });
  };

  const deletePoint = (dayIndex, pointId) => {
    setItineraryState(prev => {
      const newState = [...prev];
      newState[dayIndex].points = newState[dayIndex].points.filter(p => p.id !== pointId);
      return newState;
    });
  };

  const addPointToDay = (dayIndex, point) => {
    setItineraryState(prev => {
      const newState = [...prev];
      newState[dayIndex].points.push(point);
      return newState;
    });
  };

  // Image compression & upload handler
  const handlePhotoUpload = (pointId, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 600;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7); // Compress to 70% quality JPEG
        
        setPhotos(prev => ({
          ...prev,
          [pointId]: [...(prev[pointId] || []), dataUrl]
        }));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const deletePhoto = (pointId, photoIndex) => {
    setPhotos(prev => {
      const newPhotos = (prev[pointId] || []).filter((_, idx) => idx !== photoIndex);
      return { ...prev, [pointId]: newPhotos };
    });
  };

  return (
    <div className="app-container">
      <ItineraryPanel 
        itinerary={itineraryState}
        activePoint={activePoint} 
        setActivePoint={setActivePoint}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        visitedPoints={visitedPoints}
        toggleVisit={toggleVisit}
        memos={memos}
        updateMemo={updateMemo}
        checklist={checklist}
        addChecklistItem={addChecklistItem}
        toggleChecklistItem={toggleChecklistItem}
        deleteChecklistItem={deleteChecklistItem}
        updatePoint={updatePoint}
        deletePoint={deletePoint}
        photos={photos}
        handlePhotoUpload={handlePhotoUpload}
        deletePhoto={deletePhoto}
        selectedRoutePoints={selectedRoutePoints}
        toggleRoutePoint={toggleRoutePoint}
      />
      <Map 
        itinerary={itineraryState}
        activePoint={activePoint} 
        setActivePoint={setActivePoint}
        searchQuery={searchQuery}
        visitedPoints={visitedPoints}
        addPointToDay={addPointToDay}
        selectedRoutePoints={selectedRoutePoints}
        showMobileMap={showMobileMap}
      />
      
      {/* Mobile Map Toggle Button */}
      <button 
        className={`mobile-map-toggle ${showMobileMap ? 'active' : ''}`}
        onClick={() => setShowMobileMap(!showMobileMap)}
      >
        {showMobileMap ? <><X size={20}/> 닫기</> : <><MapIcon size={20}/> 지도 보기</>}
      </button>
    </div>
  );
}

export default App;
