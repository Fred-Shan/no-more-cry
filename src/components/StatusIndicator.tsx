'use client';

import { useAppStore } from '@/store/appStore';
import { Activity, Mic, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

export const StatusIndicator = () => {
  const { isMonitoring, isCrying, currentVolume, cryStartTime } = useAppStore();
  const [cryDuration, setCryDuration] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isCrying && cryStartTime) {
      interval = setInterval(() => {
        setCryDuration(Math.floor((Date.now() - cryStartTime) / 1000));
      }, 1000);
    } else {
      setCryDuration(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCrying, cryStartTime]);

  return (
    <div className="flex items-center gap-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      {/* Monitoring Status */}
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${isMonitoring ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-700'}`}>
          <Mic className={`w-5 h-5 ${isMonitoring ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`} />
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Monitoring</p>
          <p className={`text-sm font-medium ${isMonitoring ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
            {isMonitoring ? 'Active' : 'Inactive'}
          </p>
        </div>
      </div>

      {/* Volume Level */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
          <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Volume Level</p>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {currentVolume} / 100
          </p>
        </div>
      </div>

      {/* Cry Status */}
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${isCrying ? 'bg-red-100 dark:bg-red-900' : 'bg-gray-100 dark:bg-gray-700'}`}>
          <div className={`w-5 h-5 rounded-full ${isCrying ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`} />
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Cry Detection</p>
          {isCrying ? (
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-red-600 dark:text-red-400">Detected</p>
              {cryDuration > 0 && (
                <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="w-3 h-3" />
                  {Math.floor(cryDuration / 60)}:{(cryDuration % 60).toString().padStart(2, '0')}
                </span>
              )}
            </div>
          ) : (
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Not Detected</p>
          )}
        </div>
      </div>

      {/* Volume Bar */}
      <div className="flex-1 max-w-xs ml-auto">
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              currentVolume > 70
                ? 'bg-red-500'
                : currentVolume > 40
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(currentVolume, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
