const erlangData1h = [
  { time: '14:00', offered: 20, capacity: 60, gos: 0.1 },
  { time: '14:05', offered: 24, capacity: 60, gos: 0.3 },
  { time: '14:10', offered: 28, capacity: 60, gos: 0.4 },
  { time: '14:15', offered: 32, capacity: 60, gos: 0.4 },
  { time: '14:20', offered: 69, capacity: 60, gos: 4.5 },
  { time: '14:25', offered: 70, capacity: 52, gos: 9 },
  { time: '14:30', offered: 70, capacity: 52, gos: 9 },
  { time: '14:35', offered: 68, capacity: 60, gos: 4 },
  { time: '14:40', offered: 65, capacity: 60, gos: 2.5 },
  { time: '14:45', offered: 26, capacity: 60, gos: 0.2 },
  { time: '14:50', offered: 22, capacity: 60, gos: 0.2 },
  { time: '14:55', offered: 18, capacity: 60, gos: 0.2 }
];

const erlangData6h = [
  { time: '12:00', offered: 20, capacity: 60, gos: 0.4 },
  { time: '12:15', offered: 24, capacity: 60, gos: 0.4 },
  { time: '12:30', offered: 28, capacity: 60, gos: 0.3 },
  { time: '12:45', offered: 32, capacity: 60, gos: 0.3 },
  { time: '13:00', offered: 34, capacity: 60, gos: 0.3 },
  { time: '13:15', offered: 35, capacity: 60, gos: 0.3 },
  { time: '13:30', offered: 35, capacity: 60, gos: 0.3 },
  { time: '13:45', offered: 33, capacity: 60, gos: 0.3 },
  { time: '14:00', offered: 30, capacity: 60, gos: 0.4 },
  { time: '14:15', offered: 26, capacity: 60, gos: 0.5 },
  { time: '14:30', offered: 57, capacity: 60, gos: 0.5 },
  { time: '14:45', offered: 53, capacity: 52, gos: 0.5 },
  { time: '15:00', offered: 48, capacity: 52, gos: 0.4 },
  { time: '15:15', offered: 45, capacity: 60, gos: 0.4 },
  { time: '15:30', offered: 42, capacity: 60, gos: 0.2 },
  { time: '15:45', offered: 5, capacity: 60, gos: 0.4 },
  { time: '16:00', offered: 5, capacity: 60, gos: 0.2 },
  { time: '16:15', offered: 6, capacity: 60, gos: 0.4 },
  { time: '16:30', offered: 8, capacity: 60, gos: 0.2 },
  { time: '16:45', offered: 12, capacity: 60, gos: 0.4 },
  { time: '17:00', offered: 16, capacity: 60, gos: 0.4 },
  { time: '17:15', offered: 20, capacity: 60, gos: 0.1 },
  { time: '17:30', offered: 25, capacity: 60, gos: 0.1 },
  { time: '17:45', offered: 29, capacity: 60, gos: 0.3 }
];

const erlangData24h = [
  { time: '00:00', offered: 20, capacity: 60, gos: 0.4 },
  { time: '11:00', offered: 60, capacity: 60, gos: 0.4 },
  { time: '11:30', offered: 64, capacity: 52, gos: 6 },
  { time: '12:00', offered: 67, capacity: 52, gos: 7.5 },
  { time: '12:30', offered: 69, capacity: 60, gos: 4.5 },
  { time: '13:00', offered: 70, capacity: 60, gos: 5 },
  { time: '23:30', offered: 35, capacity: 60, gos: 0.4 }
];

const mwData = [
  { time: '00:00', rsl: -48, throughput: 143 },
  { time: '15:00', rsl: -50, throughput: 141 },
  { time: '16:00', rsl: -48, throughput: 142 },
  { time: '17:00', rsl: -87, throughput: 4 },
  { time: '18:00', rsl: -86, throughput: 1 },
  { time: '19:00', rsl: -86, throughput: 1 },
  { time: '20:00', rsl: -88, throughput: 0 },
  { time: '21:00', rsl: -87, throughput: 1 },
  { time: '22:00', rsl: -47, throughput: 149 },
  { time: '23:00', rsl: -45, throughput: 141 }
];

