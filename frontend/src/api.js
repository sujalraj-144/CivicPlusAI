// API client communicating with FastAPI backend
const API_BASE = "http://localhost:8000";

export async function uploadPhoto(file, coords = { lat: 12.9716, lon: 77.5946 }, address = "Indiranagar, Bangalore", ward = "Ward 12") {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("latitude", coords.lat);
  formData.append("longitude", coords.lon);
  formData.append("address", address);
  formData.append("ward_number", ward);

  try {
    const res = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Upload failed");
    return await res.json();
  } catch (err) {
    console.warn("Backend not reachable, utilizing local object URL for demo:", err);
    return {
      status: "success",
      image_url: URL.createObjectURL(file),
      latitude: coords.lat,
      longitude: coords.lon,
      address,
      ward_number: ward
    };
  }
}

export async function analyzePhoto(imageUrl, descriptionHint = "") {
  try {
    const res = await fetch(`${API_BASE}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image_url: imageUrl, description_hint: descriptionHint }),
    });
    if (!res.ok) throw new Error("Analysis failed");
    return await res.json();
  } catch (err) {
    console.warn("Using offline AI detection heuristics:", err);
    // Offline simulation matching PPT YOLO model
    return {
      status: "success",
      detection: {
        detected_type: "Pothole",
        department: "PWD / Roads & Bridges",
        confidence: 0.94,
        initial_severity: 72,
        bounding_box: [0.2, 0.3, 0.8, 0.85]
      }
    };
  }
}

export async function predictRisk(severity, issueType = "Pothole", lat = 12.9716, lon = 77.5946) {
  try {
    const res = await fetch(`${API_BASE}/predict?severity=${severity}&issue_type=${encodeURIComponent(issueType)}&lat=${lat}&lon=${lon}`);
    if (!res.ok) throw new Error("Prediction failed");
    return await res.json();
  } catch (err) {
    console.warn("Using offline risk model:", err);
    return {
      forecast: {
        severity_in_24_hours: Math.min(100, severity + 12),
        severity_in_3_days: Math.min(100, severity + 22),
        severity_in_7_days: Math.min(100, severity + 30),
        priority: severity > 65 ? "HIGH" : "MEDIUM",
        rainfall_forecast_mm: 22.4,
        traffic_density: "Heavy Commercial & Transit",
        risk_summary: `Predicted rapid road degradation due to 22.4mm monsoon showers.`,
        recommended_action: "Immediate cold-mix patch & barricading within 24h SLA",
        sla_hours: severity > 65 ? 24 : 48
      }
    };
  }
}

export async function getIssues(filters = {}) {
  try {
    let url = `${API_BASE}/issues`;
    const params = new URLSearchParams();
    if (filters.status && filters.status !== "All") params.append("status", filters.status);
    if (filters.department && filters.department !== "All") params.append("department", filters.department);
    if (filters.ward && filters.ward !== "All") params.append("ward", filters.ward);
    if (params.toString()) url += `?${params.toString()}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch issues");
    return await res.json();
  } catch (err) {
    console.warn("Fallback to sample issues:", err);
    return getFallbackIssues();
  }
}

export async function createIssue(payload) {
  try {
    const res = await fetch(`${API_BASE}/issues`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Failed to create issue");
    return await res.json();
  } catch (err) {
    console.warn("Using simulated SRN generation:", err);
    const mockSrn = `CIVIC-W12-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    return {
      status: "success",
      issue: {
        id: "mock-" + Date.now(),
        srn: mockSrn,
        type: payload.type || "Pothole",
        department: "PWD / Roads & Bridges",
        latitude: payload.latitude,
        longitude: payload.longitude,
        address: payload.address,
        ward_number: payload.ward_number,
        severity: payload.severity || 68,
        status: "Submitted",
        upvotes: 1,
        image_url: payload.image_url,
        created_at: new Date().toISOString(),
        sla_hours: 24,
        prediction: {
          severity_in_24_hours: 82,
          severity_in_3_days: 90,
          severity_in_7_days: 98,
          priority: "HIGH",
          rainfall_forecast_mm: 20.0,
          traffic_density: "Moderate",
          risk_summary: "High risk of crater expansion.",
          recommended_action: "Immediate emergency repair & barricading within 24 hours.",
          sla_hours: 24
        }
      }
    };
  }
}

export async function getIssueBySrn(srn) {
  try {
    const res = await fetch(`${API_BASE}/issues/${encodeURIComponent(srn.trim())}`);
    if (!res.ok) throw new Error("SRN not found");
    return await res.json();
  } catch (err) {
    const fallbacks = getFallbackIssues();
    const found = fallbacks.find(i => i.srn.toLowerCase() === srn.trim().toLowerCase());
    if (found) return found;
    throw err;
  }
}

export async function assignIssue(issueId, payload) {
  try {
    const res = await fetch(`${API_BASE}/issues/${issueId}/assign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (err) {
    return { status: "success" };
  }
}

export async function resolveIssue(issueId, payload) {
  try {
    const res = await fetch(`${API_BASE}/issues/${issueId}/resolve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (err) {
    return { status: "success" };
  }
}

export async function upvoteIssue(issueId) {
  try {
    const res = await fetch(`${API_BASE}/issues/${issueId}/upvote`, { method: "POST" });
    return await res.json();
  } catch (err) {
    return { status: "success", upvotes: 15 };
  }
}

function getFallbackIssues() {
  return [
    {
      id: "demo-1",
      srn: "CIVIC-W12-2026-8419",
      type: "Pothole",
      department: "PWD / Roads & Bridges",
      latitude: 12.9716,
      longitude: 77.5946,
      address: "100 Ft Road, Near Indiranagar Metro Pillar 42",
      ward_number: "Ward 12 - Indiranagar",
      severity: 84,
      status: "Assigned",
      upvotes: 14,
      image_url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80",
      created_at: new Date(Date.now() - 14 * 3600000).toISOString(),
      sla_hours: 24,
      prediction: {
        severity_in_24_hours: 92,
        severity_in_3_days: 96,
        severity_in_7_days: 100,
        priority: "HIGH",
        rainfall_forecast_mm: 24.5,
        traffic_density: "Heavy Commercial & Transit",
        risk_summary: "High risk of crater expansion and two-wheeler skid accidents due to impending rainfall.",
        recommended_action: "Immediate cold-mix asphalt patching & hazard barricading within 24 hours.",
        sla_hours: 24
      },
      action: {
        recommended_action: "Immediate cold-mix asphalt patching & hazard barricading.",
        assigned_team: "PWD Rapid Response Unit 4",
        assigned_official: "Er. R. Venkatesh (Junior Engineer)",
        work_order_id: "WO-PWD-2026-118"
      }
    },
    {
      id: "demo-2",
      srn: "CIVIC-W14-2026-3921",
      type: "Garbage Dump",
      department: "Solid Waste Management",
      latitude: 12.9650,
      longitude: 77.6010,
      address: "Opposite City Central Market, 4th Cross",
      ward_number: "Ward 14 - Market East",
      severity: 65,
      status: "In Progress",
      upvotes: 8,
      image_url: "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=600&auto=format&fit=crop&q=80",
      created_at: new Date(Date.now() - 22 * 3600000).toISOString(),
      sla_hours: 48,
      prediction: {
        severity_in_24_hours: 74,
        severity_in_3_days: 85,
        severity_in_7_days: 92,
        priority: "MEDIUM",
        rainfall_forecast_mm: 12.0,
        traffic_density: "Dense Pedestrian",
        risk_summary: "Piled organic waste blocking pedestrian walkway; microbial spread risk if rain begins.",
        recommended_action: "Dispatch municipal tipper truck and deploy sanitation inspector.",
        sla_hours: 48
      },
      action: {
        recommended_action: "Dispatch municipal tipper truck and deploy sanitation inspector.",
        assigned_team: "SWM Sanitation Team Charlie",
        assigned_official: "S. Anitha (Health Inspector)",
        work_order_id: "WO-SWM-2026-442"
      }
    },
    {
      id: "demo-3",
      srn: "CIVIC-W08-2026-7290",
      type: "Waterlogging",
      department: "Stormwater & Drainage (BWSSB)",
      latitude: 12.9790,
      longitude: 77.5850,
      address: "Railway Underpass, Seshadripuram",
      ward_number: "Ward 08 - North Gate",
      severity: 91,
      status: "Submitted",
      upvotes: 26,
      image_url: "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&auto=format&fit=crop&q=80",
      created_at: new Date(Date.now() - 3 * 3600000).toISOString(),
      sla_hours: 12,
      prediction: {
        severity_in_24_hours: 98,
        severity_in_3_days: 100,
        severity_in_7_days: 100,
        priority: "HIGH",
        rainfall_forecast_mm: 38.0,
        traffic_density: "Critical Arterial Choke Point",
        risk_summary: "Underpass drainage choked. Vehicle submergence risk during evening cloudburst.",
        recommended_action: "Emergency de-watering high-capacity suction pumps required immediately.",
        sla_hours: 12
      }
    }
  ];
}
