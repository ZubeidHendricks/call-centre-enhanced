"use client";

import { useState, useRef } from 'react';

interface PhoneNumber {
  id: string;
  number: string;
  name?: string;
  notes?: string;
}

interface PhoneNumberReaderProps {
  onNumbersLoaded: (numbers: PhoneNumber[]) => void;
}

export default function PhoneNumberReader({ onNumbersLoaded }: PhoneNumberReaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target?.result as string;
      
      // Assuming CSV format: id,number,name,notes
      const lines = content.split('\n');
      const phoneNumbers: PhoneNumber[] = [];
      
      // Skip header row if present
      const startIndex = lines[0].includes('id') ? 1 : 0;
      
      for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const [id, number, name, notes] = line.split(',');
        
        if (number) {
          phoneNumbers.push({
            id: id || `id-${i}`,
            number: number.trim(),
            name: name?.trim(),
            notes: notes?.trim()
          });
        }
      }
      
      onNumbersLoaded(phoneNumbers);
      setIsLoading(false);
    };
    
    reader.onerror = () => {
      console.error('Error reading file');
      setIsLoading(false);
    };
    
    reader.readAsText(file);
  };

  return (
    <div className="mb-6 p-4 border border-border rounded-md">
      <h2 className="text-lg font-medium mb-2">Upload Phone Numbers</h2>
      <p className="text-sm opacity-70 mb-3">
        Upload a CSV file with phone numbers (format: id,number,name,notes)
      </p>
      
      <input
        type="file"
        accept=".csv,.txt"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="block w-full text-sm text-slate-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-medium
          file:bg-primary file:text-white
          hover:file:bg-primary/90"
      />
      
      {isLoading && <p className="mt-2">Loading numbers...</p>}
    </div>
  );
}