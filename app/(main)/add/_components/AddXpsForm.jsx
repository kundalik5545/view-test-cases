"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AddXpsForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    testCaseId: "",
    location: "",
    testCaseName: "",
    expectedResult: "",
    actualResult: "",
    automationStatus: "",
    testStatus: "",
    module: "",
    schemeLevel: "",
    client: "",
    releaseNo: "",
    priority: "",
    comments: "",
    defectId: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/test-cases/xps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create test case");
      }

      // Reset form
      setFormData({
        testCaseId: "",
        location: "",
        testCaseName: "",
        expectedResult: "",
        actualResult: "",
        automationStatus: "",
        testStatus: "",
        module: "",
        schemeLevel: "",
        client: "",
        releaseNo: "",
        priority: "",
        comments: "",
        defectId: "",
      });

      if (onSuccess) {
        onSuccess(data.testCase);
      }
    } catch (err) {
      setError(err.message || "An error occurred while creating the test case");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Add XPS Test Case</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {error && (
            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="testCaseId">
                Test Case ID <span className="text-destructive">*</span>
              </Label>
              <Input
                id="testCaseId"
                value={formData.testCaseId}
                onChange={(e) => handleChange("testCaseId", e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">
                Location <span className="text-destructive">*</span>
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="testCaseName">
              Test Case Name <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="testCaseName"
              value={formData.testCaseName}
              onChange={(e) => handleChange("testCaseName", e.target.value)}
              rows={8}
              className="min-h-[200px]"
              required
              disabled={isLoading}
              placeholder="Enter the test case name in detail..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectedResult">Expected Result</Label>
            <Textarea
              id="expectedResult"
              value={formData.expectedResult}
              onChange={(e) => handleChange("expectedResult", e.target.value)}
              rows={8}
              className="min-h-[200px]"
              disabled={isLoading}
              placeholder="Describe the expected result..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="actualResult">Actual Result</Label>
            <Textarea
              id="actualResult"
              value={formData.actualResult}
              onChange={(e) => handleChange("actualResult", e.target.value)}
              rows={8}
              className="min-h-[200px]"
              disabled={isLoading}
              placeholder="Describe the actual result..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="automationStatus">Automation Status</Label>
              <Select
                value={formData.automationStatus || ""}
                onValueChange={(value) =>
                  handleChange("automationStatus", value)
                }
                disabled={isLoading}
              >
                <SelectTrigger id="automationStatus">
                  <SelectValue placeholder="Select automation status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Automated">Automated</SelectItem>
                  <SelectItem value="NotAutomated">Not Automated</SelectItem>
                  <SelectItem value="Blocked">Blocked</SelectItem>
                  <SelectItem value="InProgress">In Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="testStatus">Test Status</Label>
              <Select
                value={formData.testStatus || ""}
                onValueChange={(value) => handleChange("testStatus", value)}
                disabled={isLoading}
              >
                <SelectTrigger id="testStatus">
                  <SelectValue placeholder="Select test status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Passed">Passed</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                  <SelectItem value="Blocked">Blocked</SelectItem>
                  <SelectItem value="Skipped">Skipped</SelectItem>
                  <SelectItem value="NotRun">Not Run</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="module">Module</Label>
              <Select
                value={formData.module || ""}
                onValueChange={(value) => handleChange("module", value)}
                disabled={isLoading}
              >
                <SelectTrigger id="module">
                  <SelectValue placeholder="Select module" />
                </SelectTrigger>
                <SelectContent>
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

            <div className="space-y-2">
              <Label htmlFor="schemeLevel">Scheme Level</Label>
              <Select
                value={formData.schemeLevel || ""}
                onValueChange={(value) => handleChange("schemeLevel", value)}
                disabled={isLoading}
              >
                <SelectTrigger id="schemeLevel">
                  <SelectValue placeholder="Select scheme level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TL">TL</SelectItem>
                  <SelectItem value="ML">ML</SelectItem>
                  <SelectItem value="SL">SL</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>
              <Select
                value={formData.client || ""}
                onValueChange={(value) => handleChange("client", value)}
                disabled={isLoading}
              >
                <SelectTrigger id="client">
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="XPS">XPS</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="releaseNo">Release No</Label>
              <Select
                value={formData.releaseNo || ""}
                onValueChange={(value) => handleChange("releaseNo", value)}
                disabled={isLoading}
              >
                <SelectTrigger id="releaseNo">
                  <SelectValue placeholder="Select release number" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="R3_43">R3_43</SelectItem>
                  <SelectItem value="R3_44">R3_44</SelectItem>
                  <SelectItem value="R3_45">R3_45</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority || ""}
                onValueChange={(value) => handleChange("priority", value)}
                disabled={isLoading}
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="defectId">Defect ID</Label>
              <Input
                id="defectId"
                value={formData.defectId}
                onChange={(e) => handleChange("defectId", e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comments">Comments</Label>
            <Input
              id="comments"
              value={formData.comments}
              onChange={(e) => handleChange("comments", e.target.value)}
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex gap-3 justify-end">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Test Case"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AddXpsForm;
