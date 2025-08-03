"use client";

import { useState } from "react";
import { format } from "date-fns";

const defaultExercises = [
  { name: "フル懸垂", sets: 3, reps: 5 },
  { name: "ネガティブ懸垂", sets: 3, reps: 5 },
  { name: "ダンベルベントオーバーロウ", sets: 5, reps: 15 },
  { name: "ダンベルプルオーバー", sets: 3, reps: 10 },
  { name: "ダンベルフライ", sets: 3, reps: 10 },
  { name: "プッシュアップバー", sets: 3, reps: 15 },
  { name: "バックランジ", sets: 3, reps: 20 },
  { name: "ワイドスクワット", sets: 3, reps: 15 }
];

export default function Home() {
  const [date, setDate] = useState(() => format(new Date(), "yyyy-MM-dd"));
  const [records, setRecords] = useState<Record<string, Record<string, boolean[]>>>({});
  const [notes, setNotes] = useState<Record<string, { upper?: string; lower?: string }>>({});
  const [exercises, setExercises] = useState(defaultExercises);

  const handleCheckbox = (name: string, setIndex: number) => {
    setRecords((prev) => {
      const day = prev[date] || {};
      const sets = day[name] || [];
      const newSets = [...sets];
      newSets[setIndex] = !newSets[setIndex];
      return {
        ...prev,
        [date]: {
          ...day,
          [name]: newSets
        }
      };
    });
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>, type: "upper" | "lower") => {
    setNotes((prev) => ({
      ...prev,
      [date]: {
        ...prev[date],
        [type]: e.target.value
      }
    }));
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{date} のトレーニング記録</h2>
      {exercises.map((ex, i) => (
        <div key={i} className="mb-4 border rounded p-4">
          <div className="mb-2 font-semibold text-lg">
            {ex.name}（{ex.reps}回 x {ex.sets}セット）
          </div>
          <div className="flex gap-3 mb-2">
            {[...Array(ex.sets)].map((_, idx) => (
              <input
                key={idx}
                type="checkbox"
                checked={records[date]?.[ex.name]?.[idx] || false}
                onChange={() => handleCheckbox(ex.name, idx)}
                className="w-7 h-7 border-2 border-gray-600 rounded-sm"
              />
            ))}
          </div>
        </div>
      ))}
      <div className="mb-4">
        <div className="font-semibold">上半身メモ:</div>
        <textarea
          value={notes[date]?.upper || ""}
          onChange={(e) => handleNoteChange(e, "upper")}
          className="min-h-[100px] w-full border px-2 py-1 rounded"
        />
      </div>
      <div className="mb-4">
        <div className="font-semibold">下半身メモ:</div>
        <textarea
          value={notes[date]?.lower || ""}
          onChange={(e) => handleNoteChange(e, "lower")}
          className="min-h-[100px] w-full border px-2 py-1 rounded"
        />
      </div>
    </div>
  );
}


