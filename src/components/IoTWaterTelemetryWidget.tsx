import React, { useState, useEffect } from 'react';
import { 
  Droplets, 
  Sun, 
  BatteryCharging, 
  Activity, 
  Wifi, 
  CheckCircle2, 
  RefreshCw, 
  MapPin, 
  ShieldCheck, 
  Zap, 
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';

export interface TelemetryStation {
  id: string;
  name: string;
  location: string;
  district: string;
  installedDate: string;
  sarpanchName: string;
  currentTds: number; // in PPM (0-300 is excellent mineral grade)
  baseTds: number;
  dailyFlowLiters: number;
  solarKw: number;
  batteryPct: number;
  signalStrength: 'Strong 4G LTE' | 'Good 4G' | 'LoRaWAN Mesh';
  status: 'Online & Purifying' | 'High Demand Flow' | 'Maintenance Mode';
  hourlyReadings: { time: string; flowRate: number; tds: number; solarYield: number }[];
}

export const TELEMETRY_STATIONS: TelemetryStation[] = [
  {
    id: 'st-bundi-01',
    name: 'Bundi Solar Borewell Alpha-1',
    location: 'Gram Panchayat Badodiya, Bundi',
    district: 'Rajasthan',
    installedDate: 'May 12, 2025',
    sarpanchName: 'Mukesh Gurjar (Sarpanch)',
    currentTds: 42,
    baseTds: 450, // pre-filtration was 450
    dailyFlowLiters: 32450,
    solarKw: 3.4,
    batteryPct: 96,
    signalStrength: 'Strong 4G LTE',
    status: 'Online & Purifying',
    hourlyReadings: [
      { time: '06:00', flowRate: 1200, tds: 41, solarYield: 0.8 },
      { time: '08:00', flowRate: 3400, tds: 42, solarYield: 2.1 },
      { time: '10:00', flowRate: 4800, tds: 43, solarYield: 3.2 },
      { time: '12:00', flowRate: 5600, tds: 42, solarYield: 3.6 },
      { time: '14:00', flowRate: 5100, tds: 41, solarYield: 3.4 },
      { time: '16:00', flowRate: 4200, tds: 42, solarYield: 2.4 },
      { time: '18:00', flowRate: 2900, tds: 43, solarYield: 1.1 },
      { time: '20:00', flowRate: 1500, tds: 42, solarYield: 0.2 },
    ]
  },
  {
    id: 'st-alwar-02',
    name: 'Alwar Rainwater & RO Kiosk-04',
    location: 'Kotputli-Alwar Corridor Hub',
    district: 'Rajasthan',
    installedDate: 'November 20, 2025',
    sarpanchName: 'Sunita Devi (Gram Pradhan)',
    currentTds: 38,
    baseTds: 620,
    dailyFlowLiters: 26800,
    solarKw: 2.8,
    batteryPct: 91,
    signalStrength: 'Good 4G',
    status: 'Online & Purifying',
    hourlyReadings: [
      { time: '06:00', flowRate: 900, tds: 37, solarYield: 0.6 },
      { time: '08:00', flowRate: 2800, tds: 38, solarYield: 1.8 },
      { time: '10:00', flowRate: 4200, tds: 38, solarYield: 2.8 },
      { time: '12:00', flowRate: 4900, tds: 39, solarYield: 3.1 },
      { time: '14:00', flowRate: 4600, tds: 38, solarYield: 2.9 },
      { time: '16:00', flowRate: 3600, tds: 38, solarYield: 2.1 },
      { time: '18:00', flowRate: 2400, tds: 37, solarYield: 0.9 },
      { time: '20:00', flowRate: 1200, tds: 38, solarYield: 0.1 },
    ]
  },
  {
    id: 'st-barmer-03',
    name: 'Barmer Deep Aquifer Desalination Unit',
    location: 'Thar Desert Outpost Cluster 7',
    district: 'Rajasthan',
    installedDate: 'January 14, 2026',
    sarpanchName: 'Rameshwar Lal (Panchayat Head)',
    currentTds: 54,
    baseTds: 1250,
    dailyFlowLiters: 41200,
    solarKw: 4.8,
    batteryPct: 98,
    signalStrength: 'LoRaWAN Mesh',
    status: 'High Demand Flow',
    hourlyReadings: [
      { time: '06:00', flowRate: 1800, tds: 52, solarYield: 1.1 },
      { time: '08:00', flowRate: 4900, tds: 54, solarYield: 2.9 },
      { time: '10:00', flowRate: 6400, tds: 55, solarYield: 4.5 },
      { time: '12:00', flowRate: 7200, tds: 54, solarYield: 5.0 },
      { time: '14:00', flowRate: 6800, tds: 54, solarYield: 4.7 },
      { time: '16:00', flowRate: 5600, tds: 53, solarYield: 3.3 },
      { time: '18:00', flowRate: 3900, tds: 54, solarYield: 1.4 },
      { time: '20:00', flowRate: 2100, tds: 54, solarYield: 0.3 },
    ]
  }
];

export const IoTWaterTelemetryWidget: React.FC = () => {
  const [selectedStationId, setSelectedStationId] = useState<string>('st-bundi-01');
  const [isLiveSimulating, setIsLiveSimulating] = useState<boolean>(true);
  const [lastHeartbeat, setLastHeartbeat] = useState<string>('Just now (10s ago)');
  const [tick, setTick] = useState<number>(0);

  const activeStation = TELEMETRY_STATIONS.find(s => s.id === selectedStationId) || TELEMETRY_STATIONS[0];

  // Subtle live fluctuation to show active IoT uplink telemetry
  useEffect(() => {
    if (!isLiveSimulating) return;
    const interval = setInterval(() => {
      setTick(t => t + 1);
      setLastHeartbeat(`Just now (${new Date().toLocaleTimeString()})`);
    }, 4000);
    return () => clearInterval(interval);
  }, [isLiveSimulating]);

  // Dynamic values with slight live pulse
  const liveTds = Math.max(30, activeStation.currentTds + (tick % 3 === 0 ? 1 : 0) - (tick % 4 === 0 ? 1 : 0));
  const liveFlow = activeStation.dailyFlowLiters + (tick * 12);
  const liveSolar = Number((activeStation.solarKw + (Math.sin(tick) * 0.05)).toFixed(2));

  return (
    <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white rounded-[2rem] p-5 sm:p-6 border border-zinc-800 shadow-xl space-y-5">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shadow-inner">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">
                Live IoT Ground Telemetry
              </span>
              <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>MQTT CONNECTED</span>
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white leading-tight">
              Solar Water Borewell Purity & Flow Telemetry
            </h3>
          </div>
        </div>

        {/* Station Picker */}
        <div className="flex items-center gap-2">
          <select
            value={selectedStationId}
            onChange={(e) => setSelectedStationId(e.target.value)}
            className="bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-xl px-3 py-1.5 text-xs font-bold focus:ring-2 focus:ring-cyan-500 outline-hidden"
          >
            {TELEMETRY_STATIONS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.district})
              </option>
            ))}
          </select>
          <button
            onClick={() => setTick(t => t + 1)}
            className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-zinc-300 hover:text-white border border-zinc-700 transition-colors cursor-pointer"
            title="Poll Sensor"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Station Meta Banner */}
      <div className="bg-zinc-900/90 rounded-2xl p-3.5 border border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <div>
            <span className="font-bold text-zinc-200">{activeStation.location}</span>
            <span className="text-[11px] text-zinc-400 block font-normal">
              Sarpanch: {activeStation.sarpanchName} • Commissioned: {activeStation.installedDate}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-400">
          <div className="flex items-center gap-1 text-cyan-300">
            <Wifi className="w-3.5 h-3.5" />
            <span>{activeStation.signalStrength}</span>
          </div>
          <span>Uplink: {lastHeartbeat}</span>
        </div>
      </div>

      {/* Key Telemetry Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Metric 1: TDS Potability */}
        <div className="bg-zinc-900/80 rounded-2xl p-4 border border-zinc-800 space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
            <span>Water TDS Purity</span>
            <span className="text-emerald-400 font-mono">0-300 Safe</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">
              {liveTds}
            </span>
            <span className="text-xs text-zinc-400 font-semibold">PPM</span>
          </div>
          <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 pt-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>90.7% drop from {activeStation.baseTds} PPM raw</span>
          </div>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full rounded-full" 
              style={{ width: `${Math.min(100, (liveTds / 300) * 100)}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Daily Flow Dispensed */}
        <div className="bg-zinc-900/80 rounded-2xl p-4 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
            <span>24h Water Dispensed</span>
            <Droplets className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-blue-400 font-mono">
              {(liveFlow ?? 0).toLocaleString()}
            </span>
            <span className="text-xs text-zinc-400 font-semibold">Litres</span>
          </div>
          <p className="text-[10px] text-zinc-400 pt-1">
            Avg. 4,200 Litres/hour during daytime peak
          </p>
        </div>

        {/* Metric 3: Solar Generation (kW) */}
        <div className="bg-zinc-900/80 rounded-2xl p-4 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
            <span>Solar Inverter Yield</span>
            <Sun className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
              {liveSolar}
            </span>
            <span className="text-xs text-zinc-400 font-semibold">kW</span>
          </div>
          <div className="text-[10px] text-amber-300 font-medium flex items-center gap-1 pt-1">
            <Zap className="w-3 h-3" />
            <span>100% Zero-Carbon Solar Driven</span>
          </div>
        </div>

        {/* Metric 4: Battery Storage Health */}
        <div className="bg-zinc-900/80 rounded-2xl p-4 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
            <span>LiFePO4 Storage</span>
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
              {activeStation.batteryPct}%
            </span>
            <span className="text-xs text-emerald-400 font-semibold">Healthy</span>
          </div>
          <p className="text-[10px] text-zinc-400 pt-1">
            48h cloudy-day autonomous reserve
          </p>
        </div>
      </div>

      {/* Hourly Flow Chart */}
      <div className="bg-zinc-900/60 rounded-2xl p-4 border border-zinc-800 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="font-extrabold text-zinc-200">
              Real-Time Hourly Potable Water Flow (Litres/Hr)
            </span>
          </div>
          <span className="text-[10px] font-mono text-zinc-400">
            Sensor Model: YF-S201 IoT Hall Flowmeter
          </span>
        </div>

        <div className="h-36 sm:h-44 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={activeStation.hourlyReadings}
              margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="waterFlowGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="time" 
                stroke="#71717a" 
                fontSize={10} 
                tickLine={false} 
              />
              <YAxis 
                stroke="#71717a" 
                fontSize={10} 
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  borderColor: '#3f3f46',
                  borderRadius: '0.75rem',
                  fontSize: '11px',
                  color: '#fff'
                }}
                formatter={(val: any) => [`${(Number(val) || 0).toLocaleString()} Litres/hr`, 'Flow Rate']}
              />
              <Area
                type="monotone"
                dataKey="flowRate"
                stroke="#22d3ee"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#waterFlowGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Compliance & Verification Footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400 pt-1">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-zinc-300">
            WHO Drinking Water Standard & Jal Jeevan Mission Compliant
          </span>
        </div>
        <span className="text-[10px] font-mono text-zinc-500">
          Hardware ID: HW-ESP32-SOLAR-099 • Firmware v2.6.4
        </span>
      </div>
    </div>
  );
};
