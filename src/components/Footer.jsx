import React from 'react';

export const CONTACT_EMAIL = 'playskang@gmail.com';
export const OPERATOR = '어썸라이프';

const Footer = () => (
  <footer className="site-footer">
    <nav className="footer-links">
      <a href="#/about">소개 · 이용방법</a>
      <span className="footer-dot" aria-hidden="true">·</span>
      <a href="#/privacy">개인정보처리방침</a>
    </nav>
    <p className="footer-meta">
      {OPERATOR} · 문의 <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
    </p>
  </footer>
);

export default Footer;
