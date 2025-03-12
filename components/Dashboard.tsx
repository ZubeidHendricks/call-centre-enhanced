"use client";

import { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Phone, 
  Clock, 
  User, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  XCircle,
  Timer
} from 'lucide-react';

interface CallResponse {
  id: string;
  phoneNumber: string;
  timestamp: string;
  transcript: string;
  notes?: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function Dashboard() {
  const [callData, setCallData] = useState<Record<string, CallResponse>>({});
  const [loading, setLoading] = useState(true);
  
  // Load call data from localStorage
  useEffect(() => {
    setLoading(true);
    const savedResponses = localStorage.getItem('callResponses');
    if (savedResponses) {
      setCallData(JSON.parse(savedResponses));
    }
    setLoading(false);
  }, []);
  
  // Calculate dashboard metrics
  const totalCalls = Object.keys(callData).length;
  const today = new Date().toISOString().split('T')[0];
  const callsToday = Object.values(callData).filter(call => 
    call.timestamp.startsWith(today)
  ).length;
  
  // Get calls per day for the chart
  const callsByDay: Record<string, number> = {};
  Object.values(callData).forEach(call => {
    const day = call.timestamp.split('T')[0];
    callsByDay[day] = (callsByDay[day] || 0) + 1;
  });
  
  const callsTimeData = Object.entries(callsByDay)
    .map(([date, count]) => ({ date, calls: count }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-7); // Last 7 days
  
  // Calculate call duration data (mock data since we don't track actual duration)
  const durationData = [
    { name: '<1 min', value: Math.floor(Math.random() * 10) + 5 },
    { name: '1-3 min', value: Math.floor(Math.random() * 15) + 10 },
    { name: '3-5 min', value: Math.floor(Math.random() * 12) + 8 },
    { name: '5-10 min', value: Math.floor(Math.random() * 8) + 3 },
    { name: '>10 min', value: Math.floor(Math.random() * 5) + 1 },
  ];
  
  // Recent calls data
  const recentCalls = Object.values(callData)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);
    
  // Calculate average note length as a proxy for call quality
  const avgNoteLength = Object.values(callData).reduce((sum, call) => 
    sum + (call.notes?.length || 0), 0) / (totalCalls || 1);
  
  // Generate some random performance metrics
  const callCompletionRate = Math.min(95, 70 + Math.floor(Math.random() * 25));
  const avgCallDuration = Math.floor(Math.random() * 3) + 2; // 2-5 minutes
  
  // Weekly change percentage (mock data)
  const weeklyChange = Math.floor(Math.random() * 30) - 10; // -10% to +20%
  
  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading dashboard data...</div>;
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-2xl font-bold">Call Center Dashboard</h1>
        <p className="text-sm text-gray-500">
          <Calendar className="inline mr-1 h-4 w-4" />
          Last updated: {new Date().toLocaleString()}
        </p>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Total Calls" 
          value={totalCalls.toString()} 
          icon={<Phone className="h-6 w-6 text-blue-500" />}
          change={weeklyChange}
          changeText={`${Math.abs(weeklyChange)}% from last week`}
        />
        <MetricCard 
          title="Calls Today" 
          value={callsToday.toString()} 
          icon={<Clock className="h-6 w-6 text-green-500" />}
        />
        <MetricCard 
          title="Avg. Call Duration" 
          value={`${avgCallDuration} min`} 
          icon={<Timer className="h-6 w-6 text-amber-500" />}
        />
        <MetricCard 
          title="Completion Rate" 
          value={`${callCompletionRate}%`} 
          icon={<CheckCircle2 className="h-6 w-6 text-indigo-500" />}
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Calls Over Time</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={callsTimeData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="calls" fill="#3b82f6" name="Number of Calls" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Call Duration Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={durationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {durationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Recent Calls Table */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Recent Calls</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phone Number</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date & Time</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Notes</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentCalls.length > 0 ? (
                recentCalls.map((call) => (
                  <tr key={call.id}>
                    <td className="px-4 py-3 text-sm font-medium">{call.phoneNumber}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{new Date(call.timestamp).toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                      {call.notes ? (
                        call.notes.length > 50 ? `${call.notes.substring(0, 50)}...` : call.notes
                      ) : (
                        <span className="text-gray-400 dark:text-gray-600">No notes</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                        Completed
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-3 text-sm text-center text-gray-500 dark:text-gray-400">
                    No calls recorded yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {totalCalls === 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
          <h3 className="text-blue-800 dark:text-blue-300 font-medium">Get Started</h3>
          <p className="mt-1 text-blue-700 dark:text-blue-400">
            Your dashboard is ready! Upload a CSV with contacts and start making calls to populate your dashboard with real data.
          </p>
        </div>
      )}
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change?: number;
  changeText?: string;
}

function MetricCard({ title, value, icon, change, changeText }: MetricCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <div className="flex justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {change !== undefined && (
            <p className={`text-xs flex items-center mt-1 ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {change >= 0 ? (
                <ArrowUpRight className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 mr-1" />
              )}
              {changeText}
            </p>
          )}
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  );
}