"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import AddXpsForm from "./_components/AddXpsForm";
import AddEmemberForm from "./_components/AddEmemberForm";

const AddTestCasePage = () => {
  const [activeForm, setActiveForm] = useState("xps"); // 'xps' or 'emember'
  const [successMessage, setSuccessMessage] = useState("");

  const handleSuccess = (testCase) => {
    setSuccessMessage(
      `Test case "${testCase.testCaseName}" created successfully!`
    );
    setTimeout(() => setSuccessMessage(""), 5000);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
            Add New Test Case
          </h1>

          <div className="flex gap-4 mb-6">
            <Button
              onClick={() => {
                setActiveForm("xps");
                setSuccessMessage("");
              }}
              variant={activeForm === "xps" ? "default" : "outline"}
              size="lg"
              className="flex-1"
            >
              Add XPS Test Case
            </Button>
            <Button
              onClick={() => {
                setActiveForm("emember");
                setSuccessMessage("");
              }}
              variant={activeForm === "emember" ? "default" : "outline"}
              size="lg"
              className="flex-1"
            >
              Add eMember Test Case
            </Button>
          </div>

          {successMessage && (
            <div className="mb-6 p-4 rounded-md bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800">
              {successMessage}
            </div>
          )}
        </div>

        <div className="transition-all duration-300">
          {activeForm === "xps" ? (
            <AddXpsForm onSuccess={handleSuccess} />
          ) : (
            <AddEmemberForm onSuccess={handleSuccess} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AddTestCasePage;
