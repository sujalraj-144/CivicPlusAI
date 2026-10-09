import React, { useState } from 'react';
import { Shield, AlertCircle, CheckCircle, Clock, Filter, Send, Eye, FileText, Check, ChevronRight } from 'lucide-react';
import CityMap from './CityMap';
import RiskForecast from './RiskForecast';
import { assignIssue, resolveIssue } from '../api';

export default function IcccDashboard({ issues = [], onRefresh, onSelectSrn }) {
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [activeSubTab, setActiveSubTab] = useState('table'); // 'table' | 'map' | 'forecast'

  // Dispatch Modal State
  const [assignModalIssue, setAssignModalIssue] = useState(null);
  const [assignedOfficial, setAssignedOfficial] = useState('');
  const [assignedTeam, setAssignedTeam] = useState('');
  const [workNotes, setWorkNotes] = useState('');
  const [dispatching, setDispatching] = useState(false);

  // Resolve Modal State
  const [resolveModalIssue, setResolveModalIssue] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [resolving, setResolving] = useState(false);

  // Filters
  const filteredIssues = issues.filter((item) => {
    const deptMatch = selectedDept === 'All' || item.department.toLowerCase().includes(selectedDept.toLowerCase());
    const statusMatch = selectedStatus === 'All' || item.status.toLowerCase() === selectedStatus.toLowerCase();
    return deptMatch && statusMatch;
  });

  // KPI Calculations
  const totalCount = issues.length;
  const criticalCount = issues.filter(i => i.severity >= 80 && i.status !== 'Resolved').length;
  const activeCount = issues.filter(i => i.status === 'Assigned' || i.status === 'In Progress').length;
  const resolvedCount = issues.filter(i => i.status === 'Resolved').length;

  const handleDispatch = async (e) => {
    e.preventDefault();
    if (!assignModalIssue) return;
    setDispatching(true);
    try {
      await assignIssue(assignModalIssue.id, {
        assigned_official: assignedOfficial || 'Er. R. Venkatesh (JE)',
        assigned_team: assignedTeam || 'PWD Rapid Response Unit',
        notes: workNotes
      });
      setAssignModalIssue(null);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setDispatching(false);
    }
  };

  const handleConfirmResolve = async (e) => {
    e.preventDefault();
    if (!resolveModalIssue) return;
    setResolving(true);
    try {
      await resolveIssue(resolveModalIssue.id, {
        resolution_notes: resolutionNotes || 'Repairs completed and validated via geotagged image.',
        resolution_proof_url: resolveModalIssue.image_url
      });
      setResolveModalIssue(null);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setResolving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Top ICCC Title & KPI Ribbon */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-xs font-mono font-bold text-slate-500 uppercase">
              LIVE CITY CONTROL ROOM FEED
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Integrated Command & Control Center (ICCC)
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Municipal Corporation Operations & Automated AI Work-Order Dispatch Console
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex bg-slate-200/80 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('table')}
            className={`px-3.5 py-2 rounded-lg transition ${
              activeSubTab === 'table' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'
            }`}
          >
            Live Triage Queue
          </button>
          <button
            onClick={() => setActiveSubTab('map')}
            className={`px-3.5 py-2 rounded-lg transition ${
              activeSubTab === 'map' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'
            }`}
          >
            Interactive GIS Map
          </button>
          <button
            onClick={() => setActiveSubTab('forecast')}
            className={`px-3.5 py-2 rounded-lg transition ${
              activeSubTab === 'forecast' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'
            }`}
          >
            Digital Twin Risk
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase mb-1">
            <span>Total Logged</span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl font-black text-slate-900">{totalCount}</div>
          <span className="text-[11px] text-slate-500 font-medium">Across all municipal wards</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-sm">
          <div className="flex justify-between items-center text-rose-600 text-xs font-bold uppercase mb-1">
            <span>Critical Hazards (&gt;80)</span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-3xl font-black text-rose-600">{criticalCount}</div>
          <span className="text-[11px] text-rose-600 font-medium">Immediate 24h SLA response</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm">
          <div className="flex justify-between items-center text-amber-600 text-xs font-bold uppercase mb-1">
            <span>Active Field Works</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-amber-600">{activeCount}</div>
          <span className="text-[11px] text-amber-600 font-medium">Under repair by ward crews</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm">
          <div className="flex justify-between items-center text-emerald-600 text-xs font-bold uppercase mb-1">
            <span>Grievances Resolved</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-emerald-600">{resolvedCount}</div>
          <span className="text-[11px] text-emerald-600 font-medium">Verified proof of work</span>
        </div>
      </div>

      {/* Subtab 1: Interactive GIS Map */}
      {activeSubTab === 'map' && (
        <div className="space-y-4">
          <CityMap
            issues={filteredIssues}
            onSelectIssue={(issue) => {
              setAssignModalIssue(issue);
            }}
          />
        </div>
      )}

      {/* Subtab 2: Digital Twin Risk Forecast */}
      {activeSubTab === 'forecast' && (
        <RiskForecast issues={issues} />
      )}

      {/* Subtab 3: Live Triage Queue Table */}
      {activeSubTab === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Table Filters */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
              <Filter className="w-4 h-4 text-slate-400" />
              <span>Filter Operations:</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-slate-700"
                >
                  <option value="All">All Departments</option>
                  <option value="PWD">PWD / Roads & Bridges</option>
                  <option value="Solid Waste">Solid Waste Management</option>
                  <option value="Stormwater">Drainage & Stormwater (BWSSB)</option>
                  <option value="Electrical">Electrical Department</option>
                </select>
              </div>

              <div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-slate-700"
                >
                  <option value="All">All Statuses</option>
                  <option value="Submitted">Submitted (Needs Triage)</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-700 text-xs uppercase font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">SRN / Category</th>
                  <th className="py-3 px-4">Ward & Location</th>
                  <th className="py-3 px-4">AI Severity</th>
                  <th className="py-3 px-4">Priority / SLA</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredIssues.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    {/* SRN & Type */}
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.image_url}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                        />
                        <div>
                          <span
                            onClick={() => onSelectSrn && onSelectSrn(item.srn)}
                            className="font-mono font-bold text-xs text-blue-600 hover:underline cursor-pointer block"
                          >
                            {item.srn}
                          </span>
                          <span className="font-semibold text-slate-900 text-sm">{item.type}</span>
                        </div>
                      </div>
                    </td>

                    {/* Ward & Address */}
                    <td className="py-3 px-4">
                      <div className="text-xs font-semibold text-slate-900">{item.ward_number}</div>
                      <div className="text-[11px] text-slate-500 max-w-xs truncate">{item.address}</div>
                    </td>

                    {/* Severity */}
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-extrabold font-mono ${item.severity >= 80 ? 'text-rose-600' : 'text-amber-600'}`}>
                          {item.severity}
                        </span>
                        <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${item.severity >= 80 ? 'bg-rose-500' : 'bg-amber-500'}`}
                            style={{ width: `${item.severity}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    {/* Priority & SLA */}
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        (item.prediction?.priority || 'HIGH') === 'HIGH'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {item.prediction?.priority || 'HIGH'} ({item.sla_hours || 24}h SLA)
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        item.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'Assigned' || item.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-200 text-slate-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {item.status !== 'Resolved' ? (
                          <>
                            <button
                              onClick={() => {
                                setAssignModalIssue(item);
                                setAssignedOfficial(item.action?.assigned_official || 'Er. R. Venkatesh (JE)');
                                setAssignedTeam(item.action?.assigned_team || 'PWD Rapid Response Unit 4');
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                            >
                              Dispatch Order
                            </button>
                            <button
                              onClick={() => setResolveModalIssue(item)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                            >
                              Resolve
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-emerald-600 font-bold flex items-center space-x-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>Closed</span>
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Dispatch Work Order Modal */}
      {assignModalIssue && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-fade-in">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Dispatch Work Order — {assignModalIssue.srn}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Issue an official municipal repair directive with SLA tracking.
            </p>

            <form onSubmit={handleDispatch} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Responsible Junior Engineer</label>
                <input
                  type="text"
                  value={assignedOfficial}
                  onChange={(e) => setAssignedOfficial(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Field Contractor / Rapid Action Team</label>
                <input
                  type="text"
                  value={assignedTeam}
                  onChange={(e) => setAssignedTeam(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Recommended Repair Action Notes</label>
                <textarea
                  value={workNotes}
                  onChange={(e) => setWorkNotes(e.target.value)}
                  placeholder="e.g. Immediate cold-mix asphalt application, barricade north lane."
                  rows={2}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setAssignModalIssue(null)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={dispatching}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-sm font-bold rounded-xl shadow"
                >
                  {dispatching ? 'Dispatching...' : 'Confirm Work Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resolve Issue Modal */}
      {resolveModalIssue && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-fade-in">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Validate Proof of Work & Close Grievance
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Close service request #{resolveModalIssue.srn} and record repair notes into public audit trail.
            </p>

            <form onSubmit={handleConfirmResolve} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Completion & Verification Notes</label>
                <textarea
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="e.g. Road surface resurfaced with mastic asphalt. Cleared for traffic."
                  rows={3}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300"
                  required
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setResolveModalIssue(null)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resolving}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 text-sm font-bold rounded-xl shadow"
                >
                  {resolving ? 'Closing...' : 'Confirm Resolution'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
