import React, { useEffect, useRef } from 'react';

export default function CityMap({ issues = [], onSelectIssue }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!window.L || !mapContainerRef.current) return;

    // Initialize Map if not already initialized
    if (!mapInstanceRef.current) {
      const defaultCenter = [12.9716, 77.5946]; // City Center (Bangalore)
      const map = window.L.map(mapContainerRef.current).setView(defaultCenter, 13);

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors | CivicPulse AI'
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear old markers
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    // Create custom pin icons
    const createColorIcon = (status, severity) => {
      let color = '#f59e0b'; // Amber
      if (status === 'Resolved') color = '#10b981'; // Emerald
      else if (severity >= 80) color = '#ef4444'; // Red

      return window.L.divIcon({
        className: 'custom-pin',
        html: `
          <div style="
            background-color: ${color};
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 11px;
          ">
            ${severity >= 80 ? '!' : '●'}
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });
    };

    // Add markers for all issues
    issues.forEach((issue) => {
      if (!issue.latitude || !issue.longitude) return;

      const marker = window.L.marker([issue.latitude, issue.longitude], {
        icon: createColorIcon(issue.status, issue.severity)
      }).addTo(map);

      const popupContent = `
        <div style="min-width: 180px; font-family: sans-serif; padding: 2px;">
          <div style="font-size: 10px; font-weight: bold; color: #2563eb; letter-spacing: 0.5px;">${issue.srn}</div>
          <div style="font-size: 13px; font-weight: bold; color: #0f172a; margin: 2px 0;">${issue.type}</div>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">${issue.ward_number}</div>
          <div style="font-size: 11px; margin-bottom: 6px;">
            Severity: <strong style="color: ${issue.severity >= 80 ? '#dc2626' : '#d97706'}">${issue.severity}/100</strong>
          </div>
          <div style="font-size: 10px; background: #f1f5f9; padding: 4px 6px; border-radius: 4px; color: #334155;">
            Dept: ${issue.department}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('click', () => {
        if (onSelectIssue) onSelectIssue(issue);
      });

      markersRef.current.push(marker);
    });

    // Fit map bounds if there are markers
    if (issues.length > 0) {
      const group = new window.L.featureGroup(markersRef.current);
      map.fitBounds(group.getBounds().pad(0.15));
    }
  }, [issues]);

  return (
    <div className="relative w-full h-[450px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Map Legend */}
      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-slate-200 shadow-lg z-20 text-xs space-y-1.5 font-medium">
        <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Severity & SLA Legend</div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
          <span className="text-slate-700">Critical / SLA Hazard (&gt;80)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
          <span className="text-slate-700">Medium Severity (40-79)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
          <span className="text-slate-700">Resolved Grievance</span>
        </div>
      </div>
    </div>
  );
}
