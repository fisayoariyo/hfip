"use client";
// components/onboarding/Step4Documents.tsx
// Collects financial details, land title, and input history.
// File upload is a UI placeholder — in production files go to S3/NestJS.
import { useState } from "react";
import type { DocumentInfo } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FormField from "@/components/shared/FormField";
import { BANK_NAMES, INPUT_TYPES } from "@/lib/fakeData";
import { ArrowLeft, CheckCircle2, FileText, Upload, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  data: DocumentInfo;
  onSubmit: (data: DocumentInfo) => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

export default function Step4Documents({ data, onSubmit, onBack, isSubmitting }: Props) {
  const [form, setForm] = useState<DocumentInfo>(data);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  function set<K extends keyof DocumentInfo>(key: K, val: DocumentInfo[K]) {
    setForm(f => ({ ...f, [key]: val }));
  }

  function toggleInput(input: string) {
    const current = form.inputsUsed;
    const next = current.includes(input) ? current.filter(i => i !== input) : [...current, input];
    set("inputsUsed", next);
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setUploadedFiles(prev => [...prev, ...files.map(f => f.name)]);
    set("fileUploaded", true);
  }

  function removeFile(name: string) {
    const next = uploadedFiles.filter(f => f !== name);
    setUploadedFiles(next);
    if (next.length === 0) set("fileUploaded", false);
  }

  return (
    <div className="animate-fade-in space-y-5">
      <p className="text-sm text-muted-foreground">
        These details help verify your land ownership and connect you to financial services.
        All fields are optional but recommended.
      </p>

      <FormField label="Land Title / Certificate Number" hint="e.g. LT-KN-0041">
        <Input placeholder="LT-XX-0000" value={form.landTitleNumber} onChange={e => set("landTitleNumber", e.target.value)} />
      </FormField>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Bank Name">
          <Select value={form.bankName} onValueChange={v => set("bankName", v)}>
            <SelectTrigger><SelectValue placeholder="Select bank" /></SelectTrigger>
            <SelectContent>
              {BANK_NAMES.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Account Number" hint="10-digit NUBAN">
          <Input placeholder="3012345678" type="tel" inputMode="numeric" maxLength={10}
            value={form.accountNumber} onChange={e => set("accountNumber", e.target.value)} />
        </FormField>
      </div>

      <FormField label="Cooperative / Farmer Group (if any)">
        <Input placeholder="e.g. Kano Growers Cooperative" value={form.cooperativeName}
          onChange={e => set("cooperativeName", e.target.value)} />
      </FormField>

      {/* Inputs used last season — multi-select toggle chips */}
      <div className="space-y-2">
        <p className="text-sm font-semibold">Inputs Used Last Season</p>
        <p className="text-xs text-muted-foreground">Tap all that apply</p>
        <div className="flex flex-wrap gap-2">
          {INPUT_TYPES.map(input => {
            const active = form.inputsUsed.includes(input);
            return (
              <button key={input} onClick={() => toggleInput(input)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:border-primary/50"
                )}>
                {active && <CheckCircle2 className="mr-1 inline h-3 w-3" />}
                {input}
              </button>
            );
          })}
        </div>
      </div>

      {/* Document upload */}
      <div className="space-y-2">
        <p className="text-sm font-semibold">Upload Supporting Documents</p>
        <p className="text-xs text-muted-foreground">Land certificate, ID card, farm photos (PDF or image)</p>

        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-border bg-muted/30 px-6 py-8 text-center transition hover:border-primary hover:bg-primary/5">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <span className="text-sm font-medium">Tap to upload files</span>
          <span className="text-xs text-muted-foreground">PNG, JPG, PDF up to 10MB each</span>
          <input type="file" multiple accept="image/*,.pdf" className="hidden" onChange={handleFileUpload} />
        </label>

        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            {uploadedFiles.map(name => (
              <div key={name} className="flex items-center gap-3 rounded-xl bg-emerald-50 px-4 py-3 dark:bg-emerald-950/20">
                <FileText className="h-4 w-4 shrink-0 text-emerald-600" />
                <span className="flex-1 truncate text-sm font-medium text-emerald-800 dark:text-emerald-300">{name}</span>
                <button onClick={() => removeFile(name)} className="text-muted-foreground hover:text-destructive">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <Button size="xl" variant="outline" className="flex-1" onClick={onBack} disabled={isSubmitting}>
          <ArrowLeft className="h-5 w-5" /> Back
        </Button>
        <Button size="xl" className="flex-1" onClick={() => onSubmit(form)} disabled={isSubmitting}>
          {isSubmitting ? (
            <><Loader2 className="h-5 w-5 animate-spin" /> Submitting…</>
          ) : (
            <><CheckCircle2 className="h-5 w-5" /> Complete Registration</>
          )}
        </Button>
      </div>
    </div>
  );
}
