'use client';

import { useEffect, useState } from 'react';
import { STORAGE_KEYS } from '../constants';
import { OrderFormData } from '../types';

const initialFormData: OrderFormData = {
  sender: {
    name: '',
    phone: '',
    city: '',
  },
  recipient: {
    name: '',
    city: '',
  },
  cargo: {
    type: 'regular',
    weight: 1,
  },
  agreedToTerms: false,
};

export function useFormStorage() {
  const [formData, setFormData] = useState<OrderFormData>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEYS.FORM_DATA);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error('Failed to parse stored form data', e);
        }
      }
    }
    return initialFormData;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.FORM_DATA, JSON.stringify(formData));
    }
  }, [formData]);

  const updateFormData = (data: Partial<OrderFormData>) => {
    setFormData(prev => {
      const newData = { ...prev };
      
      if (data.sender) {
        newData.sender = { ...prev.sender, ...data.sender };
      }
      if (data.recipient) {
        newData.recipient = { ...prev.recipient, ...data.recipient };
      }
      if (data.cargo) {
        newData.cargo = { ...prev.cargo, ...data.cargo };
      }
      if (data.agreedToTerms !== undefined) {
        newData.agreedToTerms = data.agreedToTerms;
      }
      
      return newData;
    });
  };

  const resetForm = () => {
    setFormData(initialFormData);
    localStorage.removeItem(STORAGE_KEYS.FORM_DATA);
  };

  return {
    formData,
    updateFormData,
    resetForm,
  };
}