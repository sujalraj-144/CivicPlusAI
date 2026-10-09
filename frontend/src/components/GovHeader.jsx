import React from 'react';
import { Shield, PhoneCall, Building2, MapPin, Eye, AlertCircle } from 'lucide-react';

export default function GovHeader({ activeTab, setActiveTab }) {
  return (
    <header className="border-b border-slate-200 bg-white shadow-sm sticky top-0 z-50">
      {/* Top emergency & accessibility bar */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 flex flex-wrap justify-between items-center border-b border-slate-800">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1 font-medium text-amber-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>GOVERNMENT OF SMART CITY MUNICIPAL CORPORATION</span>
          </span>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:inline text-slate-400">Unified Civic Grievance Redressal & Predictive AI System</span>
        </div>
        <div className="flex items-center space-x-4 font-mono text-xs">
          <span className="flex items-center space-x-1 text-slate-300">
            <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
            <span>Toll-Free Helpline: <strong className="text-white">1913</strong> / <strong className="text-white">112</strong></span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-amber-300 font-semibold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
            Smart City Mission 2.0
          </span>
        </div>
      </div>

      {/* Main Official Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          {/* Emblem / Shield Logo */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 flex items-center justify-center text-white shadow-md border border-blue-700/30">
            <Shield className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                CivicPulse <span className="text-blue-600 font-extrabold">AI</span>
              </h1>
              <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200">
                OFFICIAL PORTAL
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              National Smart Cities Integrated Grievance & Predictive Maintenance Engine
            </p>
          </div>
        </div>

        {/* Portal View Switcher (Citizen vs Government ICCC) */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-sm font-medium">
          <button
            onClick={() => setActiveTab('citizen')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === 'citizen'
                ? 'bg-white text-blue-700 font-semibold shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>Citizen Portal</span>
          </button>

          <button
            onClick={() => setActiveTab('tracker')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === 'tracker'
                ? 'bg-white text-blue-700 font-semibold shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-4 h-4 text-emerald-600" />
            <span>Track Grievance</span>
          </button>

          <button
            onClick={() => setActiveTab('iccc')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === 'iccc'
                ? 'bg-slate-900 text-amber-400 font-semibold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>Municipal ICCC Center</span>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          </button>
        </div>
      </div>
    </header>
  );
}
