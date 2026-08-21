import React, { useState, useEffect, useRef } from 'react';
import Map from './components/Map';
import ItineraryPanel from './components/ItineraryPanel';
import { itinerary as initialItinerary } from './data/itinerary';
import { Map as MapIcon, X } from 'lucide-react';

const STORAGE_FULL_MESSAGE =
  '브라우저 저장 공간이 가득 차 변경 사항을 저장하지 못했습니다.\n사진 몇 장을 삭제한 뒤 다시 시도해 주세요.';

// 저장된 값이 손상되었거나 localStorage 접근이 막혀도 앱이 멈추지 않도록 기본값으로 되돌립니다.
const loadState = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

// 저장 실패(주로 사진 때문에 발생하는 용량 초과)를 예외 대신 false로 알려줍니다.
const saveState = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

function App() {
  const [activePoint, setActivePoint] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMap, setShowMobileMap] = useState(false);
  
  // 저장된 여정을 불러오되, 시설 정보가 없는 옛 데이터라면 최신 기본 여정으로 교체합니다.
  const [itineraryState, setItineraryState] = useState(() => {
    const saved = loadState('itineraryState', null);
    if (!saved) return initialItinerary;
    const stayPoint = saved[0]?.points?.find(p => p.type === 'stay');
    if (stayPoint && !stayPoint.facilities) return initialItinerary;
    return saved;
  });

  const [visitedPoints, setVisitedPoints] = useState(() => loadState('visitedPoints', []));

  const [memos, setMemos] = useState(() => loadState('itineraryMemos', {}));

  const [checklist, setChecklist] = useState(() => {
    const parsed = loadState('itineraryChecklist', null);
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

  const [photos, setPhotos] = useState(() => loadState('itineraryPhotos', {}));

  const [selectedRoutePoints, setSelectedRoutePoints] = useState(() => {
    const saved = loadState('itinerarySelectedRoute', null);
    if (saved) return saved;
    // 기본적으로 모든 포인트 ID를 선택 상태로 초기화
    return initialItinerary.flatMap(day => day.points.map(p => p.id));
  });

  // 저장에 실패하면 세션당 한 번만 알립니다. (effect 안에서 setState를 호출하지 않도록 ref 사용)
  const quotaAlerted = useRef(false);
  const persist = (key, value) => {
    if (saveState(key, value) || quotaAlerted.current) return;
    quotaAlerted.current = true;
    alert(STORAGE_FULL_MESSAGE);
  };

  // Persist states
  useEffect(() => {
    persist('itineraryState', itineraryState);
  }, [itineraryState]);

  useEffect(() => {
    persist('visitedPoints', visitedPoints);
  }, [visitedPoints]);

  useEffect(() => {
    persist('itineraryMemos', memos);
  }, [memos]);

  useEffect(() => {
    persist('itineraryChecklist', checklist);
  }, [checklist]);

  useEffect(() => {
    persist('itineraryPhotos', photos);
  }, [photos]);

  useEffect(() => {
    persist('itinerarySelectedRoute', selectedRoutePoints);
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
    setItineraryState(prev => prev.map((day, idx) =>
      idx === dayIndex
        ? { ...day, points: day.points.filter(p => p.id !== pointId) }
        : day
    ));
  };

  const addPointToDay = (dayIndex, point) => {
    setItineraryState(prev => prev.map((day, idx) =>
      idx === dayIndex
        ? { ...day, points: [...day.points, point] }
        : day
    ));
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
