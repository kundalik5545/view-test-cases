"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CheckCircle,
  DownloadCloud,
  FileText,
  LoaderCircle,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";

const API_ENDPOINT = "/api/seed/upload-excel-file";

const modelOptions = [
  { label: "XPS Test Cases", value: "xpsTestCase" },
  { label: "eMember Test Cases", value: "eMemberTestCase" },
];

export default function DataUploadPage() {
  const [selectedModel, setSelectedModel] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleModelChange = (value) => {
    setSelectedModel(value);
    setMessage("");
    setError("");
  };

  const handleFileChange = (e) => {
    const uploadFile = e.target.files?.[0] ?? null;
    setFile(uploadFile);
    setFileName(uploadFile ? uploadFile.name : "");
    setMessage("");
    setError("");
  };

  const handleBrowseFile = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const uploadFile = e.dataTransfer?.files?.[0] ?? null;
    if (!uploadFile) return;
    setFile(uploadFile);
    setFileName(uploadFile.name);
    setMessage("");
    setError("");
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const clearFile = () => {
    setFile(null);
    setFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError("");
    setMessage("");

    if (!selectedModel) {
      setError("Please select a model.");
      setUploading(false);
      return;
    }
    if (!file) {
      setError("Please upload an Excel (.xlsx) file.");
      setUploading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("model", selectedModel);
      formData.append("file", file);

      const res = await fetch(API_ENDPOINT, {
        method: "POST",
        body: formData,
      });

      const resJson = await res.json();

      if (!res.ok) {
        setError(resJson.error || "Upload failed.");
      } else {
        setMessage(
          `Upload successful! Seeded ${resJson.rows ?? "unknown"} rows.`
        );
        clearFile();
      }
    } catch (err) {
      setError("Failed to upload. Please try again.");
    }
    setUploading(false);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-10 bg-gradient-to-b from-background via-transparent to-background">
      <Card className="w-full max-w-2xl shadow-2xl border overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 via-sky-500 to-cyan-400 px-6 py-5">
          <div className="flex items-center gap-4">
            <UploadCloud className="h-6 w-6 text-white" />
            <div>
              <h3 className="text-white text-lg font-semibold">Data Upload</h3>
              <p className="text-sm text-indigo-100/90">
                Seed test cases quickly from an Excel file
              </p>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="inline-flex items-center gap-2 text-sm font-medium text-white/95 hover:underline"
              >
                <DownloadCloud className="h-4 w-4" />
                Template
              </a>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
            {/* Drag & drop / file picker */}
            <div>
              <Label className="font-medium text-sm">
                Upload Excel File <span className="text-red-500">*</span>
              </Label>

              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className={cn(
                  "mt-3 flex items-center justify-between gap-4 rounded-lg border-2 border-dashed p-4 transition-shadow",
                  file
                    ? "border-sky-400 bg-sky-50/40"
                    : "border-muted-foreground/40 bg-transparent hover:shadow-sm"
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-md bg-white/80 shadow-sm">
                    <FileText className="h-6 w-6" />
                  </div>

                  <div className="min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">
                      {fileName || "Drag & drop, or choose a file"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Accepted: .xlsx, .xls — max 10MB
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {file && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="px-2"
                      onClick={clearFile}
                      title="Remove file"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}

                  <input
                    ref={fileInputRef}
                    id="file-input"
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <Button
                    type="button"
                    onClick={handleBrowseFile}
                    disabled={uploading}
                    size="sm"
                  >
                    Upload File
                  </Button>
                </div>
              </div>
            </div>

            {/* Model select */}
            <div>
              <Label className="font-medium text-sm">
                Select Model <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedModel}
                onValueChange={handleModelChange}
                disabled={uploading}
              >
                <SelectTrigger className="w-full mt-3">
                  <SelectValue placeholder="Choose a data model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Available models</SelectLabel>
                    {modelOptions.map((op) => (
                      <SelectItem value={op.value} key={op.value}>
                        {op.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-2">
                Make sure your Excel header columns match the selected model.
              </p>
            </div>

            {/* Submit and meta */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
              <div className="sm:col-span-2">
                <Button
                  type="submit"
                  className="w-full font-semibold"
                  size="lg"
                  disabled={uploading || !selectedModel || !file}
                >
                  {uploading ? (
                    <span className="flex items-center justify-center gap-2">
                      <LoaderCircle className="animate-spin h-5 w-5" />{" "}
                      Uploading...
                    </span>
                  ) : (
                    "Seed Data"
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSelectedModel("");
                    clearFile();
                    setMessage("");
                    setError("");
                  }}
                  disabled={uploading}
                >
                  Reset
                </Button>
              </div>
            </div>

            {/* Feedback */}
            <div>
              {message && (
                <div className="flex items-start gap-2 text-sm text-emerald-600 font-medium">
                  <CheckCircle className="h-5 w-5" />
                  <div>{message}</div>
                </div>
              )}

              {error && (
                <div className="flex items-start gap-2 text-sm text-destructive font-medium">
                  <AlertCircle className="h-5 w-5" />
                  <div>{error}</div>
                </div>
              )}

              {!message && !error && (
                <div className="text-xs text-muted-foreground mt-3">
                  Tip: download the template to see required headers.
                </div>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
