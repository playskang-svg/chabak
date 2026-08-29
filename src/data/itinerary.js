export const itinerary = [
  {
    day: 1,
    title: "1일차: 천안 출발 🚗 영덕 직행 (내륙 종단)",
    points: [
      {
        id: "d1-1",
        name: "출발지 (천안)",
        type: "start",
        coords: [36.8151, 127.1139],
        desc: "여행의 시작! 아토의 멀미 예방을 위해 출발 전 가벼운 산책을 추천합니다.",
        tips: "천안 → 영덕 약 4시간. 중부내륙고속도로로 내륙을 가로질러 문경을 지납니다.",
      },
      {
        id: "d1-opt1",
        name: "문경 선유동계곡",
        type: "waypoint",
        coords: [36.6778, 127.9564],
        desc: "대야산 자락을 따라 1.7km 이어지는 너럭바위 계곡. 학천정에서 시작하는 선유동천 나들길이 완만해 아토와 걷기 좋고, 물가에서 발 담그며 쉬어가기 좋습니다.",
        tips: "내비는 '가은읍 학천정길 18'로. 무료 주차장이 있습니다. 여름 성수기에는 사람이 몰리니 이른 시간이 편합니다.",
        link: "https://www.gbmg.go.kr/tour/contents.do?mId=0201020000"
      },
      {
        id: "d1-2",
        name: "안동 월영교",
        type: "waypoint",
        coords: [36.5533, 128.7239],
        desc: "낙동강 위를 가로지르는 목조 다리. 강변 산책로가 넓고 평탄해 아토와 걷기 좋습니다.",
        tips: "해질 무렵에 맞춰 도착하면 조명이 켜져 사진이 예쁘게 나옵니다.",
        link: "https://korean.visitkorea.or.kr/search/search_list.do?keyword=월영교"
      },
      {
        id: "d1-opt2",
        name: "영덕 강구항",
        type: "waypoint",
        coords: [36.3617, 129.3957],
        desc: "동해에 처음 닿는 지점. 대게 거리와 방파제가 있어 저녁거리를 사기 좋습니다.",
        tips: "차박지에 들어가기 전 저녁·물·얼음을 여기서 채우세요.",
      },
      {
        id: "day1-stay",
        name: "영덕 해맞이공원",
        type: "stay",
        coords: [36.4673, 129.4523],
        desc: "바다가 정면으로 보이는 언덕 위 공원. 주차장이 넓어 자리 잡기 쉽고, 다음 날 일출을 차 안에서 그대로 볼 수 있습니다.",
        tips: "풍력발전기 아래 산책로가 아토 아침 산책 코스로 좋습니다. 바람이 세니 타프는 접어두세요.",
        link: "https://map.kakao.com/link/to/영덕해맞이공원,36.4673,129.4523",
        facilities: { restroom: true, shower: false, private: true }
      }
    ]
  },
  {
    day: 2,
    title: "2일차: 영덕 🚗 울진 (7번국도 해변길)",
    points: [
      {
        id: "d2-1",
        name: "영덕 축산항 죽도산 전망대",
        type: "waypoint",
        coords: [36.5090, 129.4480],
        desc: "항구 옆 야트막한 산 위 전망대. 데크 계단을 오르면 해안선이 한눈에 들어옵니다.",
        tips: "계단이 많아 아토가 힘들어하면 항구 방파제 산책으로 대체하세요.",
      },
      {
        id: "d2-2",
        name: "영덕 고래불해수욕장",
        type: "waypoint",
        coords: [36.5527, 129.4406],
        desc: "8km에 달하는 긴 백사장. 사람이 적은 구간이 많아 아토가 마음껏 달리기 좋습니다.",
        tips: "송림 그늘에서 점심 먹기 좋아요. 모래 털 수 있게 수건 챙기세요.",
        link: "https://korean.visitkorea.or.kr/search/search_list.do?keyword=고래불해수욕장"
      },
      {
        id: "d2-opt1",
        name: "울진 후포항 · 등기산 스카이워크",
        type: "waypoint",
        coords: [36.6781, 129.4678],
        desc: "바다 위를 걷는 느낌의 스카이워크와 등대 공원. 항구에서 회를 포장하기 좋습니다.",
        tips: "스카이워크는 반려견 출입이 제한될 수 있어, 아토와는 등기산 공원 쪽을 이용하세요.",
      },
      {
        id: "d2-opt2",
        name: "울진 구산해수욕장",
        type: "waypoint",
        coords: [36.7570, 129.4678],
        desc: "소나무 숲이 백사장까지 내려온 조용한 해변. 물놀이와 낮잠 모두 좋습니다.",
        tips: "구역이 잘 나뉘어 있어 한적합니다.",
        link: "https://korean.visitkorea.or.kr/search/search_list.do?keyword=구산해수욕장"
      },
      {
        id: "day2-stay",
        name: "울진 망양정 해맞이공원",
        type: "stay",
        coords: [36.9203, 129.4283],
        desc: "관동팔경 망양정 아래 해변 공원. 바로 앞이 백사장이라 파도 소리를 들으며 잘 수 있습니다.",
        tips: "정자까지 오르는 길이 짧아 아침 산책으로 딱입니다. 취사 가능 구역인지 현지 안내를 확인하세요.",
        link: "https://map.kakao.com/link/to/망양정해맞이공원,36.9203,129.4283",
        facilities: { restroom: true, shower: true, private: true }
      }
    ]
  },
  {
    day: 3,
    title: "3일차: 울진 🚗 속초 (7번국도 북상 · 강릉은 선택)",
    points: [
      {
        id: "d3-1",
        name: "울진 죽변항 · 해안스카이레일",
        type: "waypoint",
        coords: [37.0560, 129.4230],
        desc: "붉은 등대와 '폭풍 속으로' 세트장이 있는 해안 절벽길. 짧은 산책 코스가 잘 정비돼 있습니다.",
        tips: "레일바이크는 반려견 탑승이 어려우니 해안 산책로만 이용하세요.",
      },
      {
        id: "d3-2",
        name: "삼척 장호항",
        type: "waypoint",
        coords: [37.2360, 129.3400],
        desc: "'한국의 나폴리'로 불리는 에메랄드빛 항구. 투명한 물빛이 7번국도 구간 중 최고입니다.",
        tips: "여름 성수기에는 해변 출입이 통제될 수 있어 전망대 쪽에서 보는 걸 추천합니다.",
      },
      {
        id: "d3-3",
        name: "동해 추암 촛대바위",
        type: "waypoint",
        coords: [37.4770, 129.1560],
        desc: "애국가 첫 소절 배경으로 유명한 기암. 출렁다리와 해안 산책로가 이어집니다.",
        tips: "데크길이 잘 되어 있어 아토와 걷기 편합니다.",
        link: "https://korean.visitkorea.or.kr/search/search_list.do?keyword=추암촛대바위"
      },
      {
        id: "d3-opt1",
        name: "[선택] 강릉 안목해변 커피거리",
        type: "waypoint",
        coords: [37.7730, 128.9490],
        desc: "들를지 말지 정하는 구간입니다. 카페가 늘어선 해변으로, 테라스가 있는 곳이 많아 아토와 쉬어가기 좋습니다. 대신 1시간 이상 지체됩니다.",
        tips: "건너뛰려면 이 카드의 '경로 포함' 체크를 해제하세요. 지도에서 경로선과 함께 빠집니다.",
      },
      {
        id: "d3-opt2",
        name: "[선택] 강릉 경포호 산책로",
        type: "waypoint",
        coords: [37.7950, 128.8960],
        desc: "호수를 한 바퀴 도는 평탄한 4.3km 산책로. 강릉에 들른다면 아토가 가장 좋아할 코스입니다.",
        tips: "전체를 돌면 1시간 이상 걸리니, 시간이 빠듯하면 호수 남측만 걸으세요.",
      },
      {
        id: "d3-4",
        name: "양양 하조대",
        type: "waypoint",
        coords: [38.0130, 128.7290],
        desc: "절벽 위 정자에서 내려다보는 동해. 속초 들어가기 전 마지막 전망 포인트입니다.",
        tips: "주차장에서 정자까지 5분이면 닿습니다.",
      },
      {
        id: "day3-stay",
        name: "속초해수욕장 주차장",
        type: "stay",
        coords: [38.1900, 128.6050],
        desc: "설악산 능선이 배경으로 보이는 도심 해변. 시내와 가까워 마트·식당·빨래방 이용이 편합니다.",
        tips: "도심이라 밤에 밝은 편입니다. 조용한 곳을 원하면 남쪽 외옹치 방향 끝자리를 잡으세요.",
        link: "https://map.kakao.com/link/to/속초해수욕장,38.1900,128.6050",
        facilities: { restroom: true, shower: true, private: false }
      }
    ]
  },
  {
    day: 4,
    title: "4일차: 속초 🚗 내륙 횡단 🚗 단양 차박",
    points: [
      {
        id: "d4-1",
        name: "속초 영금정 · 동명항",
        type: "waypoint",
        coords: [38.2110, 128.5990],
        desc: "바다 위로 뻗은 정자에서 보는 아침 바다. 동명항에서 아침거리를 사기 좋습니다.",
        tips: "동해와 작별하는 지점입니다. 여기서부터는 내륙 산길입니다.",
      },
      {
        id: "d4-opt1",
        name: "한계령 휴게소",
        type: "waypoint",
        coords: [38.0330, 128.3350],
        desc: "설악산 능선을 정면으로 마주하는 고갯길 휴게소. 굽잇길 드라이브의 하이라이트입니다.",
        tips: "굽이가 많아 아토가 멀미할 수 있습니다. 여기서 충분히 쉬어가세요.",
      },
      {
        id: "d4-2",
        name: "제천 의림지",
        type: "waypoint",
        coords: [37.1620, 128.1900],
        desc: "삼국시대에 만들어진 저수지. 노송이 둘러싼 둘레길이 짧고 평탄합니다.",
        tips: "긴 이동 중간의 다리 펴기 코스로 적당합니다.",
        link: "https://korean.visitkorea.or.kr/search/search_list.do?keyword=의림지"
      },
      {
        id: "d4-3",
        name: "단양 도담삼봉",
        type: "waypoint",
        coords: [36.9961, 128.3444],
        desc: "남한강 한가운데 솟은 세 개의 봉우리. 주차장에서 바로 보이고 강변 산책로가 이어집니다.",
        tips: "주차 요금이 발생할 수 있습니다. 산책 시 리드줄 필수!",
        link: "https://korean.visitkorea.or.kr/search/search_list.do?keyword=도담삼봉"
      },
      {
        id: "day4-stay",
        name: "단양생태체육공원",
        type: "stay",
        coords: [36.9850, 128.3650],
        desc: "남한강이 흐르는 강변 노지. 부지가 넓어 거리두기가 되고, 마지막 밤을 조용히 보내기 좋습니다.",
        tips: "아토가 마음껏 달릴 수 있는 넓은 잔디밭이 매력적이에요.",
        link: "https://map.kakao.com/link/to/단양생태체육공원,36.9850,128.3650",
        facilities: { restroom: true, shower: false, private: true }
      }
    ]
  },
  {
    day: 5,
    title: "5일차: 단양 🚗 충주 🚗 천안 복귀",
    points: [
      {
        id: "d5-1",
        name: "단양강 잔도길",
        type: "waypoint",
        coords: [36.9697, 128.3533],
        desc: "절벽을 따라 이어진 아찔한 산책로. 아침 강바람을 맞으며 마지막 산책을 하기 좋습니다.",
        tips: "바닥이 뚫린 구간이 있어 아토가 무서워하면 안고 이동하세요.",
      },
      {
        id: "d5-2",
        name: "충주 종댕이길 (충주호)",
        type: "waypoint",
        coords: [37.0180, 127.9490],
        desc: "충주호를 끼고 도는 숲길. 물빛과 소나무가 어우러져 여행의 마지막 여유를 즐기기 좋습니다.",
        tips: "전체 코스는 기니 호수 전망대까지만 다녀오세요.",
      },
      {
        id: "d5-opt1",
        name: "충주 탄금대",
        type: "waypoint",
        coords: [37.0083, 127.9111],
        desc: "우륵이 가야금을 탔다는 언덕. 남한강이 내려다보이는 솔숲길이 짧고 편합니다.",
        tips: "천안까지 1시간 20분 남은 지점. 마지막 견생샷 포인트입니다.",
      },
      {
        id: "d5-3",
        name: "복귀 (천안)",
        type: "end",
        coords: [36.8151, 127.1139],
        desc: "안전하게 천안으로 복귀합니다. 긴 여행 고생한 아토에게 충분한 휴식을 주세요!",
        tips: "도착 후 아토 발 씻기고 푹 재우기 💤",
      }
    ]
  }
];
