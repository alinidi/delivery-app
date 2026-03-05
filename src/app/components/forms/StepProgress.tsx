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
            <div className="sm:hidden">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-blue-600">
                        Шаг {currentStep + 1} из {totalSteps}
                    </span>
                    <span className="text-sm text-gray-500">
                        {stepNames[currentStep]}
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
            <div className="hidden sm:block">
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
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
