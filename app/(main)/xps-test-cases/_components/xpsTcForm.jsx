"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const XpsTcForm = ({ testCase, onSave, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    testCaseId: testCase?.testCaseId || "",
    location: testCase?.location || "",
    testCaseName: testCase?.testCaseName || "",
    expectedResult: testCase?.expectedResult || "",
    actualResult: testCase?.actualResult || "",
    automationStatus: testCase?.automationStatus || "",
    testStatus: testCase?.testStatus || "",
    module: testCase?.module || "",
    schemeLevel: testCase?.schemeLevel || "",
    client: testCase?.client || "",
    releaseNo: testCase?.releaseNo || "",
    priority: testCase?.priority || "",
    comments: testCase?.comments || "",
    defectId: testCase?.defectId || "",
  });

  // Update form data when testCase prop changes
  useEffect(() => {
    if (testCase) {
      setFormData({
        testCaseId: testCase.testCaseId || "",
        location: testCase.location || "",
        testCaseName: testCase.testCaseName || "",
        expectedResult: testCase.expectedResult || "",
        actualResult: testCase.actualResult || "",
        automationStatus: testCase.automationStatus || "",
        testStatus: testCase.testStatus || "",
        module: testCase.module || "",
        schemeLevel: testCase.schemeLevel || "",
        client: testCase.client || "",
        releaseNo: testCase.releaseNo || "",
        priority: testCase.priority || "",
        comments: testCase.comments || "",
        defectId: testCase.defectId || "",
      });
    }
  }, [testCase]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave({ id: testCase.id, ...formData });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="testCaseId">Test Case ID</Label>
          <Input
            id="testCaseId"
            value={formData.testCaseId}
            onChange={(e) => handleChange("testCaseId", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="testCaseName">Test Case Name</Label>
        <Textarea
          id="testCaseName"
          value={formData.testCaseName}
          onChange={(e) => handleChange("testCaseName", e.target.value)}
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="expectedResult">Expected Result</Label>
        <Textarea
          id="expectedResult"
          value={formData.expectedResult}
          onChange={(e) => handleChange("expectedResult", e.target.value)}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="actualResult">Actual Result</Label>
        <Textarea
          id="actualResult"
          value={formData.actualResult}
          onChange={(e) => handleChange("actualResult", e.target.value)}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="automationStatus">Automation Status</Label>
          <Select
            value={formData.automationStatus || ""}
            onValueChange={(value) => handleChange("automationStatus", value)}
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
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="comments">Comments</Label>
        <Input
          id="comments"
          value={formData.comments}
          onChange={(e) => handleChange("comments", e.target.value)}
        />
      </div>

      <div className="flex gap-3 justify-end pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};

export default XpsTcForm;
