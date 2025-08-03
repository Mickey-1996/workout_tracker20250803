"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const upperBodyExercises = [
  "フル懸垂",
  "ネガティブ懸垂",
  "ベントオーバーロウ",
  "ダンベルプルオーバー",
  "ダンベルフライ",
  "腕立て伏せ"
];

const lowerBodyExercises = [
  "バックランジ",
  "ワイドスクワット"
];

export default function Home() {
  const [date, setDate] = useState("");
  const [records, setRecords] = useState({});
  const [memo, setMemo] = useState("");
  const [history, setHistory] = useState([]);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setDate(today);

    const saved = localStorage.getItem("workout-records");
    if (saved) {
      const parsed = JSON.parse(saved);
      setRecords(parsed.records || {});
      setHistory(parsed.history || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "workout-records",
      JSON.stringify({ records, history })
    );
  }, [records, history]);

  const handleCheckbox = (type, name, index) => {
    const newRecords = { ...records };
    if (!newRecords[date]) newRecords[date] = {};
    if (!newRecords[date][type]) newRecords[date][type] = {};
    if (!newRecords[date][type][name])
      newRecords[date][type][name] = Array(5).fill(false);

    newRecords[date][type][name][index] =
      !newRecords[date][type][name][index];
    setRecords(newRecords);
  };

  const saveMemo = () => {
    const newHistory = [
      { date, memo, data: records[date] || {} },
      ...history.filter((h) => h.date !== date)
    ].slice(0, 14);
    setHistory(newHistory);
    setMemo("");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const renderExercise = (type, name) => {
    const checks =
      records?.[date]?.[type]?.[name] || Array(5).fill(false);
    return (
      <Card className="mb-2">
        <CardContent className="p-4">
          <div className="font-semibold mb-2">{name}</div>
          <div className="flex gap-2 mb-2">
            {checks.map((c, i) => (
              <Checkbox
                key={i}
                checked={c}
                onCheckedChange={() => handleCheckbox(type, name, i)}
              />
            ))}
          </div>
          <div className="w-full h-2 bg-gray-200 rounded">
            <div
              className="h-2 bg-green-500 rounded"
              style={{ width: `${getCompletionRate(type, name)}%` }}
            />
          </div>
        </CardContent>
      </Card>
    );
  };

  const getCompletionRate = (type, name) => {
    let completed = 0;
    let total = 0;
    history.forEach((h) => {
      const sets = h.data?.[type]?.[name];
      if (sets) {
        completed += sets.filter(Boolean).length;
        total += sets.length;
      }
    });
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const getWeeklySummary = () => {
    const today = new Date();
    const summary = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().split("T")[0];
      const r = records[key];
      if (r) {
        summary.push({ date: key, count: Object.keys(r).length });
      }
    }
    return summary;
  };

  const weeklySummary = getWeeklySummary();

  return (
    <main className="max-w-xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">🏋️ 筋トレ記録アプリ</h1>
      <Input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="mb-4"
      />

      <h2 className="text-lg font-semibold mt-4">上半身トレーニング</h2>
      {upperBodyExercises.map((name) => renderExercise("upper", name))}

      <h2 className="text-lg font-semibold mt-4">下半身トレーニング</h2>
      {lowerBodyExercises.map((name) => renderExercise("lower", name))}

      <Textarea
        placeholder="メモを書く..."
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        className="my-4"
      />
      <Button onClick={saveMemo}>💾 メモと記録を保存</Button>

      {showToast && (
        <div className="mt-2 text-green-600">✅ 記録を保存しました！</div>
      )}

      <h3 className="text-md font-semibold mt-6">📅 過去14日間の記録履歴</h3>
      <ul className="text-sm list-disc list-inside mb-4">
        {weeklySummary.map((item) => (
          <li key={item.date}>
            {item.date}：{item.count}種目記録
          </li>
        ))}
      </ul>

      <h3 className="text-md font-semibold mt-4">📊 種目ごとの達成率</h3>
      <ul className="text-sm list-disc list-inside">
        {[...upperBodyExercises, ...lowerBodyExercises].map((name) => {
          const type = upperBodyExercises.includes(name) ? "upper" : "lower";
          return (
            <li key={name}>
              {name}：{getCompletionRate(type, name)}%
            </li>
          );
        })}
      </ul>
    </main>
  );
}
