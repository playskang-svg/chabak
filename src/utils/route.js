// 구간별 거리·주행시간 어림값. 실제 도로를 따라 계산하지 않고, 두 지점 사이 직선거리에서
// 추정하므로 대략적인 감을 잡는 용도입니다.

const EARTH_RADIUS_KM = 6371;

// 도로는 곧게 나 있지 않습니다. 해안도로·고갯길이 섞인 이번 경로에서는 직선거리의 1.3배쯤 됩니다.
const ROAD_FACTOR = 1.3;

const toRad = (deg) => (deg * Math.PI) / 180;

const straightKm = ([lat1, lng1], [lat2, lng2]) => {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.asin(Math.min(1, Math.sqrt(a)));
};

// 짧은 구간은 시내·해안도로라 느리고, 긴 구간은 고속도로를 타서 빠릅니다.
const averageSpeedKmh = (km) => (km < 10 ? 30 : km < 40 ? 45 : km < 100 ? 65 : 75);

export const legBetween = (from, to) => {
  const km = straightKm(from, to) * ROAD_FACTOR;
  const minutes = Math.max(5, Math.round((km / averageSpeedKmh(km)) * 60 / 5) * 5);
  return { km, minutes };
};

export const formatKm = (km) => (km < 10 ? `${km.toFixed(1)}km` : `${Math.round(km)}km`);

export const formatMinutes = (minutes) => {
  if (minutes < 60) return `${minutes}분`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours}시간 ${rest}분` : `${hours}시간`;
};
