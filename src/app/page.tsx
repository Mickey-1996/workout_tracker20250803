"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { GripVertical } from "lucide-react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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

interface SortableItemProps {
  id: string;
  onDelete: (id: string) => void;
  onChange: (id: string, value: string) => void;
}

function SortableItem({ id, onDelete, onChange }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="flex items-center gap-2 p-2 border border-gray-300 rounded mb-2"
    >
      <span {...listeners} className="cursor-move">
        <GripVertical />
      </span>
      <Input value={id} onChange={(e) => onChange(id, e.target.value)} className="flex-1" />
      <Button onClick={() => onDelete(id)} variant="destructive">
        削除
      </Button>
    </div>
  );
}

export default function Home() {
  const [tab, setTab] = useState<'record' | 'summary' | 'settings'>('record');
  const [date, setDate] = useState<string>("");
  const [records, setRecords] = useState<RecordData>({});
  const [memoUpper, setMemoUpper] = useState<string>("");
  const [memoLower, setMemoLower] = useState<string>("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
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

  const handleDelete = (type: string, id: string) => {
    if (type === "upper") {
      setUpperBodyExercises((prev) => prev.filter((item) => item !== id));
    } else {
      setLowerBodyExercises((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleChange = (type: string, oldId: string, newValue: string) => {
    if (type === "upper") {
      setUpperBodyExercises((prev) => prev.map((item) => item === oldId ? newValue : item));
    } else {
      setLowerBodyExercises((prev) => prev.map((item) => item === oldId ? newValue : item));
    }
  };

  const handleDragEnd = (type: string, event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const items = type === "upper" ? [...upperBodyExercises] : [...lowerBodyExercises];
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      const sorted = arrayMove(items, oldIndex, newIndex);
      if (type === "upper") setUpperBodyExercises(sorted);
      else setLowerBodyExercises(sorted);
    }
  };

  return (
    <main className="max-w-xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">🏋️ 筋トレ記録アプリ</h1>

      <div className="flex gap-4 mb-6">
        <Button onClick={() => setTab('record')}>📋 記録用</Button>
        <Button onClick={() => setTab('summary')}>📊 集計用</Button>
        <Button onClick={() => setTab('settings')}>⚙️ 設定用</Button>
      </div>

      {tab === 'record' && (
        <div>
          <h2 className="text-xl font-semibold mb-2">📅 {date}</h2>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">上半身トレーニング</h3>
            {upperBodyExercises.map((name) => (
              <Card key={name} className="mb-2">
                <CardContent className="p-4">
                  <div className="text-base font-semibold mb-2">{name}</div>
                  <div className="flex gap-3 mb-2 ml-8">
                    {Array(5).fill(null).map((_, index) => (
                      <Checkbox
                        key={index}
                        checked={records?.[date]?.upper?.[name]?.[index] || false}
                        onCheckedChange={() => handleCheckbox("upper", name, index)}
                        className="w-8 h-8 border-2 border-gray-700 rounded"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
            <Textarea
              value={memoUpper}
              onChange={(e) => setMemoUpper(e.target.value)}
              placeholder="上半身メモを入力"
              className="w-full h-24 mt-2"
            />
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">下半身トレーニング</h3>
            {lowerBodyExercises.map((name) => (
              <Card key={name} className="mb-2">
                <CardContent className="p-4">
                  <div className="text-base font-semibold mb-2">{name}</div>
                  <div className="flex gap-3 mb-2 ml-8">
                    {Array(5).fill(null).map((_, index) => (
                      <Checkbox
                        key={index}
                        checked={records?.[date]?.lower?.[name]?.[index] || false}
                        onCheckedChange={() => handleCheckbox("lower", name, index)}
                        className="w-8 h-8 border-2 border-gray-700 rounded"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
            <Textarea
              value={memoLower}
              onChange={(e) => setMemoLower(e.target.value)}
              placeholder="下半身メモを入力"
              className="w-full h-24 mt-2"
            />
          </div>

          <Button onClick={() => alert("保存しました！")}>💾 保存</Button>
        </div>
      )}

      {tab === 'summary' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">📊 週間サマリー</h2>
          {/* 今後実装 */}
        </div>
      )}

      {tab === 'settings' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">⚙️ 種目設定</h2>

          <div className="mb-4">
            <h3 className="text-md font-semibold mb-2">上半身トレーニング</h3>
            <DndContext collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd("upper", e)}>
              <SortableContext items={upperBodyExercises} strategy={verticalListSortingStrategy}>
                {upperBodyExercises.map((id) => (
                  <SortableItem
                    key={id}
                    id={id}
                    onDelete={(item) => handleDelete("upper", item)}
                    onChange={(oldId, newValue) => handleChange("upper", oldId, newValue)}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>

          <div className="mb-4">
            <h3 className="text-md font-semibold mb-2">下半身トレーニング</h3>
            <DndContext collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd("lower", e)}>
              <SortableContext items={lowerBodyExercises} strategy={verticalListSortingStrategy}>
                {lowerBodyExercises.map((id) => (
                  <SortableItem
                    key={id}
                    id={id}
                    onDelete={(item) => handleDelete("lower", item)}
                    onChange={(oldId, newValue) => handleChange("lower", oldId, newValue)}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </div>
      )}
    </main>
  );
}
