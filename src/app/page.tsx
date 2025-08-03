'use client';

import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import RecordTab from '@/tabs/RecordTab';
import SummaryTab from '@/tabs/SummaryTab';
import SettingsTab from '@/tabs/SettingsTab';

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <main className="p-4">
      <Tabs defaultValue="record" className="w-full">
        <TabsList>
          <TabsTrigger value="record">記録用</TabsTrigger>
          <TabsTrigger value="summary">集計用</TabsTrigger>
          <TabsTrigger value="settings">設定用</TabsTrigger>
        </TabsList>

        <TabsContent value="record">
          <RecordTab selectedDate={selectedDate} setSelectedDate={s
