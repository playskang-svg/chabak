import React from 'react';
import { Check, LoaderCircle, AlertTriangle } from 'lucide-react';

// 저장이 됐는지 화면으로 알려줍니다. 표시할 게 없으면 아무것도 그리지 않습니다.
const LABELS = {
  saving: { icon: LoaderCircle, text: '저장 중', className: 'save-state saving' },
  saved: { icon: Check, text: '저장됨', className: 'save-state saved' },
  error: { icon: AlertTriangle, text: '저장 안 됨', className: 'save-state error' },
};

const SaveState = ({ status }) => {
  const entry = LABELS[status];
  if (!entry) return null;
  const Icon = entry.icon;
  return (
    <span className={entry.className} role="status">
      <Icon size={12} /> {entry.text}
    </span>
  );
};

export default SaveState;
