
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const Privacy = () => {
  const { t } = useTranslation();
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConsent = async () => {
    setLoading(true);
    setError('');
    try {
      await axios.post('/api/privacy/consent', { consent: true });
      setConsent(true);
    } catch (err) {
      setError('Failed to store consent');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-28">
      <h2 className="text-3xl font-bold text-blue-800 mb-6">{t('privacyTitle') || 'Privacy & Consent'}</h2>
      <div className="w-full max-w-2xl bg-white p-6 rounded-xl shadow mb-6">
        <p className="text-gray-700 mb-4">{t('privacyText') || 'We value your privacy. Your data and CV files are securely managed and will not be shared without your consent.'}</p>
        {loading ? (
          <div className="text-blue-600 text-center">Saving consent...</div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : !consent ? (
          <button className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition" onClick={handleConsent}>
            {t('giveConsent') || 'I Agree'}
          </button>
        ) : (
          <div className="text-green-600 font-semibold">{t('consentGiven') || 'Consent given. Thank you!'}</div>
        )}
      </div>
    </main>
  );
};

export default Privacy;
