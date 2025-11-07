"use client";

import React, { useState } from "react";
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

const EmTcForm = ({ testCase, onSave, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    testCaseId: testCase?.testCaseId || "",
    location: testCase?.location || "",
    testCaseName: testCase?.testCaseName || "",
    expectedResult: testCase?.expectedResult || "",
    actualResult: testCase?.actualResult || "",
    automationStatus: testCase?.automationStatus || "",
    testStatus: testCase?.testStatus || "",
    portal: testCase?.portal || "",
    comments: testCase?.comments || "",
    defectId: testCase?.defectId || "",
  });

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
          <Label htmlFor="portal">Portal</Label>
          <Select
            value={formData.portal || ""}
            onValueChange={(value) => handleChange("portal", value)}
          >
            <SelectTrigger id="portal">
              <SelectValue placeholder="Select portal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Public">Public</SelectItem>
              <SelectItem value="CAT">CAT</SelectItem>
              <SelectItem value="Fusion">Fusion</SelectItem>
              <SelectItem value="Umbraco">Umbraco</SelectItem>
              <SelectItem value="DataHub">DataHub</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
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
          required
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

export default EmTcForm;
