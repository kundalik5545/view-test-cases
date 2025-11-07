"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileSpreadsheet, FileJson, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

// Enum values from Prisma schema
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

// "All" options must use unique non-empty string values
const ALL_VALUE_SUFFIX = "__ALL";
const SELECT_ITEMS = {
  automationStatus: [
    { value: ALL_VALUE_SUFFIX, label: "All" },
    ...AUTOMATION_STATUS.map((s) => ({ value: s, label: s })),
  ],
  testStatus: [
    { value: ALL_VALUE_SUFFIX, label: "All" },
    ...TEST_STATUS.map((s) => ({ value: s, label: s })),
  ],
  module: [
    { value: ALL_VALUE_SUFFIX, label: "All" },
    ...MODULE.map((s) => ({ value: s, label: s })),
  ],
  schemeLevel: [
    { value: ALL_VALUE_SUFFIX, label: "All" },
    ...SCHEME_LEVEL.map((s) => ({ value: s, label: s })),
  ],
  client: [
    { value: ALL_VALUE_SUFFIX, label: "All" },
    ...CLIENT.map((s) => ({ value: s, label: s })),
  ],
  releaseNo: [
    { value: ALL_VALUE_SUFFIX, label: "All" },
    ...RELEASE_NO.map((s) => ({ value: s, label: s })),
  ],
  priority: [
    { value: ALL_VALUE_SUFFIX, label: "All" },
    ...PRIORITY.map((s) => ({ value: s, label: s })),
  ],
  portal: [
    { value: ALL_VALUE_SUFFIX, label: "All" },
    ...PORTAL.map((s) => ({ value: s, label: s })),
  ],
  emReleaseNo: [
    { value: ALL_VALUE_SUFFIX, label: "All" },
    ...EM_RELEASE_NO.map((s) => ({ value: s, label: s })),
  ],
};

