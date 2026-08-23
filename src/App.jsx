import React, { useEffect, useState } from 'react';
import Map from './components/Map';
import ItineraryPanel from './components/ItineraryPanel';
import SettingsModal from './components/SettingsModal';
import AboutPage from './pages/AboutPage';
import PrivacyPage from './pages/PrivacyPage';
import { useSharedTrip } from './hooks/useSharedTrip';
import { Map as MapIcon, X, AlertTriangle } from 'lucide-react';

// 라우터 라이브러리 없이도 주소로 공유되는 정적 페이지를 두기 위한 최소한의 해시 라우팅입니다.
const readRoute = () => window.location.hash.replace(/^#\/?/, '');

function App() {
  const [route, setRoute] = useState(readRoute);

  useEffect(() => {
    const onHashChange = () => setRoute(readRoute());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  if (route === 'about') return <AboutPage />;
  if (route === 'privacy') return <PrivacyPage />;
  return <TripApp />;
}

function TripApp() {
  const [activePoint, setActivePoint] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMap, setShowMobileMap] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

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

      {showSettings && (
        <SettingsModal
          config={trip.config}
          saveConfig={trip.saveConfig}
          aiPassword={trip.aiPassword}
          setAiPassword={trip.setAiPassword}
          aiBusy={trip.aiBusy}
          generatePlan={trip.generatePlan}
          onClose={() => setShowSettings(false)}
        />
      )}

      <ItineraryPanel
        config={trip.config}
        placeAnswers={trip.placeAnswers}
        askAboutPlace={trip.askAboutPlace}
        aiBusy={trip.aiBusy}
        onOpenSettings={() => setShowSettings(true)}
        saveStatus={trip.saveStatus}
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
        {showMobileMap ? <><X size={20}/> 닫기</> : <><MapIcon size={20}/> 전체 여정</>}
      </button>
    </div>
  );
}

export default App;
