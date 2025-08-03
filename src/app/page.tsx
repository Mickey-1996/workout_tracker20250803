'use client';

import React, { useState } from 'react';
import RecordTab from '../tabs/RecordTab';
import SettingsTab from '../tabs/SettingsTab';

export default function HomePage() {
  const [tab, setTab] = useState<'record' | 'settings'>('record');
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">トレーニング記録アプリ</h1>

      <div className="flex gap-2 mb-6">
        <button
          className={`px-4 py-2 rounded ${tab === 'record' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setTab('record')}
        >
          記録用
        </button>
        <button
          className={`px-4 py-2 rounded ${tab === 'settings' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setTab('settings')}
        >
          設定用
        </button>
      </div>

      {tab === 'record' && (
        <RecordTab selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      )}

      {tab === 'settings' && (
        <SettingsTab />
      )}
    </div>
  );
}
