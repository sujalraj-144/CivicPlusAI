import React, { useState } from 'react';
import { Camera, Upload, MapPin, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Loader2, CloudRain, Car } from 'lucide-react';
import { uploadPhoto, analyzePhoto, predictRisk, createIssue } from '../api';

export default function CitizenReport({ onIssueCreated, onViewTracker }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [coords, setCoords] = useState({ lat: 12.9716, lon: 77.5946 });
  const [address, setAddress] = useState('Indiranagar 100ft Road, Ward 12');
  const [ward, setWard] = useState('Ward 12 - Indiranagar');
  const [description, setDescription] = useState('');
  const [citizenName, setCitizenName] = useState('');
  const [citizenPhone, setCitizenPhone] = useState('');

  // AI Pipeline States
  const [analyzing, setAnalyzing] = useState(false);
  const [detection, setDetection] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittedIssue, setSubmittedIssue] = useState(null);

  // Auto-detect GPS
  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = parseFloat(pos.coords.latitude.toFixed(6));
          const lon = parseFloat(pos.coords.longitude.toFixed(6));
          setCoords({ lat, lon });
          setAddress(`Geo-Coordinates: ${lat}, ${lon} (Auto-Tagged)`);
        },
        (err) => {
          console.warn("Geolocation permission denied, using default city center coordinates.");
        }
      );
    }
  };

  // Handle Photo selection and trigger YOLO detection + Risk prediction
  const handlePhotoSelect = async (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    const localUrl = URL.createObjectURL(selected);
    setPreviewUrl(localUrl);
    setAnalyzing(true);
    setDetection(null);
    setPrediction(null);
    setSubmittedIssue(null);

    try {
      // 1. Upload photo
      const uploadRes = await uploadPhoto(selected, coords, address, ward);
      const remoteOrLocalUrl = uploadRes.image_url || localUrl;

      // 2. Run YOLO AI Analysis
      const analysisRes = await analyzePhoto(remoteOrLocalUrl, description || selected.name);
      const det = analysisRes.detection;
      setDetection(det);

      // 3. Predict Future Risk using Weather & Traffic
      const predRes = await predictRisk(det.initial_severity, det.detected_type, coords.lat, coords.lon);
      setPrediction(predRes.forecast);
    } catch (err) {
      console.error("AI pipeline error:", err);
    } finally {
      setAnalyzing(false);
    }
  };

  // Final Grievance Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!previewUrl || !detection) return;

    setSubmitting(true);
    try {
      const payload = {
        image_url: previewUrl,
        type: detection.detected_type,
        department: detection.department,
        latitude: coords.lat,
        longitude: coords.lon,
        address,
        ward_number: ward,
        severity: detection.initial_severity,
        description_hint: description,
        citizen_name: citizenName || 'Anonymous Citizen',
        citizen_phone: citizenPhone || 'N/A'
      };

      const res = await createIssue(payload);
      setSubmittedIssue(res.issue);
      if (onIssueCreated) onIssueCreated(res.issue);
    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Banner */}
      <div className="text-center mb-8">
        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>AI-Powered Municipal Grievance Redressal</span>
        </span>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Report a Civic Issue in 60 Seconds
        </h2>
        <p className="mt-2 text-sm text-slate-600 max-w-xl mx-auto">
          Snap a photo of potholes, garbage piles, or drainage blocks. Our computer vision model automatically identifies the hazard, alerts the ward engineer, and tracks resolution.
        </p>
      </div>

      {submittedIssue ? (
        /* Success Screen */
        <div className="bg-white rounded-2xl shadow-lg border border-emerald-200 p-8 text-center animate-fade-in">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">Grievance Registered Successfully</h3>
          <p className="text-slate-600 text-sm mt-1">
            Your issue has been logged into the Municipal Integrated Command & Control System.
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 my-6 max-w-md mx-auto text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <span className="text-xs font-semibold uppercase text-slate-500">Service Request Number (SRN)</span>
              <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                {submittedIssue.srn}
              </span>
            </div>
            <div className="pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Issue Category:</span>
                <strong className="text-slate-900">{submittedIssue.type}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Assigned Department:</span>
                <strong className="text-slate-900">{submittedIssue.department}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>SLA Resolution Deadline:</span>
                <strong className="text-emerald-700 font-semibold">{submittedIssue.sla_hours || 24} Hours</strong>
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => onViewTracker(submittedIssue.srn)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow transition flex items-center space-x-2"
            >
              <span>Track Resolution Live</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setSubmittedIssue(null);
                setPreviewUrl('');
                setFile(null);
                setDetection(null);
              }}
              className="border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium px-5 py-2.5 rounded-xl transition"
            >
              Report Another Issue
            </button>
          </div>
        </div>
      ) : (
        /* Grievance Submission Form */
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 md:p-8 space-y-6">

            {/* Step 1: Photo Upload */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center space-x-2">
                <Camera className="w-4 h-4 text-blue-600" />
                <span>1. Capture or Upload Photo of the Problem</span>
                <span className="text-red-500">*</span>
              </label>

              {!previewUrl ? (
                <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-8 text-center cursor-pointer transition bg-slate-50 hover:bg-blue-50/30 relative">
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-800">
                    Click to take a photo or drag image here
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Supports JPG, PNG (Potholes, garbage dumps, waterlogging, streetlights)
                  </p>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 group">
                  <img
                    src={previewUrl}
                    alt="Uploaded issue"
                    className="w-full h-64 object-cover opacity-90 group-hover:opacity-100 transition"
                  />
                  <div className="absolute top-3 right-3">
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewUrl('');
                        setFile(null);
                        setDetection(null);
                      }}
                      className="bg-slate-900/80 hover:bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg backdrop-blur-sm transition"
                    >
                      Change Photo
                    </button>
                  </div>

                  {analyzing && (
                    <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                      <Loader2 className="w-8 h-8 text-blue-400 animate-spin mb-2" />
                      <p className="text-sm font-semibold">Running Pretrained YOLO Detection & Risk Forecast...</p>
                      <p className="text-xs text-slate-400">Classifying problem and querying Open-Meteo weather...</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* AI Insights Card (Reveals instantly after detection) */}
            {detection && (
              <div className="bg-gradient-to-br from-blue-50/70 to-indigo-50/50 rounded-2xl border border-blue-200 p-5 animate-fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-blue-200/60 mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-blue-900">
                      AI Computer Vision Assessment
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
                    Confidence: {(detection.confidence * 100).toFixed(0)}%
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-sm">
                    <span className="text-xs text-slate-500 font-medium">Detected Hazard</span>
                    <p className="text-lg font-bold text-slate-900">{detection.detected_type}</p>
                    <span className="text-[11px] text-blue-600 font-semibold">{detection.department}</span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-sm">
                    <span className="text-xs text-slate-500 font-medium">Initial Severity Score</span>
                    <div className="flex items-baseline space-x-1.5">
                      <span className="text-2xl font-black text-rose-600">{detection.initial_severity}</span>
                      <span className="text-xs text-slate-400 font-semibold">/ 100</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="bg-rose-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${detection.initial_severity}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-sm">
                    <span className="text-xs text-slate-500 font-medium">Priority & SLA Tier</span>
                    <p className="text-lg font-bold text-amber-700">
                      {prediction ? prediction.priority : 'HIGH'}
                    </p>
                    <span className="text-[11px] text-emerald-700 font-semibold">
                      Target SLA: {prediction ? prediction.sla_hours : 24} Hours
                    </span>
                  </div>
                </div>

                {/* 7-Day Risk & Weather Forecast Card */}
                {prediction && (
                  <div className="mt-4 pt-3 border-t border-blue-200/60">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                      <span className="flex items-center space-x-1">
                        <CloudRain className="w-3.5 h-3.5 text-blue-600" />
                        <span>Predictive Risk Model (Open-Meteo {prediction.rainfall_forecast_mm}mm rain + {prediction.traffic_density})</span>
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-white/80 p-2 rounded-lg border border-blue-100">
                        <span className="text-slate-500 block">In 24 Hours</span>
                        <strong className="text-amber-700 font-bold text-sm">{prediction.severity_in_24_hours}/100</strong>
                      </div>
                      <div className="bg-white/80 p-2 rounded-lg border border-blue-100">
                        <span className="text-slate-500 block">In 3 Days</span>
                        <strong className="text-orange-600 font-bold text-sm">{prediction.severity_in_3_days}/100</strong>
                      </div>
                      <div className="bg-white/80 p-2 rounded-lg border border-blue-100">
                        <span className="text-slate-500 block">In 7 Days</span>
                        <strong className="text-red-700 font-bold text-sm">{prediction.severity_in_7_days}/100</strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Location & Ward */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1 flex items-center justify-between">
                  <span>2. Location / Street Address</span>
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1"
                  >
                    <MapPin className="w-3 h-3" />
                    <span>Auto-Detect GPS</span>
                  </button>
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 100ft Road, near Metro station"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1">
                  Municipal Ward
                </label>
                <select
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                >
                  <option value="Ward 12 - Indiranagar">Ward 12 - Indiranagar</option>
                  <option value="Ward 14 - Market East">Ward 14 - Market East</option>
                  <option value="Ward 08 - North Gate">Ward 08 - North Gate</option>
                  <option value="Ward 15 - South East">Ward 15 - South East</option>
                  <option value="Ward 04 - West Central">Ward 04 - West Central</option>
                </select>
              </div>
            </div>

            {/* Step 3: Citizen Contact & Details (Optional) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1">
                  Citizen Name (Optional)
                </label>
                <input
                  type="text"
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  placeholder="Your Name (or leave blank for anonymous)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1">
                  Phone Number for SMS Updates (Optional)
                </label>
                <input
                  type="tel"
                  value={citizenPhone}
                  onChange={(e) => setCitizenPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Additional Remarks */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                Additional Landmark / Hazard Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Mention landmarks, nearby schools, or accident risks..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-sm"
              ></textarea>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!previewUrl || analyzing || submitting}
                className={`w-full py-3.5 px-6 rounded-xl font-bold text-white text-base shadow-md transition flex items-center justify-center space-x-2 ${
                  !previewUrl || analyzing || submitting
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.99]'
                }`}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Registering Service Request in Municipal Engine...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Grievance to Municipal Corporation</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
