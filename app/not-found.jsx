"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-900 px-4">
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-8 flex flex-col items-center">
        <AlertTriangle className="w-16 h-16 text-yellow-400 mb-4" />
        <h1 className="text-3xl font-bold mb-2 text-zinc-900 dark:text-white">
          Page Not Found
        </h1>
        <p className="text-zinc-700 dark:text-zinc-200 mb-6 text-center">
          Sorry, the page you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <Button
          variant="outline"
          size="lg"
          className="flex items-center gap-2"
          onClick={() => router.push("/xps-test-cases")}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to XPS Test Cases
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