export default function ExportPage() {
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

  // Fetch counts on mount and when filters change (with debounce)
  useEffect(() => {
    const fetchXpsCount = async () => {
      setXpsLoading(true);
      try {
        const params = new URLSearchParams();
        Object.entries(xpsFilters).forEach(([key, value]) => {
          if (value && value !== ALL_VALUE_SUFFIX) {
            params.append(key, value);
          }
        });

        const url = `/api/test-cases/xps${
          params.toString() ? `?${params.toString()}` : ""
        }`;
        const res = await fetch(url);
        const data = await res.json();
        setXpsCount(data.count || 0);
      } catch (error) {
        console.error("Error fetching XPS count:", error);
        setXpsCount(0);
      } finally {
        setXpsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchXpsCount();
    }, 300);
    return () => clearTimeout(timer);
  }, [xpsFilters]);

  useEffect(() => {
    const fetchEmemberCount = async () => {
      setEmemberLoading(true);
      try {
        const params = new URLSearchParams();
        Object.entries(ememberFilters).forEach(([key, value]) => {
          if (value && value !== ALL_VALUE_SUFFIX) {
            params.append(key, value);
          }
        });

        const url = `/api/test-cases/emember${
          params.toString() ? `?${params.toString()}` : ""
        }`;
        const res = await fetch(url);
        const data = await res.json();
        setEmemberCount(data.count || 0);
      } catch (error) {
        console.error("Error fetching eMember count:", error);
        setEmemberCount(0);
      } finally {
        setEmemberLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchEmemberCount();
    }, 300);
    return () => clearTimeout(timer);
  }, [ememberFilters]);

  // Handle filter changes
  const handleXpsFilterChange = (key, value) => {
    setXpsFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleEmemberFilterChange = (key, value) => {
    setEmemberFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Export to Excel
  const handleExportExcel = async (type) => {
    setExporting((prev) => ({ ...prev, [type]: true }));
    try {
      const filters = type === "xps" ? xpsFilters : ememberFilters;

      // Remove 'all' or empty filters
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(
          ([_, value]) => value && value !== ALL_VALUE_SUFFIX
        )
      );

      const res = await fetch("/api/test-cases/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          filters: cleanFilters,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Export failed");
      }

      // Get filename from Content-Disposition header or generate one
      const contentDisposition = res.headers.get("Content-Disposition");
      let filename = `${type}-test-cases.xlsx`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Download file
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert(`Failed to export: ${error.message}`);
    } finally {
      setExporting((prev) => ({ ...prev, [type]: false }));
    }
  };

  // Export to JSON
  const handleExportJSON = async (type) => {
    setExporting((prev) => ({ ...prev, [type]: true }));
    try {
      const filters = type === "xps" ? xpsFilters : ememberFilters;

      // Build query params, skip ALL sentinel
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== ALL_VALUE_SUFFIX) {
          params.append(key, value);
        }
      });

      const url = `/api/test-cases/${type}${
        params.toString() ? `?${params.toString()}` : ""
      }`;
      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Export failed");
      }

      // Create JSON blob and download
      const jsonString = JSON.stringify(data.testCases, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url_blob = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url_blob;

      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, "-")
        .slice(0, -5);
      a.download = `${type}-test-cases-${timestamp}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url_blob);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error exporting to JSON:", error);
      alert(`Failed to export: ${error.message}`);
    } finally {
      setExporting((prev) => ({ ...prev, [type]: false }));
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 py-8">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold mb-2">Export Test Cases</h1>
          <p className="text-muted-foreground">
            Filter and export test cases in Excel or JSON format
          </p>
        </div>

        {/* Export Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* XPS Export Section */}
          <Card className="shadow-sm border">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-blue-600" />
                Export XPS Test Cases
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="space-y-3">
                <div className="text-sm font-medium text-muted-foreground">
                  Filters
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Automation Status
                    </label>
                    <Select
                      value={xpsFilters.automationStatus}
                      onValueChange={(value) =>
                        handleXpsFilterChange("automationStatus", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        {SELECT_ITEMS.automationStatus.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Test Status</label>
                    <Select
                      value={xpsFilters.testStatus}
                      onValueChange={(value) =>
                        handleXpsFilterChange("testStatus", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        {SELECT_ITEMS.testStatus.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Module</label>
                    <Select
                      value={xpsFilters.module}
                      onValueChange={(value) =>
                        handleXpsFilterChange("module", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        {SELECT_ITEMS.module.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Scheme Level</label>
                    <Select
                      value={xpsFilters.schemeLevel}
                      onValueChange={(value) =>
                        handleXpsFilterChange("schemeLevel", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        {SELECT_ITEMS.schemeLevel.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Client</label>
                    <Select
                      value={xpsFilters.client}
                      onValueChange={(value) =>
                        handleXpsFilterChange("client", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        {SELECT_ITEMS.client.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Release No</label>
                    <Select
                      value={xpsFilters.releaseNo}
                      onValueChange={(value) =>
                        handleXpsFilterChange("releaseNo", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        {SELECT_ITEMS.releaseNo.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Priority</label>
                    <Select
                      value={xpsFilters.priority}
                      onValueChange={(value) =>
                        handleXpsFilterChange("priority", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        {SELECT_ITEMS.priority.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Record Count */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="text-sm text-muted-foreground">
                  {xpsLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading...</span>
                    </div>
                  ) : (
                    <span>
                      {xpsCount} record{xpsCount !== 1 ? "s" : ""} found
                    </span>
                  )}
                </div>
              </div>

              {/* Export Buttons */}
              {xpsCount > 0 && (
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    onClick={() => handleExportExcel("xps")}
                    disabled={exporting.xps}
                    className="flex-1"
                    variant="default"
                  >
                    {exporting.xps ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Exporting...
                      </>
                    ) : (
                      <>
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        Export to Excel
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => handleExportJSON("xps")}
                    disabled={exporting.xps}
                    className="flex-1"
                    variant="outline"
                  >
                    {exporting.xps ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Exporting...
                      </>
                    ) : (
                      <>
                        <FileJson className="h-4 w-4 mr-2" />
                        Export to JSON
                      </>
                    )}
                  </Button>
                </div>
              )}

              {xpsCount === 0 && !xpsLoading && (
                <div className="text-sm text-muted-foreground text-center py-4">
                  No records found. Adjust filters to see results.
                </div>
              )}
            </CardContent>
          </Card>

          {/* eMember Export Section */}
          <Card className="shadow-sm border">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-green-600" />
                Export eMember Test Cases
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="space-y-3">
                <div className="text-sm font-medium text-muted-foreground">
                  Filters
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Automation Status
                    </label>
                    <Select
                      value={ememberFilters.automationStatus}
                      onValueChange={(value) =>
                        handleEmemberFilterChange("automationStatus", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        {SELECT_ITEMS.automationStatus.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Test Status</label>
                    <Select
                      value={ememberFilters.testStatus}
                      onValueChange={(value) =>
                        handleEmemberFilterChange("testStatus", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        {SELECT_ITEMS.testStatus.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Portal</label>
                    <Select
                      value={ememberFilters.portal}
                      onValueChange={(value) =>
                        handleEmemberFilterChange("portal", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        {SELECT_ITEMS.portal.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Release No</label>
                    <Select
                      value={ememberFilters.emReleaseNo}
                      onValueChange={(value) =>
                        handleEmemberFilterChange("emReleaseNo", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        {SELECT_ITEMS.emReleaseNo.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Priority</label>
                    <Select
                      value={ememberFilters.priority}
                      onValueChange={(value) =>
                        handleEmemberFilterChange("priority", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        {SELECT_ITEMS.priority.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Record Count */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="text-sm text-muted-foreground">
                  {ememberLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading...</span>
                    </div>
                  ) : (
                    <span>
                      {ememberCount} record{ememberCount !== 1 ? "s" : ""} found
                    </span>
                  )}
                </div>
              </div>

              {/* Export Buttons */}
              {ememberCount > 0 && (
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    onClick={() => handleExportExcel("emember")}
                    disabled={exporting.emember}
                    className="flex-1"
                    variant="default"
                  >
                    {exporting.emember ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Exporting...
                      </>
                    ) : (
                      <>
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        Export to Excel
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => handleExportJSON("emember")}
                    disabled={exporting.emember}
                    className="flex-1"
                    variant="outline"
                  >
                    {exporting.emember ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Exporting...
                      </>
                    ) : (
                      <>
                        <FileJson className="h-4 w-4 mr-2" />
                        Export to JSON
                      </>
                    )}
                  </Button>
                </div>
              )}

              {ememberCount === 0 && !ememberLoading && (
                <div className="text-sm text-muted-foreground text-center py-4">
                  No records found. Adjust filters to see results.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
