
import React from 'react';
import { CalendarDays, List } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarView } from '@/components/history/CalendarView';
import { ListView } from '@/components/history/ListView';
import { FilterPopover } from '@/components/history/FilterPopover';
import { useHistoryView } from '@/hooks/useHistoryView';

const History = () => {
  const {
    date,
    view,
    selectedDate,
    entries,
    activeFilter,
    setView,
    setSelectedDate,
    handleMonthChange,
    handleFilterSelect
  } = useHistoryView();

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      <section className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Historique</h1>
        <div className="flex space-x-2">
          <Tabs 
            value={view} 
            onValueChange={(v) => setView(v as 'calendar' | 'list')}
            className="w-[180px]"
          >
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="calendar">
                <CalendarDays className="h-4 w-4 mr-1" />
                Calendrier
              </TabsTrigger>
              <TabsTrigger value="list">
                <List className="h-4 w-4 mr-1" />
                Liste
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <FilterPopover onFilterSelect={handleFilterSelect} />
        </div>
      </section>

      {view === 'calendar' && (
        <CalendarView
          date={date}
          entries={entries}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          handleMonthChange={handleMonthChange}
        />
      )}

      {view === 'list' && (
        <ListView entries={entries} />
      )}
    </div>
  );
};

export default History;
