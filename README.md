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
