"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import AddXpsForm from "./_components/AddXpsForm";
import AddEmemberForm from "./_components/AddEmemberForm";
import { FileSpreadsheet, Users } from "lucide-react";

const AddTestCasePage = () => {
  const [activeForm, setActiveForm] = useState("xps");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSuccess = (testCase) => {
    setSuccessMessage(
      `Test case "${testCase.testCaseName}" created successfully!`
    );
    setTimeout(() => setSuccessMessage(""), 5000);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 pt-20 pb-12 flex items-center justify-center">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="mb-8 w-full flex flex-col items-center">
          <div className="inline-flex shadow-sm mb-6 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
            <Button
              onClick={() => {
                setActiveForm("xps");
                setSuccessMessage("");
              }}
              variant={activeForm === "xps" ? "default" : "ghost"}
              size="lg"
              className={`flex items-center gap-2 px-6 py-3 font-semibold rounded-none ${
                activeForm === "xps"
                  ? ""
                  : "hover:bg-zinc-100 dark:hover:bg-zinc-700"
              }`}
            >
              <FileSpreadsheet
                className={`w-5 h-5 ${
                  activeForm === "xps"
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-zinc-500"
                }`}
              />
              <span>Add XPS Test Case</span>
            </Button>
            <Button
              onClick={() => {
                setActiveForm("emember");
                setSuccessMessage("");
              }}
              variant={activeForm === "emember" ? "default" : "ghost"}
              size="lg"
              className={`flex items-center gap-2 px-6 py-3 font-semibold rounded-none ${
                activeForm === "emember"
                  ? ""
                  : "hover:bg-zinc-100 dark:hover:bg-zinc-700"
              }`}
            >
              <Users
                className={`w-5 h-5 ${
                  activeForm === "emember"
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-zinc-500"
                }`}
              />
              <span>Add eMember Test Case</span>
            </Button>
          </div>

          {successMessage && (
            <div className="mb-6 w-full max-w-lg mx-auto p-4 rounded-md bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800 text-center">
              {successMessage}
            </div>
          )}
        </div>
        <div className="transition-all duration-300 w-full">
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
