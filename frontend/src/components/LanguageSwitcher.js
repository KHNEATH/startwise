import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  return (
    <div className="flex gap-2 mb-4">
      <button onClick={() => i18n.changeLanguage('en')} className="px-2 py-1 border rounded">EN</button>
      <button onClick={() => i18n.changeLanguage('km')} className="px-2 py-1 border rounded">ខ្មែរ</button>
    </div>
  );
};

export default LanguageSwitcher;
