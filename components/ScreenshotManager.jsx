"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Clipboard,
  X,
  Image as ImageIcon,
  Loader2,
  Trash2,
  ZoomIn,
} from "lucide-react";

const ScreenshotManager = ({
  testCaseId,
  testCaseDbId,
  type = "xps", // "xps" or "emember"
  schemeLevel,
  module,
  portal,
}) => {
  const [screenshots, setScreenshots] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const containerRef = useRef(null);

  const apiBase = `/api/test-cases/${type}/screenshots`;

  // Define fetchScreenshots with useCallback BEFORE useEffect
  const fetchScreenshots = useCallback(async () => {
    try {
      const response = await fetch(`${apiBase}?id=${testCaseDbId}`);
      if (!response.ok) throw new Error("Failed to fetch screenshots");
      const data = await response.json();
      setScreenshots(data.screenshots || []);
    } catch (err) {
      console.error("Error fetching screenshots:", err);
    }
  }, [testCaseDbId, apiBase]);

  // Fetch screenshots on mount
  useEffect(() => {
    fetchScreenshots();
  }, [fetchScreenshots]);

  // Handle clipboard paste
  const handleFileUpload = useCallback(
    async (file) => {
      // Validate file type
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        setError("Invalid file type. Only PNG, JPG, and JPEG are allowed.");
        setTimeout(() => setError(null), 3000);
        return;
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setError("File size exceeds 5MB limit.");
        setTimeout(() => setError(null), 3000);
        return;
      }

      setIsUploading(true);
      setError(null);
      setSuccessMessage(null);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("testCaseId", testCaseId);
        formData.append("id", testCaseDbId);

        const response = await fetch(apiBase, {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          const errorMsg =
            data.error || data.message || "Failed to upload screenshot";
          const details = data.details ? `\nDetails: ${data.details}` : "";
          throw new Error(`${errorMsg}${details}`);
        }

        setSuccessMessage("Screenshot uploaded successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
        await fetchScreenshots();
      } catch (err) {
        console.error("Error uploading screenshot:", err);
        setError(err.message || "Failed to upload screenshot");
        setTimeout(() => setError(null), 3000);
      } finally {
        setIsUploading(false);
      }
    },
    [testCaseDbId, testCaseId, apiBase, fetchScreenshots]
  );

  useEffect(() => {
    const handlePaste = async (e) => {
      // Only handle paste if the container is focused or user is in the view page
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf("image") !== -1) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) {
            await handleFileUpload(file);
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [handleFileUpload]);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (screenshotPath) => {
    if (!confirm("Are you sure you want to delete this screenshot?")) {
      return;
    }

    try {
      const filename = screenshotPath.split("/").pop();
      const response = await fetch(
        `${apiBase}?id=${testCaseDbId}&filename=${filename}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete screenshot");
      }

      setSuccessMessage("Screenshot deleted successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      await fetchScreenshots();
    } catch (err) {
      console.error("Error deleting screenshot:", err);
      setError(err.message || "Failed to delete screenshot");
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleImageClick = (screenshotPath) => {
    setPreviewImage(screenshotPath);
  };

  const closePreview = () => {
    setPreviewImage(null);
  };

  return (
    <div className="space-y-4" ref={containerRef}>
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">Screenshots</Label>
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Clipboard className="h-4 w-4 mr-2" />
                Paste Screenshot
              </>
            )}
          </Button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Press Ctrl+V (Cmd+V on Mac) to paste a screenshot, or click the button
        to select a file.
      </p>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-md text-green-700 dark:text-green-400 text-sm">
          {successMessage}
        </div>
      )}

      {screenshots.length === 0 ? (
        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            No screenshots yet. Paste an image or click the button to upload.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {screenshots.map((screenshotPath, index) => {
            const filename = screenshotPath.split("/").pop();
            return (
              <div
                key={index}
                className="relative group border rounded-lg overflow-hidden bg-muted/50 hover:bg-muted transition-colors"
              >
                <div
                  className="aspect-video cursor-pointer"
                  onClick={() => handleImageClick(screenshotPath)}
                >
                  <img
                    src={screenshotPath}
                    alt={`Screenshot ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23ddd' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-size='12'%3EImage not found%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleImageClick(screenshotPath)}
                    className="text-white hover:text-white hover:bg-white/20"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(screenshotPath);
                    }}
                    className="text-white hover:text-white hover:bg-white/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 px-2 truncate">
                  {filename}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={closePreview}
        >
          <div className="relative max-w-7xl max-h-full">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 text-white hover:text-white hover:bg-white/20 z-10"
              onClick={closePreview}
            >
              <X className="h-6 w-6" />
            </Button>
            <img
              src={previewImage}
              alt="Screenshot preview"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ScreenshotManager;
