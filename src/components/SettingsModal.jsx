import React, { useState } from 'react';
import { X, Sparkles, Save, AlertTriangle } from 'lucide-react';

const PROMPT_PLACEHOLDER = `예) 천안에서 출발해 3박 4일 남해안 차박 여행.
보더콜리 한 마리와 함께 가고 전기차라 충전소가 필요해요.
바다가 보이는 조용한 차박지 위주로, 사람 많은 곳은 피하고 싶어요.`;

const SettingsModal = ({ config, saveConfig, aiPassword, setAiPassword, aiBusy, generatePlan, onClose }) => {
  const [title, setTitle] = useState(config.title);
  const [subtitle, setSubtitle] = useState(config.subtitle);
  const [prompt, setPrompt] = useState(config.prompt ?? '');
  const [password, setPassword] = useState(aiPassword);
  const [notice, setNotice] = useState(null);
  const [failure, setFailure] = useState(null);

  const generating = aiBusy === 'plan';

  const handleSaveBranding = () => {
    saveConfig({ title: title.trim() || config.title, subtitle: subtitle.trim() });
    setNotice('제목과 부제를 저장했습니다.');
    setFailure(null);
  };

  const handleGenerate = async () => {
    setNotice(null);
    setFailure(null);
    setAiPassword(password);
    try {
      const result = await generatePlan(prompt.trim());
      saveConfig({ prompt: prompt.trim() });
      setNotice(`새 일정을 만들었습니다 — ${result.days}일 · ${result.points}곳.`);
    } catch (err) {
      setFailure(err.message);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>⚙️ 설정</h2>
          <button onClick={onClose} aria-label="닫기"><X size={20} /></button>
        </div>

        <div className="modal-body">
          <section className="settings-section">
            <h3>앱 이름</h3>
            <label className="settings-field">
              <span>제목</span>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="🐾 아토와 차박여행" />
            </label>
            <label className="settings-field">
              <span>부제</span>
              <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="한 줄 요약" />
            </label>
            <button className="btn-secondary" onClick={handleSaveBranding}>
              <Save size={14} /> 제목·부제 저장
            </button>
          </section>

          <section className="settings-section">
            <h3>AI로 일정 만들기</h3>
            <p className="settings-help">
              어떤 여행인지 적으면 일정·장소 설명·준비물을 새로 만들어 모두에게 반영합니다.
            </p>
            <label className="settings-field">
              <span>여행 프롬프트</span>
              <textarea
                rows={6}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={PROMPT_PLACEHOLDER}
              />
            </label>
            <label className="settings-field">
              <span>생성 암호</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="AI 기능 공유 암호"
              />
            </label>

            <div className="settings-warning">
              <AlertTriangle size={16} />
              <span>
                새로 만들면 <strong>기존 일정·메모·방문 도장·준비물·질문 기록이 지워집니다.</strong>{' '}
                올린 사진은 지워지지 않습니다.
              </span>
            </div>

            <button className="btn-primary" onClick={handleGenerate} disabled={generating || !prompt.trim()}>
              <Sparkles size={16} /> {generating ? '만드는 중… (1분 정도 걸립니다)' : 'AI로 일정 생성'}
            </button>
          </section>

          {notice && <div className="settings-notice">{notice}</div>}
          {failure && <div className="settings-failure">{failure}</div>}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
