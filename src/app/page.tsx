"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface RecordData {
  [date: string]: {
    [type: string]: {
      [name: string]: boolean[];
    };
  };
}

interface HistoryItem {
  date: string;
  memo: {
    upper: string;
    lower: string;
  };
  data: RecordData[string];
}

export default function Home() {
  const [date, setDate] = useState<string>("");
  const [records, setRecords] = useState<RecordData>({});
  const [memoUpper, setMemoUpper] = useState<string>("");
  const [memoLower, setMemoLower] = useState<string>("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [upperBodyExercises, setUpperBodyExercises] = useState<string[]>([
    "フル懸垂",
    "ネガティブ懸垂",
    "ベントオーバーロウ",
    "ダンベルプルオーバー",
    "ダンベルフライ",
    "腕立て伏せ"
  ]);
  const [lowerBodyExercises, setLowerBodyExercises] = useState<string[]>([
    "バックランジ",
    "ワイドスクワット"
  ]);
  const [newUpperExercise, setNewUpperExercise] = useState("");
  const [newLowerExercise, setNewLowerExercise] = useState("");

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setDate(today);

    const saved = localStorage.getItem("workout-records");
    if (saved) {
      const parsed = JSON.parse(saved);
      setRecords(parsed.records || {});
      setHistory(parsed.history || []);
      setUpperBodyExercises(parsed.upperBodyExercises || upperBodyExercises);
      setLowerBodyExercises(parsed.lowerBodyExercises || lowerBodyExercises);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "workout-records",
      JSON.stringify({ records, history, upperBodyExercises, lowerBodyExercises })
    );
  }, [records, history, upperBodyExercises, lowerBodyExercises]);

  const handleCheckbox = (type: string, name: string, index: number) => {
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
      { date, memo: { upper: memoUpper, lower: memoLower }, data: records[date] || {} },
      ...history.filter((h) => h.date !== date)
    ].slice(0, 14);
    setHistory(newHistory);
    setMemoUpper("");
    setMemoLower("");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const renderExercise = (type: string, name: string) => {
    const checks =
      records?.[date]?.[type]?.[name] || Array(5).fill(false);
    return (
      <Card className="mb-2">
        <CardContent className="p-4">
          <div className="font-semibold mb-2 text-sm">{name}</div>
          <div className="flex gap-3 mb-2 ml-8">
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

  const getCompletionRate = (type: string, name: string): number => {
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
    const summary: { date: string; count: number; sets: number }[] = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().split("T")[0];
      const r = records[key];
      let sets = 0;
      if (r) {
        for (const type of Object.keys(r)) {
          for (const name of Object.keys(r[type])) {
            sets += r[type][name].filter(Boolean).length;
          }
        }
        summary.push({ date: key, count: Object.keys(r).length, sets });
      }
    }
    return summary;
  };

  const addExercise = (type: "upper" | "lower") => {
    if (type === "upper" && newUpperExercise.trim()) {
      setUpperBodyExercises([...upperBodyExercises, newUpperExercise.trim()]);
      setNewUpperExercise("");
    } else if (type === "lower" && newLowerExercise.trim()) {
      setLowerBodyExercises([...lowerBodyExercises, newLowerExercise.trim()]);
      setNewLowerExercise("");
    }
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

      <h2 className="text-xl font-semibold mt-4">上半身トレーニング</h2>
      <div className="flex gap-2 mb-2">
        <Input
          placeholder="種目を追加"
          value={newUpperExercise}
          onChange={(e) => setNewUpperExercise(e.target.value)}
        />
        <Button onClick={() => addExercise("upper")}>追加</Button>
      </div>
      {upperBodyExercises.map((name) => renderExercise("upper", name))}

      <Textarea
        placeholder="上半身メモを書く..."
        value={memoUpper}
        onChange={(e) => setMemoUpper(e.target.value)}
        className="my-4 h-28"
      />

      <h2 className="text-xl font-semibold mt-4">下半身トレーニング</h2>
      <div className="flex gap-2 mb-2">
        <Input
          placeholder="種目を追加"
          value={newLowerExercise}
          onChange={(e) => setNewLowerExercise(e.target.value)}
        />
        <Button onClick={() => addExercise("lower")}>追加</Button>
      </div>
      {lowerBodyExercises.map((name) => renderExercise("lower", name))}

      <Textarea
        placeholder="下半身メモを書く..."
        value={memoLower}
        onChange={(e) => setMemoLower(e.target.value)}
        className="my-4 h-28"
      />

      <Button onClick={saveMemo}>💾 メモと記録を保存</Button>

      {showToast && (
        <div className="mt-2 text-green-600">✅ 記録を保存しました！</div>
      )}

      <h3 className="text-md font-semibold mt-6">📅 過去14日間の記録履歴</h3>
      <ul className="text-sm list-disc list-inside mb-4">
        {weeklySummary.map((item) => (
          <li key={item.date}>
            {item.date}：{item.count}種目／{item.sets}セット
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
