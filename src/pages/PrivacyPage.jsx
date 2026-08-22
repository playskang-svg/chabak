import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Footer, { CONTACT_EMAIL, OPERATOR } from '../components/Footer';

const EFFECTIVE_DATE = '2026년 8월 23일';

const PrivacyPage = () => (
  <div className="doc-page">
    <div className="doc-inner">
      <a className="doc-back" href="#/"><ArrowLeft size={16} /> 여행으로 돌아가기</a>

      <h1>개인정보처리방침</h1>
      <p className="doc-effective">시행일: {EFFECTIVE_DATE}</p>

      <section className="doc-section">
        <h2>1. 계정 없이 이용합니다</h2>
        <p>
          이 서비스는 회원가입과 로그인이 없습니다. 이름, 생년월일, 전화번호, 이메일 주소 등
          이용자를 식별할 수 있는 정보를 요구하거나 수집하지 않습니다.
        </p>
      </section>

      <section className="doc-section">
        <h2>2. 저장되는 정보</h2>
        <table className="doc-table">
          <thead>
            <tr><th>구분</th><th>내용</th><th>목적</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>이용자가 직접 입력한 내용</td>
              <td>여행 일정, 장소 메모, 준비물 항목, 방문 표시, 업로드한 사진, 장소에 대한 질문과 답변, 앱 제목·부제·프롬프트</td>
              <td>서비스 제공 및 동행자 간 공유</td>
            </tr>
            <tr>
              <td>자동으로 기록되는 정보</td>
              <td>AI 기능(일정 생성·장소 질문)을 사용할 때의 접속 IP 주소</td>
              <td>시간당 호출 횟수 제한 — 비용이 발생하는 기능의 오·남용 방지</td>
            </tr>
            <tr>
              <td>브라우저에 저장되는 값</td>
              <td>AI 기능 공유 암호</td>
              <td>매번 다시 입력하지 않도록 하기 위함. 이용자 기기에만 남으며 서버로 전송되지 않습니다.</td>
            </tr>
          </tbody>
        </table>
        <p>광고 식별자나 행동 분석을 위한 추적은 하지 않으며, 쿠키를 사용하지 않습니다.</p>
      </section>

      <section className="doc-section doc-callout">
        <h2>3. 공개 범위 — 꼭 확인해 주세요</h2>
        <p>
          이 서비스는 <strong>주소를 아는 사람이라면 누구나 내용을 보고 수정·삭제할 수 있도록</strong> 열려 있습니다.
          동행자와 손쉽게 함께 쓰기 위한 구조이며, 별도의 접근 제한을 두지 않았습니다.
        </p>
        <p>
          따라서 <strong>남에게 알려지면 곤란한 내용은 입력하지 마시기 바랍니다.</strong> 메모, 사진,
          질문 내용은 주소를 아는 제3자에게 노출될 수 있습니다.
        </p>
      </section>

      <section className="doc-section">
        <h2>4. 보관 위치와 처리 위탁</h2>
        <p>입력한 내용은 아래 사업자의 인프라에 저장·처리됩니다.</p>
        <table className="doc-table">
          <thead>
            <tr><th>수탁자</th><th>위탁 업무</th><th>처리 위치</th></tr>
          </thead>
          <tbody>
            <tr><td>Supabase, Inc.</td><td>데이터베이스 및 사진 파일 보관</td><td>대한민국 (서울)</td></tr>
            <tr><td>Vercel, Inc.</td><td>웹사이트 호스팅</td><td>해외</td></tr>
            <tr><td>Anthropic, PBC</td><td>AI 일정 생성 및 장소 질문 처리</td><td>해외</td></tr>
          </tbody>
        </table>
        <p>
          AI 기능을 사용할 때에 한해, 입력한 질문이나 여행 프롬프트와 해당 장소 정보가
          Anthropic으로 전송되어 답변 생성에 사용됩니다. AI 기능을 사용하지 않으면 전송되지 않습니다.
        </p>
        <p>
          지도는 OpenStreetMap의 지도 이미지를 불러와 표시하며, 길찾기 버튼을 누르면
          카카오맵 또는 네이버지도로 이동합니다. 이때 해당 사업자의 정책이 적용됩니다.
        </p>
      </section>

      <section className="doc-section">
        <h2>5. 보관 기간과 파기</h2>
        <ul className="doc-list">
          <li>이용자가 입력한 내용은 삭제하기 전까지 보관되며, 서비스 화면에서 직접 삭제할 수 있습니다.</li>
          <li>AI 기능으로 일정을 새로 만들면 기존 일정·메모·방문 표시·준비물·질문 기록이 함께 삭제됩니다. 사진은 삭제되지 않습니다.</li>
          <li>AI 호출 기록(IP 주소)은 횟수 제한 확인 외의 용도로 사용하지 않습니다.</li>
          <li>전체 삭제를 원하시면 아래 연락처로 요청해 주세요.</li>
        </ul>
      </section>

      <section className="doc-section">
        <h2>6. 이용자의 권리</h2>
        <p>
          입력한 내용의 열람·수정·삭제는 서비스 화면에서 언제든 직접 하실 수 있습니다.
          그 밖의 요청이나 문의는 아래 연락처로 보내주시면 확인 후 처리해 드립니다.
        </p>
      </section>

      <section className="doc-section">
        <h2>7. 만 14세 미만 아동</h2>
        <p>
          만 14세 미만 아동을 대상으로 하지 않으며, 아동의 개인정보를 의도적으로 수집하지 않습니다.
        </p>
      </section>

      <section className="doc-section">
        <h2>8. 변경 안내</h2>
        <p>
          내용이 바뀌는 경우 이 페이지에 변경된 방침과 시행일을 게시합니다.
        </p>
      </section>

      <section className="doc-section">
        <h2>9. 문의</h2>
        <p className="doc-contact">
          {OPERATOR}<br />
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
      </section>

      <Footer />
    </div>
  </div>
);

export default PrivacyPage;
