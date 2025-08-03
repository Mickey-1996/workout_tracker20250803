// app/layout.tsx（ルートレイアウト）
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="p-4">
        {children}
      </body>
    </html>
  );
}

// app/page.tsx（タブ付きトップページ）
'use client';

import { useState } from 'react';
import RecordTab from './tabs/RecordTab';
import SummaryTab from './tabs/SummaryTab';
import SettingsTab from './tabs/SettingsTab';

export default function Home() {
  const tabs = ['記録用', '集計用', '設定用'];
  const [activeTab, setActiveTab] = useState('記録用');

  return (
    <div>
      <div className="flex space-x-4 border-b mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 ${activeTab === tab ? 'border-b-2 border-black font-bold' : 'text-gray-500'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === '記録用' && <RecordTab />}
      {activeTab === '集計用' && <SummaryTab />}
      {activeTab === '設定用' && <SettingsTab />}
    </div>
  );
}

// app/tabs/RecordTab.tsx
'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function RecordTab() {
  const [date, setDate] = useState(new Date());
  return (
    <div>
      <Calendar onChange={setDate} value={date} className="mb-4" />
      <p className="mb-4">選択日: {format(date, 'yyyy/MM/dd')}</p>
      {/* 記録入力UIをここに配置 */}
    </div>
  );
}

// app/tabs/SummaryTab.tsx
'use client';

export default function SummaryTab() {
  return (
    <div>
      <p>週ごとの集計データ（未実装）</p>
    </div>
  );
}

// app/tabs/SettingsTab.tsx
'use client';

export default function SettingsTab() {
  return (
    <div>
      <p>種目の追加・削除・編集・順序変更（未実装）</p>
    </div>
  );
}
