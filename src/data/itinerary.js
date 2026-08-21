export const itinerary = [
  {
    day: 1,
    title: "1일차: 천안 출발 🚗 단양 차박",
    points: [
      {
        id: "d1-1",
        name: "출발지 (천안)",
        type: "start",
        coords: [36.8151, 127.1139],
        desc: "여행의 시작! 아토의 멀미 예방을 위해 출발 전 가벼운 산책을 추천합니다.",
        tips: "이동 시간: 약 2시간 소요 (단양까지)",
      },
      {
        id: "d1-opt1",
        name: "덕평자연휴게소 (반려견 쉼터)",
        type: "waypoint",
        coords: [37.2346, 127.3596],
        desc: "이동 중 아토가 지루하지 않게 휴게소 내 반려견 전용 놀이터 '달려라 코코'에서 신나게 뛰놀게 해주세요.",
        tips: "차량 탑승 전 물 마시게 하기 잊지 마세요!",
      },
      {
        id: "d1-2",
        name: "단양 도담삼봉",
        type: "waypoint",
        coords: [36.9961, 128.3444],
        desc: "남한강 한가운데 솟은 세 개의 봉우리. 주차장에서 멋진 풍경을 보며 아토와 가볍게 산책할 수 있습니다.",
        tips: "주차장 이용 요금 발생 가능. 산책 시 리드줄 필수!",
        link: "https://korean.visitkorea.or.kr/detail/ms_detail.do?cotid=9f57ebcb-3da4-4c46-96a9-8350eb017a41"
      },
      {
        id: "d1-opt2",
        name: "단양강 잔도길",
        type: "waypoint",
        coords: [36.9697, 128.3533],
        desc: "절벽을 따라 이어진 아찔하면서도 아름다운 산책로입니다. 아토와 함께 강바람을 맞으며 걸어보세요.",
        tips: "바닥이 뚫린 구간이 있어 아토가 무서워할 경우 안고 이동하세요.",
      },
      {
        id: 'day1-stay',
        type: 'stay',
        name: '단양생태체육공원',
        coords: [36.985, 128.365],
        desc: '남한강이 흐르는 강변 노지입니다. 부지가 엄청나게 넓어 차박 간 거리두기가 가능해 아주 프라이빗합니다.',
        tips: '아토가 마음껏 달릴 수 있는 넓은 잔디밭이 매력적이에요.',
        link: 'https://map.kakao.com/link/to/단양생태체육공원,36.985,128.365',
        facilities: { restroom: true, shower: false, private: true }
      }
    ]
  },
  {
    day: 2,
    title: "2일차: 단양 🚗 삼척 해변 차박",
    points: [
      {
        id: "d2-opt1",
        name: "태백산국립공원 입구",
        type: "waypoint",
        coords: [37.1009, 128.9409],
        desc: "단양에서 삼척으로 넘어가는 굽이진 국도 드라이브 중 만나는 웅장한 자연 경관.",
        tips: "포토존에서 아토와 사진 한 장 찰칵!",
      },
      {
        id: "d2-1",
        name: "태백 황지연못",
        type: "waypoint",
        coords: [37.1728, 128.9867],
        desc: "낙동강의 발원지. 시내 중심에 있어 접근성이 좋고, 공원이 잘 조성되어 있어 이동 중 아토와 힐링 산책하기 좋습니다.",
        tips: "단양에서 삼척 가는 길에 들르기 좋은 코스.",
        link: "https://korean.visitkorea.or.kr/detail/ms_detail.do?cotid=32ccf4a4-54c3-4d43-8557-0a2569c76ba7"
      },
      {
        id: "d2-opt2",
        name: "삼척 이사부사자공원",
        type: "waypoint",
        coords: [37.4727, 129.1553],
        desc: "동해바다가 한눈에 내려다보이는 공원. 바닷바람을 맞으며 산책하기에 최적의 장소입니다.",
        tips: "추암촛대바위와 연결되어 있어 뷰가 환상적입니다.",
      },
      {
        id: 'day2-stay',
        type: 'stay',
        name: '삼척 맹방해수욕장 주차장',
        coords: [37.394, 129.197],
        desc: '백사장이 넓게 펼쳐진 해변. 주차장이 길어 구석에 자리잡으면 방해받지 않습니다. 소나무 숲길 산책로가 일품입니다.',
        tips: '취사가 가능한 구역인지 현지 플래카드를 확인하세요.',
        link: 'https://map.kakao.com/link/to/맹방해수욕장,37.394,129.197',
        facilities: { restroom: true, shower: true, private: true }
      }
    ]
  },
  {
    day: 3,
    title: "3일차: 삼척 🚗 울진 청정바다 차박",
    points: [
      {
        id: "d3-opt1",
        name: "삼척 해양레일바이크 주변 산책",
        type: "waypoint",
        coords: [37.3197, 129.2740],
        desc: "레일바이크 정거장 주변의 해안 절경. 아토와 함께 해안선을 따라 가볍게 산책로를 걸어보세요.",
        tips: "반려견은 레일바이크 탑승이 어려울 수 있으니 주변 해변 산책로를 이용하세요.",
      },
      {
        id: "d3-1",
        name: "울진 왕피천공원 주변",
        type: "waypoint",
        coords: [36.9744, 129.4140],
        desc: "탁 트인 동해바다와 왕피천이 만나는 곳. 근처 산책로에서 바닷바람을 맞으며 휴식하기 좋습니다.",
        tips: "소나무 숲 그늘에서 잠시 낮잠을 자도 좋습니다.",
        link: "https://www.uljin.go.kr/index.uljin?menuCd=DOM_000000104001004000"
      },
      {
        id: "d3-opt2",
        name: "울진 등기산 스카이워크 공원",
        type: "waypoint",
        coords: [36.6781, 129.4678],
        desc: "푸른 바다 위를 걷는 듯한 느낌의 스카이워크 근처 공원. (스카이워크 자체는 반려견 출입이 제한될 수 있습니다.)",
        tips: "근처 후포항에서 식사를 포장하기 좋습니다.",
      },
      {
        id: "d3-2",
        name: "울진 구산해수욕장 (3박 ⛺)",
        type: "stay",
        coords: [36.7570, 129.4678],
        desc: "소나무 숲이 어우러진 차박 명소. 반려견과 쾌적하게 머무르며 산책과 물놀이를 즐길 수 있습니다.",
        tips: "구역이 잘 나뉘어 있어 조용하게 차박하기 좋습니다.",
        link: "https://korean.visitkorea.or.kr/detail/ms_detail.do?cotid=474c15cd-2651-409b-ae7c-2b5093cd0c89",
        facilities: { restroom: true, shower: true, private: true }
      }
    ]
  },
  {
    day: 4,
    title: "4일차: 울진 🚗 영덕 🚗 포항 일출 차박",
    points: [
      {
        id: "d4-opt1",
        name: "영덕 해맞이공원",
        type: "waypoint",
        coords: [36.4673, 129.4523],
        desc: "해안도로를 따라 내려가다 만나는 탁 트인 바다 전망대. 거대한 집게발 조형물이 인상적입니다.",
        tips: "아토와 산책하며 바다 배경으로 견생샷을 남겨주세요.",
      },
      {
        id: "d4-1",
        name: "영덕 장사해수욕장",
        type: "waypoint",
        coords: [36.2818, 129.3789],
        desc: "영덕으로 내려가는 길에 위치한 아름다운 해변. 송림 산책로가 있어 여유를 즐기기 좋은 휴식 포인트.",
        tips: "넓은 주차장 구비, 바다 뷰 휴식.",
        link: "https://korean.visitkorea.or.kr/detail/ms_detail.do?cotid=67776b3c-62bb-49e0-822e-a7f433ce1c8d"
      },
      {
        id: "d4-opt2",
        name: "포항 이가리 닻 전망대 주변 해변",
        type: "waypoint",
        coords: [36.1923, 129.3820],
        desc: "닻 모양의 해상 전망대로 핫한 곳. 주변 해변이 깨끗하고 모래가 부드러워 강아지 산책에 제격입니다.",
        tips: "주말에는 사람이 많을 수 있으니 안쪽 한적한 모래사장을 이용하세요.",
      },
      {
        id: 'day4-stay',
        type: 'stay',
        name: '포항 도구해수욕장',
        coords: [35.986, 129.420],
        desc: '해안선 끝쪽으로 주차하면 한적하고 프라이빗합니다. 도심과 가까워 배달음식이나 마트 이용이 아주 편리합니다.',
        tips: '아침 일찍 아토와 함께 해변 일출 산책을 꼭 즐겨보세요!',
        link: 'https://map.kakao.com/link/to/도구해수욕장,35.986,129.420',
        facilities: { restroom: true, shower: false, private: true }
      }
    ]
  },
  {
    day: 5,
    title: "5일차: 포항 🚗 천안 복귀",
    points: [
      {
        id: "d5-1",
        name: "포항 사방기념공원",
        type: "waypoint",
        coords: [36.1437, 129.3878],
        desc: "'갯마을 차차차' 촬영지. 넓은 잔디마당과 바다가 보이는 언덕길이 있어 아토와의 마지막 여행 컷을 남기기 완벽합니다.",
        tips: "언덕을 오르며 체력 소모가 있을 수 있으니 수분 섭취(아토 물 챙기기) 잊지 마세요!",
        link: "https://korean.visitkorea.or.kr/detail/ms_detail.do?cotid=c5b74a9d-5ed5-4309-8d19-1d2a1d2f9547"
      },
      {
        id: "d5-opt1",
        name: "경부고속도로 금강휴게소",
        type: "waypoint",
        coords: [36.2774, 127.6748],
        desc: "복귀 길의 오아시스. 금강이 훤히 내려다보이는 강변 산책로가 있어 장거리 이동에 지친 아토가 쉬어가기 아주 좋습니다.",
        tips: "강변 데크길 산책 추천!",
      },
      {
        id: "d5-2",
        name: "복귀 (천안)",
        type: "end",
        coords: [36.8151, 127.1139],
        desc: "안전하게 천안으로 복귀합니다. 긴 여행 고생한 아토에게 충분한 휴식을 주세요!",
        tips: "도착 후 아토 발 씻기고 푹 재우기 💤",
      }
    ]
  }
];
