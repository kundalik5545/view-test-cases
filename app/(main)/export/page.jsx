"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileSpreadsheet,
  FileJson,
  Loader2,
  Download,
  Filter,
} from "lucide-react";

// constants (kept as provided)
const AUTOMATION_STATUS = [
  "Automated",
  "NotAutomated",
  "Blocked",
  "InProgress",
];
const TEST_STATUS = ["Passed", "Failed", "Blocked", "Skipped", "NotRun"];
const MODULE = [
  "Details",
  "ToolsAndProcesses",
  "Letters",
  "Leavers",
  "Reports",
  "Others",
];
const SCHEME_LEVEL = ["TL", "ML", "SL"];
const CLIENT = ["XPS", "Other"];
const RELEASE_NO = ["R3_43", "R3_44", "R3_45"];
const EM_RELEASE_NO = ["Old", "New", "Other"];
const PRIORITY = ["High", "Medium", "Low"];
const PORTAL = [
  "Admin",
  "Public",
  "CAT",
  "Fusion",
  "Umbraco",
  "DataHub",
  "Other",
];
const ALL_VALUE_SUFFIX = "__ALL";

const makeSelectItems = (arr) => [
  { value: ALL_VALUE_SUFFIX, label: "All" },
  ...arr.map((s) => ({ value: s, label: s })),
];

const SELECT_ITEMS = {
  automationStatus: makeSelectItems(AUTOMATION_STATUS),
  testStatus: makeSelectItems(TEST_STATUS),
  module: makeSelectItems(MODULE),
  schemeLevel: makeSelectItems(SCHEME_LEVEL),
  client: makeSelectItems(CLIENT),
  releaseNo: makeSelectItems(RELEASE_NO),
  priority: makeSelectItems(PRIORITY),
  portal: makeSelectItems(PORTAL),
  emReleaseNo: makeSelectItems(EM_RELEASE_NO),
};

