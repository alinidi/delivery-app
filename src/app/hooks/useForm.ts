'use client';

import { useState } from 'react';

export function useMultiStepForm(steps: number) {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    setCurrentStep(i => {
      if (i >= steps - 1) return i;
      return i + 1;
    });
  };

  const prevStep = () => {
    setCurrentStep(i => {
      if (i <= 0) return i;
      return i - 1;
    });
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step < steps) {
      setCurrentStep(step);
    }
  };

  return {
    currentStep,
    nextStep,
    prevStep,
    goToStep,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === steps - 1,
  };
}