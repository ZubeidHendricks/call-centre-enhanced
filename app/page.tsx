import { lazy } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import components with client-side rendering only
import dynamic from 'next/dynamic';
const Chat = dynamic(() => import("@/components/Chat"), {
  ssr: false,
});

const CallManager = dynamic(() => import("@/components/CallManager"), {
  ssr: false,
});

const Dashboard = dynamic(() => import("@/components/Dashboard"), {
  ssr: false,
});

// Force dynamic rendering instead of static generation
export const dynamicParams = true;
export const fetchCache = 'force-no-store';

export default function Page() {
  return (
    <div className="grow flex flex-col max-w-7xl mx-auto w-full p-4">
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="call-manager">Call Manager</TabsTrigger>
          <TabsTrigger value="simple-chat">Simple Chat</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="flex-grow">
          <div className="border border-border rounded-lg p-6 h-full">
            <Dashboard />
          </div>
        </TabsContent>
        
        <TabsContent value="call-manager" className="flex-grow">
          <div className="border border-border rounded-lg p-6 h-full">
            <h1 className="text-2xl font-semibold mb-6">Call Centre Management</h1>
            <CallManager />
          </div>
        </TabsContent>
        
        <TabsContent value="simple-chat" className="h-full">
          <Chat />
        </TabsContent>
      </Tabs>
    </div>
  );
}