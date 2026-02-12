import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';

interface ProgressBarProps {
  currentStage: number;
  totalStages?: number;
}

export function ProgressBar({ currentStage }: ProgressBarProps) {
  const navigate = useNavigate();
  const { state, setStage } = useAppContext();
  
  const stages = [
    { number: 1, label: 'Foundation', path: '/stage1' },
    { number: 2, label: 'Upgrades', path: '/stage2' },
    { number: 3, label: 'Interior', path: '/stage3/packages' },
  ];

  const canNavigateToStage = (stageNumber: number) => {
    // Users can navigate to current stage or any previously completed stage
    // They cannot skip ahead to future stages
    return stageNumber <= state.currentStage;
  };

  const handleStageClick = (stage: typeof stages[0]) => {
    if (canNavigateToStage(stage.number)) {
      setStage(stage.number);
      navigate(stage.path);
    }
  };

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        {stages.map((stage, index) => (
          <React.Fragment key={stage.number}>
            <div className="flex flex-col items-center">
              <div
                onClick={() => handleStageClick(stage)}
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300
                  ${currentStage >= stage.number 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                  }
                  ${canNavigateToStage(stage.number) ? 'cursor-pointer hover:scale-110 hover:shadow-lg' : 'cursor-not-allowed opacity-50'}
                `}
                title={canNavigateToStage(stage.number) ? `Go to ${stage.label}` : `Complete previous stages first`}
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
