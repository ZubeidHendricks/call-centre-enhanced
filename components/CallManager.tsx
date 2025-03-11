import { useState, useEffect } from 'react';
import { useVoice } from "@humeai/voice-react";
import PhoneNumberReader from './PhoneNumberReader';
import { Button } from './ui/button';
import { Phone, Save, FileText, ArrowRight, ArrowLeft } from 'lucide-react';

interface PhoneNumber {
  id: string;
  number: string;
  name?: string;
  notes?: string;
}

interface CallResponse {
  id: string;
  phoneNumber: string;
  timestamp: string;
  transcript: string;
  notes?: string;
}

export default function CallManager() {
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [responses, setResponses] = useState<Record<string, CallResponse>>({});
  const [notes, setNotes] = useState('');
  const [isDialing, setIsDialing] = useState(false);
  
  const { connect, disconnect, status, messages } = useVoice();
  
  // Current phone entry being called
  const currentEntry = currentIndex >= 0 ? phoneNumbers[currentIndex] : null;
  
  // Load saved responses from localStorage on component mount
  useEffect(() => {
    const savedResponses = localStorage.getItem('callResponses');
    if (savedResponses) {
      setResponses(JSON.parse(savedResponses));
    }
  }, []);
  
  // Save responses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('callResponses', JSON.stringify(responses));
  }, [responses]);
  
  // When the call connects or disconnects
  useEffect(() => {
    if (status.value === 'connected') {
      setIsDialing(false);
    }
  }, [status.value]);
  
  // Handle loading numbers from file
  const handleNumbersLoaded = (numbers: PhoneNumber[]) => {
    setPhoneNumbers(numbers);
    // Reset the current index
    setCurrentIndex(-1);
  };
  
  // Start a call to the current number
  const startCall = async () => {
    if (!currentEntry) return;
    
    try {
      setIsDialing(true);
      await connect();
      
      // In a real implementation, you would integrate with a telephony API here
      console.log(`Dialing ${currentEntry.number}...`);
      
      // You could potentially pass context to your EVI here, e.g., through initial message
      // or by configuring the voice interface with the customer info
    } catch (error) {
      console.error('Failed to connect:', error);
      setIsDialing(false);
    }
  };
  
  // End the current call and save response
  const endCall = () => {
    // Save the conversation transcript before disconnecting
    if (currentEntry) {
      const transcript = messages
        .filter(msg => msg.type === 'user_message' || msg.type === 'assistant_message')
        .map(msg => `${msg.message.role}: ${msg.message.content}`)
        .join('\n');
      
      const response: CallResponse = {
        id: currentEntry.id,
        phoneNumber: currentEntry.number,
        timestamp: new Date().toISOString(),
        transcript,
        notes
      };
      
      setResponses(prev => ({
        ...prev,
        [currentEntry.id]: response
      }));
    }
    
    // Disconnect the call
    disconnect();
    setNotes('');
  };
  
  // Navigate to the next number
  const nextNumber = () => {
    if (currentIndex < phoneNumbers.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setNotes('');
    }
  };
  
  // Navigate to the previous number
  const prevNumber = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setNotes('');
    }
  };
  
  // Select a specific number by index
  const selectNumber = (index: number) => {
    if (index >= 0 && index < phoneNumbers.length) {
      setCurrentIndex(index);
      setNotes('');
    }
  };
  
  // Load previous notes for the current number
  useEffect(() => {
    if (currentEntry) {
      const savedResponse = responses[currentEntry.id];
      if (savedResponse?.notes) {
        setNotes(savedResponse.notes);
      } else if (currentEntry.notes) {
        setNotes(currentEntry.notes);
      } else {
        setNotes('');
      }
    }
  }, [currentEntry, responses]);
  
  return (
    <div className="flex flex-col h-full">
      <PhoneNumberReader onNumbersLoaded={handleNumbersLoaded} />
      
      {phoneNumbers.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Phone number list */}
            <div className="border border-border rounded-md p-4 h-60 overflow-y-auto">
              <h3 className="font-medium mb-2">Phone Numbers ({phoneNumbers.length})</h3>
              <ul className="space-y-1">
                {phoneNumbers.map((phone, index) => (
                  <li 
                    key={phone.id}
                    className={`px-2 py-1 rounded cursor-pointer flex items-center ${index === currentIndex ? 'bg-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    onClick={() => selectNumber(index)}
                  >
                    <Phone className="size-3 mr-2 opacity-70" />
                    <span>{phone.number}</span>
                    {phone.name && <span className="ml-2 opacity-70">({phone.name})</span>}
                    {responses[phone.id] && <span className="ml-auto">✓</span>}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Current contact info */}
            <div className="border border-border rounded-md p-4">
              <h3 className="font-medium mb-2">Current Contact</h3>
              {currentEntry ? (
                <div>
                  <p><strong>Number:</strong> {currentEntry.number}</p>
                  {currentEntry.name && <p><strong>Name:</strong> {currentEntry.name}</p>}
                  <div className="mt-4 flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={prevNumber}
                      disabled={currentIndex <= 0 || status.value === 'connected'}
                    >
                      <ArrowLeft className="size-4 mr-1" /> Previous
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={nextNumber}
                      disabled={currentIndex >= phoneNumbers.length - 1 || status.value === 'connected'}
                    >
                      Next <ArrowRight className="size-4 ml-1" />
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Select a phone number to start</p>
              )}
            </div>
            
            {/* Call controls */}
            <div className="border border-border rounded-md p-4">
              <h3 className="font-medium mb-2">Call Controls</h3>
              {currentEntry ? (
                <div className="space-y-3">
                  {status.value !== 'connected' ? (
                    <Button 
                      onClick={startCall} 
                      className="w-full"
                      disabled={isDialing}
                    >
                      <Phone className="size-4 mr-2" />
                      {isDialing ? 'Dialing...' : 'Start Call'}
                    </Button>
                  ) : (
                    <Button 
                      onClick={endCall} 
                      variant="destructive"
                      className="w-full"
                    >
                      <Phone className="size-4 mr-2" />
                      End & Save Call
                    </Button>
                  )}
                  
                  {responses[currentEntry.id] && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        // Show previous transcript
                        alert(`Previous call transcript:\n\n${responses[currentEntry.id].transcript}`);
                      }}
                    >
                      <FileText className="size-4 mr-2" />
                      View Previous Call
                    </Button>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">Select a phone number first</p>
              )}
            </div>
          </div>
          
          {/* Notes section */}
          <div className="border border-border rounded-md p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Notes</h3>
              {currentEntry && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    // Save notes
                    if (currentEntry) {
                      const existingResponse = responses[currentEntry.id];
                      if (existingResponse) {
                        setResponses(prev => ({
                          ...prev,
                          [currentEntry.id]: {
                            ...existingResponse,
                            notes
                          }
                        }));
                      } else {
                        setResponses(prev => ({
                          ...prev,
                          [currentEntry.id]: {
                            id: currentEntry.id,
                            phoneNumber: currentEntry.number,
                            timestamp: new Date().toISOString(),
                            transcript: '',
                            notes
                          }
                        }));
                      }
                    }
                  }}
                >
                  <Save className="size-4 mr-1" /> Save Notes
                </Button>
              )}
            </div>
            <textarea
              className="w-full h-32 p-2 border border-gray-300 dark:border-gray-700 rounded-md"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter notes about this call..."
            />
          </div>
        </div>
      )}
      
      {phoneNumbers.length === 0 && (
        <div className="text-center py-8">
          <p>Upload a CSV file with phone numbers to begin making calls.</p>
          <p className="text-sm opacity-70 mt-2">
            Format: id,number,name,notes (one entry per line)
          </p>
        </div>
      )}
    </div>
  );
}