export default function ExportPageRedesign() {
  const [xpsFilters, setXpsFilters] = useState({
    automationStatus: ALL_VALUE_SUFFIX,
    testStatus: ALL_VALUE_SUFFIX,
    module: ALL_VALUE_SUFFIX,
    schemeLevel: ALL_VALUE_SUFFIX,
    client: ALL_VALUE_SUFFIX,
    releaseNo: ALL_VALUE_SUFFIX,
    priority: ALL_VALUE_SUFFIX,
  });

  const [ememberFilters, setEmemberFilters] = useState({
    automationStatus: ALL_VALUE_SUFFIX,
    testStatus: ALL_VALUE_SUFFIX,
    portal: ALL_VALUE_SUFFIX,
    emReleaseNo: ALL_VALUE_SUFFIX,
    priority: ALL_VALUE_SUFFIX,
  });

  const [xpsCount, setXpsCount] = useState(0);
  const [ememberCount, setEmemberCount] = useState(0);
  const [xpsLoading, setXpsLoading] = useState(false);
  const [ememberLoading, setEmemberLoading] = useState(false);
  const [exporting, setExporting] = useState({ xps: false, emember: false });

  // debounce helper
  useEffect(() => {
    const t = setTimeout(fetchXpsCount, 250);
    return () => clearTimeout(t);
  }, [xpsFilters]);

  useEffect(() => {
    const t = setTimeout(fetchEmemberCount, 250);
    return () => clearTimeout(t);
  }, [ememberFilters]);

  async function fetchXpsCount() {
    setXpsLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(xpsFilters).forEach(([key, value]) => {
        if (value && value !== ALL_VALUE_SUFFIX) params.append(key, value);
      });
      const url = `/api/test-cases/xps${
        params.toString() ? `?${params.toString()}` : ""
      }`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setXpsCount(data.count ?? 0);
    } catch (e) {
      console.error(e);
      setXpsCount(0);
    } finally {
      setXpsLoading(false);
    }
  }

  async function fetchEmemberCount() {
    setEmemberLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(ememberFilters).forEach(([key, value]) => {
        if (value && value !== ALL_VALUE_SUFFIX) params.append(key, value);
      });
      const url = `/api/test-cases/emember${
        params.toString() ? `?${params.toString()}` : ""
      }`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setEmemberCount(data.count ?? 0);
    } catch (e) {
      console.error(e);
      setEmemberCount(0);
    } finally {
      setEmemberLoading(false);
    }
  }

  const handleXpsFilterChange = (key, value) =>
    setXpsFilters((p) => ({ ...p, [key]: value }));
  const handleEmemberFilterChange = (key, value) =>
    setEmemberFilters((p) => ({ ...p, [key]: value }));

  // Export helpers
  const doExport = async (type, format = "excel") => {
    setExporting((p) => ({ ...p, [type]: true }));
    try {
      const filters = type === "xps" ? xpsFilters : ememberFilters;
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v && v !== ALL_VALUE_SUFFIX)
      );

      if (format === "excel") {
        const res = await fetch("/api/test-cases/export", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, filters: cleanFilters }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Export failed");
        }
        const contentDisposition = res.headers.get("Content-Disposition");
        let filename = `${type}-test-cases.xlsx`;
        if (contentDisposition) {
          const match = contentDisposition.match(/filename="(.+)"/);
          if (match) filename = match[1];
        }
        const blob = await res.blob();
        downloadBlob(blob, filename);
      } else {
        // json export uses GET list endpoint
        const params = new URLSearchParams(cleanFilters);
        const url = `/api/test-cases/${type}${
          params.toString() ? `?${params.toString()}` : ""
        }`;
        const res = await fetch(url);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Export failed");
        const jsonString = JSON.stringify(data.testCases ?? data, null, 2);
        const b = new Blob([jsonString], { type: "application/json" });
        const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5);
        downloadBlob(b, `${type}-test-cases-${ts}.json`);
      }
    } catch (err) {
      console.error(err);
      alert(`Export failed: ${err.message}`);
    } finally {
      setExporting((p) => ({ ...p, [type]: false }));
    }
  };

  const downloadBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const ResetFiltersButton = ({ onReset }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={onReset}
      className="flex items-center gap-2"
    >
      <Filter className="h-4 w-4" /> Reset
    </Button>
  );

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 py-8 pt-20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        {/* header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold">Export Test Cases</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Filter and export XPS or eMember test cases — responsive, clean
              dashboard style
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* XPS */}
          <Card className="shadow-sm border">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-3">
                <FileSpreadsheet className="h-5 w-5 text-blue-600" /> Export XPS
              </CardTitle>
              <div className="flex items-center gap-3">
                <ResetFiltersButton
                  onReset={() =>
                    setXpsFilters({
                      automationStatus: ALL_VALUE_SUFFIX,
                      testStatus: ALL_VALUE_SUFFIX,
                      module: ALL_VALUE_SUFFIX,
                      schemeLevel: ALL_VALUE_SUFFIX,
                      client: ALL_VALUE_SUFFIX,
                      releaseNo: ALL_VALUE_SUFFIX,
                      priority: ALL_VALUE_SUFFIX,
                    })
                  }
                />
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="text-sm font-medium text-muted-foreground">
                Filters
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* each filter group */}
                <FilterRow
                  label="Automation"
                  value={xpsFilters.automationStatus}
                  onChange={(v) => handleXpsFilterChange("automationStatus", v)}
                  items={SELECT_ITEMS.automationStatus}
                />
                <FilterRow
                  label="Test Status"
                  value={xpsFilters.testStatus}
                  onChange={(v) => handleXpsFilterChange("testStatus", v)}
                  items={SELECT_ITEMS.testStatus}
                />
                <FilterRow
                  label="Module"
                  value={xpsFilters.module}
                  onChange={(v) => handleXpsFilterChange("module", v)}
                  items={SELECT_ITEMS.module}
                />
                <FilterRow
                  label="Scheme Level"
                  value={xpsFilters.schemeLevel}
                  onChange={(v) => handleXpsFilterChange("schemeLevel", v)}
                  items={SELECT_ITEMS.schemeLevel}
                />
                <FilterRow
                  label="Client"
                  value={xpsFilters.client}
                  onChange={(v) => handleXpsFilterChange("client", v)}
                  items={SELECT_ITEMS.client}
                />
                <FilterRow
                  label="Release"
                  value={xpsFilters.releaseNo}
                  onChange={(v) => handleXpsFilterChange("releaseNo", v)}
                  items={SELECT_ITEMS.releaseNo}
                />
                <FilterRow
                  label="Priority"
                  value={xpsFilters.priority}
                  onChange={(v) => handleXpsFilterChange("priority", v)}
                  items={SELECT_ITEMS.priority}
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  {xpsLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Loading...
                    </div>
                  ) : (
                    <span className="text-sm">
                      {xpsCount} record{xpsCount !== 1 ? "s" : ""} found
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    disabled={xpsCount === 0 || exporting.xps}
                    onClick={() => doExport("xps", "excel")}
                  >
                    {exporting.xps ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />{" "}
                        Exporting...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" /> Export Excel
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    disabled={xpsCount === 0 || exporting.xps}
                    onClick={() => doExport("xps", "json")}
                  >
                    {exporting.xps ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />{" "}
                        Exporting...
                      </>
                    ) : (
                      <>
                        <FileJson className="h-4 w-4 mr-2" /> Export JSON
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* eMember */}
          <Card className="shadow-sm border">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-3">
                <FileSpreadsheet className="h-5 w-5 text-green-600" /> Export
                eMember
              </CardTitle>
              <div className="flex items-center gap-3">
                <ResetFiltersButton
                  onReset={() =>
                    setEmemberFilters({
                      automationStatus: ALL_VALUE_SUFFIX,
                      testStatus: ALL_VALUE_SUFFIX,
                      portal: ALL_VALUE_SUFFIX,
                      emReleaseNo: ALL_VALUE_SUFFIX,
                      priority: ALL_VALUE_SUFFIX,
                    })
                  }
                />
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="text-sm font-medium text-muted-foreground">
                Filters
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FilterRow
                  label="Automation"
                  value={ememberFilters.automationStatus}
                  onChange={(v) =>
                    handleEmemberFilterChange("automationStatus", v)
                  }
                  items={SELECT_ITEMS.automationStatus}
                />
                <FilterRow
                  label="Test Status"
                  value={ememberFilters.testStatus}
                  onChange={(v) => handleEmemberFilterChange("testStatus", v)}
                  items={SELECT_ITEMS.testStatus}
                />
                <FilterRow
                  label="Portal"
                  value={ememberFilters.portal}
                  onChange={(v) => handleEmemberFilterChange("portal", v)}
                  items={SELECT_ITEMS.portal}
                />
                <FilterRow
                  label="Release"
                  value={ememberFilters.emReleaseNo}
                  onChange={(v) => handleEmemberFilterChange("emReleaseNo", v)}
                  items={SELECT_ITEMS.emReleaseNo}
                />
                <FilterRow
                  label="Priority"
                  value={ememberFilters.priority}
                  onChange={(v) => handleEmemberFilterChange("priority", v)}
                  items={SELECT_ITEMS.priority}
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  {ememberLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Loading...
                    </div>
                  ) : (
                    <span className="text-sm">
                      {ememberCount} record{ememberCount !== 1 ? "s" : ""} found
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    disabled={ememberCount === 0 || exporting.emember}
                    onClick={() => doExport("emember", "excel")}
                  >
                    {exporting.emember ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />{" "}
                        Exporting...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" /> Export Excel
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    disabled={ememberCount === 0 || exporting.emember}
                    onClick={() => doExport("emember", "json")}
                  >
                    {exporting.emember ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />{" "}
                        Exporting...
                      </>
                    ) : (
                      <>
                        <FileJson className="h-4 w-4 mr-2" /> Export JSON
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// small helper component used above
function FilterRow({ label, value, onChange, items }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          {items.map((it) => (
            <SelectItem key={it.value} value={it.value}>
              {it.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
