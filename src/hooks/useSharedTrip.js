import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase, PHOTO_BUCKET, photoUrl } from '../lib/supabase';
import { itinerary as initialItinerary } from '../data/itinerary';

// 시드용 고정 ID. 두 사람이 동시에 처음 열어도 중복으로 들어가지 않도록 UUID를 박아 둡니다.
const DEFAULT_CHECKLIST = [
  { id: '0c000000-0000-4000-8000-000000000001', text: '여벌 옷 및 세면도구', completed: false, category: 'human' },
  { id: '0c000000-0000-4000-8000-000000000002', text: '차박용 평탄화 매트 & 침낭', completed: false, category: 'human' },
  { id: '0c000000-0000-4000-8000-000000000003', text: '랜턴 및 보조배터리', completed: false, category: 'human' },
  { id: '0c000000-0000-4000-8000-000000000004', text: '아토 롱리드줄 & 원반 장난감', completed: false, category: 'dog' },
  { id: '0c000000-0000-4000-8000-000000000005', text: '에너지 넘치는 아토를 위한 충분한 사료 및 간식', completed: false, category: 'dog' },
  { id: '0c000000-0000-4000-8000-000000000006', text: '배변봉투 넉넉히', completed: false, category: 'dog' },
  { id: '0c000000-0000-4000-8000-000000000007', text: '아토 전용 수건 및 물통', completed: false, category: 'dog' },
];

const MEMO_SAVE_DELAY = 600;
// 응답이 없어도 로딩 화면에 갇히지 않도록 하는 상한
const LOAD_TIMEOUT = 8000;
// 실시간 연결이 끊겨 있어도 동행자의 변경을 놓치지 않기 위한 예비 주기
const REFRESH_INTERVAL = 45000;
const PHOTO_MAX_WIDTH = 1200;
const PHOTO_QUALITY = 0.75;

const allPointIds = (itinerary) => itinerary.flatMap(day => day.points.map(p => p.id));

// 업로드 전에 브라우저에서 리사이즈·압축합니다. 원본을 그대로 올리면 저장소가 금방 찹니다.
const compressImage = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('파일을 읽지 못했습니다.'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('이미지를 열지 못했습니다.'));
      img.onload = () => {
        const scale = Math.min(1, PHOTO_MAX_WIDTH / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => (blob ? resolve(blob) : reject(new Error('이미지를 변환하지 못했습니다.'))),
          'image/jpeg',
          PHOTO_QUALITY
        );
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });

