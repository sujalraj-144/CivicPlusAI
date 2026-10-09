import React, { useState, useEffect } from 'react';
import GovHeader from './components/GovHeader';
import CitizenReport from './components/CitizenReport';
import IssueTracker from './components/IssueTracker';
import IcccDashboard from './components/IcccDashboard';
import { getIssues } from './api';

export default function App() {
  const [activeTab, setActiveTab] = useState('citizen'); // 'citizen' | 'tracker' | 'iccc'
  const [issues, setIssues] = useState([]);
  const [trackedSrn, setTrackedSrn] = useState('CIVIC-W12-2026-8419');

  const fetchAllIssues = async () => {
    try {
      const data = await getIssues();
      setIssues(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAllIssues();
  }, []);

  const handleIssueCreated = (newIssue) => {
    setIssues((prev) => [newIssue, ...prev]);
    setTrackedSrn(newIssue.srn);
  };

  const handleViewTracker = (srn) => {
    setTrackedSrn(srn);
    setActiveTab('tracker');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Official Government Header */}
      <GovHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'citizen' && (
          <CitizenReport
            onIssueCreated={handleIssueCreated}
            onViewTracker={handleViewTracker}
          />
        )}

        {activeTab === 'tracker' && (
          <IssueTracker initialSrn={trackedSrn} />
        )}

        {activeTab === 'iccc' && (
          <IcccDashboard
            issues={issues}
            onRefresh={fetchAllIssues}
            onSelectSrn={handleViewTracker}
          />
        )}
      </main>

      {/* Official Municipal Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="font-semibold text-slate-300">
              CivicPulse AI — Smart City Municipal Operations System
            </p>
            <p className="text-slate-500 mt-0.5">
              Powered by Pretrained YOLO Computer Vision + Open-Meteo Precipitation Telemetry.
            </p>
          </div>

          <div className="flex items-center space-x-6 text-slate-400">
            <span>Built by Team <strong>Knox Drift</strong> (Shyam, Balaji, Sujal, Akhil)</span>
            <span>•</span>
            <span>Ministry of Housing & Urban Affairs Standards</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
