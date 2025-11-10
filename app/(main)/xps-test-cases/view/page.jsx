"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import XpsTcForm from "../_components/xpsTcForm";
import ScreenshotManager from "@/components/ScreenshotManager";
import { PlusIcon, X } from "lucide-react";

const XpsTcViewPage = () => {
  const searchParams = useSearchParams();
  const [testCases, setTestCases] = useState([]);
  const [filteredTestCases, setFilteredTestCases] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [moduleFilter, setModuleFilter] = useState("");
  const [schemeLevelFilter, setSchemeLevelFilter] = useState("");
  const [automationStatusFilter, setAutomationStatusFilter] = useState("");
  const [testStatusFilter, setTestStatusFilter] = useState("");
  const [clientFilter, setClientFilter] = useState("");
  const [releaseNoFilter, setReleaseNoFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  useEffect(() => {
    fetchTestCases();
  }, []);

  // Apply filters whenever testCases or filters change
  useEffect(() => {
    let filtered = [...testCases];

    if (moduleFilter) {
      filtered = filtered.filter((tc) => tc.module === moduleFilter);
    }

    if (schemeLevelFilter) {
      filtered = filtered.filter((tc) => tc.schemeLevel === schemeLevelFilter);
    }

    if (automationStatusFilter) {
      filtered = filtered.filter(
        (tc) => tc.automationStatus === automationStatusFilter
      );
    }

    if (testStatusFilter) {
      filtered = filtered.filter((tc) => tc.testStatus === testStatusFilter);
    }

    if (clientFilter) {
      filtered = filtered.filter((tc) => tc.client === clientFilter);
    }

    if (releaseNoFilter) {
      filtered = filtered.filter((tc) => tc.releaseNo === releaseNoFilter);
    }

    if (priorityFilter) {
      filtered = filtered.filter((tc) => tc.priority === priorityFilter);
    }

    setFilteredTestCases(filtered);
    // Reset to first item when filters change, or clamp index if out of bounds
    setCurrentIndex(0);
  }, [
    testCases,
    moduleFilter,
    schemeLevelFilter,
    automationStatusFilter,
    testStatusFilter,
    clientFilter,
    releaseNoFilter,
    priorityFilter,
  ]);

  // Handle testCaseId query parameter after filtered test cases are loaded
  useEffect(() => {
    const testCaseId = searchParams.get("testCaseId");
    if (testCaseId && filteredTestCases.length > 0) {
      const index = filteredTestCases.findIndex(
        (tc) => tc.testCaseId === testCaseId
      );
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [filteredTestCases, searchParams]);

  const fetchTestCases = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/test-cases/xps");
      if (!response.ok) {
        throw new Error("Failed to fetch test cases");
      }
      const data = await response.json();
      setTestCases(data.testCases || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching test cases:", err);
      setError("Failed to load test cases. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setSuccessMessage(null);
    setError(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    setSuccessMessage(null);
  };

  const handleSave = async (formData) => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);

      const response = await fetch("/api/test-cases/xps", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update test case");
      }

      const data = await response.json();

      // Update the test case in the local state
      // Find the index in the full testCases array, not filteredTestCases
      const fullIndex = testCases.findIndex((tc) => tc.id === formData.id);
      if (fullIndex !== -1) {
        const updatedTestCases = [...testCases];
        updatedTestCases[fullIndex] = data.testCase;
        setTestCases(updatedTestCases);
      }

      setIsEditing(false);
      setSuccessMessage("Test case updated successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Error updating test case:", err);
      setError(err.message || "Failed to update test case. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsEditing(false);
      setError(null);
      setSuccessMessage(null);
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredTestCases.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsEditing(false);
      setError(null);
      setSuccessMessage(null);
    }
  };

  const handleClearFilters = () => {
    setModuleFilter("");
    setSchemeLevelFilter("");
    setAutomationStatusFilter("");
    setTestStatusFilter("");
    setClientFilter("");
    setReleaseNoFilter("");
    setPriorityFilter("");
  };

  const hasActiveFilters =
    moduleFilter ||
    schemeLevelFilter ||
    automationStatusFilter ||
    testStatusFilter ||
    clientFilter ||
    releaseNoFilter ||
    priorityFilter;
  const currentTestCase = filteredTestCases[currentIndex];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Loading test cases...</p>
        </div>
      </div>
    );
  }

  if (testCases.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No test cases found.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (filteredTestCases.length === 0 && hasActiveFilters) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">XPS Test Cases</h1>
          <p className="text-muted-foreground">View and edit XPS test cases</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 items-end">
              <div className="space-y-2 min-w-[200px]">
                <Label htmlFor="module-filter">Module</Label>
                <Select
                  value={moduleFilter || undefined}
                  onValueChange={(value) =>
                    setModuleFilter(value === "__all__" ? "" : value)
                  }
                >
                  <SelectTrigger id="module-filter">
                    <SelectValue placeholder="All Modules" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">All Modules</SelectItem>
                    <SelectItem value="Details">Details</SelectItem>
                    <SelectItem value="ToolsAndProcesses">
                      Tools and Processes
                    </SelectItem>
                    <SelectItem value="Letters">Letters</SelectItem>
                    <SelectItem value="Leavers">Leavers</SelectItem>
                    <SelectItem value="Reports">Reports</SelectItem>
                    <SelectItem value="Others">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 min-w-[200px]">
                <Label htmlFor="scheme-level-filter">Scheme Level</Label>
                <Select
                  value={schemeLevelFilter || undefined}
                  onValueChange={(value) =>
                    setSchemeLevelFilter(value === "__all__" ? "" : value)
                  }
                >
                  <SelectTrigger id="scheme-level-filter">
                    <SelectValue placeholder="All Scheme Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">All Scheme Levels</SelectItem>
                    <SelectItem value="TL">TL</SelectItem>
                    <SelectItem value="ML">ML</SelectItem>
                    <SelectItem value="SL">SL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 min-w-[200px]">
                <Label htmlFor="automation-status-filter">
                  Automation Status
                </Label>
                <Select
                  value={automationStatusFilter || undefined}
                  onValueChange={(value) =>
                    setAutomationStatusFilter(value === "__all__" ? "" : value)
                  }
                >
                  <SelectTrigger id="automation-status-filter">
                    <SelectValue placeholder="All Automation Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">All Automation Status</SelectItem>
                    <SelectItem value="Automated">Automated</SelectItem>
                    <SelectItem value="NotAutomated">Not Automated</SelectItem>
                    <SelectItem value="Blocked">Blocked</SelectItem>
                    <SelectItem value="InProgress">In Progress</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 min-w-[200px]">
                <Label htmlFor="test-status-filter">Test Status</Label>
                <Select
                  value={testStatusFilter || undefined}
                  onValueChange={(value) =>
                    setTestStatusFilter(value === "__all__" ? "" : value)
                  }
                >
                  <SelectTrigger id="test-status-filter">
                    <SelectValue placeholder="All Test Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">All Test Status</SelectItem>
                    <SelectItem value="NotRun">Not Run</SelectItem>
                    <SelectItem value="Passed">Passed</SelectItem>
                    <SelectItem value="Failed">Failed</SelectItem>
                    <SelectItem value="Blocked">Blocked</SelectItem>
                    <SelectItem value="Skipped">Skipped</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 min-w-[200px]">
                <Label htmlFor="client-filter">Client</Label>
                <Select
                  value={clientFilter || undefined}
                  onValueChange={(value) =>
                    setClientFilter(value === "__all__" ? "" : value)
                  }
                >
                  <SelectTrigger id="client-filter">
                    <SelectValue placeholder="All Clients" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">All Clients</SelectItem>
                    <SelectItem value="XPS">XPS</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 min-w-[200px]">
                <Label htmlFor="release-no-filter">Release No</Label>
                <Select
                  value={releaseNoFilter || undefined}
                  onValueChange={(value) =>
                    setReleaseNoFilter(value === "__all__" ? "" : value)
                  }
                >
                  <SelectTrigger id="release-no-filter">
                    <SelectValue placeholder="All Release Numbers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">All Release Numbers</SelectItem>
                    <SelectItem value="R3_43">R3_43</SelectItem>
                    <SelectItem value="R3_44">R3_44</SelectItem>
                    <SelectItem value="R3_45">R3_45</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 min-w-[200px]">
                <Label htmlFor="priority-filter">Priority</Label>
                <Select
                  value={priorityFilter || undefined}
                  onValueChange={(value) =>
                    setPriorityFilter(value === "__all__" ? "" : value)
                  }
                >
                  <SelectTrigger id="priority-filter">
                    <SelectValue placeholder="All Priorities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">All Priorities</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No test cases found matching the selected filters.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Ensure we have a valid test case before rendering
  if (!currentTestCase || filteredTestCases.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">XPS Test Cases</h1>
          <p className="text-muted-foreground">View and edit XPS test cases</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 items-end">
              <div className="space-y-2 min-w-[200px]">
                <Label htmlFor="module-filter">Module</Label>
                <Select
                  value={moduleFilter || undefined}
                  onValueChange={(value) =>
                    setModuleFilter(value === "__all__" ? "" : value)
                  }
                >
                  <SelectTrigger id="module-filter">
                    <SelectValue placeholder="All Modules" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">All Modules</SelectItem>
                    <SelectItem value="Details">Details</SelectItem>
                    <SelectItem value="ToolsAndProcesses">
                      Tools and Processes
                    </SelectItem>
                    <SelectItem value="Letters">Letters</SelectItem>
                    <SelectItem value="Leavers">Leavers</SelectItem>
                    <SelectItem value="Reports">Reports</SelectItem>
                    <SelectItem value="Others">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 min-w-[200px]">
                <Label htmlFor="scheme-level-filter">Scheme Level</Label>
                <Select
                  value={schemeLevelFilter || undefined}
                  onValueChange={(value) =>
                    setSchemeLevelFilter(value === "__all__" ? "" : value)
                  }
                >
                  <SelectTrigger id="scheme-level-filter">
                    <SelectValue placeholder="All Scheme Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">All Scheme Levels</SelectItem>
                    <SelectItem value="TL">TL</SelectItem>
                    <SelectItem value="ML">ML</SelectItem>
                    <SelectItem value="SL">SL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 min-w-[200px]">
                <Label htmlFor="automation-status-filter">
                  Automation Status
                </Label>
                <Select
                  value={automationStatusFilter || undefined}
                  onValueChange={(value) =>
                    setAutomationStatusFilter(value === "__all__" ? "" : value)
                  }
                >
                  <SelectTrigger id="automation-status-filter">
                    <SelectValue placeholder="All Automation Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">All Automation Status</SelectItem>
                    <SelectItem value="Automated">Automated</SelectItem>
                    <SelectItem value="NotAutomated">Not Automated</SelectItem>
                    <SelectItem value="Blocked">Blocked</SelectItem>
                    <SelectItem value="InProgress">In Progress</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 min-w-[200px]">
                <Label htmlFor="test-status-filter">Test Status</Label>
                <Select
                  value={testStatusFilter || undefined}
                  onValueChange={(value) =>
                    setTestStatusFilter(value === "__all__" ? "" : value)
                  }
                >
                  <SelectTrigger id="test-status-filter">
                    <SelectValue placeholder="All Test Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">All Test Status</SelectItem>
                    <SelectItem value="NotRun">Not Run</SelectItem>
                    <SelectItem value="Passed">Passed</SelectItem>
                    <SelectItem value="Failed">Failed</SelectItem>
                    <SelectItem value="Blocked">Blocked</SelectItem>
                    <SelectItem value="Skipped">Skipped</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 min-w-[200px]">
                <Label htmlFor="client-filter">Client</Label>
                <Select
                  value={clientFilter || undefined}
                  onValueChange={(value) =>
                    setClientFilter(value === "__all__" ? "" : value)
                  }
                >
                  <SelectTrigger id="client-filter">
                    <SelectValue placeholder="All Clients" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">All Clients</SelectItem>
                    <SelectItem value="XPS">XPS</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 min-w-[200px]">
                <Label htmlFor="release-no-filter">Release No</Label>
                <Select
                  value={releaseNoFilter || undefined}
                  onValueChange={(value) =>
                    setReleaseNoFilter(value === "__all__" ? "" : value)
                  }
                >
                  <SelectTrigger id="release-no-filter">
                    <SelectValue placeholder="All Release Numbers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">All Release Numbers</SelectItem>
                    <SelectItem value="R3_43">R3_43</SelectItem>
                    <SelectItem value="R3_44">R3_44</SelectItem>
                    <SelectItem value="R3_45">R3_45</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 min-w-[200px]">
                <Label htmlFor="priority-filter">Priority</Label>
                <Select
                  value={priorityFilter || undefined}
                  onValueChange={(value) =>
                    setPriorityFilter(value === "__all__" ? "" : value)
                  }
                >
                  <SelectTrigger id="priority-filter">
                    <SelectValue placeholder="All Priorities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">All Priorities</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear Filters
                </Button>
              )}
            </div>
            {hasActiveFilters && (
              <div className="mt-4 text-sm text-muted-foreground">
                Showing {filteredTestCases.length} of {testCases.length} test
                cases
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No test cases available.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className=" flex items-center justify-between mb-6">
        <div className="">
          <h1 className="text-3xl font-bold mb-2">XPS Test Cases</h1>
          <p className="text-muted-foreground">View and edit XPS test cases</p>
        </div>
        <div className="">
          <Button variant="outline">
            <PlusIcon /> Add Test Case
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-md text-destructive">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-md text-green-700 dark:text-green-400">
          {successMessage}
        </div>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-2 min-w-[200px]">
              <Label htmlFor="module-filter">Module</Label>
              <Select
                value={moduleFilter || undefined}
                onValueChange={(value) =>
                  setModuleFilter(value === "__all__" ? "" : value)
                }
              >
                <SelectTrigger id="module-filter">
                  <SelectValue placeholder="All Modules" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All Modules</SelectItem>
                  <SelectItem value="Details">Details</SelectItem>
                  <SelectItem value="ToolsAndProcesses">
                    Tools and Processes
                  </SelectItem>
                  <SelectItem value="Letters">Letters</SelectItem>
                  <SelectItem value="Leavers">Leavers</SelectItem>
                  <SelectItem value="Reports">Reports</SelectItem>
                  <SelectItem value="Others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 min-w-[200px]">
              <Label htmlFor="scheme-level-filter">Scheme Level</Label>
              <Select
                value={schemeLevelFilter || undefined}
                onValueChange={(value) =>
                  setSchemeLevelFilter(value === "__all__" ? "" : value)
                }
              >
                <SelectTrigger id="scheme-level-filter">
                  <SelectValue placeholder="All Scheme Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All Scheme Levels</SelectItem>
                  <SelectItem value="TL">TL</SelectItem>
                  <SelectItem value="ML">ML</SelectItem>
                  <SelectItem value="SL">SL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 min-w-[200px]">
              <Label htmlFor="automation-status-filter">
                Automation Status
              </Label>
              <Select
                value={automationStatusFilter || undefined}
                onValueChange={(value) =>
                  setAutomationStatusFilter(value === "__all__" ? "" : value)
                }
              >
                <SelectTrigger id="automation-status-filter">
                  <SelectValue placeholder="All Automation Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All Automation Status</SelectItem>
                  <SelectItem value="Automated">Automated</SelectItem>
                  <SelectItem value="NotAutomated">Not Automated</SelectItem>
                  <SelectItem value="Blocked">Blocked</SelectItem>
                  <SelectItem value="InProgress">In Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 min-w-[200px]">
              <Label htmlFor="test-status-filter">Test Status</Label>
              <Select
                value={testStatusFilter || undefined}
                onValueChange={(value) =>
                  setTestStatusFilter(value === "__all__" ? "" : value)
                }
              >
                <SelectTrigger id="test-status-filter">
                  <SelectValue placeholder="All Test Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All Test Status</SelectItem>
                  <SelectItem value="NotRun">Not Run</SelectItem>
                  <SelectItem value="Passed">Passed</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                  <SelectItem value="Blocked">Blocked</SelectItem>
                  <SelectItem value="Skipped">Skipped</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 min-w-[200px]">
              <Label htmlFor="client-filter">Client</Label>
              <Select
                value={clientFilter || undefined}
                onValueChange={(value) =>
                  setClientFilter(value === "__all__" ? "" : value)
                }
              >
                <SelectTrigger id="client-filter">
                  <SelectValue placeholder="All Clients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All Clients</SelectItem>
                  <SelectItem value="XPS">XPS</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 min-w-[200px]">
              <Label htmlFor="release-no-filter">Release No</Label>
              <Select
                value={releaseNoFilter || undefined}
                onValueChange={(value) =>
                  setReleaseNoFilter(value === "__all__" ? "" : value)
                }
              >
                <SelectTrigger id="release-no-filter">
                  <SelectValue placeholder="All Release Numbers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All Release Numbers</SelectItem>
                  <SelectItem value="R3_43">R3_43</SelectItem>
                  <SelectItem value="R3_44">R3_44</SelectItem>
                  <SelectItem value="R3_45">R3_45</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 min-w-[200px]">
              <Label htmlFor="priority-filter">Priority</Label>
              <Select
                value={priorityFilter || undefined}
                onValueChange={(value) =>
                  setPriorityFilter(value === "__all__" ? "" : value)
                }
              >
                <SelectTrigger id="priority-filter">
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All Priorities</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </div>
          {hasActiveFilters && (
            <div className="mt-4 text-sm text-muted-foreground">
              Showing {filteredTestCases.length} of {testCases.length} test
              cases
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Test Case Details</CardTitle>
            <CardAction>
              {!isEditing && (
                <Button onClick={handleEdit} variant="outline">
                  Edit
                </Button>
              )}
            </CardAction>
          </div>
        </CardHeader>

        <CardContent>
          {isEditing ? (
            <XpsTcForm
              testCase={currentTestCase}
              onSave={handleSave}
              onCancel={handleCancel}
              isLoading={isSaving}
            />
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Test Case ID</Label>
                  <p className="text-sm font-medium">
                    {currentTestCase.testCaseId}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Location</Label>
                  <p className="text-sm font-medium">
                    {currentTestCase.location}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-muted-foreground">Test Case Name</Label>
                <p className="text-sm whitespace-pre-wrap">
                  {currentTestCase.testCaseName}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">
                    Automation Status
                  </Label>
                  <p className="text-sm font-medium">
                    {currentTestCase.automationStatus || "—"}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Test Status</Label>
                  <p className="text-sm font-medium">
                    {currentTestCase.testStatus || "—"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Module</Label>
                  <p className="text-sm font-medium">
                    {currentTestCase.module || "—"}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Scheme Level</Label>
                  <p className="text-sm font-medium">
                    {currentTestCase.schemeLevel || "—"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Client</Label>
                  <p className="text-sm font-medium">
                    {currentTestCase.client || "—"}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Release No</Label>
                  <p className="text-sm font-medium">
                    {currentTestCase.releaseNo || "—"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Priority</Label>
                  <p className="text-sm font-medium">
                    {currentTestCase.priority || "—"}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Defect ID</Label>
                  <p className="text-sm font-medium">
                    {currentTestCase.defectId || "—"}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-muted-foreground">Expected Result</Label>
                <p className="text-sm whitespace-pre-wrap">
                  {currentTestCase.expectedResult || "—"}
                </p>
              </div>

              <div className="space-y-1">
                <Label className="text-muted-foreground">Actual Result</Label>
                <p className="text-sm whitespace-pre-wrap">
                  {currentTestCase.actualResult || "—"}
                </p>
              </div>

              <div className="space-y-1">
                <Label className="text-muted-foreground">Comments</Label>
                <p className="text-sm">{currentTestCase.comments || "—"}</p>
              </div>

              {!isEditing && (
                <div className="border-t pt-6">
                  <ScreenshotManager
                    testCaseId={currentTestCase.testCaseId}
                    testCaseDbId={currentTestCase.id}
                    type="xps"
                    schemeLevel={currentTestCase.schemeLevel}
                    module={currentTestCase.module}
                  />
                </div>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="border-t pt-6">
          <div className="flex items-center justify-between w-full flex-wrap gap-4">
            <div className="text-sm text-muted-foreground">
              Test Case {currentIndex + 1} of {filteredTestCases.length}
              {hasActiveFilters && (
                <span className="ml-2">
                  (filtered from {testCases.length} total)
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentIndex === 0 || isEditing}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={handleNext}
                disabled={
                  currentIndex === filteredTestCases.length - 1 || isEditing
                }
              >
                Next
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default XpsTcViewPage;
