// lib/fakeData.ts — demo data seeded on first load
import type { Farmer } from "@/types";

export const FAKE_FARMERS: Farmer[] = [
  { id:"HFIP-2026-0001", status:"verified", createdAt:"2026-01-10T08:30:00Z", completedStep:4, onboardingComplete:true,
    personalInfo:{ firstName:"Aminu",lastName:"Musa",phone:"08012345678",gender:"male",nextOfKin:"Fatima Musa",nextOfKinPhone:"08087654321",dob:"1985-04-12",state:"Kano",lga:"Gwale" },
    biometric:{ fingerprintCaptured:true, faceCaptured:true },
    farmInfo:{ gpsLat:11.9964, gpsLng:8.5167, acreage:4.5, cropType:"Soya Bean", soilType:"Loamy", expectedYield:2700, season:"wet" },
    documents:{ landTitleNumber:"LT-KN-0041",bankName:"First Bank",accountNumber:"3012345678",cooperativeName:"Kano Growers Coop",fileUploaded:true,inputsUsed:["Fertiliser","Herbicide"] } },

  { id:"HFIP-2026-0002", status:"verified", createdAt:"2026-01-15T10:00:00Z", completedStep:4, onboardingComplete:true,
    personalInfo:{ firstName:"Ngozi",lastName:"Okafor",phone:"08023456789",gender:"female",nextOfKin:"Emeka Okafor",nextOfKinPhone:"08098765432",dob:"1991-08-22",state:"Enugu",lga:"Igbo-Eze North" },
    biometric:{ fingerprintCaptured:true, faceCaptured:true },
    farmInfo:{ gpsLat:6.8612, gpsLng:7.4985, acreage:2.0, cropType:"Soya Bean", soilType:"Sandy Loam", expectedYield:1200, season:"wet" },
    documents:{ landTitleNumber:"LT-EN-0098",bankName:"UBA",accountNumber:"2034567890",cooperativeName:"Enugu Women Farmers",fileUploaded:true,inputsUsed:["Fertiliser"] } },

  { id:"HFIP-2026-0003", status:"pending", createdAt:"2026-02-03T09:15:00Z", completedStep:4, onboardingComplete:true,
    personalInfo:{ firstName:"Tunde",lastName:"Adeyemi",phone:"08034567890",gender:"male",nextOfKin:"Bisi Adeyemi",nextOfKinPhone:"08011223344",dob:"1979-12-05",state:"Oyo",lga:"Ibadan North" },
    biometric:{ fingerprintCaptured:true, faceCaptured:false },
    farmInfo:{ gpsLat:7.3775, gpsLng:3.947, acreage:7.2, cropType:"Maize", soilType:"Clay", expectedYield:5040, season:"wet" },
    documents:{ landTitleNumber:"LT-OY-0211",bankName:"Zenith Bank",accountNumber:"1056789012",cooperativeName:"Oyo Farmers Alliance",fileUploaded:false,inputsUsed:["Fertiliser","Pesticide","Herbicide"] } },

  { id:"HFIP-2026-0004", status:"pending", createdAt:"2026-02-28T14:00:00Z", completedStep:2, onboardingComplete:false,
    personalInfo:{ firstName:"Hauwa",lastName:"Ibrahim",phone:"08045678901",gender:"female",nextOfKin:"Musa Ibrahim",nextOfKinPhone:"08055667788",dob:"1995-06-30",state:"Borno",lga:"Maiduguri" },
    biometric:{ fingerprintCaptured:false, faceCaptured:false },
    farmInfo:{ gpsLat:11.8311, gpsLng:13.151, acreage:1.5, cropType:"Soya Bean", soilType:"Sandy", expectedYield:750, season:"dry" },
    documents:{ landTitleNumber:"",bankName:"",accountNumber:"",cooperativeName:"",fileUploaded:false,inputsUsed:[] } },

  { id:"HFIP-2026-0005", status:"rejected", createdAt:"2026-03-01T11:00:00Z", completedStep:4, onboardingComplete:true,
    personalInfo:{ firstName:"Chukwuemeka",lastName:"Eze",phone:"08056789012",gender:"male",nextOfKin:"Ada Eze",nextOfKinPhone:"08099887766",dob:"1988-02-14",state:"Anambra",lga:"Onitsha North" },
    biometric:{ fingerprintCaptured:true, faceCaptured:true },
    farmInfo:{ gpsLat:6.1421, gpsLng:6.7922, acreage:3.8, cropType:"Rice", soilType:"Loamy", expectedYield:3800, season:"wet" },
    documents:{ landTitleNumber:"LT-AN-0077",bankName:"GTBank",accountNumber:"0078901234",cooperativeName:"Anambra Rice Farmers",fileUploaded:true,inputsUsed:["Fertiliser","Seed","Pesticide"] } },
];

export const NIGERIAN_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT","Gombe","Imo",
  "Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa",
  "Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara",
];

export const CROP_TYPES = ["Soya Bean","Maize","Rice","Cassava","Yam","Cowpea","Groundnut","Sorghum","Millet","Wheat","Cotton"];
export const SOIL_TYPES = ["Loamy","Sandy Loam","Clay","Sandy","Silty","Peat","Chalky"];
export const BANK_NAMES = ["Access Bank","First Bank","GTBank","UBA","Zenith Bank","Stanbic IBTC","Polaris Bank","Union Bank","Fidelity Bank","Ecobank"];
export const INPUT_TYPES = ["Fertiliser","Herbicide","Pesticide","Fungicide","Improved Seed","Irrigation Equipment","Tractor Services"];

// Fake productivity data used on the farmer dashboard
export const PRODUCTIVITY = {
  actualYield: 2450,
  expectedYield: 2700,
  revenue: 1837500,
  inputCost: 450000,
  profit: 1387500,
  trends: [
    { season:"Wet '24",yield:2100 },
    { season:"Dry '24",yield:1800 },
    { season:"Wet '25",yield:2350 },
    { season:"Dry '25",yield:2100 },
    { season:"Wet '26",yield:2450 },
  ],
};
