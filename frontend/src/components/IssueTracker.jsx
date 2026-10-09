import React, { useState, useEffect } from 'react';
import { Search, Clock, CheckCircle2, Shield, AlertTriangle, ThumbsUp, Wrench, UserCheck, Calendar } from 'lucide-react';
import { getIssueBySrn, upvoteIssue } from '../api';

const STAGES = [
  { key: 'Submitted', label: '1. Citizen Report Logged', desc: 'Registered with GPS & photo verification' },
  { key: 'Triaged', label: '2. AI Triage & Priority', desc: 'Classified by YOLO; weather risk forecasted' },
  { key: 'Assigned', label: '3. Work Order Dispatched', desc: 'Assigned to Ward Junior Engineer & Field Unit' },
  { key: 'In Progress', label: '4. Repair in Progress', desc: 'Field contractor on-site' },
  { key: 'Resolved', label: '5. Resolved & Verified', desc: 'Proof of work validated' }
];

export default function IssueTracker({ initialSrn = '' }) {
  const [srnInput, setSrnInput] = useState(initialSrn || 'CIVIC-W12-2026-8419');
  const [loading, setLoading] = useState(false);
  const [issue, setIssue] = useState(null);
  const [error, setError] = useState('');
  const [upvoted, setUpvoted] = useState(false);

  useEffect(() => {
    if (initialSrn) {
      setSrnInput(initialSrn);
      handleTrack(initialSrn);
    } else {
      handleTrack('CIVIC-W12-2026-8419');
    }
  }, [initialSrn]);

  const handleTrack = async (targetSrn) => {
    const query = targetSrn || srnInput;
    if (!query) return;

    setLoading(true);
    setError('');
    try {
      const data = await getIssueBySrn(query);
      setIssue(data);
      setUpvoted(false);
    } catch (err) {
      setError('Service Request Number not found. Please verify the SRN.');
      setIssue(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async () => {
    if (!issue || upvoted) return;
    try {
      await upvoteIssue(issue.id);
      setIssue(prev => ({ ...prev, upvotes: prev.upvotes + 1 }));
      setUpvoted(true);
    } catch (err) {
      console.error(err);
    }
  };

  const getStageIndex = (status) => {
    switch (status) {
      case 'Submitted': return 0;
      case 'Triaged': return 1;
      case 'Assigned': return 2;
      case 'In Progress': return 3;
      case 'Resolved': return 4;
      default: return 1;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Track Grievance Status
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Enter your official Service Request Number (SRN) to view real-time municipal field progress and SLA compliance.
        </p>

        {/* Search Bar */}
        <div className="mt-6 max-w-xl mx-auto flex gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={srnInput}
              onChange={(e) => setSrnInput(e.target.value)}
              placeholder="e.g. CIVIC-W12-2026-8419"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm tracking-wider uppercase bg-white shadow-sm"
            />
          </div>
          <button
            onClick={() => handleTrack()}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition shadow flex items-center space-x-2"
          >
            {loading ? <span>Searching...</span> : <span>Track</span>}
          </button>
        </div>

        {error && (
          <p className="mt-3 text-sm text-rose-600 font-medium">{error}</p>
        )}
      </div>

      {issue && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
          {/* SRN Summary Header */}
          <div className="bg-slate-900 text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="font-mono text-lg font-bold text-amber-400 bg-slate-800 px-3 py-1 rounded border border-slate-700">
                  {issue.srn}
                </span>
                <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase">
                  {issue.status}
                </span>
              </div>
              <h3 className="text-xl font-bold">{issue.type} — {issue.ward_number}</h3>
              <p className="text-xs text-slate-400 mt-1">{issue.address}</p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleUpvote}
                disabled={upvoted}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition border ${
                  upvoted
                    ? 'bg-emerald-900/60 text-emerald-300 border-emerald-700'
                    : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
                }`}
              >
                <ThumbsUp className="w-4 h-4 text-amber-400" />
                <span>{upvoted ? 'Upvoted (+1)' : 'Me Too / Impacted'} ({issue.upvotes})</span>
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Step-by-step Gov Redressal Lifecycle */}
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-6">
                Official Redressal Timeline & Status
              </h4>
              <div className="relative">
                {/* Timeline Line */}
                <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0"></div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
                  {STAGES.map((stg, idx) => {
                    const currentIndex = getStageIndex(issue.status);
                    const isDone = idx <= currentIndex;
                    const isCurrent = idx === currentIndex;

                    return (
                      <div
                        key={stg.key}
                        className={`p-4 rounded-xl border transition ${
                          isCurrent
                            ? 'bg-blue-50 border-blue-500 shadow-sm ring-1 ring-blue-500'
                            : isDone
                            ? 'bg-white border-emerald-300 text-slate-700'
                            : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              isDone ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-slate-700'
                            }`}
                          >
                            {isDone ? '✓' : idx + 1}
                          </div>
                          <span className={`text-xs font-bold ${isCurrent ? 'text-blue-900' : 'text-slate-800'}`}>
                            {stg.key}
                          </span>
                        </div>
                        <p className="text-[11px] leading-tight text-slate-600 font-medium">
                          {stg.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Official Details & Work Order Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span>Municipal Assignment Details</span>
                </div>
                <div className="text-xs space-y-2 text-slate-600">
                  <div className="flex justify-between">
                    <span>Department:</span>
                    <strong className="text-slate-900">{issue.department}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Assigned Engineer:</span>
                    <strong className="text-slate-900">
                      {issue.action?.assigned_official || 'Er. R. Venkatesh (Junior Engineer)'}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Assigned Unit:</span>
                    <strong className="text-slate-900">
                      {issue.action?.assigned_team || 'PWD Rapid Response Unit 4'}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Work Order ID:</span>
                    <strong className="font-mono text-blue-700">
                      {issue.action?.work_order_id || 'WO-PWD-2026-118'}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>SLA Guarantee & Risk Forecast</span>
                </div>
                <div className="text-xs space-y-2 text-slate-600">
                  <div className="flex justify-between">
                    <span>Target Resolution SLA:</span>
                    <strong className="text-emerald-700">{issue.sla_hours || 24} Hours Maximum</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Severity Score:</span>
                    <strong className="text-rose-600 font-bold">{issue.severity} / 100</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Predictive 3-Day Escalation:</span>
                    <strong className="text-orange-600">
                      {issue.prediction?.severity_in_3_days || 96} / 100
                    </strong>
                  </div>
                  <div className="pt-1 text-[11px] text-slate-500 italic">
                    {issue.prediction?.risk_summary || 'Priority escalated due to heavy traffic on arterial road.'}
                  </div>
                </div>
              </div>
            </div>

            {/* Photo Preview */}
            {issue.image_url && (
              <div className="pt-4 border-t border-slate-200">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3">
                  Geo-Tagged Evidence Photo
                </h4>
                <div className="rounded-xl overflow-hidden border border-slate-200 max-w-sm">
                  <img
                    src={issue.image_url}
                    alt={issue.type}
                    className="w-full h-48 object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
