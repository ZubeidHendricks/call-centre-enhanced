"use client";

import { VoiceProvider } from "@humeai/voice-react";
import Messages from "./Messages";
import Controls from "./Controls";
import StartCall from "./StartCall";
import { ComponentRef, useEffect, useRef, useState } from "react";

export default function Chat() {
  const timeout = useRef<number | null>(null);
  const ref = useRef<ComponentRef<typeof Messages> | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the access token on the client side
  useEffect(() => {
    const fetchToken = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/auth/token');
        
        if (!response.ok) {
          throw new Error('Failed to get access token');
        }
        
        const data = await response.json();
        setAccessToken(data.accessToken);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching token:', err);
        setError('Failed to connect to Hume API. Please check your API credentials.');
        setIsLoading(false);
      }
    };
    
    fetchToken();
  }, []);

  // optional: use configId from environment variable
  const configId = process.env['NEXT_PUBLIC_HUME_CONFIG_ID'];
  
  if (isLoading) {
    return <div className="p-4 text-center">Connecting to Hume API...</div>;
  }
  
  if (error || !accessToken) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">{error || 'Failed to get Hume access token. Please add your API keys to the environment variables.'}</p>
        <p className="mt-2 text-sm">Check your .env file or Vercel environment variables and add:</p>
        <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-left inline-block">
          HUME_API_KEY=your-api-key<br/>
          HUME_SECRET_KEY=your-secret-key
        </pre>
      </div>
    );
  }
  
  return (
    <div
      className={
        "relative grow flex flex-col mx-auto w-full overflow-hidden h-[0px]"
      }
    >
      <VoiceProvider
        auth={{ type: "accessToken", value: accessToken }}
        configId={configId}
        onMessage={() => {
          if (timeout.current) {
            window.clearTimeout(timeout.current);
          }

          timeout.current = window.setTimeout(() => {
            if (ref.current) {
              const scrollHeight = ref.current.scrollHeight;

              ref.current.scrollTo({
                top: scrollHeight,
                behavior: "smooth",
              });
            }
          }, 200);
        }}
      >
        <Messages ref={ref} />
        <Controls />
        <StartCall />
      </VoiceProvider>
    </div>
  );
}