import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Navigation, 
  Droplets, 
  GraduationCap, 
  HeartPulse, 
  Utensils, 
  Package, 
  CheckCircle2, 
  ExternalLink, 
  Search, 
  Filter, 
  Layers, 
  Compass, 
  ShieldCheck, 
  Users, 
  Sparkles,
  ArrowRight,
  Radio
} from 'lucide-react';
import { Project } from '../types';

export interface GeospatialNode {
  id: string;
  name: string;
  district: string;
  state: string;
  coordinates: { lat: number; lng: number };
  mapX: number; // percentage on vector SVG map (0 - 100)
  mapY: number; // percentage on vector SVG map (0 - 100)
  category: 'Water' | 'Education' | 'Healthcare' | 'Hunger' | 'Relief';
  status: 'Active 24/7' | 'Under Installation' | 'Completed & Handed Over';
  beneficiariesCount: number;
  establishedDate: string;
  leadCoordinator: string;
  sarpanchEndorsement: string;
  liveMetric: string;
  description: string;
  image: string;
}

export const PAN_INDIA_GEOSPATIAL_NODES: GeospatialNode[] = [
  {
    id: 'geo-ludhiana-01',
    name: 'AABHA Child Education Hub & STEM Center',
    district: 'Ludhiana',
    state: 'Punjab',
    coordinates: { lat: 30.8604, lng: 75.8573 },
    mapX: 34,
    mapY: 23,
    category: 'Education',
    status: 'Active 24/7',
    beneficiariesCount: 1250,
    establishedDate: 'March 2016',
    leadCoordinator: 'Amarjeet Kumar (Founder & Director)',
    sarpanchEndorsement: 'Gill Road Welfare Committee & GNDEC Chapter',
    liveMetric: '450+ Active Students • Daily Evening Sessions',
    description: 'Flagship learning center providing underprivileged children with academic bridge tutoring, school bags, digital tablets, and nutritious evening snacks.',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'geo-ludhiana-02',
    name: 'Green Earth with Bharat & Clean Water Station',
    district: 'Ludhiana',
    state: 'Punjab',
    coordinates: { lat: 30.9010, lng: 75.8573 },
    mapX: 35,
    mapY: 22,
    category: 'Water',
    status: 'Active 24/7',
    beneficiariesCount: 4800,
    establishedDate: 'July 2018',
    leadCoordinator: 'Priya Sharma (Environment Lead)',
    sarpanchEndorsement: 'Ludhiana Green Council',
    liveMetric: '15,000+ Native Saplings • 3 Water Coolers',
    description: 'Large-scale afforestation drive and public clean drinking water station installed near college and community zones.',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'geo-chandigarh-03',
    name: 'HELPS Welfare Society National Registration Secretariat',
    district: 'Chandigarh',
    state: 'Chandigarh (UT)',
    coordinates: { lat: 30.7333, lng: 76.7794 },
    mapX: 37,
    mapY: 21,
    category: 'Relief',
    status: 'Active 24/7',
    beneficiariesCount: 8500,
    establishedDate: 'August 2016',
    leadCoordinator: 'Pooja Rani (Secretariat Incharge)',
    sarpanchEndorsement: 'Societies Registration Act XXI of 1860 Registrar',
    liveMetric: 'Pan-India Operations HQ & Volunteer Registry',
    description: 'Central administrative coordinating center managing government compliance, volunteer enrollments, donor 80G tax exemptions, and relief logistics.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'geo-bundi-04',
    name: 'Bundi Potable Water & Health Outreach',
    district: 'Bundi',
    state: 'Rajasthan',
    coordinates: { lat: 25.4305, lng: 75.6499 },
    mapX: 32,
    mapY: 42,
    category: 'Water',
    status: 'Active 24/7',
    beneficiariesCount: 4200,
    establishedDate: 'May 2021',
    leadCoordinator: 'Priya Sharma (Field Ops)',
    sarpanchEndorsement: 'Shri Mukesh Gurjar, Badodiya Panchayat',
    liveMetric: '42 PPM TDS • 32,450 L/day pumped',
    description: 'Autonomous 3kW solar-powered deep borewell providing clean drinking water to over 800 rural households.',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'geo-patna-05',
    name: 'Patna Slum Nutrition & Education Center',
    district: 'Patna',
    state: 'Bihar',
    coordinates: { lat: 25.5941, lng: 85.1376 },
    mapX: 62,
    mapY: 42,
    category: 'Hunger',
    status: 'Active 24/7',
    beneficiariesCount: 2500,
    establishedDate: 'March 2020',
    leadCoordinator: 'Amitabh Kumar (Nutrition Lead)',
    sarpanchEndorsement: 'Danapur Civic Welfare Board',
    liveMetric: '1,200 Hot Meals Cooked Daily',
    description: 'Centralized hygienic kitchen preparing high-protein fortified mid-day meals for slum clusters.',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'geo-ranchi-06',
    name: 'Ranchi Mobile Healthcare Van & Diagnostic Unit',
    district: 'Ranchi',
    state: 'Jharkhand',
    coordinates: { lat: 23.3441, lng: 85.3096 },
    mapX: 63,
    mapY: 48,
    category: 'Healthcare',
    status: 'Active 24/7',
    beneficiariesCount: 1450,
    establishedDate: 'August 2022',
    leadCoordinator: 'Dr. Arvind Mehta (Medical Van Lead)',
    sarpanchEndorsement: 'Tamar Block Tribal Council',
    liveMetric: '35 Rural Clinics / Month',
    description: 'Fully equipped mobile clinical van with on-board ultrasound, blood testing lab, and maternal health doctor.',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80'
  }
];

