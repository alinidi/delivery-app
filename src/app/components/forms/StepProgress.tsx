'use client';

interface StepProgressProps {
    currentStep: number;
    totalSteps: number;
    stepNames: string[];
}

export default function StepProgress({
    currentStep,
    totalSteps,
    stepNames,
}: StepProgressProps) {
    const progress = ((currentStep + 1) / totalSteps) * 100;

    return (
        <div className="mb-8">
            <div className="flex justify-between mb-2">
                {stepNames.map((name, index) => (
                    <div
                        key={index}
                        className={`text-sm font-medium ${
                            index <= currentStep
                                ? 'text-blue-600'
                                : 'text-gray-400'
                        }`}
                    >
                        {name}
                    </div>
                ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-500">
                    Шаг {currentStep + 1} из {totalSteps}
                </span>
            </div>
        </div>
    );
}
