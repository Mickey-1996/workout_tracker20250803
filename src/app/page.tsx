"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  const [records, setRecords] = useState({});
  const [notes, setNotes] = useState({});
  const [exercises, setExercises] = useState(defaultExercises);
  const [tab, setTab] = useState("log");

  const handleCheckbox = (name, setIndex) => {
    setRecords(prev => {
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

  const completedCount = (name) => {
    return records[date]?.[name]?.filter(Boolean).length || 0;
  };

  const handleNoteChange = (e, type) => {
    setNotes(prev => ({
      ...prev,
      [date]: {
        ...prev[date],
        [type]: e.target.value
      }
    }));
  };

  const weeklySummary = () => {
    const summary = {};
    Object.entries(records).forEach(([recordDate, exercises]) => {
      Object.entries(exercises).forEach(([name, sets]) => {
        summary[name] = (summary[name] || 0) + sets.filter(Boolean).length;
      });
    });
    return summary;
  };

  const updateExerciseName = (index, newName) => {
    const updated = [...exercises];
    updated[index].name = newName;
    setExercises(updated);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="mb-4 flex gap-2">
        <Button onClick={() => setTab("log")}>記録用</Button>
        <Button onClick={() => setTab("summary")}>集計用</Button>
        <Button onClick={() => setTab("settings")}>設定用</Button>
      </div>

      {tab === "log" && (
        <div>
          <h2 className="text-xl font-bold mb-2">{date} のトレーニング記録</h2>
          {exercises.map((ex, i) => (
            <Card key={i} className="mb-4">
              <CardContent className="p-4">
                <div className="mb-2 font-semibold">{ex.name}（{ex.reps}回 x {ex.sets}セット）</div>
                <div className="flex gap-2 mb-2">
                  {[...Array(ex.sets)].map((_, idx) => (
                    <Checkbox
                      key={idx}
                      checked={records[date]?.[ex.name]?.[idx] || false}
                      onCheckedChange={() => handleCheckbox(ex.name, idx)}
                      className="w-6 h-6"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
          <div className="mb-4">
            <div className="font-semibold">上半身メモ:</div>
            <Textarea
              value={notes[date]?.upper || ""}
              onChange={(e) => handleNoteChange(e, "upper")}
            />
          </div>
          <div className="mb-4">
            <div className="font-semibold">下半身メモ:</div>
            <Textarea
              value={notes[date]?.lower || ""}
              onChange={(e) => handleNoteChange(e, "lower")}
            />
          </div>
        </div>
      )}

      {tab === "summary" && (
        <div>
          <h2 className="text-xl font-bold mb-4">📊 週間集計</h2>
          <ul className="list-disc pl-5">
            {Object.entries(weeklySummary()).map(([name, count]) => (
              <li key={name}>{name}：{count} 回</li>
            ))}
          </ul>
        </div>
      )}

      {tab === "settings" && (
        <div>
          <h2 className="text-xl font-bold mb-4">⚙️ 種目設定</h2>
          {exercises.map((ex, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <Input
                value={ex.name}
                onChange={(e) => updateExerciseName(i, e.target.value)}
              />
              <span>{ex.reps}回 x {ex.sets}セット</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
