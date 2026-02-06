import React from 'react';

interface ProgressBarProps {
  currentStage: number;
  totalStages?: number;
}

export function ProgressBar({ currentStage }: ProgressBarProps) {
  const stages = [
    { number: 1, label: 'Foundation' },
    { number: 2, label: 'Upgrades' },
    { number: 3, label: 'Interior' },
  ];

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        {stages.map((stage, index) => (
          <React.Fragment key={stage.number}>
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300
                  ${currentStage >= stage.number 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                  }`}
              >
                {currentStage > stage.number ? '✓' : stage.number}
              </div>
              <div className={`mt-2 text-sm font-medium ${currentStage >= stage.number ? 'text-primary-600' : 'text-gray-400'}`}>
                {stage.label}
              </div>
            </div>
            {index < stages.length - 1 && (
              <div className="flex-1 h-1 mx-4 relative top-[-20px]">
                <div className="h-full bg-gray-200 rounded">
                  <div
                    className={`h-full rounded transition-all duration-300 ${
                      currentStage > stage.number ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                    style={{ width: currentStage > stage.number ? '100%' : '0%' }}
                  />
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
