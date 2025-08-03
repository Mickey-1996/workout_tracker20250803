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
  const [tab, setTab] = useState<'record' | 'summary' | 'settings'>('record');
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
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editingName, setEditingName] = useState<string>("");
  const [editingIndex, setEditingIndex] = useState<number>(-1);
  const [editingType, setEditingType] = useState<"upper" | "lower">("upper");

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

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

  const handleDragStart = (index: number) => setDraggedIndex(index);
  const handleDrop = (index: number, type: "upper" | "lower") => {
    if (draggedIndex === null) return;
    const list = type === "upper" ? [...upperBodyExercises] : [...lowerBodyExercises];
    const [draggedItem] = list.splice(draggedIndex, 1);
    list.splice(index, 0, draggedItem);
    if (type === "upper") setUpperBodyExercises(list);
    else setLowerBodyExercises(list);
    setDraggedIndex(null);
  };

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
    const checks = records?.[date]?.[type]?.[name] || Array(5).fill(false);
    return (
      <Card className="mb-2">
        <CardContent className="p-4">
          <div className="font-semibold mb-2 text-base">{name}</div>
          <div className="flex gap-4 mb-2 ml-8">
            {checks.map((c, i) => (
              <Checkbox
                key={i}
                checked={c}
                onCheckedChange={() => handleCheckbox(type, name, i)}
                className="w-7 h-7 border-2 border-gray-700 rounded"
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
      let count = 0;
      if (r) {
        for (const type of Object.keys(r)) {
          for (const name of Object.keys(r[type])) {
            sets += r[type][name].filter(Boolean).length;
            count++;
          }
        }
      }
      summary.push({ date: key, count, sets });
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

  const editExercise = (type: "upper" | "lower", index: number, name: string) => {
    setEditingType(type);
    setEditingIndex(index);
    setEditingName(name);
    setEditMode(true);
  };

  const saveExerciseName = () => {
    if (editingType === "upper") {
      const updated = [...upperBodyExercises];
      updated[editingIndex] = editingName;
      setUpperBodyExercises(updated);
    } else {
      const updated = [...lowerBodyExercises];
      updated[editingIndex] = editingName;
      setLowerBodyExercises(updated);
    }
    setEditMode(false);
    setEditingName("");
    setEditingIndex(-1);
  };

  const deleteExercise = (type: "upper" | "lower", index: number) => {
    if (type === "upper") {
      const updated = [...upperBodyExercises];
      updated.splice(index, 1);
      setUpperBodyExercises(updated);
    } else {
      const updated = [...lowerBodyExercises];
      updated.splice(index, 1);
      setLowerBodyExercises(updated);
    }
  };

  const weeklySummary = getWeeklySummary();

  return (
    <main className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">🏋️ 筋トレ記録アプリ</h1>

      <div className="flex gap-4 mb-6">
        <Button onClick={() => setTab('record')}>📋 記録用</Button>
        <Button onClick={() => setTab('summary')}>📊 集計用</Button>
        <Button onClick={() => setTab('settings')}>⚙️ 設定用</Button>
      </div>

      {/* (そのまま record, summary, settings タブのレンダリングを続けます) */}
    </main>
  );
}
