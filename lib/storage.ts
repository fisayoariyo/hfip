// lib/storage.ts
// localStorage helpers. In production, replace these with NestJS API calls.
import type { AppState, Farmer } from "@/types";
import { generateFarmerId } from "./generateId";

const KEY = "hfip_v1";

const DEFAULT: AppState = { farmers: [], currentFarmerId: null, activeRole: "farmer", darkMode: false };

export function loadState(): AppState {
  if (typeof window === "undefined") return DEFAULT;
  try { return { ...DEFAULT, ...JSON.parse(localStorage.getItem(KEY) ?? "{}") }; }
  catch { return DEFAULT; }
}

export function saveState(s: AppState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(s));
}

export const getFarmers = () => loadState().farmers;
export const getFarmerById = (id: string) => loadState().farmers.find(f => f.id === id);
export const getCurrentFarmerId = () => loadState().currentFarmerId;
export const getActiveRole = () => loadState().activeRole;
export const getDarkMode = () => loadState().darkMode;

export function setActiveRole(role: AppState["activeRole"]) {
  saveState({ ...loadState(), activeRole: role });
}
export function setCurrentFarmerId(id: string | null) {
  saveState({ ...loadState(), currentFarmerId: id });
}

export function createFarmer(): Farmer {
  const state = loadState();
  const id = generateFarmerId(state.farmers.length);
  const f: Farmer = {
    id,
    personalInfo: { firstName:"",lastName:"",phone:"",gender:"",nextOfKin:"",nextOfKinPhone:"",dob:"",state:"",lga:"" },
    biometric: { fingerprintCaptured:false, faceCaptured:false },
    farmInfo: { gpsLat:null, gpsLng:null, acreage:0, cropType:"Soya Bean", soilType:"", expectedYield:0, season:"" },
    documents: { landTitleNumber:"",bankName:"",accountNumber:"",cooperativeName:"",fileUploaded:false,inputsUsed:[] },
    status:"pending", createdAt:new Date().toISOString(), completedStep:0, onboardingComplete:false,
  };
  saveState({ ...state, farmers:[...state.farmers, f], currentFarmerId:id });
  return f;
}

export function updateFarmer(updated: Farmer) {
  const state = loadState();
  saveState({ ...state, farmers: state.farmers.map(f => f.id === updated.id ? updated : f) });
}

export function verifyFarmer(id: string) {
  const state = loadState();
  saveState({ ...state, farmers: state.farmers.map(f => f.id===id ? {...f, status:"verified"} : f) });
}

export function rejectFarmer(id: string) {
  const state = loadState();
  saveState({ ...state, farmers: state.farmers.map(f => f.id===id ? {...f, status:"rejected"} : f) });
}

export function toggleDarkMode(): boolean {
  const state = loadState();
  const val = !state.darkMode;
  saveState({ ...state, darkMode: val });
  return val;
}

export function exportCSV(farmers: Farmer[]): string {
  const headers = ["ID","Full Name","Phone","State","LGA","Crop","Acreage","Status","Registered"];
  const rows = farmers.map(f => [
    f.id,
    `${f.personalInfo.firstName} ${f.personalInfo.lastName}`,
    f.personalInfo.phone, f.personalInfo.state, f.personalInfo.lga,
    f.farmInfo.cropType, f.farmInfo.acreage, f.status,
    new Date(f.createdAt).toLocaleDateString("en-NG"),
  ]);
  return [headers,...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
}
