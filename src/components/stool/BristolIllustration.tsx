
import React from 'react';
import { cn } from '@/lib/utils';

interface BristolIllustrationProps {
  type: number;
  size?: 'sm' | 'md' | 'lg';
}

export const BristolIllustration: React.FC<BristolIllustrationProps> = ({ 
  type,
  size = 'md'
}) => {
  const getSize = () => {
    switch (size) {
      case 'sm': return 'w-8 h-8';
      case 'lg': return 'w-16 h-16';
      default: return 'w-12 h-12';
    }
  };

  const renderIllustration = () => {
    switch (type) {
      case 1:
        return (
          <div className={cn("rounded-full bg-amber-800 flex flex-col justify-center items-center", getSize())}>
            <div className="w-3/4 h-3/4 flex flex-wrap justify-center content-center gap-1">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-1/3 h-1/3 rounded-full bg-amber-700"></div>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className={cn("rounded-full bg-amber-700 flex justify-center items-center", getSize())}>
            <div className="w-4/5 h-4/5 rounded-full bg-amber-600 flex items-center justify-center">
              <div className="w-3/4 h-3/4 flex flex-wrap justify-center content-center gap-0.5">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-2/5 h-2/5 rounded-full bg-amber-700"></div>
                ))}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className={cn("rounded-lg bg-amber-600 flex flex-col justify-center items-center", getSize())}>
            <div className="w-4/5 h-4/5 bg-amber-600 rounded-lg border-t border-r border-l border-amber-700">
              <div className="w-full h-full flex flex-col justify-evenly">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-full h-0.5 bg-amber-700"></div>
                ))}
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className={cn("rounded-lg bg-amber-500 flex flex-col justify-center items-center", getSize())}>
            <div className="w-4/5 h-4/5 bg-amber-500 rounded-lg">
            </div>
          </div>
        );
      case 5:
        return (
          <div className={cn("rounded-full bg-amber-400 flex flex-col justify-center items-center", getSize())}>
            <div className="w-4/5 h-4/5 flex flex-wrap justify-center content-center gap-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-1/3 h-1/3 rounded-full bg-amber-500"></div>
              ))}
            </div>
          </div>
        );
      case 6:
        return (
          <div className={cn("bg-blue-300 flex flex-col justify-center items-center", getSize())}>
            <div className="w-full h-full flex flex-wrap justify-center content-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-1/3 h-1/4 bg-blue-400 rounded-sm"></div>
              ))}
            </div>
          </div>
        );
      case 7:
        return (
          <div className={cn("bg-blue-200 flex flex-col justify-center items-center", getSize())}>
            <div className="w-full h-full flex flex-col justify-center">
              <div className="w-full h-2/3 flex justify-center items-center">
                <div className="w-3/4 h-0.5 bg-blue-300"></div>
              </div>
            </div>
          </div>
        );
      default:
        return <div className={cn("bg-gray-200 rounded-full", getSize())}></div>;
    }
  };

  return renderIllustration();
};
