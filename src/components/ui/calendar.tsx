'use client';

import * as React from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';

export default function Calendar({ selected, onSelect }: {
  selected: Date;
  onSelect: (date: Date) => void;
}) {
  return (
    <div className="rounded-md border w-fit p-2">
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={(date) => {
          if (date) onSelect(date);
        }}
        className="bg-white"
        captionLayout="dropdown"
        fromYear={2020}
        toYear={2030}
      />
      <p className="text-sm text-center mt-2">選択日: {format(selected, 'yyyy-MM-dd')}</p>
    </div>
  );
}
