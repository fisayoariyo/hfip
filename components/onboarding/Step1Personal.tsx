"use client";
// components/onboarding/Step1Personal.tsx
// Collects farmer's personal details. All inputs are large for easy tapping.
import { useState } from "react";
import type { PersonalInfo } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FormField from "@/components/shared/FormField";
import { NIGERIAN_STATES } from "@/lib/fakeData";
import { ArrowRight } from "lucide-react";

interface Props {
  data: PersonalInfo;
  onNext: (data: PersonalInfo) => void;
}

export default function Step1Personal({ data, onNext }: Props) {
  const [form, setForm] = useState<PersonalInfo>(data);
  const [errors, setErrors] = useState<Partial<Record<keyof PersonalInfo, string>>>({});

  function set(key: keyof PersonalInfo, val: string) {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: "" }));
  }

  function validate(): boolean {
    const e: typeof errors = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim()) e.lastName = "Last name is required";
    if (!/^0[789]\d{9}$/.test(form.phone)) e.phone = "Enter a valid Nigerian phone number (e.g. 08012345678)";
    if (!form.gender) e.gender = "Please select a gender";
    if (!form.nextOfKin.trim()) e.nextOfKin = "Next of kin name is required";
    if (!form.state) e.state = "Please select your state";
    if (!form.lga.trim()) e.lga = "Please enter your LGA";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  return (
    <div className="animate-fade-in space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="First Name" required error={errors.firstName}>
          <Input placeholder="e.g. Aminu" value={form.firstName} onChange={e => set("firstName", e.target.value)} />
        </FormField>
        <FormField label="Last Name" required error={errors.lastName}>
          <Input placeholder="e.g. Musa" value={form.lastName} onChange={e => set("lastName", e.target.value)} />
        </FormField>
      </div>

      <FormField label="Phone Number" required error={errors.phone} hint="Must be a valid Nigerian mobile number">
        <Input placeholder="08012345678" type="tel" inputMode="numeric" value={form.phone} onChange={e => set("phone", e.target.value)} />
      </FormField>

      <FormField label="Gender" required error={errors.gender}>
        <Select value={form.gender} onValueChange={v => set("gender", v)}>
          <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </FormField>

      <FormField label="Date of Birth" hint="Optional">
        <Input type="date" value={form.dob} onChange={e => set("dob", e.target.value)} />
      </FormField>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Next of Kin (Full Name)" required error={errors.nextOfKin}>
          <Input placeholder="e.g. Fatima Musa" value={form.nextOfKin} onChange={e => set("nextOfKin", e.target.value)} />
        </FormField>
        <FormField label="Next of Kin Phone">
          <Input placeholder="08087654321" type="tel" inputMode="numeric" value={form.nextOfKinPhone} onChange={e => set("nextOfKinPhone", e.target.value)} />
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="State" required error={errors.state}>
          <Select value={form.state} onValueChange={v => set("state", v)}>
            <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
            <SelectContent>
              {NIGERIAN_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Local Government Area (LGA)" required error={errors.lga}>
          <Input placeholder="e.g. Gwale" value={form.lga} onChange={e => set("lga", e.target.value)} />
        </FormField>
      </div>

      <Button size="xl" className="w-full mt-2" onClick={() => validate() && onNext(form)}>
        Save & Continue <ArrowRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
