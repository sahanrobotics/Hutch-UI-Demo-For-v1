export const erlangData1h = [
  { time: "14:50", offered: 60, capacity: 60, gos: 5.2 },
  { time: "14:55", offered: 62, capacity: 52, gos: 9.8 },
  { time: "15:00", offered: 65, capacity: 52, gos: 12.5 },
  { time: "15:05", offered: 66, capacity: 52, gos: 13.1 },
  { time: "15:10", offered: 63, capacity: 52, gos: 10.5 },
  { time: "15:15", offered: 60, capacity: 52, gos: 8.2 },
];
export const erlangData6h = [
  { time: "12:00", offered: 35, capacity: 60, gos: 0.1 },
  { time: "13:00", offered: 40, capacity: 60, gos: 0.5 },
  { time: "14:00", offered: 48, capacity: 60, gos: 1.5 },
  { time: "15:00", offered: 65, capacity: 52, gos: 12.5 },
  { time: "16:00", offered: 62, capacity: 52, gos: 9.8 },
  { time: "17:00", offered: 58, capacity: 52, gos: 6.2 },
];
export const erlangData24h = [
  { time: "00:00", offered: 15, capacity: 60, gos: 0.01 },
  { time: "04:00", offered: 10, capacity: 60, gos: 0.0 },
  { time: "08:00", offered: 30, capacity: 60, gos: 0.1 },
  { time: "12:00", offered: 45, capacity: 60, gos: 1.2 },
  { time: "14:00", offered: 50, capacity: 60, gos: 2.0 },
  { time: "15:00", offered: 65, capacity: 52, gos: 12.5 },
  { time: "16:00", offered: 60, capacity: 52, gos: 8.2 },
  { time: "20:00", offered: 40, capacity: 60, gos: 0.5 },
];
export const mwData = [
  { time: "10:00", rsl: -45, throughput: 150 },
  { time: "11:00", rsl: -47, throughput: 145 },
  { time: "12:00", rsl: -55, throughput: 120 },
  { time: "13:00", rsl: -72, throughput: 40 },
  { time: "14:00", rsl: -85, throughput: 2 },
  { time: "15:00", rsl: -88, throughput: 0.5 },
];
export const signalingData = [
  { time: "08:00", attachReq: 1200, success: 1190 },
  { time: "09:00", attachReq: 1500, success: 1485 },
  { time: "10:00", attachReq: 2100, success: 2050 },
  { time: "11:00", attachReq: 4500, success: 120 },
  { time: "12:00", attachReq: 5200, success: 80 },
];

export const complaintsList = [
  {
    id: "c-1004",
    userId: "Batch: 800+ Users",
    issue: "Emergency Calls Only (No Registration)",
    location: "Peradeniya University",
    source: "NOC Alert",
    priority: "Critical",
    priorityColor: "bg-red-500",
    badgeColor: "bg-red-500/20 text-red-500 border-red-500/30",
    time: "10 mins ago",
    status: "Deep AI Analysis Complete"
  },
  {
    id: "c-1003",
    userId: "+94 77 112 9988",
    issue: "Extremely Slow 4G Data (High Latency)",
    location: "Nuwara Eliya Town",
    source: "Mobile App",
    priority: "High",
    priorityColor: "bg-orange-500",
    badgeColor: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    time: "25 mins ago",
    status: "AI Analyzed"
  },
  {
    id: "c-1002",
    userId: "UID-45920",
    issue: "Intermittent Call Drops & Slow Data",
    location: "Kandy City Center",
    source: "Mobile App",
    priority: "Critical",
    priorityColor: "bg-purple-500",
    badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    time: "1 hr ago",
    status: "Deep AI Analysis Complete"
  },
  {
    id: "c-1001",
    userId: "+94 77 829 1029",
    issue: "Total Signal Loss (No Service)",
    location: "Gampola South",
    source: "SMS",
    priority: "High",
    priorityColor: "bg-red-500",
    badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
    time: "2 hrs ago",
    status: "Resolved"
  },
];

export const HIDDEN_PROBLEMS = [
  { id: 'h-1001', title: 'Silent RRC Connection Drops', location: 'Nuwara Eliya', timeFrame: 'weekly', detected: '4 days ago', severity: 'High', description: 'AI detected a 14% increase in RRC drop rate during night hours. 0 user complaints received.', category: 'RAN/RF' },
  { id: 'h-1002', title: 'Creeping Intercell Interference', location: 'Colombo Port', timeFrame: 'monthly', detected: '2 weeks ago', severity: 'Critical', description: 'Gradual SINR degradation over 30 days due to unchecked new high-rise reflections.', category: 'Interference' },
  { id: 'h-1003', title: 'Seasonal Fiber Attenuation', location: 'Kandy Hills', timeFrame: 'yearly', detected: 'Last Month', severity: 'Medium', description: 'Pattern recognized: Backhaul microwave fading perfectly correlated with monsoon humidity cycles over 3 years.', category: 'Backhaul' },
  { id: 'h-1004', title: 'Ghost Handover Failures', location: 'Galle Fort', timeFrame: 'weekly', detected: 'Yesterday', severity: 'High', description: 'Automated UE traces show handovers failing and silently retrying 5+ times before success.', category: 'Signaling' },
  { id: 'h-1005', title: 'Dormant Core Bottleneck', location: 'National Data Center', timeFrame: 'monthly', detected: '3 weeks ago', severity: 'Critical', description: 'SGW throughput hitting 99% capacity for micro-bursts of 2 seconds every day at 8:00 PM.', category: 'Core (EPC)' },
];