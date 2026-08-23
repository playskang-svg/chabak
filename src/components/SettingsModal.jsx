import React, { useState } from 'react';
import { X, Sparkles, Save, AlertTriangle } from 'lucide-react';

const PROMPT_PLACEHOLDER = `예) 천안에서 출발해 3박 4일 남해안 차박 여행.
보더콜리 한 마리와 함께 가고 전기차라 충전소가 필요해요.
바다가 보이는 조용한 차박지 위주로, 사람 많은 곳은 피하고 싶어요.`;

// 결과는 누른 버튼 바로 옆에 보여야 합니다. 모달 아래쪽에 그리면 스크롤 밖이라 안 보입니다.
const Result = ({ result }) =>
  result ? <div className={result.ok ? 'settings-notice' : 'settings-failure'}>{result.text}</div> : null;

const SettingsModal = ({ config, saveConfig, aiPassword, setAiPassword, aiBusy, generatePlan, onClose }) => {
  const [title, setTitle] = useState(config.title);
  const [subtitle, setSubtitle] = useState(config.subtitle);
  const [prompt, setPrompt] = useState(config.prompt ?? '');
  const [password, setPassword] = useState(aiPassword);
  const [savingBranding, setSavingBranding] = useState(false);
  const [brandingResult, setBrandingResult] = useState(null);
  const [planResult, setPlanResult] = useState(null);
  // 되돌릴 수 없는 동작이라 한 번 더 확인받습니다.
  const [confirming, setConfirming] = useState(false);

  const generating = aiBusy === 'plan';

  const handleSaveBranding = async () => {
    setBrandingResult(null);
    setSavingBranding(true);
    const error = await saveConfig({ title: title.trim() || config.title, subtitle: subtitle.trim() });
    setSavingBranding(false);
    setBrandingResult(error
      ? { ok: false, text: `저장하지 못했습니다: ${error.message}` }
      : { ok: true, text: '저장했습니다. 상단 제목이 바뀌었는지 확인해 보세요.' });
  };

  const handleGenerate = async () => {
    setConfirming(false);
    setPlanResult(null);
    setAiPassword(password);
    try {
      const result = await generatePlan(prompt.trim());
      await saveConfig({ prompt: prompt.trim() });
      setPlanResult({ ok: true, text: `새 일정을 만들었습니다 — ${result.days}일 · ${result.points}곳.` });
    } catch (err) {
      setPlanResult({ ok: false, text: err.message });
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
            <button className="btn-secondary" onClick={handleSaveBranding} disabled={savingBranding}>
              <Save size={14} /> {savingBranding ? '저장 중…' : '제목·부제 저장'}
            </button>
            <Result result={brandingResult} />
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
                onChange={(e) => { setPrompt(e.target.value); setConfirming(false); }}
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

            {confirming ? (
              <div className="settings-confirm">
                <p>
                  지금 일정 <strong>전체를 지우고</strong> 새로 만듭니다. 되돌릴 수 없습니다.
                  그래도 진행할까요?
                </p>
                <div className="settings-confirm-actions">
                  <button className="btn-secondary" onClick={() => setConfirming(false)}>취소</button>
                  <button className="btn-danger" onClick={handleGenerate}>
                    <Sparkles size={16} /> 네, 새로 만들기
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="btn-primary"
                onClick={() => { setPlanResult(null); setConfirming(true); }}
                disabled={generating || !prompt.trim()}
              >
                <Sparkles size={16} /> {generating ? '만드는 중… (1분 정도 걸립니다)' : 'AI로 일정 생성'}
              </button>
            )}
            <Result result={planResult} />
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