interface GeospatialImpactMapProps {
  onSelectProject?: (project: Project) => void;
  onDonateClick?: () => void;
}

export const GeospatialImpactMap: React.FC<GeospatialImpactMapProps> = ({
  onSelectProject,
  onDonateClick
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeNodeId, setActiveNodeId] = useState<string>(PAN_INDIA_GEOSPATIAL_NODES[0].id);

  const filteredNodes = useMemo(() => {
    return PAN_INDIA_GEOSPATIAL_NODES.filter(node => {
      const matchCat = selectedCategory === 'All' || node.category === selectedCategory;
      const matchQuery = !searchQuery || 
        node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.state.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  const activeNode = PAN_INDIA_GEOSPATIAL_NODES.find(n => n.id === activeNodeId) || PAN_INDIA_GEOSPATIAL_NODES[0];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Water': return 'bg-cyan-500 text-white border-cyan-300';
      case 'Education': return 'bg-blue-600 text-white border-blue-300';
      case 'Healthcare': return 'bg-emerald-600 text-white border-emerald-300';
      case 'Hunger': return 'bg-amber-500 text-white border-amber-300';
      default: return 'bg-purple-600 text-white border-purple-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Water': return <Droplets className="w-3.5 h-3.5" />;
      case 'Education': return <GraduationCap className="w-3.5 h-3.5" />;
      case 'Healthcare': return <HeartPulse className="w-3.5 h-3.5" />;
      case 'Hunger': return <Utensils className="w-3.5 h-3.5" />;
      default: return <Package className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-[2rem] p-5 sm:p-6 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center shadow-2xs">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">
                Interactive Geospatial GIS
              </span>
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{PAN_INDIA_GEOSPATIAL_NODES.length} Active Field Clusters</span>
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-gray-900 leading-tight">
              Live Field Deployments & Project Map
            </h3>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search district, village..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-hidden"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {['All', 'Water', 'Education', 'Healthcare', 'Hunger', 'Relief'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === cat
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat !== 'All' && getCategoryIcon(cat)}
            <span>{cat}</span>
          </button>
        ))}
      </div>

      {/* Main Map + Node Inspection Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Vector Map Canvas */}
        <div className="lg:col-span-7 bg-zinc-950 rounded-2xl p-4 relative overflow-hidden min-h-[300px] sm:min-h-[380px] flex items-center justify-center border border-zinc-800 shadow-inner">
          {/* Subtle Grid Lines and Compass Backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] opacity-60 pointer-events-none"></div>
          
          <div className="absolute top-3 left-3 z-10 bg-zinc-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-zinc-700 text-[10px] font-mono text-zinc-400 flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>GEO-NODE TELEMETRY LAYER</span>
          </div>

          <div className="absolute bottom-3 left-3 z-10 bg-zinc-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-zinc-700 text-[10px] font-mono text-zinc-400">
            <span>20.5937° N, 78.9629° E • Bharat GIS</span>
          </div>

          {/* Stylized Vector SVG Map Shape for Pan-India Representation */}
          <div className="relative w-full h-full max-w-[340px] max-h-[340px] aspect-square flex items-center justify-center">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full text-zinc-800/80 stroke-zinc-700/60 fill-zinc-900/90"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Generalized Topographic India Outline Polygon */}
              <polygon
                points="35,10 45,8 55,14 62,24 72,28 80,32 75,40 68,44 65,55 58,68 50,82 45,92 42,92 38,76 30,64 24,54 18,46 22,36 30,28 35,18"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              {/* Regional connecting operational mesh lines */}
              <line x1="32" y1="42" x2="35" y2="36" stroke="#f97316" strokeWidth="0.8" strokeDasharray="1.5,1.5" opacity="0.6" />
              <line x1="35" y1="36" x2="38" y2="30" stroke="#f97316" strokeWidth="0.8" strokeDasharray="1.5,1.5" opacity="0.6" />
              <line x1="35" y1="36" x2="56" y2="43" stroke="#f97316" strokeWidth="0.8" strokeDasharray="1.5,1.5" opacity="0.6" />
              <line x1="56" y1="43" x2="62" y2="42" stroke="#f97316" strokeWidth="0.8" strokeDasharray="1.5,1.5" opacity="0.6" />
              <line x1="62" y1="42" x2="63" y2="48" stroke="#f97316" strokeWidth="0.8" strokeDasharray="1.5,1.5" opacity="0.6" />
              <line x1="32" y1="42" x2="20" y2="44" stroke="#f97316" strokeWidth="0.8" strokeDasharray="1.5,1.5" opacity="0.6" />
            </svg>

            {/* Interactive GPS Pin Nodes */}
            {filteredNodes.map((node) => {
              const isSelected = node.id === activeNodeId;
              return (
                <button
                  key={node.id}
                  onClick={() => setActiveNodeId(node.id)}
                  style={{ top: `${node.mapY}%`, left: `${node.mapX}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20 focus:outline-none"
                  title={`${node.name} (${node.district}, ${node.state})`}
                >
                  <div className="relative flex items-center justify-center">
                    {/* Pulsing ring for selected pin */}
                    {isSelected && (
                      <span className="absolute w-8 h-8 rounded-full bg-orange-500/40 animate-ping pointer-events-none"></span>
                    )}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shadow-lg border-2 transition-transform duration-200 ${
                        isSelected
                          ? 'scale-125 border-white bg-orange-600 text-white ring-4 ring-orange-500/50'
                          : `${getCategoryColor(node.category)} hover:scale-115`
                      }`}
                    >
                      {getCategoryIcon(node.category)}
                    </div>

                    {/* Mini floating label on hover or active */}
                    <div
                      className={`absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/90 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow pointer-events-none transition-opacity ${
                        isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      {node.district}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Node Inspection Drawer */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-3.5">
          {/* Card Top */}
          <div className="space-y-3">
            <div className="relative h-36 rounded-xl overflow-hidden shadow-2xs border border-gray-200">
              <img
                src={activeNode.image}
                alt={activeNode.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1.5">
                {getCategoryIcon(activeNode.category)}
                <span>{activeNode.category}</span>
              </div>
              <div className="absolute top-2.5 right-2.5 bg-emerald-600/90 backdrop-blur-md text-white text-[9px] font-bold px-2.5 py-1 rounded-full shadow">
                {activeNode.status}
              </div>
            </div>

            <div>
              <h4 className="text-sm sm:text-base font-black text-gray-900 leading-snug">
                {activeNode.name}
              </h4>
              <div className="flex items-center gap-1.5 text-xs text-gray-600 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />
                <span className="font-semibold">{activeNode.district}, {activeNode.state}</span>
                <span className="text-[10px] text-gray-400 font-mono">
                  ({activeNode.coordinates.lat.toFixed(2)}°N, {activeNode.coordinates.lng.toFixed(2)}°E)
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              {activeNode.description}
            </p>

            {/* Metric Banner */}
            <div className="bg-white p-3 rounded-xl border border-gray-200 space-y-1 shadow-2xs">
              <div className="flex items-center justify-between text-[10px] uppercase font-bold text-gray-500">
                <span>Real-Time Performance</span>
                <span className="text-emerald-600 font-bold">✓ Active Sensor</span>
              </div>
              <div className="text-xs font-black text-gray-900 font-mono">
                {activeNode.liveMetric}
              </div>
            </div>

            {/* Sarpanch and Coordinator Verification Signoff */}
            <div className="bg-orange-50/70 p-3 rounded-xl border border-orange-100 text-[11px] space-y-1">
              <div className="flex items-center gap-1 text-orange-800 font-bold text-[10px] uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
                <span>Panchayat & Field Lead Verification</span>
              </div>
              <p className="text-gray-700 font-medium">
                Endorsed by: <span className="font-bold text-gray-900">{activeNode.sarpanchEndorsement}</span>
              </p>
              <p className="text-gray-500 text-[10px]">
                Field Supervisor: {activeNode.leadCoordinator} • Est. {activeNode.establishedDate}
              </p>
            </div>
          </div>

          {/* Action button */}
          {onDonateClick && (
            <button
              onClick={onDonateClick}
              className="w-full bg-orange-600 hover:bg-orange-700 active:scale-98 text-white font-extrabold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Support This Field Station</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
