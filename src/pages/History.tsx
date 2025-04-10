
import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  List, 
  CalendarDays,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BristolType } from '@/components/stool/BristolType';
import { getEntries, getEntriesByDate } from '@/services/storageService';
import { EntryData } from '@/hooks/useEntryData';

const History = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [entries, setEntries] = useState<EntryData[]>([]);
  
  // Load entries from localStorage when component mounts
  useEffect(() => {
    const storedEntries = getEntries();
    setEntries(storedEntries);
  }, []);

  const entriesForSelectedDate = selectedDate 
    ? entries.filter(entry => isSameDay(entry.time, selectedDate))
    : [];

  const handleMonthChange = (increment: number) => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + increment);
    setDate(newDate);
  };

  const days = eachDayOfInterval({
    start: startOfMonth(date),
    end: endOfMonth(date)
  });

  // Get number of entries per day for the calendar view
  const entriesByDay = days.map(day => {
    const dayEntries = entries.filter(entry => isSameDay(entry.time, day));
    return {
      date: day,
      entries: dayEntries,
      count: dayEntries.length
    };
  });

  // Group entries by date for the list view
  const groupedEntries: { [date: string]: EntryData[] } = {};
  entries.forEach(entry => {
    const dateKey = format(entry.time, 'yyyy-MM-dd');
    if (!groupedEntries[dateKey]) {
      groupedEntries[dateKey] = [];
    }
    groupedEntries[dateKey].push(entry);
  });

  // Sort dates in descending order (most recent first)
  const sortedDateKeys = Object.keys(groupedEntries).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

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
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="space-y-2 py-2">
                <h3 className="font-medium mb-2">Filtrer par type</h3>
                <div className="grid grid-cols-4 gap-1">
                  {[1, 2, 3, 4, 5, 6, 7].map(type => (
                    <div key={type} className="flex items-center justify-center">
                      <BristolType type={type} size="sm" showLabel={false} />
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </section>

      {view === 'calendar' && (
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <Button variant="ghost" size="icon" onClick={() => handleMonthChange(-1)}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-lg font-medium">
              {format(date, 'MMMM yyyy', { locale: fr })}
            </h2>
            <Button variant="ghost" size="icon" onClick={() => handleMonthChange(1)}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(day => (
              <div key={day} className="text-center py-2 text-muted-foreground">
                {day}
              </div>
            ))}
            
            {entriesByDay.map(({ date, entries, count }) => {
              const dayOfMonth = date.getDate();
              const dayOfWeek = date.getDay();
              
              // Create placeholder divs for days before the first of the month
              const placeholders = [];
              if (dayOfMonth === 1) {
                const firstDayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Adjust for Monday start
                for (let i = 0; i < firstDayOfWeek; i++) {
                  placeholders.push(<div key={`placeholder-${i}`} className="py-2" />);
                }
              }
              
              return (
                <React.Fragment key={date.toString()}>
                  {dayOfMonth === 1 && placeholders}
                  <div
                    className={`py-2 text-center relative cursor-pointer hover:bg-muted/50 rounded-md ${
                      selectedDate && isSameDay(date, selectedDate) ? 'bg-intestitrack-blue-light' : ''
                    }`}
                    onClick={() => setSelectedDate(date)}
                  >
                    <div>{dayOfMonth}</div>
                    {count > 0 && (
                      <div className="flex justify-center mt-1 space-x-1">
                        {entries.slice(0, 3).map((entry, index) => (
                          <div 
                            key={index}
                            className={`h-2 w-2 rounded-full bristol-type-${entry.type}`}
                          />
                        ))}
                        {count > 3 && <div className="text-xs">+{count - 3}</div>}
                      </div>
                    )}
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          {entriesForSelectedDate.length > 0 ? (
            <div className="mt-6">
              <h3 className="font-medium mb-2">
                Entrées du {selectedDate && format(selectedDate, 'dd MMMM yyyy', { locale: fr })}
              </h3>
              <div className="space-y-2">
                {entriesForSelectedDate.map(entry => (
                  <Card key={entry.id} className="p-3 hover:bg-muted/50 cursor-pointer">
                    <div className="flex items-center">
                      <div className={`bristol-type-${entry.type} w-10 h-10 rounded-full flex items-center justify-center mr-3`}>
                        <span className="font-semibold">{entry.type}</span>
                      </div>
                      <div>
                        <div className="font-medium">Type {entry.type}</div>
                        <div className="text-sm text-muted-foreground">
                          {format(entry.time, 'HH:mm')}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : selectedDate ? (
            <div className="mt-6 text-center py-4 text-muted-foreground">
              Aucune entrée pour le {format(selectedDate, 'dd MMMM yyyy', { locale: fr })}
            </div>
          ) : null}
        </Card>
      )}

      {view === 'list' && (
        <div className="space-y-4">
          {entries.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground">Aucune entrée à afficher</p>
            </Card>
          ) : (
            sortedDateKeys.map((dateKey) => (
              <div key={dateKey}>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  {format(new Date(dateKey), 'EEEE dd MMMM yyyy', { locale: fr })}
                </h3>
                <div className="space-y-2">
                  {groupedEntries[dateKey].map(entry => (
                    <Card key={entry.id} className="p-3 hover:bg-muted/50 cursor-pointer">
                      <div className="flex items-center">
                        <div className={`bristol-type-${entry.type} w-10 h-10 rounded-full flex items-center justify-center mr-3`}>
                          <span className="font-semibold">{entry.type}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span className="font-medium">Type {entry.type}</span>
                            <span className="text-sm text-muted-foreground">
                              {format(new Date(entry.time), 'HH:mm')}
                            </span>
                          </div>
                          <div className="flex items-center mt-1">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs mr-2 ${
                              entry.quantity === 'small' ? 'bg-intestitrack-blue-light text-intestitrack-blue' :
                              entry.quantity === 'normal' ? 'bg-intestitrack-green-light text-intestitrack-green' :
                              'bg-intestitrack-alert-light text-intestitrack-alert'
                            }`}>
                              {entry.quantity === 'small' ? 'Faible' : 
                              entry.quantity === 'normal' ? 'Normale' : 'Abondante'}
                            </span>
                            {entry.notes && (
                              <span className="text-xs text-muted-foreground">Avec notes</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default History;
