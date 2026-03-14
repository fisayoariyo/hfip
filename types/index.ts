// types/index.ts — all TypeScript shapes for the HFIP app

export type Role = "farmer" | "admin";
export type WizardStep = 1 | 2 | 3 | 4;

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  phone: string;
  gender: "male" | "female" | "other" | "";
  nextOfKin: string;
  nextOfKinPhone: string;
  dob: string;
  state: string;
  lga: string;
}

export interface BiometricData {
  fingerprintCaptured: boolean;
  faceCaptured: boolean;
  photoDataUrl?: string;
}

export interface FarmInfo {
  gpsLat: number | null;
  gpsLng: number | null;
  acreage: number;
  cropType: string;
  soilType: string;
  expectedYield: number;
  season: "wet" | "dry" | "";
}

export interface DocumentInfo {
  landTitleNumber: string;
  bankName: string;
  accountNumber: string;
  cooperativeName: string;
  fileUploaded: boolean;
  inputsUsed: string[];
}

export interface Farmer {
  id: string;
  personalInfo: PersonalInfo;
  biometric: BiometricData;
  farmInfo: FarmInfo;
  documents: DocumentInfo;
  status: "pending" | "verified" | "rejected";
  createdAt: string;
  completedStep: WizardStep | 0;
  onboardingComplete: boolean;
}

export interface AppState {
  farmers: Farmer[];
  currentFarmerId: string | null;
  activeRole: Role;
  darkMode: boolean;
}