export function useSharedTrip() {
  const [itineraryState, setItineraryState] = useState(initialItinerary);
  const [selectedRoutePoints, setSelectedRoutePoints] = useState(() => allPointIds(initialItinerary));
  const [memos, setMemos] = useState({});
  const [visitedPoints, setVisitedPoints] = useState([]);
  const [checklist, setChecklist] = useState([]);
  const [photos, setPhotos] = useState({});
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState(null);

  // 콜백에서 최신 값을 읽기 위한 거울. 렌더 결과에는 쓰지 않습니다.
  const latest = useRef({});
  useEffect(() => {
    latest.current = { itineraryState, selectedRoutePoints, memos, visitedPoints, checklist, photos };
  });

  // 저장 대기 중인 메모는 다른 사람의 변경을 받아도 덮어쓰지 않습니다.
  const pendingMemos = useRef(new Set());
  const memoTimers = useRef({});

  const loadDocs = useCallback(async () => {
    const { data, error } = await supabase.from('chabak_trip_docs').select('key, data');
    if (error) throw error;
    const byKey = Object.fromEntries((data ?? []).map(row => [row.key, row.data]));
    const nextItinerary = byKey.itinerary ?? initialItinerary;
    setItineraryState(nextItinerary);
    setSelectedRoutePoints(byKey.route ?? allPointIds(nextItinerary));
    return byKey;
  }, []);

  const loadMemos = useCallback(async () => {
    const { data, error } = await supabase.from('chabak_memos').select('point_id, body');
    if (error) throw error;
    setMemos(prev => {
      const next = Object.fromEntries((data ?? []).map(row => [row.point_id, row.body]));
      pendingMemos.current.forEach(id => { next[id] = prev[id] ?? ''; });
      return next;
    });
  }, []);

  const loadVisits = useCallback(async () => {
    const { data, error } = await supabase.from('chabak_visits').select('point_id');
    if (error) throw error;
    setVisitedPoints((data ?? []).map(row => row.point_id));
  }, []);

  const loadChecklist = useCallback(async () => {
    const { data, error } = await supabase
      .from('chabak_checklist_items')
      .select('id, text, completed, category')
      .order('created_at');
    if (error) throw error;
    setChecklist(data ?? []);
    return data ?? [];
  }, []);

  const loadPhotos = useCallback(async () => {
    const { data, error } = await supabase
      .from('chabak_photos')
      .select('id, point_id, path')
      .order('created_at');
    if (error) throw error;
    const grouped = {};
    (data ?? []).forEach(row => {
      (grouped[row.point_id] ??= []).push({ id: row.id, path: row.path, url: photoUrl(row.path) });
    });
    setPhotos(grouped);
  }, []);

  useEffect(() => {
    let cancelled = false;

    let timer;

    const loadAll = async () => {
      const [docs, , , items] = await Promise.all([
        loadDocs(), loadMemos(), loadVisits(), loadChecklist(), loadPhotos(),
      ]);
      if (cancelled) return;
      setStatus('ready');
      setErrorMessage(null);

      // 처음 여는 사람이 기본값을 심습니다. 화면은 이미 떠 있으니 기다리게 하지 않습니다.
      if (!docs.itinerary) {
        await supabase
          .from('chabak_trip_docs')
          .upsert({ key: 'itinerary', data: initialItinerary }, { onConflict: 'key', ignoreDuplicates: true });
      }
      if (items.length === 0) {
        await supabase
          .from('chabak_checklist_items')
          .upsert(DEFAULT_CHECKLIST, { onConflict: 'id', ignoreDuplicates: true });
        if (!cancelled) await loadChecklist();
      }
    };

    const timeout = new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error('응답이 없습니다')), LOAD_TIMEOUT);
    });

    // 읽기가 끝나거나 시간이 다 되면 화면을 엽니다. 늦게 도착한 응답은 loadAll이 반영합니다.
    Promise.race([loadAll(), timeout])
      .catch((err) => {
        if (cancelled) return;
        setStatus('error');
        setErrorMessage(`공유 저장소에 연결하지 못했습니다 (${err.message}). 기본 여정으로 표시합니다.`);
      })
      .finally(() => clearTimeout(timer));

    return () => { cancelled = true; clearTimeout(timer); };
  }, [loadDocs, loadMemos, loadVisits, loadChecklist, loadPhotos]);

  const refreshAll = useCallback(() => {
    Promise.all([loadDocs(), loadMemos(), loadVisits(), loadChecklist(), loadPhotos()]).catch(() => {});
  }, [loadDocs, loadMemos, loadVisits, loadChecklist, loadPhotos]);

  // 동행자가 바꾼 내용을 새로고침 없이 받아옵니다.
  useEffect(() => {
    const reload = (fn) => () => { fn().catch(() => {}); };
    const channel = supabase
      .channel('chabak-shared')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chabak_trip_docs' }, reload(loadDocs))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chabak_memos' }, reload(loadMemos))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chabak_visits' }, reload(loadVisits))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chabak_checklist_items' }, reload(loadChecklist))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chabak_photos' }, reload(loadPhotos))
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [loadDocs, loadMemos, loadVisits, loadChecklist, loadPhotos]);

  // 실시간 연결이 막힌 망에서도 화면이 뒤처지지 않도록, 보고 있는 동안만 주기적으로 다시 읽습니다.
  useEffect(() => {
    const tick = () => { if (document.visibilityState === 'visible') refreshAll(); };
    const interval = setInterval(tick, REFRESH_INTERVAL);
    document.addEventListener('visibilitychange', tick);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', tick);
    };
  }, [refreshAll]);

  useEffect(() => {
    const timers = memoTimers.current;
    return () => { Object.values(timers).forEach(clearTimeout); };
  }, []);

  const report = useCallback((error, what) => {
    if (error) setErrorMessage(`${what} 저장에 실패했습니다: ${error.message}`);
  }, []);

  const saveDoc = useCallback(async (key, data, what) => {
    const { error } = await supabase
      .from('chabak_trip_docs')
      .upsert({ key, data, updated_at: new Date().toISOString() }, { onConflict: 'key' });
    report(error, what);
  }, [report]);

  const saveItinerary = useCallback((next) => {
    setItineraryState(next);
    return saveDoc('itinerary', next, '여정');
  }, [saveDoc]);

  const toggleVisit = useCallback(async (pointId) => {
    const wasVisited = (latest.current.visitedPoints ?? []).includes(pointId);
    setVisitedPoints(prev => (wasVisited ? prev.filter(id => id !== pointId) : [...prev, pointId]));
    const { error } = wasVisited
      ? await supabase.from('chabak_visits').delete().eq('point_id', pointId)
      : await supabase.from('chabak_visits').upsert({ point_id: pointId }, { onConflict: 'point_id' });
    report(error, '방문 도장');
  }, [report]);

  const toggleRoutePoint = useCallback((pointId) => {
    const current = latest.current.selectedRoutePoints ?? [];
    const next = current.includes(pointId) ? current.filter(id => id !== pointId) : [...current, pointId];
    setSelectedRoutePoints(next);
    return saveDoc('route', next, '경로 선택');
  }, [saveDoc]);

  const updateMemo = useCallback((pointId, text) => {
    setMemos(prev => ({ ...prev, [pointId]: text }));
    pendingMemos.current.add(pointId);
    clearTimeout(memoTimers.current[pointId]);
    memoTimers.current[pointId] = setTimeout(async () => {
      const { error } = await supabase
        .from('chabak_memos')
        .upsert({ point_id: pointId, body: text, updated_at: new Date().toISOString() }, { onConflict: 'point_id' });
      pendingMemos.current.delete(pointId);
      report(error, '메모');
    }, MEMO_SAVE_DELAY);
  }, [report]);

  const addChecklistItem = useCallback(async (text, category) => {
    const item = { id: crypto.randomUUID(), text, completed: false, category };
    setChecklist(prev => [...prev, item]);
    const { error } = await supabase.from('chabak_checklist_items').insert(item);
    report(error, '준비물');
  }, [report]);

  const toggleChecklistItem = useCallback(async (id) => {
    const item = (latest.current.checklist ?? []).find(entry => entry.id === id);
    if (!item) return;
    setChecklist(prev => prev.map(entry => (entry.id === id ? { ...entry, completed: !entry.completed } : entry)));
    const { error } = await supabase
      .from('chabak_checklist_items')
      .update({ completed: !item.completed })
      .eq('id', id);
    report(error, '준비물');
  }, [report]);

  const deleteChecklistItem = useCallback(async (id) => {
    setChecklist(prev => prev.filter(entry => entry.id !== id));
    const { error } = await supabase.from('chabak_checklist_items').delete().eq('id', id);
    report(error, '준비물');
  }, [report]);

  const updatePoint = useCallback((dayIndex, pointId, newName, newDesc) => {
    const next = (latest.current.itineraryState ?? []).map((day, idx) =>
      idx === dayIndex
        ? { ...day, points: day.points.map(p => (p.id === pointId ? { ...p, name: newName, desc: newDesc } : p)) }
        : day
    );
    return saveItinerary(next);
  }, [saveItinerary]);

  const deletePoint = useCallback((dayIndex, pointId) => {
    const next = (latest.current.itineraryState ?? []).map((day, idx) =>
      idx === dayIndex ? { ...day, points: day.points.filter(p => p.id !== pointId) } : day
    );
    return saveItinerary(next);
  }, [saveItinerary]);

  const addPointToDay = useCallback((dayIndex, point) => {
    const next = (latest.current.itineraryState ?? []).map((day, idx) =>
      idx === dayIndex ? { ...day, points: [...day.points, point] } : day
    );
    return saveItinerary(next);
  }, [saveItinerary]);

  const handlePhotoUpload = useCallback(async (pointId, file) => {
    if (!file) return;
    try {
      const blob = await compressImage(file);
      const path = `${pointId}/${crypto.randomUUID()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from(PHOTO_BUCKET)
        .upload(path, blob, { contentType: 'image/jpeg' });
      if (uploadError) throw uploadError;

      const { data, error } = await supabase
        .from('chabak_photos')
        .insert({ point_id: pointId, path })
        .select('id, path')
        .single();
      if (error) throw error;

      setPhotos(prev => ({
        ...prev,
        [pointId]: [...(prev[pointId] ?? []), { id: data.id, path: data.path, url: photoUrl(data.path) }],
      }));
    } catch (err) {
      setErrorMessage(`사진 업로드에 실패했습니다: ${err.message}`);
    }
  }, []);

  const deletePhoto = useCallback(async (pointId, photoId) => {
    const target = (latest.current.photos?.[pointId] ?? []).find(photo => photo.id === photoId);
    setPhotos(prev => ({ ...prev, [pointId]: (prev[pointId] ?? []).filter(photo => photo.id !== photoId) }));
    const { error } = await supabase.from('chabak_photos').delete().eq('id', photoId);
    report(error, '사진');
    if (!error && target) await supabase.storage.from(PHOTO_BUCKET).remove([target.path]);
  }, [report]);

  return {
    status,
    errorMessage,
    dismissError: useCallback(() => setErrorMessage(null), []),
    itineraryState,
    selectedRoutePoints,
    memos,
    visitedPoints,
    checklist,
    photos,
    toggleVisit,
    toggleRoutePoint,
    updateMemo,
    addChecklistItem,
    toggleChecklistItem,
    deleteChecklistItem,
    updatePoint,
    deletePoint,
    addPointToDay,
    handlePhotoUpload,
    deletePhoto,
  };
}
