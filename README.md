# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

---

## 아토와 차박여행 — 데이터 저장

여정·메모·준비물·방문 도장·사진은 모두 Supabase에 저장되어 접속한 사람 모두가 같은 내용을 봅니다.
(예전에는 브라우저 localStorage에만 저장돼 기기마다 따로 놀았습니다.)

- Supabase 프로젝트: `isa-eopche-pseo` (`kybfprvpgwqdrvrblxnq`, ap-northeast-2)
- 테이블: `chabak_trip_docs`, `chabak_memos`, `chabak_visits`, `chabak_checklist_items`, `chabak_photos`
  (같은 프로젝트의 다른 앱과 섞이지 않도록 `chabak_` 접두사를 씁니다)
- 사진 파일: Storage 버킷 `chabak-photos` (공개 읽기). 업로드 전 가로 1200px, JPEG 품질 0.75로 압축합니다.
- 접속 정보는 `src/lib/supabase.js`에 있습니다. 브라우저 번들에 실리는 공개 키이며,
  접근 제어는 RLS 정책이 담당합니다. 현재 정책은 **누구나 읽고 쓸 수 있는 완전 공개**입니다.
- 변경 사항은 Supabase Realtime으로 즉시 반영되고, 실시간 연결이 막힌 망을 대비해
  화면을 보고 있는 동안 45초마다 다시 읽습니다.

## AI로 일정 만들기 · 장소 질문

설정 메뉴(☰ → 설정)에서 여행 프롬프트를 넣으면 일정·장소 설명·준비물이 새로 만들어지고,
장소 카드마다 궁금한 점을 물어볼 수 있습니다. 답변도 공유 저장소에 남아 모두가 같이 봅니다.

- Claude 호출은 Supabase Edge Function `chabak-ai` 안에서만 일어납니다.
  API 키는 서버 시크릿에만 있고 브라우저 번들에는 들어가지 않습니다.
- 모델: `claude-opus-5`. 일정 생성은 strict tool use로 JSON 스키마를 강제합니다.
- 사이트가 공개돼 있으므로 두 겹으로 막습니다: **공유 암호**(`CHABAK_AI_PASSWORD`)와
  **IP당 시간 제한**(일정 생성 5회/시간, 질문 30회/시간, `chabak_ai_calls` 테이블 기준).

### 설정 방법

Supabase 대시보드 → Project Settings → Edge Functions → Secrets 에서 두 개를 넣습니다.

| 시크릿 | 값 |
|---|---|
| `ANTHROPIC_API_KEY` | console.anthropic.com 에서 발급한 API 키 |
| `CHABAK_AI_PASSWORD` | 동행자와 공유할 임의의 암호 |

둘 중 하나라도 없으면 AI 기능은 꺼진 상태로 안내 메시지만 나옵니다. 나머지 기능은 그대로 동작합니다.

### 일정을 새로 만들면 지워지는 것

`chabak_trip_docs`(일정·경로), `chabak_memos`, `chabak_visits`,
`chabak_checklist_items`, `chabak_place_answers` 가 교체·삭제됩니다.
새 일정의 장소 id가 달라 옛 기록이 어차피 연결되지 않기 때문입니다.
**사진은 지우지 않습니다** — 되돌릴 수 없어서 사용자가 직접 지우도록 남겨 둡니다.
