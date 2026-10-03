import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams, useLocation } from "react-router-dom";
import {
  LineChart, Line, BarChart, Bar, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceArea, ReferenceLine, Legend, AreaChart, Area, Brush
} from "recharts";
import {
  AlertCircle, AlertTriangle, CheckCircle2, LayoutDashboard, MapPin, Search, Send,
  Clock, Smartphone, MessageSquare, Globe, ChevronRight, User, Activity, Map as MapIcon, Cpu, Zap, Reply, Lightbulb, Database, Maximize2, ClipboardList, CheckSquare, X, CloudRain, ServerCrash, PlusCircle, Image as ImageIcon, Ghost, Settings
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';

// --- Custom Leaflet Icons ---

const getTowerIcon = (id: string, color = "#3b82f6") => L.divIcon({
  html: `<div style="display: flex; flex-direction: column; align-items: center; position: absolute; transform: translate(-50%, -100%); width: 120px;">
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 10px ${color}); background: rgba(0,0,0,0.4); border-radius: 50%; padding: 4px;">
      <path d="M4.5 10.5 8 6l3.5 4.5"/><path d="m11.5 10.5 4-4.5 4.5 4.5"/><path d="M12 22V6"/><path d="M7 22v-6"/><path d="M17 22v-6"/>
    </svg>
    <div style="background: rgba(0,0,0,0.85); border: 1px solid ${color}; color: white; font-size: 11px; font-weight: bold; padding: 2px 6px; border-radius: 4px; margin-top: 4px; white-space: nowrap; box-shadow: 0 4px 6px rgba(0,0,0,0.5);">${id}</div>
  </div>`,
  className: 'custom-leaflet-icon',
  iconSize: [0, 0],
  iconAnchor: [0, 0]
});

const userIconHtml = `<div style="background: rgba(239,68,68,0.15); border: 2px solid #ef4444; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 15px rgba(239,68,68,0.8); backdrop-filter: blur(2px); animation: pulse 2s infinite;"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`;
const userIcon = L.divIcon({
  html: userIconHtml,
  className: 'custom-leaflet-icon',
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

// --- Mock Data ---

const erlangData1h = [
  { time: "14:00", offered: 20, capacity: 60, gos: 0.1 },
  { time: "14:05", offered: 24, capacity: 60, gos: 0.3 },
  { time: "14:10", offered: 28, capacity: 60, gos: 0.4 },
  { time: "14:15", offered: 32, capacity: 60, gos: 0.4 },
  { time: "14:20", offered: 69, capacity: 60, gos: 4.5 },
  { time: "14:25", offered: 70, capacity: 52, gos: 9 },
  { time: "14:30", offered: 70, capacity: 52, gos: 9 },
  { time: "14:35", offered: 68, capacity: 60, gos: 4 },
  { time: "14:40", offered: 65, capacity: 60, gos: 2.5 },
  { time: "14:45", offered: 26, capacity: 60, gos: 0.2 },
  { time: "14:50", offered: 22, capacity: 60, gos: 0.2 },
  { time: "14:55", offered: 18, capacity: 60, gos: 0.2 }
];
  const erlangData6h = [
  { time: "12:00", offered: 20, capacity: 60, gos: 0.4 },
  { time: "12:15", offered: 24, capacity: 60, gos: 0.4 },
  { time: "12:30", offered: 28, capacity: 60, gos: 0.3 },
  { time: "12:45", offered: 32, capacity: 60, gos: 0.3 },
  { time: "13:00", offered: 34, capacity: 60, gos: 0.3 },
  { time: "13:15", offered: 35, capacity: 60, gos: 0.3 },
  { time: "13:30", offered: 35, capacity: 60, gos: 0.3 },
  { time: "13:45", offered: 33, capacity: 60, gos: 0.3 },
  { time: "14:00", offered: 30, capacity: 60, gos: 0.4 },
  { time: "14:15", offered: 26, capacity: 60, gos: 0.5 },
  { time: "14:30", offered: 57, capacity: 60, gos: 0.5 },
  { time: "14:45", offered: 53, capacity: 52, gos: 0.5 },
  { time: "15:00", offered: 48, capacity: 52, gos: 0.4 },
  { time: "15:15", offered: 45, capacity: 60, gos: 0.4 },
  { time: "15:30", offered: 42, capacity: 60, gos: 0.2 },
  { time: "15:45", offered: 5, capacity: 60, gos: 0.4 },
  { time: "16:00", offered: 5, capacity: 60, gos: 0.2 },
  { time: "16:15", offered: 6, capacity: 60, gos: 0.4 },
  { time: "16:30", offered: 8, capacity: 60, gos: 0.2 },
  { time: "16:45", offered: 12, capacity: 60, gos: 0.4 },
  { time: "17:00", offered: 16, capacity: 60, gos: 0.4 },
  { time: "17:15", offered: 20, capacity: 60, gos: 0.1 },
  { time: "17:30", offered: 25, capacity: 60, gos: 0.1 },
  { time: "17:45", offered: 29, capacity: 60, gos: 0.3 }
];
  const erlangData24h = [
  { time: "00:00", offered: 20, capacity: 60, gos: 0.4 },
  { time: "00:30", offered: 24, capacity: 60, gos: 0 },
  { time: "01:00", offered: 28, capacity: 60, gos: 0.3 },
  { time: "01:30", offered: 32, capacity: 60, gos: 0 },
  { time: "02:00", offered: 34, capacity: 60, gos: 0.2 },
  { time: "02:30", offered: 35, capacity: 60, gos: 0 },
  { time: "03:00", offered: 35, capacity: 60, gos: 0.3 },
  { time: "03:30", offered: 33, capacity: 60, gos: 0.4 },
  { time: "04:00", offered: 30, capacity: 60, gos: 0.4 },
  { time: "04:30", offered: 26, capacity: 60, gos: 0.2 },
  { time: "05:00", offered: 22, capacity: 60, gos: 0.5 },
  { time: "05:30", offered: 18, capacity: 60, gos: 0.1 },
  { time: "06:00", offered: 13, capacity: 60, gos: 0.1 },
  { time: "06:30", offered: 10, capacity: 60, gos: 0.3 },
  { time: "07:00", offered: 7, capacity: 60, gos: 0.3 },
  { time: "07:30", offered: 5, capacity: 60, gos: 0.4 },
  { time: "08:00", offered: 5, capacity: 60, gos: 0 },
  { time: "08:30", offered: 6, capacity: 60, gos: 0.1 },
  { time: "09:00", offered: 8, capacity: 60, gos: 0.4 },
  { time: "09:30", offered: 12, capacity: 60, gos: 0.3 },
  { time: "10:00", offered: 16, capacity: 60, gos: 0.3 },
  { time: "10:30", offered: 20, capacity: 60, gos: 0.2 },
  { time: "11:00", offered: 60, capacity: 60, gos: 0.4 },
  { time: "11:30", offered: 64, capacity: 52, gos: 6 },
  { time: "12:00", offered: 67, capacity: 52, gos: 7.5 },
  { time: "12:30", offered: 69, capacity: 60, gos: 4.5 },
  { time: "13:00", offered: 70, capacity: 60, gos: 5 },
  { time: "13:30", offered: 35, capacity: 60, gos: 0.4 },
  { time: "14:00", offered: 33, capacity: 60, gos: 0.2 },
  { time: "14:30", offered: 30, capacity: 60, gos: 0.4 },
  { time: "15:00", offered: 26, capacity: 60, gos: 0.2 },
  { time: "15:30", offered: 22, capacity: 60, gos: 0.5 },
  { time: "16:00", offered: 17, capacity: 60, gos: 0 },
  { time: "16:30", offered: 13, capacity: 60, gos: 0.1 },
  { time: "17:00", offered: 10, capacity: 60, gos: 0.4 },
  { time: "17:30", offered: 7, capacity: 60, gos: 0.1 },
  { time: "18:00", offered: 5, capacity: 60, gos: 0.5 },
  { time: "18:30", offered: 5, capacity: 60, gos: 0.5 },
  { time: "19:00", offered: 6, capacity: 60, gos: 0.4 },
  { time: "19:30", offered: 9, capacity: 60, gos: 0.1 },
  { time: "20:00", offered: 12, capacity: 60, gos: 0.2 },
  { time: "20:30", offered: 16, capacity: 60, gos: 0.1 },
  { time: "21:00", offered: 21, capacity: 60, gos: 0.3 },
  { time: "21:30", offered: 25, capacity: 60, gos: 0.2 },
  { time: "22:00", offered: 29, capacity: 60, gos: 0.1 },
  { time: "22:30", offered: 32, capacity: 60, gos: 0.2 },
  { time: "23:00", offered: 34, capacity: 60, gos: 0.3 },
  { time: "23:30", offered: 35, capacity: 60, gos: 0.4 }
];
  const mwData = [
  { time: "00:00", rsl: -48, throughput: 143 },
  { time: "01:00", rsl: -46, throughput: 145 },
  { time: "02:00", rsl: -47, throughput: 145 },
  { time: "03:00", rsl: -46, throughput: 141 },
  { time: "04:00", rsl: -46, throughput: 148 },
  { time: "05:00", rsl: -49, throughput: 144 },
  { time: "06:00", rsl: -47, throughput: 147 },
  { time: "07:00", rsl: -49, throughput: 141 },
  { time: "08:00", rsl: -45, throughput: 143 },
  { time: "09:00", rsl: -46, throughput: 150 },
  { time: "10:00", rsl: -49, throughput: 149 },
  { time: "11:00", rsl: -50, throughput: 147 },
  { time: "12:00", rsl: -47, throughput: 148 },
  { time: "13:00", rsl: -47, throughput: 147 },
  { time: "14:00", rsl: -48, throughput: 142 },
  { time: "15:00", rsl: -50, throughput: 141 },
  { time: "16:00", rsl: -48, throughput: 142 },
  { time: "17:00", rsl: -87, throughput: 4 },
  { time: "18:00", rsl: -86, throughput: 1 },
  { time: "19:00", rsl: -86, throughput: 1 },
  { time: "20:00", rsl: -88, throughput: 0 },
  { time: "21:00", rsl: -87, throughput: 1 },
  { time: "22:00", rsl: -47, throughput: 149 },
  { time: "23:00", rsl: -45, throughput: 141 }
];
  const signalingData = [
  { time: "00:00", attachReq: 1003, success: 1002 },
  { time: "01:00", attachReq: 805, success: 788 },
  { time: "02:00", attachReq: 1057, success: 1043 },
  { time: "03:00", attachReq: 1071, success: 1060 },
  { time: "04:00", attachReq: 1013, success: 1000 },
  { time: "05:00", attachReq: 957, success: 952 },
  { time: "06:00", attachReq: 1184, success: 1174 },
  { time: "07:00", attachReq: 1014, success: 1006 },
  { time: "08:00", attachReq: 1098, success: 1085 },
  { time: "09:00", attachReq: 939, success: 929 },
  { time: "10:00", attachReq: 994, success: 991 },
  { time: "11:00", attachReq: 1159, success: 1141 },
  { time: "12:00", attachReq: 958, success: 949 },
  { time: "13:00", attachReq: 836, success: 822 },
  { time: "14:00", attachReq: 809, success: 807 },
  { time: "15:00", attachReq: 889, success: 870 },
  { time: "16:00", attachReq: 1155, success: 1150 },
  { time: "17:00", attachReq: 1148, success: 1143 },
  { time: "18:00", attachReq: 854, success: 837 },
  { time: "19:00", attachReq: 4694, success: 66 },
  { time: "20:00", attachReq: 4536, success: 86 },
  { time: "21:00", attachReq: 4514, success: 123 },
  { time: "22:00", attachReq: 1097, success: 1088 },
  { time: "23:00", attachReq: 987, success: 984 }
];

const complaintsList = [
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

const HIDDEN_PROBLEMS = [
  { id: 'h-1001', title: 'Silent RRC Connection Drops', location: 'Nuwara Eliya', timeFrame: 'weekly', detected: '4 days ago', severity: 'High', description: 'AI detected a 14% increase in RRC drop rate during night hours. 0 user complaints received.', category: 'RAN/RF' },
  { id: 'h-1002', title: 'Creeping Intercell Interference', location: 'Colombo Port', timeFrame: 'monthly', detected: '2 weeks ago', severity: 'Critical', description: 'Gradual SINR degradation over 30 days due to unchecked new high-rise reflections.', category: 'Interference' },
  { id: 'h-1003', title: 'Seasonal Fiber Attenuation', location: 'Kandy Hills', timeFrame: 'yearly', detected: 'Last Month', severity: 'Medium', description: 'Pattern recognized: Backhaul microwave fading perfectly correlated with monsoon humidity cycles over 3 years.', category: 'Backhaul' },
  { id: 'h-1004', title: 'Ghost Handover Failures', location: 'Galle Fort', timeFrame: 'weekly', detected: 'Yesterday', severity: 'High', description: 'Automated UE traces show handovers failing and silently retrying 5+ times before success.', category: 'Signaling' },
  { id: 'h-1005', title: 'Dormant Core Bottleneck', location: 'National Data Center', timeFrame: 'monthly', detected: '3 weeks ago', severity: 'Critical', description: 'SGW throughput hitting 99% capacity for micro-bursts of 2 seconds every day at 8:00 PM.', category: 'Core (EPC)' },
];

function Layout({ children, checklists, setChecklists }: { children: React.ReactNode, checklists: string[], setChecklists: any }) {
  const location = useLocation();

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden font-sans text-foreground">
      <aside className="w-[260px] border-r border-border/10 bg-[#0A0A0A] hidden md:flex flex-col shrink-0 z-50">
        
        <div className="h-16 flex items-center justify-between px-4 mt-2">
          <img src="/Logo.png" alt="Logo" className="h-7 object-contain" />
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-white"><Search className="size-4" /></Button>
            <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-white"><LayoutDashboard className="size-4" /></Button>
          </div>
        </div>

        <ScrollArea className="flex-1 px-3 py-2">
          <nav className="space-y-1 mb-8">
            <Link to="/">
              <Button variant="ghost" className="w-full justify-start h-10 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-white font-medium text-[14px]">
                <MessageSquare className="mr-3 size-4" /> Chat
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="ghost" className="w-full justify-start h-10 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-white font-medium text-[14px] flex justify-between">
                <div className="flex items-center"><Activity className="mr-3 size-4" /> Dashboard</div>
                <div className="size-1.5 bg-blue-500 rounded-full" />
              </Button>
            </Link>
            <Link to="/hidden">
              <Button variant="ghost" className="w-full justify-start h-10 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-white font-medium text-[14px]">
                <Ghost className="mr-3 size-4" /> Hidden Anomalies
              </Button>
            </Link>
            <Link to="/settings">
              <Button variant="ghost" className="w-full justify-start h-10 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-white font-medium text-[14px]">
                <Settings className="mr-3 size-4" /> Settings
              </Button>
            </Link>
          </nav>

          <div className="mb-2 px-3 flex justify-between items-center text-[11px] font-bold text-muted-foreground/50">
            <span>Projects</span>
            <Database className="size-3 cursor-pointer" />
          </div>
          <Button variant="ghost" className="w-full justify-start h-9 rounded-lg text-muted-foreground/80 hover:bg-white/5 hover:text-white text-[13px] mb-6">
            <PlusCircle className="mr-3 size-3.5" /> Add project
          </Button>

          <div className="mb-2 px-3 text-[11px] font-bold text-muted-foreground/50">Chats</div>
          <nav className="space-y-0.5">
            {complaintsList.map(c => (
              <Link to={`/chat/${c.id}`} key={c.id}>
                 <Button variant={location.pathname === `/chat/${c.id}` ? "secondary" : "ghost"} className={`w-full justify-start h-9 rounded-lg ${location.pathname === `/chat/${c.id}` ? 'bg-white/10 text-white' : 'text-muted-foreground hover:bg-white/5 hover:text-white'} text-[13px] font-normal truncate`}>
                   {c.issue.length > 25 ? c.issue.substring(0, 25) + '...' : c.issue}
                 </Button>
              </Link>
            ))}
            <Link to={`/chat/h-1001`}>
              <Button variant={location.pathname === `/chat/h-1001` ? "secondary" : "ghost"} className={`w-full justify-start h-9 rounded-lg ${location.pathname === `/chat/h-1001` ? 'bg-white/10 text-white' : 'text-muted-foreground hover:bg-white/5 hover:text-white'} text-[13px] font-normal truncate`}>
                Silent RRC Connection Drops...
              </Button>
            </Link>
            <Link to={`/chat/c-1005`}>
              <Button variant="ghost" className="w-full justify-start h-9 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-white text-[13px] font-normal mt-2">
                See all
              </Button>
            </Link>
          </nav>
        </ScrollArea>

        <div className="mt-auto p-4 flex flex-col gap-2">
          <Button variant="ghost" className="w-full justify-start h-10 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-white text-[14px]">
            <Cpu className="mr-3 size-4" /> Plugins
          </Button>
          <div className="flex items-center gap-3 px-2 py-2 cursor-pointer hover:bg-white/5 rounded-lg transition-colors">
            <Avatar className="size-7">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>SS</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-foreground">Sahan Sadeepa</span>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen min-w-0 bg-background relative">
        <div className="absolute top-4 right-6 flex items-center gap-4 z-50">
           <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white rounded-full h-8 px-3 text-xs bg-[#1A1A1A] border border-border/40">
             <div className="size-4 mr-1.5 rounded-full overflow-hidden bg-white/10 p-0.5 flex items-center justify-center"><img src="/Bot.png" className="size-full object-contain"/></div>
             TeleQ Bot
           </Button>
           <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white rounded-full h-8 px-3 text-xs bg-transparent border border-border/20">
             <User className="size-3 mr-1.5" /> Private
           </Button>
        </div>
        
        {children}
      </main>
    </div>
  );
}

function RecentProblemsList() {
  const [chatInput, setChatInput] = useState("");
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 w-full max-w-3xl mx-auto relative mt-16">
      <h1 className="text-3xl font-bold mb-10 text-white">What should we explore?</h1>
      
      <div className="w-full bg-[#161616] border border-border/30 rounded-[28px] p-2 flex flex-col focus-within:ring-1 focus-within:ring-border/50 shadow-2xl">
          <div className="flex flex-col mb-0.5 pl-3 pt-2">
            <div className="bg-[#2A2A2A] border border-border/10 rounded-full py-1.5 px-3.5 flex items-center w-fit shadow-sm">
               <ImageIcon className="size-3 mr-2 text-muted-foreground" />
               <span className="text-[12px] font-medium text-foreground">image.png</span>
               <X className="size-3 ml-2 text-muted-foreground cursor-pointer hover:text-white" />
            </div>
          </div>
          <div className="flex items-center">
          <div className="text-muted-foreground pl-3"><PlusCircle className="size-5" /></div>
          <Input 
            placeholder="Type @ to search your apps" 
            className="border-none bg-transparent shadow-none focus-visible:ring-0 text-lg px-4 flex-1 h-12"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
          />
          <div className="bg-white p-1 rounded-full flex shrink-0 items-center justify-center size-8 mr-2 shadow-[0_0_10px_rgba(255,255,255,0.2)]">
            <img src="/Bot.png" className="size-full object-contain" />
          </div>
        </div>
        
        <div className="flex items-center justify-end mt-2 px-2">
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-muted-foreground text-xs rounded-full h-8 hover:bg-white/10 px-3">
              Fast <ChevronRight className="size-3 ml-1 rotate-90" />
            </Button>
            <Button variant="ghost" size="icon" className="size-8 rounded-full text-muted-foreground hover:text-white hover:bg-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
            </Button>
            <Button size="icon" className="size-8 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground ml-1 shadow-md" onClick={() => navigate('/chat/c-1005')}>
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Button>
          </div>
        </div>
      </div>

      <div className="w-full mt-6 bg-[#161616]/50 border border-border/30 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
           <div className="size-10 bg-white rounded-full flex items-center justify-center p-2 shadow-sm">
             <img src="/Bot.png" className="size-full object-contain" />
           </div>
           <div>
             <h4 className="font-bold text-[15px] text-white">Meet TeleQ Bot</h4>
             <p className="text-muted-foreground text-[13px]">AI teammates you can give real work to. They use your tools just like you do.</p>
           </div>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white">Dismiss</Button>
           <Button size="sm" className="bg-white text-black hover:bg-white/90 rounded-full font-bold px-4">Upgrade</Button>
        </div>
      </div>
    </div>
  );
}

// --- Universal Map Component ---
interface TowerData {
  id: string;
  pos: [number, number];
  status: string;
  reason: string;
  color: string;
}

function DynamicInteractiveMap({
  center, towers, userPos, userLabel, onAnalyzeArea
}: {
  center: [number, number], towers: TowerData[], userPos: [number, number], userLabel: string, onAnalyzeArea: (radius: number) => void
}) {
  const [radiusKm, setRadiusKm] = useState(1.5);

  return (
    <div className="w-full relative h-[450px] rounded-xl overflow-hidden border border-border/80 shadow-inner group">
      <div className="absolute top-4 right-4 z-[400] bg-background/95 p-4 rounded-xl border border-border shadow-2xl backdrop-blur-md min-w-[220px]">
        <div className="text-sm font-bold text-foreground mb-3 flex items-center"><Maximize2 className="size-4 mr-2 text-primary" /> Analysis Radius</div>
        <div className="flex items-center justify-between text-xs text-muted-foreground font-mono mb-2">
          <span>0.5km</span>
          <span className="font-bold text-primary">{radiusKm.toFixed(1)} km</span>
          <span>5.0km</span>
        </div>
        <input
          type="range"
          min="0.5" max="5" step="0.1"
          value={radiusKm}
          onChange={e => setRadiusKm(parseFloat(e.target.value))}
          className="w-full mb-4 cursor-pointer accent-primary h-1.5 bg-muted rounded-full appearance-none"
        />
        <Button size="sm" className="w-full h-8 text-xs font-semibold shadow-md" onClick={() => onAnalyzeArea(radiusKm)}>
          <Search className="size-3.5 mr-1.5" /> Analyze Behavior Inside Circle
        </Button>
      </div>

      <div className="h-full w-full">
        <MapContainer center={center} zoom={14} style={{ height: '100%', width: '100%' }} zoomControl={false}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png?key=cb1_420a_1_1e09ee8bb5664db11bbad781"
            attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          {towers.map(t => (
            <Marker key={t.id} position={t.pos} icon={getTowerIcon(t.id, t.color)}>
              <Popup>
                <div className="text-xs">
                  <strong className="text-sm block mb-1" style={{ color: t.color }}>{t.id}</strong>
                  Status: <span className="font-bold" style={{ color: t.color }}>{t.status}</span><br />
                  {t.reason}
                </div>
              </Popup>
            </Marker>
          ))}
          <Marker position={userPos} icon={userIcon}>
            <Popup>
              <div className="text-xs">
                <strong className="text-sm text-red-600 block mb-1">Problem Area/User</strong>
                {userLabel}
              </div>
            </Popup>
          </Marker>
          <Circle
            center={userPos}
            pathOptions={{ fillColor: '#3b82f6', fillOpacity: 0.15, color: '#3b82f6', weight: 2, dashArray: '4' }}
            radius={radiusKm * 1000}
          />
        </MapContainer>
      </div>
    </div>
  );
}

function ErlangInteractiveChart({ onAnalyzeTime }: { onAnalyzeTime: (range: string) => void }) {
  const [range, setRange] = useState('6h');
  const [startTime, setStartTime] = useState("14:00");
  const [endTime, setEndTime] = useState("15:30");
  const data = range === '1h' ? erlangData1h : range === '6h' ? erlangData6h : erlangData24h;

  return (
    <div className="w-full relative h-[400px] rounded-xl overflow-hidden border border-border/80 shadow-inner flex flex-col bg-background">
      <div className="flex flex-wrap gap-3 items-center justify-between p-3 border-b border-border/50 bg-muted/20 shrink-0">
        <div className="flex gap-1 bg-muted p-1 rounded-lg border border-border/50 shadow-sm">
          <Button variant={range === '1h' ? 'default' : 'ghost'} size="sm" className="h-7 text-xs px-3 shadow-none" onClick={() => setRange('1h')}>1h View</Button>
          <Button variant={range === '6h' ? 'default' : 'ghost'} size="sm" className="h-7 text-xs px-3 shadow-none" onClick={() => setRange('6h')}>6h View</Button>
          <Button variant={range === '24h' ? 'default' : 'ghost'} size="sm" className="h-7 text-xs px-3 shadow-none" onClick={() => setRange('24h')}>24h View</Button>
        </div>

        <div className="flex items-center gap-2 bg-background p-1.5 rounded-lg border border-border shadow-sm">
          <Clock className="size-4 text-muted-foreground ml-2" />
          <span className="text-xs font-semibold text-muted-foreground mr-1 hidden sm:inline">Select Range:</span>
          <div className="flex items-center gap-1">
            <input
              type="time"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              className="bg-muted text-xs p-1 rounded outline-none text-foreground border border-border/50 focus:border-primary sm:w-[90px]"
            />
            <span className="text-muted-foreground text-xs font-bold">-</span>
            <input
              type="time"
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
              className="bg-muted text-xs p-1 rounded outline-none text-foreground border border-border/50 focus:border-primary sm:w-[90px]"
            />
          </div>
          <Button size="sm" className="h-7 text-xs font-semibold shadow-sm ml-2 bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => onAnalyzeTime(`Analyze the specific Erlang congestion between ${startTime} - ${endTime} on the ${range} trend.`)}>
            <Search className="size-3.5 mr-1.5" /> Deep Scan
          </Button>
        </div>
      </div>
      <div className="flex-1 p-5 pb-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10 }}>
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.15)" />
            <XAxis dataKey="time" axisLine={{ stroke: '#ffffff', strokeWidth: 1, opacity: 0.7 }} tickLine={{ stroke: '#ffffff', strokeWidth: 1, opacity: 0.7 }} tick={{ fill: '#e5e7eb', fontSize: 12, fontWeight: 500 }} dy={10} angle={0} textAnchor="middle" height={40} />
            <YAxis yAxisId="left" domain={[0, 80]} axisLine={{ stroke: '#ffffff', strokeWidth: 1, opacity: 0.7 }} tickLine={{ stroke: '#ffffff', strokeWidth: 1, opacity: 0.7 }} tick={{ fill: '#e5e7eb', fontSize: 12, fontWeight: 500 }} dx={-5} />
            <YAxis yAxisId="right" orientation="right" domain={[0, 15]} axisLine={{ stroke: '#ffffff', strokeWidth: 1, opacity: 0.7 }} tickLine={{ stroke: '#ffffff', strokeWidth: 1, opacity: 0.7 }} tick={{ fill: '#e5e7eb', fontSize: 12, fontWeight: 500 }} dx={5} />
            <RechartsTooltip contentStyle={{ fontSize: '13px', border: '1px solid var(--border)', borderRadius: '8px', backgroundColor: 'var(--background)' }} />
            <Legend verticalAlign="top" align="center" wrapperStyle={{ fontSize: '11px', paddingBottom: '20px' }} />
            <ReferenceArea yAxisId="left" x1={startTime} x2={endTime} strokeOpacity={0} fill="var(--primary)" fillOpacity={0.08} />
            <ReferenceLine yAxisId="right" y={2} stroke="var(--primary)" strokeDasharray="3 3" strokeOpacity={0.5} label={{ position: 'top', value: 'GoS Target (2%)', fontSize: 10, fill: 'var(--primary)', opacity: 0.7 }} />
            
            <Line yAxisId="left" type="monotone" dataKey="capacity" name="Available TCH" stroke="#fef08a" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
            <Line yAxisId="left" type="monotone" dataKey="offered" name="Offered Traffic (E)" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
            <Line yAxisId="right" type="monotone" dataKey="gos" name="Blocking Prob %" stroke="#22c55e" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
            <Brush dataKey="time" height={30} stroke="#3b82f6" fill="rgba(255,255,255,0.05)" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function MicrowaveInteractiveChart({ onAnalyzeTime }: { onAnalyzeTime: (range: string) => void }) {
  const [range, setRange] = useState('6h');
  const [startTime, setStartTime] = useState("12:00");
  const [endTime, setEndTime] = useState("14:30");
  const data = range === '6h' ? mwData.slice(-6) : range === '12h' ? mwData.slice(-12) : mwData;

  return (
    <div className="w-full relative h-[450px] rounded-xl overflow-hidden border border-border/80 shadow-inner flex flex-col bg-background">
      <div className="flex flex-wrap gap-3 items-center justify-between p-3 border-b border-border/50 bg-muted/20 shrink-0">
        <div className="flex gap-1 bg-muted p-1 rounded-lg border border-border/50 shadow-sm">
          <Button variant={range === '6h' ? 'default' : 'ghost'} size="sm" className="h-7 text-xs px-3 shadow-none" onClick={() => setRange('6h')}>6h View</Button>
          <Button variant={range === '12h' ? 'default' : 'ghost'} size="sm" className="h-7 text-xs px-3 shadow-none" onClick={() => setRange('12h')}>12h View</Button>
          <Button variant={range === '24h' ? 'default' : 'ghost'} size="sm" className="h-7 text-xs px-3 shadow-none" onClick={() => setRange('24h')}>24h View</Button>
        </div>
        <div className="flex items-center gap-2 bg-background p-1.5 rounded-lg border border-border shadow-sm">
          <Clock className="size-4 text-muted-foreground ml-2" />
          <span className="text-xs font-semibold text-muted-foreground mr-1 hidden sm:inline">Select Range:</span>
          <div className="flex items-center gap-1">
            <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="bg-muted text-xs p-1 rounded outline-none text-foreground border border-border/50 sm:w-[90px]" />
            <span className="text-muted-foreground text-xs font-bold">-</span>
            <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="bg-muted text-xs p-1 rounded outline-none text-foreground border border-border/50 sm:w-[90px]" />
          </div>
          <Button size="sm" className="h-7 text-xs font-semibold shadow-sm ml-2 bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => onAnalyzeTime(`Analyze the microwave backhaul telemetry between ${startTime} - ${endTime}.`)}>
            <Search className="size-3.5 mr-1.5" /> Deep Scan
          </Button>
        </div>
      </div>
      <div className="flex-1 p-5 pb-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, bottom: 20 }}>
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.15)" />
            <XAxis dataKey="time" axisLine={{ stroke: '#ffffff', strokeWidth: 1, opacity: 0.7 }} tickLine={{ stroke: '#ffffff', strokeWidth: 1, opacity: 0.7 }} tick={{ fill: '#e5e7eb', fontSize: 12, fontWeight: 500 }} dy={10} angle={0} textAnchor="middle" height={40} />
            <YAxis yAxisId="left" domain={[-90, -40]} axisLine={{ stroke: '#ffffff', strokeWidth: 1, opacity: 0.7 }} tickLine={{ stroke: '#ffffff', strokeWidth: 1, opacity: 0.7 }} tick={{ fill: '#e5e7eb', fontSize: 12, fontWeight: 500 }} label={{ value: 'RSL (dBm)', angle: -90, position: 'insideLeft', fontSize: 12, fill: "#e5e7eb", opacity: 0.8 }} dx={-5} />
            <YAxis yAxisId="right" orientation="right" domain={[0, 200]} axisLine={{ stroke: '#ffffff', strokeWidth: 1, opacity: 0.7 }} tickLine={{ stroke: '#ffffff', strokeWidth: 1, opacity: 0.7 }} tick={{ fill: '#e5e7eb', fontSize: 12, fontWeight: 500 }} label={{ value: 'Throughput (Mbps)', angle: 90, position: 'insideRight', fontSize: 12, fill: "#e5e7eb", opacity: 0.8 }} dx={5} />
            <RechartsTooltip contentStyle={{ backgroundColor: 'var(--background)' }} />
            <Legend verticalAlign="top" align="center" wrapperStyle={{ paddingBottom: '20px' }} />
            <ReferenceArea yAxisId="left" x1={startTime} x2={endTime} strokeOpacity={0} fill="var(--primary)" fillOpacity={0.08} />
            <ReferenceLine yAxisId="left" y={-80} stroke="var(--destructive)" strokeDasharray="3 3" strokeOpacity={0.5} label={{ position: 'top', value: 'Drop Threshold (-80)', fontSize: 10, fill: 'var(--destructive)', opacity: 0.7 }} />
            
            <Line yAxisId="right" type="monotone" dataKey="throughput" name="User Throughput" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
            <Line yAxisId="left" type="monotone" dataKey="rsl" name="Receive Signal Level" stroke="#f97316" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
            <Brush dataKey="time" height={30} stroke="#3b82f6" fill="rgba(255,255,255,0.05)" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function CoreSignalingInteractiveChart({ onAnalyzeTime }: { onAnalyzeTime: (range: string) => void }) {
  const [range, setRange] = useState('6h');
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("12:00");
  const data = range === '6h' ? signalingData.slice(-6) : range === '12h' ? signalingData.slice(-12) : signalingData;

  return (
    <div className="w-full relative h-[450px] rounded-xl overflow-hidden border border-border/80 shadow-inner flex flex-col bg-background">
      <div className="flex flex-wrap gap-3 items-center justify-between p-3 border-b border-border/50 bg-muted/20 shrink-0">
        <div className="flex gap-1 bg-muted p-1 rounded-lg border border-border/50 shadow-sm">
          <Button variant={range === '6h' ? 'default' : 'ghost'} size="sm" className="h-7 text-xs px-3 shadow-none" onClick={() => setRange('6h')}>6h View</Button>
          <Button variant={range === '12h' ? 'default' : 'ghost'} size="sm" className="h-7 text-xs px-3 shadow-none" onClick={() => setRange('12h')}>12h View</Button>
          <Button variant={range === '24h' ? 'default' : 'ghost'} size="sm" className="h-7 text-xs px-3 shadow-none" onClick={() => setRange('24h')}>24h View</Button>
        </div>
        <div className="flex items-center gap-2 bg-background p-1.5 rounded-lg border border-border shadow-sm">
          <Clock className="size-4 text-muted-foreground ml-2" />
          <span className="text-xs font-semibold text-muted-foreground mr-1 hidden sm:inline">Select Range:</span>
          <div className="flex items-center gap-1">
            <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="bg-muted text-xs p-1 rounded outline-none text-foreground border border-border/50 sm:w-[90px]" />
            <span className="text-muted-foreground text-xs font-bold">-</span>
            <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="bg-muted text-xs p-1 rounded outline-none text-foreground border border-border/50 sm:w-[90px]" />
          </div>
          <Button size="sm" className="h-7 text-xs font-semibold shadow-sm ml-2 bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => onAnalyzeTime(`Analyze the signaling storm and HSS failure between ${startTime} - ${endTime}.`)}>
            <Search className="size-3.5 mr-1.5" /> Deep Scan
          </Button>
        </div>
      </div>
      <div className="flex-1 p-5 pb-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, bottom: 20 }}>
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.15)" />
            <XAxis dataKey="time" axisLine={{ stroke: '#ffffff', strokeWidth: 1, opacity: 0.7 }} tickLine={{ stroke: '#ffffff', strokeWidth: 1, opacity: 0.7 }} tick={{ fill: '#e5e7eb', fontSize: 12, fontWeight: 500 }} dy={10} angle={0} textAnchor="middle" height={40} />
            <YAxis yAxisId="left" axisLine={{ stroke: '#ffffff', strokeWidth: 1, opacity: 0.7 }} tickLine={{ stroke: '#ffffff', strokeWidth: 1, opacity: 0.7 }} tick={{ fill: '#e5e7eb', fontSize: 12, fontWeight: 500 }} dx={-5} />
            <YAxis yAxisId="right" orientation="right" axisLine={{ stroke: '#ffffff', strokeWidth: 1, opacity: 0.7 }} tickLine={{ stroke: '#ffffff', strokeWidth: 1, opacity: 0.7 }} tick={{ fill: '#e5e7eb', fontSize: 12, fontWeight: 500 }} dx={5} />
            <RechartsTooltip contentStyle={{ backgroundColor: 'var(--background)' }} />
            <Legend verticalAlign="top" align="center" wrapperStyle={{ paddingBottom: '20px' }} />
            <ReferenceArea yAxisId="left" x1={startTime} x2={endTime} strokeOpacity={0} fill="var(--primary)" fillOpacity={0.08} />
            
            <Line yAxisId="left" type="monotone" dataKey="attachReq" name="Attach Requests (Attempted)" stroke="#ef4444" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
            <Line yAxisId="right" type="monotone" dataKey="success" name="Successful Attach" stroke="#10b981" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
            <Brush dataKey="time" height={30} stroke="#3b82f6" fill="rgba(255,255,255,0.05)" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}


function ProblemChat({ checklists, setChecklists }: { checklists: string[], setChecklists: any }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [chatInput, setChatInput] = useState("");
  const [reference, setReference] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [dialogData, setDialogData] = useState<{ lang: string, text: string } | null>(null);

  let complaint = complaintsList.find(c => c.id === id);
  if (!complaint && id?.startsWith('h-')) {
    const hidden = HIDDEN_PROBLEMS.find(h => h.id === id);
    if (hidden) {
      complaint = {
        id: hidden.id,
        userId: "AI Telemetry",
        issue: hidden.title,
        location: hidden.location,
        source: "System Auto-Detect",
        priority: hidden.severity,
        priorityColor: hidden.severity === 'Critical' ? 'bg-red-500' : hidden.severity === 'High' ? 'bg-orange-500' : 'bg-blue-500',
        badgeColor: hidden.severity === 'Critical' ? 'bg-red-500/20 text-red-500 border-red-500/30' : hidden.severity === 'High' ? 'bg-orange-500/20 text-orange-500 border-orange-500/30' : 'bg-blue-500/20 text-blue-500 border-blue-500/30',
        time: hidden.detected,
        status: "Latent Anomaly"
      };
    }
  }
  if (!complaint && id === 'c-1005') {
    complaint = {
      id: "c-1005",
      userId: "Manual Geo-Pin",
      issue: "Custom Investigation",
      location: "Sri Lanka (Dropped Pin)",
      source: "Manual",
      priority: "High",
      priorityColor: "bg-orange-500",
      badgeColor: "bg-orange-500/20 text-orange-500 border-orange-500/30",
      time: "Just now",
      status: "AI Analyzing"
    };
  }

  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    if (id === 'c-1001') {
      setMessages([{
        role: 'ai',
        type: 'initial-analysis-power',
        content: `I have intercepted a high-priority SMS complaint from **${complaint?.userId}** for **Total Signal Loss** in **Gampola South**. I have proactively analyzed the network data and alarms for this location.`
      }]);
    } else if (id === 'c-1002') {
      setMessages([{
        role: 'ai',
        type: 'initial-analysis-deep',
        content: `CRITICAL: User **${complaint?.userId}** reported **Intermittent Call Drops & Slow Data** via the Mobile App. Triangulated with 14 other hidden network anomalies in **Kandy City Center**. \n\nI have run a **deep multi-layer RF and Erlang Capacity analysis**. Here is the detailed step-by-step breakdown:`
      }]);
    } else if (id === 'c-1003') {
      setMessages([{
        role: 'ai',
        type: 'initial-analysis-backhaul',
        content: `I have intercepted a complaint from **${complaint?.userId}** reporting **Extremely Slow 4G Data (High Latency)** in **Nuwara Eliya Town**. \n\nI initiated a cross-domain correlation between RAN metrics, Backhaul Microwave links, and Weather APIs. Here is the root cause analysis:`
      }]);
    } else if (id === 'c-1004') {
      setMessages([{
        role: 'ai',
        type: 'initial-analysis-core',
        content: `URGENT NOC ALERT: A massive spike of **"Emergency Calls Only"** incidents just triggered at **Peradeniya University**. Over 800+ users are failing to latch to the network. \n\nI have traced the signaling flow from the eNodeB all the way to the Core Network (EPC). Here is the immediate diagnosis:`
      }]);
    } else if (id === 'h-1001') {
      setMessages([{
        role: 'ai',
        type: 'initial-analysis-hidden',
        content: `I have autonomously detected a pattern of **Silent RRC Connection Drops** in **Nuwara Eliya**. No user complaints were filed, but my telemetry sweeps identified a 14% increase in drop rates during night hours over the past week. \n\nI traced this to an automated power-saving feature aggressively shutting down carriers. I recommend re-tuning the threshold.`
      }]);
    } else if (id === 'h-1002') {
      setMessages([{
        role: 'ai',
        type: 'initial-analysis-hidden',
        content: `A **Creeping Intercell Interference** issue in **Colombo Port** has been flagged. This is a monthly hidden trend. Over the last 30 days, average SINR has degraded by 4dB. \n\nAnalysis of propagation delay and timing advance indicates a newly constructed high-rise is causing severe signal reflection. Remote electrical tilt (RET) adjustment is required.`
      }]);
    } else if (id === 'h-1003') {
      setMessages([{
        role: 'ai',
        type: 'initial-analysis-hidden',
        content: `I have identified a yearly recurring anomaly: **Seasonal Fiber Attenuation** in the **Kandy Hills** aggregation ring. \n\nBy correlating 3 years of performance data with weather APIs, I found that backhaul microwave links and certain exposed fiber joints suffer massive fading perfectly synced with the monsoon humidity cycles. Preventive maintenance is highly advised before next month.`
      }]);
    } else if (id === 'h-1004') {
      setMessages([{
        role: 'ai',
        type: 'initial-analysis-hidden',
        content: `I detected a massive volume of **Ghost Handover Failures** near **Galle Fort**. Users are not dropping calls, but their phones are silently failing handovers and retrying up to 8 times before succeeding, draining UE batteries and congesting signaling links. \n\nThis weekly trend maps to a misconfigured X2 interface between eNodeB-GF1 and eNodeB-GF2.`
      }]);
    } else if (id === 'h-1005') {
      setMessages([{
        role: 'ai',
        type: 'initial-analysis-hidden',
        content: `A **Dormant Core Bottleneck** was uncovered in the National Data Center. \n\nThis monthly anomaly shows the SGW (Serving Gateway) hitting 99% CPU capacity for micro-bursts of exactly 2 seconds every day at 8:00 PM. No alarms trigger because the duration is under the 5-minute NOC threshold. This indicates a massive automated IoT payload synchronization.`
      }]);
    }
  }, [id, complaint]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = (textOverride?: string) => {
    const userMsg = textOverride || chatInput;
    if (!userMsg.trim() && !reference && !textOverride) return;

    const fullMsg = reference && !textOverride ? `[Ref: ${reference}] ${userMsg}` : userMsg;
    setMessages(prev => [...prev, { role: 'user', content: fullMsg }]);
    if (!textOverride) {
      setChatInput("");
      setReference(null);
    }
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);

      if (userMsg.includes("Generate User Feedback")) {
        setMessages(prev => [...prev, {
          role: 'ai',
          type: 'translations',
          content: `I have generated simple, customer-friendly notifications for affected users regarding this outage.`
        }]);
      } else if (userMsg.includes("deep research")) {
        setMessages(prev => [...prev, {
          role: 'ai',
          type: 'deep-research',
          content: `I have pulled historical fault logs for the past 90 days and scanned adjacent sector behaviors.`
        }]);
      } else if (userMsg.includes("Analyze behavior inside the")) {
        setMessages(prev => [...prev, {
          role: 'ai',
          type: 'area-analysis',
          content: `Scanning network behavior for all active sessions within that radius... \n\nI detect multiple correlated anomalies inside this geographic boundary matching the primary failure signature.`
        }]);
      } else if (userMsg.includes("Analyze the specific Erlang congestion spike")) {
        setMessages(prev => [...prev, {
          role: 'ai',
          type: 'time-analysis',
          content: `I have extracted the core data points from the selected time window.\n\n**Finding:** The data reveals a sudden and massive correlation between the exact moment the hardware alarm triggered and the immediate drop in capacity. Because the physical user traffic volume remained high while the capacity shrank, the Blocking Probability exponentially skyrocketed.`
        }]);
      } else if (userMsg.includes("Forwarded the generated translations")) {
        setMessages(prev => [...prev, {
          role: 'ai',
          type: 'text',
          content: "Done. The draft has been queued directly into the Customer Care Zendesk portal for final approval and dispatch."
        }]);
      } else if (userMsg.includes("Dispatched the automated SMS")) {
        setMessages(prev => [...prev, {
          role: 'ai',
          type: 'text',
          content: "Broadcast sent successfully via SMPP gateway. 1,420 users in the affected cell radius have received the notification."
        }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'ai',
          type: 'text',
          content: "Action executed via NOC API. Real-time telemetry confirms the mitigation script has been deployed successfully. Traffic is normalizing."
        }]);
      }
    }, 1500);
  };

  const handleReferenceStep = (stepNum: number, title: string) => {
    setReference(`Step ${stepNum} - ${title}`);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const addToChecklist = (suggestion: string) => {
    if (!checklists.includes(suggestion)) {
      setChecklists([...checklists, suggestion]);
    }
  };

  if (!complaint) return <div>Not found</div>;

  return (
    <div className="flex flex-col h-full bg-background relative">

      {/* Custom Modal Dialog */}
      {dialogData && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-background border border-border shadow-2xl rounded-2xl w-[450px] overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b flex items-center justify-between bg-muted/30">
              <h3 className="font-bold text-lg flex items-center"><Globe className="size-5 mr-2 text-primary" /> Notification Approval</h3>
              <Button variant="ghost" size="icon" className="size-8 rounded-full" onClick={() => setDialogData(null)}><X className="size-4" /></Button>
            </div>
            <div className="p-6 space-y-5">
              <p className="text-[15px] text-muted-foreground leading-relaxed">
                You are preparing an automated <strong>{dialogData.lang}</strong> SMS broadcast for the affected users in this region.
              </p>
              <div className="p-4 bg-muted/50 rounded-xl text-[15px] border border-border/80 text-foreground font-medium shadow-inner italic relative">
                <span className="absolute -top-3 -left-2 text-4xl text-primary/30">"</span>
                {dialogData.text}
              </div>
              <p className="text-sm font-semibold text-foreground">
                Choose a routing method for this communication:
              </p>
            </div>
            <div className="p-5 border-t border-border/50 bg-muted/10 flex flex-col gap-3">
              <Button variant="outline" className="w-full text-blue-500 border-blue-500/30 hover:bg-blue-500/10 h-11 justify-start px-4 shadow-sm" onClick={() => {
                setDialogData(null);
                handleSendMessage("Forwarded the generated translations to the Level 2 Customer Care team for manual review and dispatch.");
              }}>
                <div className="size-8 rounded-full bg-blue-500/10 flex items-center justify-center mr-3"><MessageSquare className="size-4" /></div>
                Forward to Customer Care Review
              </Button>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-11 justify-start px-4 shadow-sm" onClick={() => {
                setDialogData(null);
                handleSendMessage("Dispatched the automated SMS broadcast to all affected IMSIs in the cell radius.");
              }}>
                <div className="size-8 rounded-full bg-black/20 flex items-center justify-center mr-3"><Send className="size-4" /></div>
                Dispatch Directly to Users
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-8 pb-48 space-y-8 bg-background" ref={scrollRef as any}>
        <div className="flex justify-center mb-8">
          <Badge variant="outline" className="bg-background text-muted-foreground shadow-sm">Today, {complaint.time}</Badge>
        </div>

        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col gap-2 w-full max-w-3xl mx-auto`}>
            {msg.role === 'ai' && (
              <div className="flex items-center gap-2 mb-2 pl-1">
                <div className="size-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shadow-md overflow-hidden">
                  <img src="/Bot.png" alt="Bot" className="size-full object-contain p-1" />
                </div>
                <span className="text-sm font-bold text-foreground tracking-tight">TeleQ Bot Specialist</span>
              </div>
            )}

            {msg.role === 'user' ? (
              <div className="bg-[#1A1A1A] text-white px-5 py-3 rounded-3xl text-[15px] shadow-sm ml-auto max-w-[80%] whitespace-pre-wrap leading-relaxed">
                {msg.content}
              </div>
            ) : (
              <div className="text-[15px] w-full text-card-foreground pl-11">
                <div dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>') }} className="leading-relaxed text-muted-foreground whitespace-pre-wrap text-[15px]" />

                {/* INTERMITTENT CALL DROPS (KANDY) */}
                {msg.type === 'initial-analysis-deep' && (
                  <div className="mt-10 relative border-l-2 border-border ml-5 pl-10 space-y-12 pb-4">
                    <div className="relative">
                      <div className="absolute -left-[61px] top-1 size-10 rounded-full bg-background border-[3px] border-primary text-primary flex items-center justify-center font-black text-lg shadow-sm">1</div>
                      <Card className="bg-background border-border/60 shadow-sm hover:border-primary/50 transition-colors">
                        <CardHeader className="py-4 px-5 border-b border-border/40 bg-muted/20 flex flex-row items-center justify-between">
                          <div>
                            <Badge variant="outline" className="mb-2 text-[10px] uppercase tracking-wider text-blue-500 border-blue-500/30 font-bold bg-blue-500/5">Topic: Spatial Triangulation</Badge>
                            <CardTitle className="text-lg flex items-center"><MapIcon className="size-5 mr-2 text-blue-500" /> Interactive GIS Coverage Map</CardTitle>
                          </div>
                          <Button variant="secondary" size="sm" className="h-8 shadow-sm hover:bg-primary hover:text-primary-foreground" onClick={() => handleReferenceStep(1, 'Interactive GIS Map')}>
                            <Reply className="size-4 mr-1.5" /> Ask About This
                          </Button>
                        </CardHeader>
                        <CardContent className="p-5">
                          <p className="text-[15px] text-muted-foreground mb-4">Mapped user coordinates via App triangulation. Latched to <strong className="text-foreground">Kandy-1_G1-091</strong> (Sector 1).</p>
                          <DynamicInteractiveMap
                            center={[7.2906, 80.6337]}
                            towers={[
                              { id: 'Kandy-1_G1-091', pos: [7.2970, 80.6360], status: 'Congested (VSWR)', reason: 'Capacity: 52/60', color: '#ef4444' },
                              { id: 'Kandy-1_G2-092', pos: [7.2830, 80.6250], status: 'Optimal', reason: 'Load: 40%', color: '#3b82f6' }
                            ]}
                            userPos={[7.2906, 80.6337]}
                            userLabel="UID: 45920 (iPhone 14)"
                            onAnalyzeArea={(r) => handleSendMessage(`Analyze behavior inside the ${r}km highlighted map radius.`)}
                          />
                        </CardContent>
                      </Card>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[61px] top-1 size-10 rounded-full bg-background border-[3px] border-primary text-primary flex items-center justify-center font-black text-lg shadow-sm">2</div>
                      <Card className="bg-background border-border/60 shadow-sm hover:border-primary/50 transition-colors">
                        <CardHeader className="py-4 px-5 border-b border-border/40 bg-muted/20 flex flex-row items-center justify-between">
                          <div>
                            <Badge variant="outline" className="mb-2 text-[10px] uppercase tracking-wider text-indigo-500 border-indigo-500/30 font-bold bg-indigo-500/5">Topic: RF Diagnostics</Badge>
                            <CardTitle className="text-lg flex items-center"><Activity className="size-5 mr-2 text-indigo-500" /> Air Interface Analysis</CardTitle>
                          </div>

                          <Button variant="secondary" size="sm" className="h-8 shadow-sm hover:bg-primary hover:text-primary-foreground" onClick={() => handleReferenceStep(2, 'Air Interface Analysis')}>
                            <Reply className="size-4 mr-1.5" /> Ask About This
                          </Button>
                        </CardHeader>
                        <CardContent className="p-5">
                          <div className="grid grid-cols-2 gap-6">
                            <div className="bg-background p-4 rounded-xl border border-border/80 shadow-sm flex flex-col items-center justify-center">
                              <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-2">RSRP (Terminal)</div>
                              <div className="text-3xl font-black text-yellow-500">-98 dBm</div>
                              <div className="text-sm font-medium text-muted-foreground mt-1">Status: Fair</div>
                            </div>
                            <div className="bg-background p-4 rounded-xl border border-border/80 shadow-sm flex flex-col items-center justify-center">
                              <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-2">SINR (Interference)</div>
                              <div className="text-3xl font-black text-emerald-500">14 dB</div>
                              <div className="text-sm font-medium text-muted-foreground mt-1">Status: Good</div>
                            </div>
                          </div>
                          <div className="mt-5 p-4 bg-muted/30 rounded-lg border border-border/50 text-[15px] text-muted-foreground">
                            <span className="font-semibold text-foreground">Conclusion:</span> Air interface quality is sufficient. The call drops are <strong>not</strong> caused by weak signal or external interference.
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[61px] top-1 size-10 rounded-full bg-background border-[3px] border-primary text-primary flex items-center justify-center font-black text-lg shadow-sm">3</div>
                      <Card className="bg-background border-border/60 shadow-sm hover:border-primary/50 transition-colors">
                        <CardHeader className="py-4 px-5 border-b border-border/40 bg-muted/20 flex flex-row items-center justify-between">
                          <div>
                            <Badge variant="outline" className="mb-2 text-[10px] uppercase tracking-wider text-orange-500 border-orange-500/30 font-bold bg-orange-500/5">Topic: NOC Logs</Badge>
                            <CardTitle className="text-lg flex items-center"><AlertCircle className="size-5 mr-2 text-orange-500" /> Hardware Alarm Correlation</CardTitle>
                          </div>

                          <Button variant="secondary" size="sm" className="h-8 shadow-sm hover:bg-primary hover:text-primary-foreground" onClick={() => handleReferenceStep(3, 'Hardware Alarm Correlation')}>
                            <Reply className="size-4 mr-1.5" /> Ask About This
                          </Button>
                        </CardHeader>
                        <CardContent className="p-5">
                          <div className="rounded-xl border border-border/80 bg-background overflow-hidden shadow-sm">
                            <table className="w-full text-sm text-left">
                              <thead className="bg-muted/50 border-b border-border/50">
                                <tr><th className="p-3 text-foreground font-semibold">Time</th><th className="p-3 text-foreground font-semibold">Alarm Name</th><th className="p-3 text-foreground font-semibold">Severity</th></tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-border/50"><td className="p-3 text-muted-foreground">14:15</td><td className="p-3 font-mono text-muted-foreground">LINK_OAM_FAIL</td><td className="p-3 text-blue-500 font-medium">Warning</td></tr>
                                <tr className="bg-orange-500/5"><td className="p-3 text-muted-foreground">14:55</td><td className="p-3 font-mono font-bold text-orange-500">TRX_VSWR_LIMIT_EXCEEDED</td><td className="p-3"><Badge variant="outline" className="bg-orange-500/10 border-orange-500/30 text-orange-500">Minor</Badge></td></tr>
                              </tbody>
                            </table>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[61px] top-1 size-10 rounded-full bg-background border-[3px] border-primary text-primary flex items-center justify-center font-black text-lg shadow-sm">4</div>
                      <Card className="bg-background border-border/60 shadow-sm hover:border-primary/50 transition-colors">
                        <CardHeader className="py-4 px-5 border-b border-border/40 bg-muted/20 flex flex-row items-center justify-between">
                          <div>
                            <Badge variant="outline" className="mb-2 text-[10px] uppercase tracking-wider text-purple-500 border-purple-500/30 font-bold bg-purple-500/5">Topic: Mathematics</Badge>
                            <CardTitle className="text-lg flex items-center text-primary"><Zap className="size-5 mr-2 text-primary" /> Interactive Erlang B Capacity</CardTitle>
                          </div>

                          <Button variant="secondary" size="sm" className="h-8 shadow-sm hover:bg-primary hover:text-primary-foreground" onClick={() => handleReferenceStep(4, 'Interactive Erlang B Capacity')}>
                            <Reply className="size-4 mr-1.5" /> Ask About This
                          </Button>
                        </CardHeader>
                        <CardContent className="p-5">
                          <ErlangInteractiveChart onAnalyzeTime={(t) => handleSendMessage(t)} />
                        </CardContent>
                      </Card>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[61px] top-1 size-10 rounded-full bg-primary border-[3px] border-primary text-primary-foreground flex items-center justify-center font-black text-lg shadow-[0_0_20px_rgba(var(--primary),0.5)]">5</div>
                      <Card className="bg-primary/5 border-primary/40 shadow-[0_0_30px_rgba(var(--primary),0.15)] ring-1 ring-primary/30">
                        <CardHeader className="py-4 px-5 border-b border-primary/20 bg-primary/10 flex flex-row items-center justify-between">
                          <div>
                            <Badge className="mb-2 text-[10px] uppercase tracking-wider bg-primary text-primary-foreground">AI Synthesis</Badge>
                            <CardTitle className="text-xl flex items-center text-primary"><Lightbulb className="size-6 mr-2" /> Final Diagnosis & Action Plan</CardTitle>
                          </div>

                          <Button variant="secondary" size="sm" className="h-8 shadow-sm hover:bg-primary hover:text-primary-foreground" onClick={() => handleReferenceStep(5, 'Final Diagnosis & Action Plan')}>
                            <Reply className="size-4 mr-1.5" /> Ask About This
                          </Button>
                        </CardHeader>
                        <CardContent className="p-6 space-y-5 text-[15px] leading-relaxed">
                          <div>
                            <strong className="text-foreground text-lg mb-2 block">Root Cause Summary:</strong>
                            <span className="text-muted-foreground block">
                              The intermittent call drops and slow data in Kandy City Center are caused by <strong>physical antenna feeder cable degradation (VSWR 1.7)</strong> on Sector 1, TRX-2.
                            </span>
                          </div>
                          <div className="bg-background p-5 rounded-xl border border-border/80 shadow-sm mt-4">
                            <strong className="text-foreground flex items-center mb-3 text-lg"><CheckCircle2 className="size-5 mr-2 text-primary" /> Recommended Mitigation:</strong>
                            <ul className="list-disc pl-5 space-y-4 text-muted-foreground">
                              <li><strong>Customer Feedback:</strong> Generate SMS to inform users in the area about the degraded service during repairs.</li>
                              <li className="flex flex-col items-start gap-3">
                                <span><strong>Mitigation Action:</strong> Dispatch Field Rigging Team to Kandy-1_G1 to physically inspect and replace the feeder cable.</span>
                                <Button size="sm" variant="outline" className="bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 h-8 shadow-sm" onClick={() => addToChecklist("Physical inspection of TRX-2 Feeder Cable at Kandy-1_G1")}>
                                  <ClipboardList className="size-4 mr-2" /> Add to Investigation Checklist
                                </Button>
                              </li>
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {/* POWER FAILURE (GAMPOLA) */}
                {msg.type === 'initial-analysis-power' && (
                  <div className="mt-10 relative border-l-2 border-border ml-5 pl-10 space-y-12 pb-4">
                    <div className="relative">
                      <div className="absolute -left-[61px] top-1 size-10 rounded-full bg-background border-[3px] border-red-500 text-red-500 flex items-center justify-center font-black text-lg shadow-sm">1</div>
                      <Card className="bg-background border-border/60 shadow-sm hover:border-red-500/50 transition-colors">
                        <CardHeader className="py-4 px-5 border-b border-border/40 bg-muted/20 flex flex-row items-center justify-between">
                          <div>
                            <Badge variant="outline" className="mb-2 text-[10px] uppercase tracking-wider text-blue-500 border-blue-500/30 font-bold bg-blue-500/5">Topic: Spatial Triangulation</Badge>
                            <CardTitle className="text-lg flex items-center"><MapIcon className="size-5 mr-2 text-blue-500" /> Location Triangulation</CardTitle>
                          </div>

                          <Button variant="secondary" size="sm" className="h-8 shadow-sm hover:bg-primary hover:text-primary-foreground" onClick={() => handleReferenceStep(1, 'Location Triangulation')}>
                            <Reply className="size-4 mr-1.5" /> Ask About This
                          </Button>
                        </CardHeader>
                        <CardContent className="p-5">
                          <DynamicInteractiveMap
                            center={[7.1667, 80.5667]}
                            towers={[{ id: 'Gampola-South_Site_04', pos: [7.1700, 80.5700], status: 'Total Shutdown', reason: 'Grid Power Failure', color: '#ef4444' }]}
                            userPos={[7.1667, 80.5667]}
                            userLabel="UID: +94 77 829 1029"
                            onAnalyzeArea={(r) => handleSendMessage(`Analyze behavior inside the ${r}km highlighted map radius.`)}
                          />
                        </CardContent>
                      </Card>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[61px] top-1 size-10 rounded-full bg-background border-[3px] border-red-500 text-red-500 flex items-center justify-center font-black text-lg shadow-sm">2</div>
                      <Card className="bg-background border-border/60 shadow-sm hover:border-red-500/50 transition-colors">
                        <CardHeader className="py-4 px-5 border-b border-border/40 bg-muted/20 flex flex-row items-center justify-between">
                          <div>
                            <Badge variant="outline" className="mb-2 text-[10px] uppercase tracking-wider text-orange-500 border-orange-500/30 font-bold bg-orange-500/5">Topic: NOC Logs</Badge>
                            <CardTitle className="text-lg flex items-center"><AlertCircle className="size-5 mr-2 text-orange-500" /> Active Alarm Check</CardTitle>
                          </div>

                          <Button variant="secondary" size="sm" className="h-8 shadow-sm hover:bg-primary hover:text-primary-foreground" onClick={() => handleReferenceStep(2, 'Active Alarm Check')}>
                            <Reply className="size-4 mr-1.5" /> Ask About This
                          </Button>
                        </CardHeader>
                        <CardContent className="p-5">
                          <div className="flex flex-col gap-3">
                            <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-xl flex items-center shadow-sm">
                              <AlertTriangle className="size-7 text-red-500 mr-4" />
                              <div>
                                <div className="font-mono font-bold text-red-500 text-base">MAINS_FAILURE</div>
                                <div className="text-sm text-red-400 mt-1">Triggered at 08:45 AM</div>
                              </div>
                            </div>
                            <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-xl flex items-center shadow-sm">
                              <AlertTriangle className="size-7 text-red-500 mr-4" />
                              <div>
                                <div className="font-mono font-bold text-red-500 text-base">BATTERY_DEPLETED</div>
                                <div className="text-sm text-red-400 mt-1">Triggered at 10:30 AM</div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[61px] top-1 size-10 rounded-full bg-red-500 border-[3px] border-red-500 text-white flex items-center justify-center font-black text-lg shadow-[0_0_20px_rgba(239,68,68,0.5)]">3</div>
                      <Card className="bg-red-500/5 border-red-500/40 shadow-[0_0_30px_rgba(239,68,68,0.15)] ring-1 ring-red-500/30">
                        <CardHeader className="py-4 px-5 border-b border-red-500/20 bg-red-500/10 flex flex-row items-center justify-between">
                          <div>
                            <Badge className="mb-2 text-[10px] uppercase tracking-wider bg-red-500 text-white hover:bg-red-600">AI Synthesis</Badge>
                            <CardTitle className="text-xl flex items-center text-red-500"><Lightbulb className="size-6 mr-2" /> Final Diagnosis & Action Plan</CardTitle>
                          </div>

                          <Button variant="secondary" size="sm" className="h-8 shadow-sm hover:bg-primary hover:text-primary-foreground" onClick={() => handleReferenceStep(3, 'Final Diagnosis & Action Plan')}>
                            <Reply className="size-4 mr-1.5" /> Ask About This
                          </Button>
                        </CardHeader>
                        <CardContent className="p-6 space-y-5 text-[15px] leading-relaxed">
                          <div>
                            <strong className="text-foreground text-lg mb-2 block">Root Cause Summary:</strong>
                            <span className="text-muted-foreground block">
                              Based on the correlated <code>MAINS_FAILURE</code> and <code>BATTERY_DEPLETED</code> NOC alarms, the root cause is a <strong>prolonged commercial grid power failure</strong> that exceeded the site's 2-hour backup battery life.
                            </span>
                          </div>
                          <div className="bg-background p-5 rounded-xl border border-border/80 shadow-sm mt-4">
                            <strong className="text-foreground flex items-center mb-3 text-lg"><CheckCircle2 className="size-5 mr-2 text-red-500" /> Recommended Mitigation:</strong>
                            <ul className="list-disc pl-5 space-y-4 text-muted-foreground">
                              <li><strong>Customer Feedback:</strong> Generate SMS to inform users in the area about the power failure.</li>
                              <li className="flex flex-col items-start gap-3">
                                <span><strong>Mitigation Action:</strong> Alert Regional Power Team and CEB (Ceylon Electricity Board). Dispatch a mobile backup generator.</span>
                                <Button size="sm" variant="outline" className="bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20 h-8 shadow-sm" onClick={() => addToChecklist("Dispatch Mobile Generator to Gampola-South_Site_04")}>
                                  <ClipboardList className="size-4 mr-2" /> Add to Investigation Checklist
                                </Button>
                              </li>
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {/* BACKHAUL FAILURE (NUWARA ELIYA) */}
                {msg.type === 'initial-analysis-backhaul' && (
                  <div className="mt-10 relative border-l-2 border-border ml-5 pl-10 space-y-12 pb-4">
                    <div className="relative">
                      <div className="absolute -left-[61px] top-1 size-10 rounded-full bg-background border-[3px] border-orange-500 text-orange-500 flex items-center justify-center font-black text-lg shadow-sm">1</div>
                      <Card className="bg-background border-border/60 shadow-sm hover:border-orange-500/50 transition-colors">
                        <CardHeader className="py-4 px-5 border-b border-border/40 bg-muted/20 flex flex-row items-center justify-between">
                          <div>
                            <Badge variant="outline" className="mb-2 text-[10px] uppercase tracking-wider text-blue-500 border-blue-500/30 font-bold bg-blue-500/5">Topic: Spatial Triangulation</Badge>
                            <CardTitle className="text-lg flex items-center"><MapIcon className="size-5 mr-2 text-blue-500" /> Location Triangulation</CardTitle>
                          </div>

                          <Button variant="secondary" size="sm" className="h-8 shadow-sm hover:bg-primary hover:text-primary-foreground" onClick={() => handleReferenceStep(1, 'Location Triangulation')}>
                            <Reply className="size-4 mr-1.5" /> Ask About This
                          </Button>
                        </CardHeader>
                        <CardContent className="p-5">
                          <DynamicInteractiveMap
                            center={[6.9497, 80.7811]}
                            towers={[{ id: 'NuwaraEliya-Hub-01', pos: [6.9530, 80.7840], status: 'Active (Degraded Backhaul)', reason: '15GHz MW Link', color: '#f97316' }]}
                            userPos={[6.9497, 80.7811]}
                            userLabel="UID: +94 77 112 9988 (High Latency)"
                            onAnalyzeArea={(r) => handleSendMessage(`Analyze behavior inside the ${r}km highlighted map radius.`)}
                          />
                        </CardContent>
                      </Card>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[61px] top-1 size-10 rounded-full bg-background border-[3px] border-orange-500 text-orange-500 flex items-center justify-center font-black text-lg shadow-sm">2</div>
                      <Card className="bg-background border-border/60 shadow-sm hover:border-orange-500/50 transition-colors">
                        <CardHeader className="py-4 px-5 border-b border-border/40 bg-muted/20 flex flex-row items-center justify-between">
                          <div>
                            <Badge variant="outline" className="mb-2 text-[10px] uppercase tracking-wider text-orange-500 border-orange-500/30 font-bold bg-orange-500/5">Topic: Transmission Network</Badge>
                            <CardTitle className="text-lg flex items-center"><Activity className="size-5 mr-2 text-orange-500" /> Microwave Backhaul Telemetry</CardTitle>
                          </div>

                          <Button variant="secondary" size="sm" className="h-8 shadow-sm hover:bg-primary hover:text-primary-foreground" onClick={() => handleReferenceStep(2, 'Microwave Backhaul Telemetry')}>
                            <Reply className="size-4 mr-1.5" /> Ask About This
                          </Button>
                        </CardHeader>
                        <CardContent className="p-5">
                          <p className="text-[15px] text-muted-foreground mb-4">Radio interface is healthy (RSRP -85dBm). Tracing backhaul link connecting Nuwara Eliya Hub to Core.</p>
                          <MicrowaveInteractiveChart onAnalyzeTime={(t) => handleSendMessage(t)} />
                        </CardContent>
                      </Card>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[61px] top-1 size-10 rounded-full bg-background border-[3px] border-orange-500 text-orange-500 flex items-center justify-center font-black text-lg shadow-sm">3</div>
                      <Card className="bg-background border-border/60 shadow-sm hover:border-orange-500/50 transition-colors">
                        <CardHeader className="py-4 px-5 border-b border-border/40 bg-muted/20 flex flex-row items-center justify-between">
                          <div>
                            <Badge variant="outline" className="mb-2 text-[10px] uppercase tracking-wider text-cyan-500 border-cyan-500/30 font-bold bg-cyan-500/5">Topic: Environmental API Correlation</Badge>
                            <CardTitle className="text-lg flex items-center"><CloudRain className="size-5 mr-2 text-cyan-500" /> Weather Impact Analysis</CardTitle>
                          </div>

                          <Button variant="secondary" size="sm" className="h-8 shadow-sm hover:bg-primary hover:text-primary-foreground" onClick={() => handleReferenceStep(3, 'Weather Impact Analysis')}>
                            <Reply className="size-4 mr-1.5" /> Ask About This
                          </Button>
                        </CardHeader>
                        <CardContent className="p-5">
                          <p className="text-[15px] text-muted-foreground leading-relaxed">
                            Pulled real-time meteorological data for Nuwara Eliya via external API.<br /><br />
                            <strong>Finding:</strong> Heavy rainfall (45mm/hr) and dense fog began at 13:15. High-frequency 15GHz Microwave links suffer from severe <em>Rain Fade</em> (water droplets absorbing RF energy). This explains the exact drop in Receive Signal Level (RSL) and subsequent plummet in backhaul throughput capacity.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[61px] top-1 size-10 rounded-full bg-orange-500 border-[3px] border-orange-500 text-white flex items-center justify-center font-black text-lg shadow-[0_0_20px_rgba(249,115,22,0.5)]">4</div>
                      <Card className="bg-orange-500/5 border-orange-500/40 shadow-[0_0_30px_rgba(249,115,22,0.15)] ring-1 ring-orange-500/30">
                        <CardHeader className="py-4 px-5 border-b border-orange-500/20 bg-orange-500/10 flex flex-row items-center justify-between">
                          <div>
                            <Badge className="mb-2 text-[10px] uppercase tracking-wider bg-orange-500 text-white hover:bg-orange-600">AI Synthesis</Badge>
                            <CardTitle className="text-xl flex items-center text-orange-500"><Lightbulb className="size-6 mr-2" /> Final Diagnosis & Action Plan</CardTitle>
                          </div>

                          <Button variant="secondary" size="sm" className="h-8 shadow-sm hover:bg-primary hover:text-primary-foreground" onClick={() => handleReferenceStep(4, 'Final Diagnosis & Action Plan')}>
                            <Reply className="size-4 mr-1.5" /> Ask About This
                          </Button>
                        </CardHeader>
                        <CardContent className="p-6 space-y-5 text-[15px] leading-relaxed">
                          <div>
                            <strong className="text-foreground text-lg mb-2 block">Root Cause Summary:</strong>
                            <span className="text-muted-foreground block">
                              Extreme weather (Rain Fade) in Nuwara Eliya is choking the primary 15GHz Microwave backhaul link. The eNodeB is perfectly fine, but the pipe connecting it to the core network has shrunk from 150Mbps to 0.5Mbps, causing massive latency.
                            </span>
                          </div>
                          <div className="bg-background p-5 rounded-xl border border-border/80 shadow-sm mt-4">
                            <strong className="text-foreground flex items-center mb-3 text-lg"><CheckCircle2 className="size-5 mr-2 text-orange-500" /> Recommended Mitigation:</strong>
                            <ul className="list-disc pl-5 space-y-4 text-muted-foreground">
                              <li><strong>Customer Feedback:</strong> Generate SMS to inform users in the area about the degraded throughput due to weather.</li>
                              <li className="flex flex-col items-start gap-3">
                                <span><strong>Mitigation Action:</strong> Coordinate with NOC to manually failover traffic to the secondary low-frequency (7GHz) backup microwave link.</span>
                                <Button size="sm" variant="outline" className="bg-orange-500/10 border-orange-500/30 text-orange-500 hover:bg-orange-500/20 h-8 shadow-sm" onClick={() => addToChecklist("NOC Coordination: Failover to 7GHz Link")}>
                                  <ClipboardList className="size-4 mr-2" /> Add to Investigation Checklist
                                </Button>
                              </li>
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {/* CORE NETWORK (PERADENIYA) */}
                {msg.type === 'initial-analysis-core' && (
                  <div className="mt-10 relative border-l-2 border-border ml-5 pl-10 space-y-12 pb-4">
                    <div className="relative">
                      <div className="absolute -left-[61px] top-1 size-10 rounded-full bg-background border-[3px] border-red-500 text-red-500 flex items-center justify-center font-black text-lg shadow-sm">1</div>
                      <Card className="bg-background border-border/60 shadow-sm hover:border-red-500/50 transition-colors">
                        <CardHeader className="py-4 px-5 border-b border-border/40 bg-muted/20 flex flex-row items-center justify-between">
                          <div>
                            <Badge variant="outline" className="mb-2 text-[10px] uppercase tracking-wider text-purple-500 border-purple-500/30 font-bold bg-purple-500/5">Topic: Signaling Trace</Badge>
                            <CardTitle className="text-lg flex items-center"><ServerCrash className="size-5 mr-2 text-purple-500" /> S1-MME Interface Analysis</CardTitle>
                          </div>

                          <Button variant="secondary" size="sm" className="h-8 shadow-sm hover:bg-primary hover:text-primary-foreground" onClick={() => handleReferenceStep(1, 'S1-MME Interface Analysis')}>
                            <Reply className="size-4 mr-1.5" /> Ask About This
                          </Button>
                        </CardHeader>
                        <CardContent className="p-5">
                          <p className="text-[15px] text-muted-foreground mb-4">Tracing the signaling connection requests (Attach Requests) from the Peradeniya eNodeBs towards the Mobility Management Entity (MME) in the Core.</p>
                          <CoreSignalingInteractiveChart onAnalyzeTime={(t) => handleSendMessage(t)} />
                        </CardContent>
                      </Card>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[61px] top-1 size-10 rounded-full bg-background border-[3px] border-red-500 text-red-500 flex items-center justify-center font-black text-lg shadow-sm">2</div>
                      <Card className="bg-background border-border/60 shadow-sm hover:border-red-500/50 transition-colors">
                        <CardHeader className="py-4 px-5 border-b border-border/40 bg-muted/20 flex flex-row items-center justify-between">
                          <div>
                            <Badge variant="outline" className="mb-2 text-[10px] uppercase tracking-wider text-red-500 border-red-500/30 font-bold bg-red-500/5">Topic: Core DB Logs</Badge>
                            <CardTitle className="text-lg flex items-center"><Database className="size-5 mr-2 text-red-500" /> HSS (Home Subscriber Server) Log Correlation</CardTitle>
                          </div>

                          <Button variant="secondary" size="sm" className="h-8 shadow-sm hover:bg-primary hover:text-primary-foreground" onClick={() => handleReferenceStep(2, 'HSS (Home Subscriber Server) Log Correlation')}>
                            <Reply className="size-4 mr-1.5" /> Ask About This
                          </Button>
                        </CardHeader>
                        <CardContent className="p-5">
                          <p className="text-[15px] text-muted-foreground leading-relaxed">
                            The MME is dropping 95% of attach requests. Polling the core HSS database logs for the rejected IMSIs.<br /><br />
                            <code className="block bg-destructive/10 text-destructive p-3 rounded-lg border border-destructive/30 mt-3 font-mono text-xs">
                              [ERROR] 11:05:22 - MME_01 - Authentication Info Request Failed<br />
                              [ERROR] 11:05:22 - DIAMETER_AUTHENTICATION_DATA_UNAVAILABLE (Result Code 4181)<br />
                              [WARN]  11:05:23 - HSS_Node_B database synchronization timeout
                            </code><br />
                            <strong>Finding:</strong> A specific cluster in the HSS database (HSS_Node_B) has lost synchronization. When the MME requests authentication vectors to verify these SIM cards, the HSS returns no data, causing the network to forcibly reject the phones ("Emergency Calls Only").
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[61px] top-1 size-10 rounded-full bg-red-500 border-[3px] border-red-500 text-white flex items-center justify-center font-black text-lg shadow-[0_0_20px_rgba(239,68,68,0.5)]">3</div>
                      <Card className="bg-red-500/5 border-red-500/40 shadow-[0_0_30px_rgba(239,68,68,0.15)] ring-1 ring-red-500/30">
                        <CardHeader className="py-4 px-5 border-b border-red-500/20 bg-red-500/10 flex flex-row items-center justify-between">
                          <div>
                            <Badge className="mb-2 text-[10px] uppercase tracking-wider bg-red-500 text-white hover:bg-red-600">AI Synthesis</Badge>
                            <CardTitle className="text-xl flex items-center text-red-500"><Lightbulb className="size-6 mr-2" /> Final Diagnosis & Action Plan</CardTitle>
                          </div>

                          <Button variant="secondary" size="sm" className="h-8 shadow-sm hover:bg-primary hover:text-primary-foreground" onClick={() => handleReferenceStep(3, 'Final Diagnosis & Action Plan')}>
                            <Reply className="size-4 mr-1.5" /> Ask About This
                          </Button>
                        </CardHeader>
                        <CardContent className="p-6 space-y-5 text-[15px] leading-relaxed">
                          <div>
                            <strong className="text-foreground text-lg mb-2 block">Root Cause Summary:</strong>
                            <span className="text-muted-foreground block">
                              Core Network failure. HSS_Node_B is experiencing a DB sync crash, meaning it cannot authenticate SIM cards in that specific batch. This is entirely decoupled from the radio towers in Peradeniya.
                            </span>
                          </div>
                          <div className="bg-background p-5 rounded-xl border border-border/80 shadow-sm mt-4">
                            <strong className="text-foreground flex items-center mb-3 text-lg"><CheckCircle2 className="size-5 mr-2 text-red-500" /> Recommended Mitigation:</strong>
                            <ul className="list-disc pl-5 space-y-4 text-muted-foreground">
                              <li><strong>Customer Feedback:</strong> Generate SMS to inform users in the batch about the authentication delay.</li>
                              <li className="flex flex-col items-start gap-3">
                                <span><strong>Mitigation Action:</strong> Escalate to Level 3 Core Operations team to manually isolate HSS_Node_B and verify DB integrity.</span>
                                <Button size="sm" variant="outline" className="bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20 h-8 shadow-sm" onClick={() => addToChecklist("L3 Core Ops: Verify HSS_Node_B DB Integrity")}>
                                  <ClipboardList className="size-4 mr-2" /> Add to Investigation Checklist
                                </Button>
                              </li>
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {/* CUSTOM MANUAL INVESTIGATION (c-1005) */}
                {msg.type === 'initial-analysis-custom' && (
                  <div className="mt-10 relative border-l-2 border-border ml-5 pl-10 space-y-12 pb-4">
                    <div className="relative">
                      <div className="absolute -left-[61px] top-1 size-10 rounded-full bg-background border-[3px] border-orange-500 text-orange-500 flex items-center justify-center font-black text-lg shadow-sm">1</div>
                      <Card className="bg-background border-border/60 shadow-sm hover:border-orange-500/50 transition-colors">
                        <CardHeader className="py-4 px-5 border-b border-border/40 bg-muted/20 flex flex-row items-center justify-between">
                          <div>
                            <Badge variant="outline" className="mb-2 text-[10px] uppercase tracking-wider text-orange-500 border-orange-500/30 font-bold bg-orange-500/5">Topic: Geolocation Scan</Badge>
                            <CardTitle className="text-lg flex items-center"><MapPin className="size-5 mr-2 text-orange-500" /> Context Acquired</CardTitle>
                          </div>

                          <Button variant="secondary" size="sm" className="h-8 shadow-sm hover:bg-primary hover:text-primary-foreground" onClick={() => handleReferenceStep(1, 'Context Acquired')}>
                            <Reply className="size-4 mr-1.5" /> Ask About This
                          </Button>
                        </CardHeader>
                        <CardContent className="p-5">
                          <p className="text-[15px] text-muted-foreground leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {/* HIDDEN ANOMALIES */}
                {msg.type === 'initial-analysis-hidden' && (
                  <div className="mt-10 relative border-l-2 border-border ml-5 pl-10 space-y-12 pb-4">
                    <div className="relative">
                      <div className="absolute -left-[61px] top-1 size-10 rounded-full bg-background border-[3px] border-emerald-500 text-emerald-500 flex items-center justify-center shadow-sm">
                        <Ghost className="size-5" />
                      </div>
                      <Card className="bg-emerald-500/5 border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.15)] hover:border-emerald-500/60 transition-colors">
                        <CardHeader className="py-4 px-5 border-b border-emerald-500/20 bg-emerald-500/10 flex flex-row items-center justify-between">
                          <div>
                            <Badge className="mb-2 text-[10px] uppercase tracking-wider bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm">Autonomous Detection</Badge>
                            <CardTitle className="text-xl flex items-center text-emerald-500"><Activity className="size-6 mr-2" /> Latent Anomaly Analysis</CardTitle>
                          </div>

                          <Button variant="secondary" size="sm" className="h-8 shadow-sm hover:bg-primary hover:text-primary-foreground" onClick={() => handleReferenceStep(1, 'Latent Anomaly Analysis')}>
                            <Reply className="size-4 mr-1.5" /> Ask About This
                          </Button>
                        </CardHeader>
                        <CardContent className="p-6 space-y-5 text-[15px] leading-relaxed">
                          <p dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>') }} className="leading-relaxed text-muted-foreground text-[15px] whitespace-pre-wrap" />
                          <div className="bg-background p-5 rounded-xl border border-border/80 shadow-sm mt-4">
                            <strong className="text-foreground flex items-center mb-3 text-lg"><CheckCircle2 className="size-5 mr-2 text-emerald-500" /> Automated Mitigation Protocol:</strong>
                            <ul className="list-disc pl-5 space-y-4 text-muted-foreground">
                              <li className="flex flex-col items-start gap-3">
                                <span><strong>Mitigation Action:</strong> Dispatch internal engineering ticket for physical site inspection or parameter tuning based on AI root cause.</span>
                                <Button size="sm" variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/20 h-8 shadow-sm" onClick={() => addToChecklist("Engineering Ticket: Address Latent Anomaly")}>
                                  <ClipboardList className="size-4 mr-2" /> Add to Investigation Checklist
                                </Button>
                              </li>
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}


                {/* COMMON ACTIONS */}
                {msg.type === 'deep-research' && (
                  <div className="mt-6 border border-primary/30 rounded-xl overflow-hidden bg-primary/5 shadow-lg">
                    <div className="bg-primary/20 px-5 py-3 border-b border-primary/30 text-primary font-bold flex items-center text-sm uppercase tracking-wider">
                      <Database className="size-5 mr-2" /> Historical Correlation
                    </div>
                    <div className="p-6 space-y-5">
                      <div className="bg-background p-5 rounded-xl border border-border/80 shadow-sm">
                        <p className="text-[15px] text-muted-foreground leading-relaxed">{msg.content}</p>
                      </div>
                    </div>
                  </div>
                )}

                {msg.type === 'area-analysis' && (
                  <div className="mt-6 border border-blue-500/30 rounded-xl overflow-hidden bg-blue-500/5 shadow-lg">
                    <div className="bg-blue-500/20 px-5 py-3 border-b border-blue-500/30 text-blue-500 font-bold flex items-center text-sm uppercase tracking-wider">
                      <Search className="size-5 mr-2" /> Area Behavior Scan Result
                    </div>
                    <div className="p-6">
                      <p dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>') }} className="leading-relaxed text-muted-foreground text-[15px] whitespace-pre-wrap" />
                    </div>
                  </div>
                )}

                {msg.type === 'time-analysis' && (
                  <div className="mt-6 border border-purple-500/30 rounded-xl overflow-hidden bg-purple-500/5 shadow-lg">
                    <div className="bg-purple-500/20 px-5 py-3 border-b border-purple-500/30 text-purple-500 font-bold flex items-center text-sm uppercase tracking-wider">
                      <Clock className="size-5 mr-2" /> Time Range Deep Dive Analysis
                    </div>
                    <div className="p-6">
                      <p dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>') }} className="leading-relaxed text-muted-foreground text-[15px] whitespace-pre-wrap" />
                    </div>
                  </div>
                )}

                {msg.type === 'translations' && (
                  <div className="mt-8 grid gap-4">
                    <Card className="bg-blue-500/10 border-blue-500/20 shadow-md">
                      <CardHeader className="py-4 px-5 border-b border-blue-500/20">
                        <CardTitle className="text-base flex items-center text-blue-500">
                          <Globe className="size-5 mr-2" /> English (Simple)
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="py-4 px-5 text-[15px] text-blue-100/90 font-medium leading-relaxed">
                        "We are experiencing a temporary network issue in your area. Services will recover shortly. We apologize for the inconvenience."
                      </CardContent>
                      <div className="bg-blue-500/5 px-5 py-3 flex justify-end">
                        <Button size="sm" variant="outline" className="text-sm bg-background/50 border-blue-500/30 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300" onClick={() => setDialogData({ lang: 'English', text: '"We are experiencing a temporary network issue in your area. Services will recover shortly. We apologize for the inconvenience."' })}>
                          <Send className="size-3.5 mr-2" /> Send to User
                        </Button>
                      </div>
                    </Card>
                    <Card className="bg-emerald-500/10 border-emerald-500/20 shadow-md">
                      <CardHeader className="py-4 px-5 border-b border-emerald-500/20">
                        <CardTitle className="text-base flex items-center text-emerald-500">
                          <Globe className="size-5 mr-2" /> Sinhala
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="py-4 px-5 text-[15px] text-emerald-100/90 font-medium leading-relaxed">
                        "ඔබගේ ප්‍රදේශයේ ජාලයේ තාවකාලික දෝෂයක් පවතී. සේවා ඉක්මනින් යථා තත්ත්වයට පත්වනු ඇත. සිදුවූ අපහසුතාවයට කනගාටු වෙමු."
                      </CardContent>
                      <div className="bg-emerald-500/5 px-5 py-3 flex justify-end">
                        <Button size="sm" variant="outline" className="text-sm bg-background/50 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300" onClick={() => setDialogData({ lang: 'Sinhala', text: '"ඔබගේ ප්‍රදේශයේ ජාලයේ තාවකාලික දෝෂයක් පවතී. සේවා ඉක්මනින් යථා තත්ත්වයට පත්වනු ඇත. සිදුවූ අපහසුතාවයට කනගාටු වෙමු."' })}>
                          <Send className="size-3.5 mr-2" /> Send to User
                        </Button>
                      </div>
                    </Card>
                    <Card className="bg-purple-500/10 border-purple-500/20 shadow-md">
                      <CardHeader className="py-4 px-5 border-b border-purple-500/20">
                        <CardTitle className="text-base flex items-center text-purple-500">
                          <Globe className="size-5 mr-2" /> Tamil
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="py-4 px-5 text-[15px] text-purple-100/90 font-medium leading-relaxed">
                        "உங்கள் பகுதியில் தற்காலிக பிணைய கோளாறு உள்ளது. சேவைகள் விரைவில் சீரடையும். சிரமத்திற்கு வருந்துகிறோம்."
                      </CardContent>
                      <div className="bg-purple-500/5 px-5 py-3 flex justify-end">
                        <Button size="sm" variant="outline" className="text-sm bg-background/50 border-purple-500/30 text-purple-400 hover:bg-purple-500/20 hover:text-purple-300" onClick={() => setDialogData({ lang: 'Tamil', text: '"உங்கள் பகுதியில் தற்காலிக பிணைய கோளாறு உள்ளது. சேவைகள் விரைவில் சீரடையும். சிரமத்திற்கு வருந்துகிறோம்."' })}>
                          <Send className="size-3.5 mr-2" /> Send to User
                        </Button>
                      </div>
                    </Card>
                  </div>
                )}
                
                <div className="mt-8 flex items-center gap-4 text-muted-foreground text-[13px] border-t border-border/20 pt-4 pb-2">
                  <Badge variant="outline" className="bg-white/5 rounded-full border-white/10 hover:bg-white/10 text-white cursor-pointer px-3 py-1 flex items-center gap-2">
                     <div className="flex -space-x-1">
                       <img src="/Bot.png" className="size-3.5" />
                       <img src="/Bot.png" className="size-3.5 opacity-50" />
                     </div>
                     16 sources
                  </Badge>
                  <Button variant="ghost" size="icon" className="size-7 hover:bg-white/10 rounded-md text-muted-foreground hover:text-white"><ClipboardList className="size-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="size-7 hover:bg-white/10 rounded-md text-muted-foreground hover:text-white"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg></Button>
                  <Button variant="ghost" size="icon" className="size-7 hover:bg-white/10 rounded-md text-muted-foreground hover:text-white"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg></Button>
                  <Button variant="ghost" size="icon" className="size-7 hover:bg-white/10 rounded-md text-muted-foreground hover:text-white"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"></path></svg></Button>
                  <Button variant="ghost" size="icon" className="size-7 hover:bg-white/10 rounded-md text-muted-foreground hover:text-white"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg></Button>
                  <Button variant="ghost" size="icon" className="size-7 hover:bg-white/10 rounded-md text-muted-foreground hover:text-white"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg></Button>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="text-[14px] text-muted-foreground hover:text-white cursor-pointer flex items-center transition-colors">
                     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 opacity-60"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v3.5"/></svg>
                     What ML methods work for hourly anomaly detection with monthly history
                  </div>
                  <div className="text-[14px] text-muted-foreground hover:text-white cursor-pointer flex items-center transition-colors">
                     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 opacity-60"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v3.5"/></svg>
                     Is this data sufficient for anomaly detection
                  </div>
                  <div className="text-[14px] text-muted-foreground hover:text-white cursor-pointer flex items-center transition-colors">
                     <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 opacity-60"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v3.5"/></svg>
                     How to implement these models
                  </div>
                </div>

              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex flex-col gap-2 max-w-[80%] mr-auto">
            <div className="flex items-center gap-2 mb-1 pl-1">
              <div className="size-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shadow-md overflow-hidden animate-spin">
                <img src="/Bot.png" alt="Bot" className="size-full object-contain p-1" />
              </div>
              <span className="text-sm font-bold text-foreground">TeleQ Bot Specialist</span>
            </div>
            <div className="bg-card border shadow-md p-5 rounded-2xl rounded-tl-sm w-32 space-y-3 ml-11">
              <div className="flex gap-1.5 items-center justify-center h-4">
                <span className="size-2.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="size-2.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="size-2.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="absolute z-[999] bottom-0 left-0 w-full h-40 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
      <div className="absolute z-[999] bottom-8 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4">
        <div className="w-full bg-[#1A1A1A] border border-white/5 rounded-[32px] p-3 shadow-2xl flex flex-col gap-1 transition-all focus-within:ring-1 focus-within:ring-white/10">
          
          <div className="flex items-center px-2 pt-1 h-[32px]">
            {reference && (
              <div className="bg-[#2D2D2D] border border-white/5 rounded-xl py-1.5 px-3 flex items-center shadow-sm w-fit transition-colors hover:bg-[#333333] cursor-pointer">
                 <img src="/Bot.png" className="size-3.5 mr-2" alt="bot" />
                 <span className="text-[13px] font-medium text-foreground/90">{reference}</span>
                 <X className="size-3.5 ml-3 text-muted-foreground hover:text-white transition-colors" onClick={(e) => { e.stopPropagation(); setReference(null); }} />
              </div>
            )}
          </div>

          <div className="flex items-center px-1">
            <button className="text-muted-foreground hover:text-white transition-colors p-1 shrink-0">
               <PlusCircle className="size-[22px]" strokeWidth={2} />
            </button>
            <Input
              ref={inputRef}
              placeholder="Ask anything"
              className="border-none bg-transparent shadow-none focus-visible:ring-0 text-[15px] px-3 flex-1 h-11 text-white placeholder:text-muted-foreground/60"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <div className="bg-white rounded-full flex items-center justify-center size-[34px] shadow-sm overflow-hidden mr-1 shrink-0">
              <img src="/Bot.png" className="size-full object-contain p-1" />
            </div>
          </div>
          
          <div className="flex items-center justify-end px-2 pb-1">
            <div className="flex items-center gap-1.5">
              <Button variant="ghost" size="sm" className="text-muted-foreground/80 text-[13px] font-medium rounded-full h-8 hover:bg-white/5 hover:text-white px-3 transition-colors" onClick={() => handleSendMessage("Generate User Feedback SMS")}>
                Fast <ChevronRight className="size-3.5 ml-1 rotate-90 opacity-70" />
              </Button>
              <Button variant="ghost" size="icon" className="size-8 rounded-full text-muted-foreground/80 hover:text-white hover:bg-white/5 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
              </Button>
              <Button size="icon" className="size-[34px] rounded-full bg-primary hover:bg-primary/90 text-primary-foreground ml-1 shadow-md transition-all disabled:opacity-50" onClick={() => handleSendMessage()} disabled={!chatInput.trim() || isTyping}>
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AgentDashboard() {
  const [chatInput, setChatInput] = useState("");
  const [reference, setReference] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([
    { role: 'ai', content: 'Hello! I am the TeleQ Bot Operations agent. You can ask me to analyze any of the high-level network statistics on this dashboard.', options: ["Show failing sectors", "Analyze Microwave links", "Compare with last week"] }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSendMessage = (textOverride?: string) => {
    const userMsg = textOverride || chatInput;
    if (!userMsg.trim() && !reference && !textOverride) return;
    
    const fullMsg = reference && !textOverride ? `[Ref: ${reference}] ${userMsg}` : userMsg;
    setMessages(prev => [...prev, { role: 'user', content: fullMsg }]);
    if (!textOverride) {
      setChatInput("");
      setReference(null);
    }
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let replyMsg: any = { role: 'ai', content: "I've analyzed the network health. The overall stability score is 92%, but there are emerging anomalies.", options: ["Show top failing sectors", "Analyze Microwave links"] };
      
      if (fullMsg.toLowerCase().includes("failing sectors") || fullMsg.toLowerCase().includes("sectors")) {
         replyMsg.content = "Here are the top 3 worst performing sectors across the island right now based on RRC connection drops:";
         replyMsg.table = {
           headers: ["Sector ID", "Location", "Drop Rate", "Trend"],
           rows: [
             ["CMB-004-A", "Colombo 4", "12.4%", "🔴 Worsening"],
             ["KND-012-C", "Kandy Town", "9.8%", "🟡 Stable"],
             ["GAL-009-B", "Galle Fort", "8.1%", "🟢 Improving"]
           ]
         };
         replyMsg.options = ["Investigate CMB-004-A", "Show active alarms"];
      } else if (fullMsg.toLowerCase().includes("investigate cmb")) {
         replyMsg.content = "Deep scan initiated for **CMB-004-A**.\n\nPrimary issue detected: **VSWR alarm active on Antenna Port 1**. The hardware is likely degraded or experiencing water ingress due to recent rain.\n\nRecommended actions:";
         replyMsg.options = ["Create Field Ticket", "Mute Alarm temporarily"];
      } else if (fullMsg.includes("Problem Frequency")) {
        replyMsg.content = "The highest frequency anomaly detected by the AI this week is **Hardware (VSWR/Cable)** issues, constituting nearly 30% of all alerts. This indicates a physical degradation pattern that manual teams are currently addressing.";
        replyMsg.options = ["Show VSWR trends", "List affected sites"];
      } else if (fullMsg.includes("Most Affected Areas")) {
        replyMsg.content = "Kandy City Center has triggered **145 AI-based congestion warnings** this week, primarily due to intermittent hardware failure. I recommend prioritizing Field Rigging dispatches to this region.";
        replyMsg.options = ["Generate dispatch report"];
      } else if (fullMsg.toLowerCase().includes("create field ticket")) {
        replyMsg.content = "✅ **Field Ticket #TKT-8992** has been automatically generated and dispatched to the Colombo Regional Maintenance Team. They will inspect the VSWR issue on Port 1 at CMB-004-A.";
        replyMsg.options = ["View Ticket Status"];
      }
      
      setMessages(prev => [...prev, replyMsg]);
    }, 1500);
  };

  const askAbout = (topic: string) => {
    setReference(topic);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const chartData = [
    { day: "Mon", ai: 120, manual: 45 },
    { day: "Tue", ai: 132, manual: 50 },
    { day: "Wed", ai: 180, manual: 40 },
    { day: "Thu", ai: 150, manual: 55 },
    { day: "Fri", ai: 190, manual: 35 },
    { day: "Sat", ai: 140, manual: 20 },
    { day: "Sun", ai: 110, manual: 15 },
  ];

  const frequencyData = [
    { name: 'Hardware (VSWR/Cable)', count: 420 },
    { name: 'Power/Grid Failure', count: 380 },
    { name: 'Microwave Backhaul', count: 215 },
    { name: 'Core/HSS Network', count: 180 },
    { name: 'External Interference', count: 95 },
  ];

  const areaData = [
    { name: 'Kandy City Center', issues: 145 },
    { name: 'Gampola South', issues: 98 },
    { name: 'Peradeniya Uni', issues: 85 },
    { name: 'Nuwara Eliya Town', issues: 72 },
    { name: 'Katugastota', issues: 41 },
  ];

  return (
    <div className="flex h-full bg-muted/10 w-full relative">
      <div className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Agent Operations Dashboard</h1>
        <p className="text-muted-foreground mb-8">Performance overview of the TeleQ Bot Network Assistant.</p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card className="relative group overflow-hidden border-border/80 shadow-sm hover:border-primary/50 transition-colors bg-background">
            <CardContent className="p-6">
              <div className="text-muted-foreground font-semibold mb-1 text-sm uppercase tracking-wider">Anomalies Auto-Diagnosed</div>
              <div className="text-4xl font-black text-primary">1,420</div>
            </CardContent>
            <Button variant="secondary" size="sm" className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-primary/10 text-primary hover:bg-primary/20" onClick={() => askAbout('Auto-Diagnosed Anomalies')}>
              <Reply className="size-4 mr-1.5" /> Ask AI
            </Button>
          </Card>
          <Card className="relative group overflow-hidden border-border/80 shadow-sm hover:border-emerald-500/50 transition-colors bg-background">
            <CardContent className="p-6">
              <div className="text-muted-foreground font-semibold mb-1 text-sm uppercase tracking-wider">MTTR Reduction</div>
              <div className="text-4xl font-black text-emerald-500">-65%</div>
            </CardContent>
            <Button variant="secondary" size="sm" className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20" onClick={() => askAbout('MTTR Reduction')}>
              <Reply className="size-4 mr-1.5" /> Ask AI
            </Button>
          </Card>
          <Card className="relative group overflow-hidden border-border/80 shadow-sm hover:border-blue-500/50 transition-colors bg-background">
            <CardContent className="p-6">
              <div className="text-muted-foreground font-semibold mb-1 text-sm uppercase tracking-wider">Notifications Sent</div>
              <div className="text-4xl font-black text-blue-500">24,592</div>
            </CardContent>
            <Button variant="secondary" size="sm" className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-500/10 text-blue-500 hover:bg-blue-500/20" onClick={() => askAbout('Customer Notifications')}>
              <Reply className="size-4 mr-1.5" /> Ask AI
            </Button>
          </Card>
          <Card className="relative group overflow-hidden border-border/80 shadow-sm hover:border-purple-500/50 transition-colors bg-background">
            <CardContent className="p-6">
              <div className="text-muted-foreground font-semibold mb-1 text-sm uppercase tracking-wider">Diagnostic Accuracy</div>
              <div className="text-4xl font-black text-purple-500">97.4%</div>
            </CardContent>
            <Button variant="secondary" size="sm" className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-purple-500/10 text-purple-500 hover:bg-purple-500/20" onClick={() => askAbout('Diagnostic Accuracy')}>
              <Reply className="size-4 mr-1.5" /> Ask AI
            </Button>
          </Card>
        </div>

        <Card className="relative group border-border/80 shadow-sm hover:border-primary/30 transition-colors bg-background">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 bg-muted/20 pb-4">
            <CardTitle className="text-lg">Cases Resolved: AI vs Manual</CardTitle>
            <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity border-primary/30 text-primary" onClick={() => askAbout('AI vs Manual Workload Chart')}>
              <Reply className="size-4 mr-1.5" /> Ask AI to Analyze Chart
            </Button>
          </CardHeader>
          <CardContent className="h-[300px] p-5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)' }} dx={-10} />
                <RechartsTooltip contentStyle={{ backgroundColor: 'var(--background)', borderRadius: '8px', border: '1px solid var(--border)' }} cursor={{ fill: 'var(--muted)' }} />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="ai" name="AI Analyzed Tickets" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={30} />
                <Bar dataKey="manual" name="Manual Engineering" fill="#64748b" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4 mt-8 pb-8">
          <Card className="relative group border-border/80 shadow-sm hover:border-primary/30 transition-colors bg-background">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 bg-muted/20 pb-4">
              <CardTitle className="text-lg text-foreground flex items-center"><Activity className="size-5 mr-2 text-primary" /> AI Diagnosed Problem Types</CardTitle>
              <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity border-primary/30 text-primary" onClick={() => askAbout('Problem Frequency')}>
                <Reply className="size-4 mr-1.5" /> Ask AI
              </Button>
            </CardHeader>
            <CardContent className="h-[280px] p-5">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={frequencyData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)' }} />
                  <YAxis dataKey="name" type="category" width={150} axisLine={false} tickLine={false} tick={{ fill: 'var(--foreground)', fontSize: 12 }} />
                  <RechartsTooltip contentStyle={{ backgroundColor: 'var(--background)', borderRadius: '8px', border: '1px solid var(--border)' }} cursor={{ fill: 'var(--muted)' }} />
                  <Bar dataKey="count" name="Incidents" fill="var(--primary)" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="relative group border-border/80 shadow-sm hover:border-primary/30 transition-colors bg-background">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 bg-muted/20 pb-4">
              <CardTitle className="text-lg text-foreground flex items-center"><MapPin className="size-5 mr-2 text-primary" /> Most Affected Regions</CardTitle>
              <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity border-primary/30 text-primary" onClick={() => askAbout('Most Affected Areas')}>
                <Reply className="size-4 mr-1.5" /> Ask AI
              </Button>
            </CardHeader>
            <CardContent className="h-[280px] p-0 overflow-y-auto">
              <div className="divide-y divide-border/50">
                {areaData.map((area, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold text-sm shadow-sm border border-orange-500/20">{idx + 1}</div>
                      <span className="font-semibold text-[15px]">{area.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">{area.issues} AI Alerts</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="w-[350px] border-l border-border bg-background flex flex-col shrink-0 shadow-[-10px_0_30px_rgba(0,0,0,0.05)] z-10 relative">
        <div className="h-16 border-b border-border/50 flex items-center px-5 font-bold shrink-0 bg-muted/10 text-[15px]">
          <img src="/Bot.png" alt="Bot" className="h-6 object-contain mr-2" /> Global Analytics Assistant
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-5" ref={scrollRef}>
          {messages.map((m, i) => (
            <div key={i} className={`flex flex-col gap-2 ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`p-4 rounded-2xl text-[14px] leading-relaxed max-w-[95%] shadow-sm ${m.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted/50 border border-border/50 text-foreground rounded-tl-sm'}`}>
                <div dangerouslySetInnerHTML={{ __html: m.content.replace(/\n/g, '<br/>') }} />
                {m.table && (
                  <div className="mt-4 rounded-xl border border-border/80 bg-background overflow-hidden shadow-sm">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-muted/50 border-b border-border/50">
                        <tr>
                          {m.table.headers.map((h:any, hi:any) => <th key={hi} className="p-3 text-foreground font-semibold">{h}</th>)}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {m.table.rows.map((row:any, ri:any) => (
                          <tr key={ri} className="hover:bg-muted/20">
                            {row.map((cell:any, ci:any) => <td key={ci} className="p-3 text-muted-foreground">{cell}</td>)}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {m.options && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {m.options.map((opt:any, oi:any) => (
                      <button key={oi} className="bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/20 text-[11px] px-3 py-1.5 rounded-full transition-colors font-semibold text-left shadow-sm" onClick={() => handleSendMessage(opt)}>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="bg-muted/50 border border-border/50 p-4 rounded-2xl rounded-tl-sm w-20 shadow-sm flex items-center justify-center">
              <div className="flex gap-1.5">
                <span className="size-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="size-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="size-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>
        <div className="p-4 border-t border-border/50 bg-muted/10 shrink-0">
          {reference && (
            <div className="mb-3 flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary w-max px-3 py-1.5 rounded-full text-xs shadow-sm">
              <img src="/Bot.png" className="size-4" alt="bot" />
              <span className="font-semibold">{reference}</span>
              <button onClick={() => setReference(null)} className="ml-1 hover:text-foreground hover:bg-background/50 rounded-full p-0.5 transition-colors">
                <X className="size-3.5" />
              </button>
            </div>
          )}
          <div className="relative">
            <Input
              ref={inputRef}
              placeholder="Ask about dashboard metrics..."
              className="pr-10 bg-background border-border/80 shadow-sm h-11"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
            />
            <Button size="icon" variant="ghost" className="absolute right-1 top-1 size-9 text-primary hover:bg-primary/10 hover:text-primary rounded-lg" onClick={() => handleSendMessage()}>
              <Send className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function DraggableMarker({ position, setPosition }: { position: [number, number], setPosition: (pos: [number, number]) => void }) {
  const map = useMap();
  useEffect(() => {
    map.setView(position, map.getZoom());
  }, [position, map]);

  return (
    <Marker
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const pos = marker.getLatLng();
          setPosition([pos.lat, pos.lng]);
        },
      }}
      position={position}
    >
      <Popup>User Location</Popup>
    </Marker>
  )
}

const SRI_LANKA_LOCATIONS = [
  { name: 'Colombo City Center', lat: 6.9271, lng: 79.8612 },
  { name: 'Kandy City Center', lat: 7.2906, lng: 80.6337 },
  { name: 'Gampola South', lat: 7.1627, lng: 80.5656 },
  { name: 'Peradeniya University', lat: 7.2612, lng: 80.5983 },
  { name: 'Nuwara Eliya Town', lat: 6.9497, lng: 80.7828 },
  { name: 'Katugastota', lat: 7.3235, lng: 80.6136 },
  { name: 'Kurunegala', lat: 7.4818, lng: 80.3609 },
  { name: 'Galle Fort', lat: 6.0271, lng: 80.2138 },
  { name: 'Jaffna', lat: 9.6615, lng: 80.0255 },
];

function NewInvestigation() {
  const [position, setPosition] = useState<[number, number]>([7.2906, 80.6337]); // Kandy default
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCells, setSelectedCells] = useState<string[]>([]);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const navigate = useNavigate();

  const filteredLocations = SRI_LANKA_LOCATIONS.filter(loc => loc.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleSearch = () => {
    const loc = SRI_LANKA_LOCATIONS.find(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()));
    if (loc) {
      setPosition([loc.lat, loc.lng]);
      setSearchQuery(loc.name);
      setShowSuggestions(false);
    } else {
      setPosition([7.8731, 80.7718]); // SL center
    }
  };

  const handleSelectLocation = (loc: any) => {
    setSearchQuery(loc.name);
    setPosition([loc.lat, loc.lng]);
    setShowSuggestions(false);
  };

  const nearbyCells = [
    { id: 'Cell-Local_G1', lat: position[0] + 0.005, lng: position[1] + 0.005, band: 'LTE Band 3' },
    { id: 'Cell-Local_G2', lat: position[0] - 0.004, lng: position[1] + 0.002, band: 'LTE Band 1' },
    { id: 'Cell-Local_G3', lat: position[0] + 0.002, lng: position[1] - 0.006, band: '3G 2100MHz' },
  ];

  return (
    <div className="absolute inset-0 flex p-6 gap-6 bg-muted/10">
      <div className="w-[480px] h-full shrink-0 overflow-y-auto pr-3 pb-12 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent space-y-6 block">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">New Manual Investigation</h1>
          <p className="text-muted-foreground">Start a fresh AI diagnostic session by dropping a pin and attaching user reports.</p>
        </div>

        <Card className="bg-background shadow-sm border-border/80 relative z-50 overflow-visible">
          <CardHeader className="pb-3 border-b border-border/40 bg-muted/20">
            <CardTitle className="text-lg">Location Context (Sri Lanka)</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4 relative">
            <div className="flex gap-2 relative">
              <Input
                placeholder="Search location (e.g. Kandy, Colombo)..."
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setShowSuggestions(false)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
              />
              <Button variant="secondary" onClick={handleSearch}><Search className="size-4" /></Button>

              {showSuggestions && searchQuery.length > 0 && filteredLocations.length > 0 && (
                <div className="absolute top-12 left-0 w-[calc(100%-3rem)] bg-background border border-border shadow-xl rounded-lg z-[999] max-h-48 overflow-y-auto">
                  {filteredLocations.map((loc, idx) => (
                    <div
                      key={idx}
                      className="px-4 py-2 hover:bg-muted/50 cursor-pointer text-sm flex items-center text-foreground transition-colors"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelectLocation(loc);
                      }}
                    >
                      <MapPin className="size-3.5 mr-2 text-primary opacity-70" />
                      {loc.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Drag the blue pin on the map to fine-tune the user's exact coordinates.</p>
            <div className="grid grid-cols-2 gap-2 text-sm bg-muted/30 p-3 rounded-lg border border-border/50">
              <div><span className="text-muted-foreground">Lat:</span> {position[0].toFixed(4)}</div>
              <div><span className="text-muted-foreground">Lng:</span> {position[1].toFixed(4)}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background shadow-sm border-border/80">
          <CardHeader className="pb-3 border-b border-border/40 bg-muted/20">
            <CardTitle className="text-lg">Nearby Cell References</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-3">Select adjacent cell towers to include in the AI's telemetry scan context.</p>
            <div className="space-y-3">
              {nearbyCells.map(cell => (
                <div
                  key={cell.id}
                  className={`flex items-center gap-4 p-3 rounded-xl border ${selectedCells.includes(cell.id) ? 'border-primary/50 bg-primary/10 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'border-border/50 hover:bg-muted/40'} cursor-pointer transition-all duration-200`}
                  onClick={() => {
                    setSelectedCells(prev => prev.includes(cell.id) ? prev.filter(c => c !== cell.id) : [...prev, cell.id]);
                  }}
                >
                  <div className={`size-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${selectedCells.includes(cell.id) ? 'bg-primary border-primary' : 'border-muted-foreground/50 bg-background'}`}>
                    {selectedCells.includes(cell.id) && <div className="size-2.5 bg-primary-foreground rounded-sm shadow-sm" />}
                  </div>
                  <div className="flex-1 flex justify-between items-center">
                    <span className="font-semibold text-sm text-foreground">{cell.id}</span>
                    <Badge variant={selectedCells.includes(cell.id) ? "default" : "secondary"}>{cell.band}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className={`bg-background shadow-sm border-border/80 border-dashed border-2 transition-colors cursor-pointer group relative overflow-hidden ${screenshot ? 'border-primary/50' : 'hover:border-primary/50'}`}>
          {screenshot && (
            <img src={screenshot} alt="Screenshot preview" className="w-full h-full object-cover absolute inset-0 opacity-20" />
          )}
          <CardContent className="p-8 flex flex-col items-center justify-center text-center relative z-10 h-[200px]">
            {screenshot ? (
              <div className="bg-background/90 backdrop-blur-sm px-6 py-4 rounded-xl border border-border/50 flex flex-col items-center shadow-xl pointer-events-none">
                <CheckCircle2 className="size-8 text-emerald-500 mb-2" />
                <div className="font-semibold text-sm text-foreground">Screenshot Attached</div>
                <div className="text-xs text-muted-foreground mt-1">Click to replace image</div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center pointer-events-none">
                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <ImageIcon className="size-6 text-primary" />
                </div>
                <div className="font-semibold mb-1">Attach User Screenshots</div>
                <p className="text-xs text-muted-foreground">Upload NetMonster or Network Cell Info Lite screenshots for visual AI parsing.</p>
              </div>
            )}
            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-20" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setScreenshot(URL.createObjectURL(file));
            }} />
          </CardContent>
        </Card>

        <Button size="lg" className="w-full text-md h-12 shadow-md mt-4" onClick={() => navigate('/chat/c-1005', { state: { selectedCells } })}>
          <img src="/Bot.png" alt="Bot" className="size-6 object-contain mr-2" /> Start AI Investigation
        </Button>
      </div>

      <div className="flex-1 rounded-2xl overflow-hidden border border-border/80 shadow-inner relative z-0 h-full">
        <div className="absolute top-4 right-4 z-[400] bg-background/90 backdrop-blur border border-border p-3 rounded-lg shadow-lg w-[200px]">
          <div className="text-xs font-semibold mb-2">Map Legend</div>
          <div className="flex items-center gap-2 text-xs mb-1"><div className="size-3 bg-blue-500 rounded-full" /> User Dropped Pin</div>
          <div className="flex items-center gap-2 text-xs"><div className="size-3 border-2 border-red-500 rounded-full bg-red-500/20" /> Reference Cells</div>
        </div>
        <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png?key=cb1_420a_1_1e09ee8bb5664db11bbad781"
          />
          <DraggableMarker position={position} setPosition={setPosition} />
          {nearbyCells.map(cell => (
            <Marker
              key={cell.id}
              position={[cell.lat, cell.lng]}
              eventHandlers={{
                click: () => {
                  setSelectedCells(prev => prev.includes(cell.id) ? prev.filter(c => c !== cell.id) : [...prev, cell.id]);
                }
              }}
              icon={L.divIcon({
                className: 'bg-transparent',
                html: `<div class="size-4 border-2 ${selectedCells.includes(cell.id) ? 'border-primary bg-primary/50 shadow-[0_0_15px_rgba(59,130,246,0.8)]' : 'border-red-500 bg-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.5)]'} rounded-full transition-colors duration-300"></div>`
              })}
            >
              <Popup>{cell.id} - {cell.band} {selectedCells.includes(cell.id) ? '(Selected)' : ''}</Popup>
            </Marker>
          ))}
          <Circle center={position} radius={800} pathOptions={{ color: 'var(--primary)', fillColor: 'var(--primary)', fillOpacity: 0.1, weight: 1, dashArray: '4 4' }} />
        </MapContainer>
      </div>
    </div>
  )
}

function HiddenProblems() {
  const [searchQuery, setSearchQuery] = useState("");
  const [timeframe, setTimeframe] = useState("all");
  const navigate = useNavigate();

  const filtered = HIDDEN_PROBLEMS.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTime = timeframe === "all" || p.timeFrame === timeframe;
    return matchesSearch && matchesTime;
  });

  return (
    <div className="flex flex-col h-full bg-background p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto w-full space-y-6 pb-20">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center"><Ghost className="size-8 mr-3 text-primary" /> Hidden Problem Detection</h1>
          <p className="text-muted-foreground text-lg">AI autonomously identifying latent network issues before users complain. Categorized by short and long-term historical trends.</p>
        </div>

        <div className="flex gap-4 items-center mb-6 mt-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
            <Input
              placeholder="Search hidden anomalies by title, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 bg-muted/20 text-lg rounded-xl border-border/80"
            />
          </div>
          <div className="flex bg-muted/30 p-1.5 rounded-xl border border-border/50 h-14 items-center">
            {['all', 'weekly', 'monthly', 'yearly'].map(t => (
              <Button
                key={t}
                variant={timeframe === t ? "secondary" : "ghost"}
                size="lg"
                className={`capitalize rounded-lg ${timeframe === t ? 'shadow-sm bg-background font-bold text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setTimeframe(t)}
              >
                {t}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          {filtered.map(prob => (
            <Card key={prob.id} className="bg-background shadow-sm border-border/80 hover:border-primary/50 transition-colors cursor-pointer group" onClick={() => navigate(`/chat/${prob.id}`)}>
              <CardContent className="p-6 flex items-start gap-6">
                <div className={`size-14 rounded-full shrink-0 flex items-center justify-center ${prob.severity === 'Critical' ? 'bg-red-500/10 text-red-500' : prob.severity === 'High' ? 'bg-orange-500/10 text-orange-500' : 'bg-blue-500/10 text-blue-500'}`}>
                  <Ghost className="size-6" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{prob.title}</h3>
                      <div className="flex items-center text-sm text-muted-foreground mt-1.5 gap-4">
                        <span className="flex items-center"><MapPin className="size-3.5 mr-1 text-primary/70" /> {prob.location}</span>
                        <span className="flex items-center"><Clock className="size-3.5 mr-1 text-primary/70" /> Detected {prob.detected}</span>
                        <Badge variant="outline" className="capitalize bg-muted/30 border-primary/30 text-primary">{prob.timeFrame} Trend</Badge>
                      </div>
                    </div>
                    <Badge variant={prob.severity === 'Critical' ? 'destructive' : prob.severity === 'High' ? 'default' : 'secondary'} className="shadow-sm text-sm px-3 py-0.5">{prob.severity}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                    {prob.description}
                  </p>
                </div>
                <div className="shrink-0 flex items-center self-center text-muted-foreground group-hover:text-primary transition-colors">
                  <Button variant="ghost" size="icon" className="rounded-full size-10">
                    <ChevronRight className="size-6" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-24 text-muted-foreground border-2 border-dashed border-border/50 rounded-2xl">
              <Ghost className="size-12 mx-auto mb-4 opacity-20" />
              <div className="text-lg">No hidden anomalies found matching your criteria.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="h-full flex flex-col">
      <header className="h-24 border-b border-border/50 bg-background flex flex-col justify-center px-8 shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-50" />
        <h1 className="text-3xl font-black tracking-tight flex items-center relative z-10">
          <Settings className="size-8 mr-3 text-primary" />
          AI System Settings
        </h1>
        <p className="text-muted-foreground mt-1 text-[15px] relative z-10">Manage autonomous behavior, integration keys, and global thresholds.</p>
      </header>
      <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-muted/10">

        <Card className="border-border/80 shadow-sm max-w-4xl mx-auto">
          <CardHeader className="bg-muted/30 border-b border-border/40">
            <CardTitle className="flex items-center text-lg"><Cpu className="size-5 mr-2 text-primary" /> Autonomous Action Level</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl border border-primary/30 bg-primary/5">
              <div>
                <h4 className="font-bold">Semi-Autonomous (Current)</h4>
                <p className="text-sm text-muted-foreground">AI recommends actions and writes scripts, but requires human approval to execute.</p>
              </div>
              <Button variant="outline" className="border-primary/50 text-primary">Active</Button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-border/80 transition-colors">
              <div>
                <h4 className="font-bold text-muted-foreground">Fully Autonomous</h4>
                <p className="text-sm text-muted-foreground">AI can execute parameter tuning and reboot sequences without human intervention.</p>
              </div>
              <Button variant="ghost">Select</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm max-w-4xl mx-auto">
          <CardHeader className="bg-muted/30 border-b border-border/40">
            <CardTitle className="flex items-center text-lg"><Ghost className="size-5 mr-2 text-emerald-500" /> Latent Anomaly Detection</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-bold">Sensitivity Threshold</label>
                <span className="text-sm text-muted-foreground">High</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-3/4 rounded-full" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Higher sensitivity will flag smaller deviations in historical patterns as anomalies.</p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold">Automated Root Cause Triage</h4>
                <p className="text-sm text-muted-foreground">Automatically run full RF and Core diagnostics when a latent anomaly is found.</p>
              </div>
              <div className="w-10 h-6 bg-emerald-500 rounded-full relative shadow-inner">
                <div className="absolute right-1 top-1 size-4 bg-white rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}



export default function App() {
  const [checklists, setChecklists] = useState<string[]>([]);
  
  return (
    <>
            <BrowserRouter>
        <Layout checklists={checklists} setChecklists={setChecklists}>
          <Routes>
            <Route path="/" element={<RecentProblemsList />} />
            <Route path="/new" element={<NewInvestigation />} />
            <Route path="/hidden" element={<HiddenProblems />} />
            <Route path="/dashboard" element={<AgentDashboard />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/chat/:id" element={<ProblemChat checklists={checklists} setChecklists={setChecklists} />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </>
  );
}