const signalingData = [
  { time: '16:00', attachReq: 1155, success: 1150 },
  { time: '17:00', attachReq: 1148, success: 1143 },
  { time: '18:00', attachReq: 854, success: 837 },
  { time: '19:00', attachReq: 4694, success: 66 },
  { time: '20:00', attachReq: 4536, success: 86 },
  { time: '21:00', attachReq: 4514, success: 123 },
  { time: '22:00', attachReq: 1097, success: 1088 }
];

const complaintsList = [
  {
    id: 'c-1004',
    userId: 'Batch: 800+ Users',
    issue: 'Emergency Calls Only (No Registration)',
    location: 'Peradeniya University',
    source: 'NOC Alert',
    priority: 'Critical',
    priorityColor: 'bg-red-500',
    badgeColor: 'bg-background text-red-500 border-border/50',
    time: '10 mins ago',
    status: 'Deep AI Analysis Complete'
  },
  {
    id: 'c-1003',
    userId: '+94 77 112 9988',
    issue: 'Extremely Slow 4G Data (High Latency)',
    location: 'Nuwara Eliya Town',
    source: 'Mobile App',
    priority: 'High',
    priorityColor: 'bg-orange-500',
    badgeColor: 'bg-background text-orange-400 border-border/50',
    time: '25 mins ago',
    status: 'AI Analyzed'
  },
  {
    id: 'c-1002',
    userId: 'UID-45920',
    issue: 'Intermittent Call Drops & Slow Data',
    location: 'Kandy City Center',
    source: 'Mobile App',
    priority: 'Critical',
    priorityColor: 'bg-purple-500',
    badgeColor: 'bg-background text-purple-400 border-border/50',
    time: '1 hr ago',
    status: 'Deep AI Analysis Complete'
  },
  {
    id: 'c-1001',
    userId: '+94 77 829 1029',
    issue: 'Total Signal Loss (No Service)',
    location: 'Gampola South',
    source: 'SMS',
    priority: 'High',
    priorityColor: 'bg-red-500',
    badgeColor: 'bg-background text-red-400 border-border/50',
    time: '2 hrs ago',
    status: 'Resolved'
  }
];

const HIDDEN_PROBLEMS = [
  { id: 'h-1001', title: 'Silent RRC Connection Drops', location: 'Nuwara Eliya', timeFrame: 'weekly', detected: '4 days ago', severity: 'High', description: 'AI detected a 14% increase in RRC drop rate during night hours. 0 user complaints received.', category: 'RAN/RF' },
  { id: 'h-1002', title: 'Creeping Intercell Interference', location: 'Colombo Port', timeFrame: 'monthly', detected: '2 weeks ago', severity: 'Critical', description: 'Gradual SINR degradation over 30 days due to unchecked new high-rise reflections.', category: 'Interference' },
  { id: 'h-1003', title: 'Seasonal Fiber Attenuation', location: 'Kandy Hills', timeFrame: 'yearly', detected: 'Last Month', severity: 'Medium', description: 'Pattern recognized: Backhaul microwave fading perfectly correlated with monsoon humidity cycles over 3 years.', category: 'Backhaul' },
  { id: 'h-1004', title: 'Ghost Handover Failures', location: 'Galle Fort', timeFrame: 'weekly', detected: 'Yesterday', severity: 'High', description: 'Automated UE traces show handovers failing and silently retrying 5+ times before success.', category: 'Signaling' },
  { id: 'h-1005', title: 'Dormant Core Bottleneck', location: 'National Data Center', timeFrame: 'monthly', detected: '3 weeks ago', severity: 'Critical', description: 'SGW throughput hitting 99% capacity for micro-bursts of 2 seconds every day at 8:00 PM.', category: 'Core (EPC)' }
];

module.exports = {
  erlangData1h, erlangData6h, erlangData24h,
  mwData, signalingData,
  complaintsList, HIDDEN_PROBLEMS
};
