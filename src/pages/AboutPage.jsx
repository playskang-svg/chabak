import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Footer, { CONTACT_EMAIL, OPERATOR } from '../components/Footer';

const STEPS = [
  {
    title: '1. 일정 훑어보기',
    body: '왼쪽 목록은 날짜순 여정이고, 오른쪽 지도에는 같은 장소가 일차 번호로 찍힙니다. 카드를 누르면 지도가 그 장소로 이동하고, 지도 우상단 "전체 여정" 버튼을 누르면 다시 전체가 한눈에 들어옵니다. 휴대폰에서는 아래쪽 "전체 여정" 버튼으로 지도를 엽니다.',
  },
  {
    title: '2. 갈지 말지 정하기',
    body: '카드마다 있는 "경로 포함" 체크를 끄면 그 장소가 지도 경로선에서 빠지고 마커도 흐려집니다. 들를지 고민 중인 곳을 지웠다 살렸다 하지 않고 그대로 두고 비교할 수 있습니다.',
  },
  {
    title: '3. 다녀온 곳에 도장 찍기',
    body: '카드 오른쪽 아래 "도장 꾹!"을 누르면 방문 완료로 표시되고, 상단 진행률이 함께 올라갑니다.',
  },
  {
    title: '4. 메모와 사진 남기기',
    body: '장소마다 메모를 적고 사진을 올릴 수 있습니다. 사진은 올릴 때 가로 1200px로 줄여 저장하고, 사진 위 ⬇ 버튼으로 내 기기에 내려받을 수 있습니다. 원본을 남기고 싶다면 카메라 앱으로 먼저 찍은 뒤 갤러리에서 고르세요.',
  },
  {
    title: '5. 준비물 챙기기',
    body: '메뉴(☰) → 준비물 체크리스트에서 두 묶음으로 나눠 관리합니다. 항목을 직접 추가하거나 지울 수 있습니다.',
  },
  {
    title: '6. 궁금한 점 물어보기',
    body: '카드 아래 "이 곳 궁금한 점"에 질문을 적으면 AI가 답합니다. 질문과 답은 함께 보는 사람 모두에게 남습니다. 확실하지 않은 정보는 단정하지 않도록 해 두었지만, 운영시간·요금·반려동물 출입처럼 자주 바뀌는 정보는 방문 전에 직접 확인하세요.',
  },
  {
    title: '7. 다른 여행으로 갈아끼우기',
    body: '메뉴(☰) → 설정에서 앱 제목과 부제를 바꿀 수 있고, 어떤 여행인지 문장으로 적으면 일정·장소 설명·준비물을 AI가 새로 만들어 줍니다. 새로 만들면 기존 일정과 기록이 교체되니 주의하세요.',
  },
];

const AboutPage = () => (
  <div className="doc-page">
    <div className="doc-inner">
      <a className="doc-back" href="#/"><ArrowLeft size={16} /> 여행으로 돌아가기</a>

      <h1>소개 · 이용방법</h1>

      <section className="doc-section">
        <h2>어떤 서비스인가요</h2>
        <p>
          여행 일정을 지도와 함께 보고, 같이 가는 사람과 기록을 나누는 서비스입니다.
          날짜별 동선과 들를 곳을 한 화면에서 확인하고, 다녀온 곳에 도장을 찍고,
          메모와 사진을 남깁니다.
        </p>
        <p>
          <strong>기록은 접속한 사람 모두에게 같이 보입니다.</strong> 한 사람이 남긴 메모나 사진이
          다른 사람 화면에도 몇 초 안에 나타납니다. 따로 계정을 만들거나 로그인할 필요 없이,
          주소만 알면 바로 함께 쓸 수 있습니다.
        </p>
      </section>

      <section className="doc-section">
        <h2>이용방법</h2>
        <ol className="doc-steps">
          {STEPS.map((step) => (
            <li key={step.title}>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="doc-section">
        <h2>알아두실 점</h2>
        <ul className="doc-list">
          <li>주소를 아는 사람은 누구나 내용을 보고 고칠 수 있습니다. 비밀로 남기고 싶은 내용은 적지 마세요.</li>
          <li>지도 위치는 각 장소의 대표 지점 기준이라 정확한 좌표가 아닐 수 있습니다. 실제 길안내는 카드의 카카오·네이버 버튼을 이용하세요.</li>
          <li>AI가 만든 일정과 답변은 참고용입니다. 방문 전에 영업 여부와 조건을 확인해 주세요.</li>
        </ul>
      </section>

      <section className="doc-section">
        <h2>문의</h2>
        <p className="doc-contact">
          {OPERATOR}<br />
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
      </section>

      <Footer />
    </div>
  </div>
);

export default AboutPage;
