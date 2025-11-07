"use client";

import React, { useState, useEffect } from "react";
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
import XpsTcForm from "../_components/xpsTcForm";
import ScreenshotManager from "@/components/ScreenshotManager";
import { PlusIcon } from "lucide-react";

const XpsTcViewPage = () => {
  const [testCases, setTestCases] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchTestCases();
  }, []);

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
      const updatedTestCases = [...testCases];
      updatedTestCases[currentIndex] = data.testCase;
      setTestCases(updatedTestCases);

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
    if (currentIndex < testCases.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsEditing(false);
      setError(null);
      setSuccessMessage(null);
    }
  };

  const currentTestCase = testCases[currentIndex];

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
              Test Case {currentIndex + 1} of {testCases.length}
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
                disabled={currentIndex === testCases.length - 1 || isEditing}
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
