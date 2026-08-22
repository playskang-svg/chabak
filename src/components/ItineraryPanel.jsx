import React, { useEffect, useRef, useMemo, useState } from 'react';
import { Info, ExternalLink, Navigation, Search, CheckCircle, ListTodo, Edit3, Plus, Trash2, Zap, Settings, Save, Backpack } from 'lucide-react';

// 준비물 원본은 UpNote 공유 노트에서 관리합니다.
const PACKING_NOTE_URL = 'https://getupnote.com/share/notes/g7PMwusXenRBTR9rjTupYw2z7QU2/01A0269E-9438-753E-B8BF-A840C41BF3A6';

const ItineraryPanel = ({ 
  itinerary,
  activePoint, 
  setActivePoint, 
  searchQuery, 
  setSearchQuery, 
  visitedPoints, 
  toggleVisit,
  memos,
  updateMemo,
  checklist,
  addChecklistItem,
  toggleChecklistItem,
  deleteChecklistItem,
  updatePoint,
  deletePoint,
  photos,
  handlePhotoUpload,
  deletePhoto,
  selectedRoutePoints,
  toggleRoutePoint
}) => {
  const itemRefs = useRef({});
  const [showChecklist, setShowChecklist] = useState(false);
  const [activeChecklistTab, setActiveChecklistTab] = useState('human');
  const [newChecklistText, setNewChecklistText] = useState('');
  const [editingMemoId, setEditingMemoId] = useState(null);
  const fileInputRefs = useRef({});
  
  // Edit mode states
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingPointId, setEditingPointId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', desc: '' });

  // Scroll to active item when selected from map
  useEffect(() => {
    if (activePoint && itemRefs.current[activePoint.id]) {
      itemRefs.current[activePoint.id].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activePoint]);

  // Calculate Progress
  const totalPoints = useMemo(() => itinerary.reduce((acc, day) => acc + day.points.length, 0), [itinerary]);
  const progressPercent = totalPoints === 0 ? 0 : Math.round((visitedPoints.length / totalPoints) * 100);

  // Filter itinerary based on search query
  const filteredItinerary = useMemo(() => {
    // 편집/삭제는 원본 itinerary의 인덱스를 써야 하므로 필터링 전에 붙여 둡니다.
    const indexedItinerary = itinerary.map((day, dayIndex) => ({ ...day, dayIndex }));
    if (!searchQuery.trim()) return indexedItinerary;
    const lowerQuery = searchQuery.toLowerCase();
    
    return indexedItinerary.map(day => {
      const filteredPoints = day.points.filter(point => 
        (point.name || '').toLowerCase().includes(lowerQuery) || 
        (point.desc || '').toLowerCase().includes(lowerQuery) ||
        (point.tips && point.tips.toLowerCase().includes(lowerQuery)) ||
        (memos[point.id] && memos[point.id].toLowerCase().includes(lowerQuery))
      );
      return { ...day, points: filteredPoints };
    }).filter(day => day.points.length > 0);
  }, [searchQuery, memos, itinerary]);

  const handleAddChecklist = (e) => {
    e.preventDefault();
    if (newChecklistText.trim()) {
      addChecklistItem(newChecklistText.trim(), activeChecklistTab);
      setNewChecklistText('');
    }
  };

  const startEditingPoint = (point) => {
    setEditingPointId(point.id);
    setEditForm({ name: point.name, desc: point.desc });
  };

  const saveEditingPoint = (dayIndex, pointId) => {
    updatePoint(dayIndex, pointId, editForm.name, editForm.desc);
    setEditingPointId(null);
  };

  return (
    <div className="panel-container">
      <div className="panel-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>🐾 아토와 차박여행</h1>
          <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
            <a 
              href="https://map.kakao.com/?q=전기차충전소"
              target="_blank"
              rel="noopener noreferrer"
              className="header-icon-btn"
              title="EV 충전소 찾기"
              style={{ color: '#FDE047' }}
            >
              <Zap size={22} fill="currentColor" />
            </a>
            <a
              href={PACKING_NOTE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="header-icon-btn"
              title="준비물 확인 (UpNote 노트)"
            >
              <Backpack size={22} />
            </a>
            <button 
              className="header-icon-btn" 
              onClick={() => setShowChecklist(!showChecklist)}
              title="준비물 체크리스트"
            >
              <ListTodo size={24} />
            </button>
            <button 
              className={`header-icon-btn ${isEditMode ? 'active-edit' : ''}`}
              onClick={() => {
                setIsEditMode(!isEditMode);
                setEditingPointId(null);
              }}
              title="여정 편집 모드"
              style={isEditMode ? { background: '#FCA5A5', color: '#7F1D1D' } : {}}
            >
              <Settings size={22} />
            </button>
          </div>
        </div>
        <p>천안 출발 4박 5일 해안선 투어 (EV6 & 보더콜리 아토 🐶)</p>
        
        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-texts">
            <span>진행률</span>
            <span>{progressPercent}% ({visitedPoints.length}/{totalPoints})</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}>
              <span className="car-icon">🚙</span>
            </div>
          </div>
        </div>

        <div className="search-bar" style={{ marginTop: '16px' }}>
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="장소, 특징, 메모 검색..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="itinerary-list">
        {/* Checklist Section */}
        {showChecklist && (
          <div className="checklist-container">
            <h3 className="checklist-title">🎒 짐 챙기기 체크리스트</h3>
            
            <div className="checklist-tabs">
              <button 
                className={`tab-btn ${activeChecklistTab === 'human' ? 'active' : ''}`}
                onClick={() => setActiveChecklistTab('human')}
              >
                🙋‍♂️ 내 짐
              </button>
              <button 
                className={`tab-btn ${activeChecklistTab === 'dog' ? 'active' : ''}`}
                onClick={() => setActiveChecklistTab('dog')}
              >
                🐶 아토 짐
              </button>
            </div>

            <ul className="checklist-items">
              {checklist.filter(item => item.category === activeChecklistTab).map(item => (
                <li key={item.id} className={`checklist-item ${item.completed ? 'completed' : ''}`}>
                  <label className="checklist-label">
                    <input 
                      type="checkbox" 
                      checked={item.completed} 
                      onChange={() => toggleChecklistItem(item.id)}
                    />
                    <span>{item.text}</span>
                  </label>
                  <button className="delete-btn" onClick={() => deleteChecklistItem(item.id)}>
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
            <form onSubmit={handleAddChecklist} className="checklist-form">
              <input 
                type="text" 
                placeholder={`${activeChecklistTab === 'human' ? '내' : '아토'} 준비물 추가...`}
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
              />
              <button type="submit"><Plus size={16} /></button>
            </form>
          </div>
        )}

        {isEditMode && (
          <div className="edit-mode-banner">
            ⚙️ 편집 모드가 켜져있습니다. 지도에서 원하는 위치를 클릭해 새 장소를 추가할 수도 있습니다.
          </div>
        )}

        {filteredItinerary.length === 0 ? (
          <div className="empty-search">검색 결과가 없거나 일정이 비어있습니다.</div>
        ) : (
          filteredItinerary.map((day) => (
            <div key={day.day} className="day-section">
              <h2 className="day-title">{day.title}</h2>
              
              {day.points.map((point) => {
                const isVisited = visitedPoints.includes(point.id);
                const isEditingThisPoint = isEditMode && editingPointId === point.id;
                const isSelected = selectedRoutePoints.includes(point.id);
                const hasMemo = memos[point.id] && memos[point.id].trim().length > 0;
                const isEditingMemo = editingMemoId === point.id;
                
                return (
                  <div 
                    key={point.id}
                    ref={(el) => (itemRefs.current[point.id] = el)}
                    className={`point-card type-${point.type} ${activePoint?.id === point.id ? 'active' : ''} ${!isSelected ? 'unselected-card' : ''} ${isVisited ? 'visited-dimmed' : ''}`}
                    onClick={() => !isEditingThisPoint && setActivePoint(point)}
                  >
                    {isVisited && (
                      <div className="stamp-overlay">
                        <CheckCircle size={48} color="#059669" />
                        <span>방문 완료</span>
                      </div>
                    )}
                    
                    {/* Point Edit UI */}
                    {isEditingThisPoint ? (
                      <div className="point-edit-form" onClick={(e) => e.stopPropagation()}>
                        <input 
                          type="text" 
                          value={editForm.name} 
                          onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                          placeholder="장소 이름"
                          className="edit-input font-bold"
                        />
                        <textarea 
                          value={editForm.desc} 
                          onChange={(e) => setEditForm({...editForm, desc: e.target.value})}
                          placeholder="장소 설명"
                          className="edit-textarea"
                        />
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '8px' }}>
                          <button onClick={() => setEditingPointId(null)} className="btn-cancel">취소</button>
                          <button onClick={() => saveEditingPoint(day.dayIndex, point.id)} className="btn-save"><Save size={14}/> 저장</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="card-header">
                          <h3 className="card-title">
                            {point.name}
                          </h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className={`card-badge badge-${point.type}`}>
                              {point.type === 'stay' ? '1박 차박지' : point.type === 'waypoint' ? '경유지' : '출발/도착'}
                            </span>
                            
                            <label className="route-toggle-label" onClick={(e) => e.stopPropagation()}>
                              <input 
                                type="checkbox" 
                                checked={isSelected}
                                onChange={() => toggleRoutePoint(point.id)}
                              />
                              <span className="route-toggle-text">경로 포함</span>
                            </label>

                            {isEditMode && (
                              <div className="edit-actions" onClick={(e) => e.stopPropagation()}>
                                <button onClick={() => startEditingPoint(point)} className="icon-btn edit"><Edit3 size={14}/></button>
                                <button onClick={() => deletePoint(day.dayIndex, point.id)} className="icon-btn delete"><Trash2 size={14}/></button>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <p className="card-desc">{point.desc}</p>
                      </>
                    )}
                    
                    {!isEditingThisPoint && point.tips && (
                      <div className="card-tips">
                        <Info size={16} />
                        <span>{point.tips}</span>
                      </div>
                    )}
                    
                    {/* Facilities Section for Stays */}
                    {!isEditingThisPoint && point.type === 'stay' && point.facilities && (
                      <div className="facilities-section">
                        {point.facilities.restroom && <span className="fac-badge">🚻 화장실</span>}
                        {point.facilities.shower && <span className="fac-badge">🚿 샤워실</span>}
                        {point.facilities.private && <span className="fac-badge">⛺ 프라이빗</span>}
                      </div>
                    )}

                    {/* Memo Section */}
                    {!isEditingThisPoint && (
                      <div className="memo-section" onClick={(e) => e.stopPropagation()}>
                        {(hasMemo || isEditingMemo) ? (
                          <div className="memo-content">
                            <div className="memo-header">
                              <span className="memo-title"><Edit3 size={12} /> 장소 메모</span>
                              <button className="memo-edit-btn" onClick={() => setEditingMemoId(isEditingMemo ? null : point.id)}>
                                {isEditingMemo ? '닫기' : '수정'}
                              </button>
                            </div>
                            {isEditingMemo ? (
                              <textarea 
                                className="memo-textarea"
                                placeholder="이 장소에 대한 메모를 남겨보세요..."
                                value={memos[point.id] || ''}
                                onChange={(e) => updateMemo(point.id, e.target.value)}
                                autoFocus
                              />
                            ) : (
                              <p className="memo-text">{memos[point.id]}</p>
                            )}
                          </div>
                        ) : (
                          <button className="memo-add-btn" onClick={() => setEditingMemoId(point.id)}>
                            <Edit3 size={14} /> 메모 추가하기
                          </button>
                        )}
                      </div>
                    )}

                    {/* Photo Album Section */}
                    {!isEditingThisPoint && (
                      <div className="photo-album-section" onClick={e => e.stopPropagation()}>
                        <div className="album-header">
                          <span className="album-title">📸 추억 앨범</span>
                          <button 
                            className="btn-add-photo" 
                            onClick={() => fileInputRefs.current[point.id]?.click()}
                          >
                            <Plus size={14} /> 사진 추가
                          </button>
                          <input 
                            type="file" 
                            accept="image/*" 
                            style={{ display: 'none' }}
                            ref={el => fileInputRefs.current[point.id] = el}
                            onChange={(e) => {
                              if(e.target.files && e.target.files[0]) {
                                handlePhotoUpload(point.id, e.target.files[0]);
                              }
                              e.target.value = null; // reset
                            }}
                          />
                        </div>
                        
                        {photos[point.id] && photos[point.id].length > 0 && (
                          <div className="album-gallery">
                            {photos[point.id].map((photo, idx) => (
                              <div key={photo.id} className="photo-card">
                                <img src={photo.url} alt={`추억 ${idx+1}`} loading="lazy" />
                                <button className="btn-delete-photo" onClick={() => deletePhoto(point.id, photo.id)}>
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {!isEditingThisPoint && (() => {
                      const cleanName = point.name.replace(/\s*\(.*?\)/g, '').trim();
                      return (
                      <div className="card-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <a 
                            href={`https://map.kakao.com/link/to/${cleanName},${point.coords[0]},${point.coords[1]}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="card-link"
                            onClick={(e) => e.stopPropagation()}
                            style={{ background: '#FEE500', color: '#000000' }}
                          >
                            <Navigation size={14} /> 카카오
                          </a>
                          <a 
                            href={`https://map.naver.com/v5/search/${cleanName}?c=${point.coords[1]},${point.coords[0]},15,0,0,0,dh`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="card-link"
                            onClick={(e) => e.stopPropagation()}
                            style={{ background: '#03C75A', color: '#ffffff' }}
                          >
                            <Navigation size={14} /> 네이버
                          </a>
                          {point.link && (
                            <a 
                              href={point.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="card-link"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink size={14} /> 관련 정보
                            </a>
                          )}
                        </div>
                        
                        <button 
                          className={`stamp-btn ${isVisited ? 'stamped' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleVisit(point.id);
                          }}
                          title="방문 도장 찍기"
                        >
                          <CheckCircle size={20} />
                          {isVisited ? '도장 취소' : '도장 꾹!'}
                        </button>
                      </div>
                      );
                    })()}
                  </div>
                );
              })}
            </div>
          ))
        )}
        
        <div style={{ height: '50px' }}></div>
      </div>
    </div>
  );
};

export default ItineraryPanel;
