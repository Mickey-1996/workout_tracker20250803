'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import Calendar from '@/components/ui/Calendar'; // あなたの実装に合わせて調整
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type Props = {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
};

const defaultExercises = [
  '懸垂',
  'ダンベルロー',
  'プルオーバー',
  'プッシュアップ',
];

export default function RecordTab({ selectedDate, setSelectedDate }: Props) {
  const [records, setRecords] = useState<Record<string, Record<string, boolean[]>>>({});

  const formattedDate = format(selectedDate, 'yyyy-MM-dd');

  const toggleCheckbox = (exercise: string, setIndex: number) => {
    setRecords(prev => {
      const day = prev[formattedDate] || {};
      const sets = day[exercise] || Array(5).fill(false);
      sets[setIndex] = !sets[setIndex];
      return {
        ...prev,
        [formattedDate]: {
          ...day,
          [exercise]: sets,
        },
      };
    });
  };

  return (
    <div className="space-y-4">
      <Calendar selected={selectedDate} onSelect={setSelectedDate} />

      {defaultExercises.map(exercise => (
        <Card key={exercise}>
          <CardContent className="p-4 space-y-2">
            <h2 className="text-lg font-bold">{exercise}</h2>
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <Checkbox
                  key={i}
                  checked={records[formattedDate]?.[exercise]?.[i] || false}
                  onCheckedChange={() => toggleCheckbox(exercise, i)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
