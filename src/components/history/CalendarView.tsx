
import React from 'react';
import { format, eachDayOfInterval, startOfMonth, endOfMonth, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EntryData } from '@/hooks/useEntryData';
import { DailyEntries } from './DailyEntries';
import { cn } from '@/lib/utils';

interface CalendarViewProps {
  date: Date;
  entries: EntryData[];
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date) => void;
  handleMonthChange: (increment: number) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  date,
  entries,
  selectedDate,
  setSelectedDate,
  handleMonthChange
}) => {
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

  const entriesForSelectedDate = selectedDate 
    ? entries.filter(entry => isSameDay(entry.time, selectedDate))
    : [];

  return (
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
        <DailyEntries 
          selectedDate={selectedDate} 
          entries={entriesForSelectedDate} 
        />
      ) : selectedDate ? (
        <div className="mt-6 text-center py-4 text-muted-foreground">
          Aucune entrée pour le {format(selectedDate, 'dd MMMM yyyy', { locale: fr })}
        </div>
      ) : null}
    </Card>
  );
};
