import React, { useState } from 'react';
import Map from './components/Map';
import ItineraryPanel from './components/ItineraryPanel';
import { useSharedTrip } from './hooks/useSharedTrip';
import { Map as MapIcon, X, AlertTriangle } from 'lucide-react';

function App() {
  const [activePoint, setActivePoint] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMap, setShowMobileMap] = useState(false);

  // 여정·메모·준비물·사진은 모두 공유 저장소에 있습니다. 동행자의 변경은 실시간으로 들어옵니다.
  const trip = useSharedTrip();

  if (trip.status === 'loading') {
    return (
      <div className="app-loading">
        <span className="app-loading-icon">🚙</span>
        <p>여행 기록을 불러오는 중…</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      {trip.errorMessage && (
        <div className="app-error-banner" role="alert">
          <AlertTriangle size={16} />
          <span>{trip.errorMessage}</span>
          <button onClick={trip.dismissError} aria-label="닫기"><X size={14} /></button>
        </div>
      )}

      <ItineraryPanel
        itinerary={trip.itineraryState}
        activePoint={activePoint}
        setActivePoint={setActivePoint}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        visitedPoints={trip.visitedPoints}
        toggleVisit={trip.toggleVisit}
        memos={trip.memos}
        updateMemo={trip.updateMemo}
        checklist={trip.checklist}
        addChecklistItem={trip.addChecklistItem}
        toggleChecklistItem={trip.toggleChecklistItem}
        deleteChecklistItem={trip.deleteChecklistItem}
        updatePoint={trip.updatePoint}
        deletePoint={trip.deletePoint}
        photos={trip.photos}
        handlePhotoUpload={trip.handlePhotoUpload}
        deletePhoto={trip.deletePhoto}
        selectedRoutePoints={trip.selectedRoutePoints}
        toggleRoutePoint={trip.toggleRoutePoint}
      />
      <Map
        itinerary={trip.itineraryState}
        activePoint={activePoint}
        setActivePoint={setActivePoint}
        searchQuery={searchQuery}
        visitedPoints={trip.visitedPoints}
        addPointToDay={trip.addPointToDay}
        selectedRoutePoints={trip.selectedRoutePoints}
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
