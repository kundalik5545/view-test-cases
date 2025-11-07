import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { writeFile, unlink, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { Buffer } from "buffer";

export const dynamic = "force-dynamic";

// Ensure screenshots directory exists
const SCREENSHOTS_DIR = path.join(process.cwd(), "public", "screenshots");

async function ensureScreenshotsDir() {
  if (!existsSync(SCREENSHOTS_DIR)) {
    await mkdir(SCREENSHOTS_DIR, { recursive: true });
  }
}

// POST - Upload screenshot
export async function POST(request) {
  try {
    await ensureScreenshotsDir();

    const formData = await request.formData();
    const file = formData.get("file");
    const testCaseId = formData.get("testCaseId");
    const id = formData.get("id");

    if (!file || !testCaseId || !id) {
      return NextResponse.json(
        { error: "Missing required fields: file, testCaseId, or id" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PNG, JPG, and JPEG are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit." },
        { status: 400 }
      );
    }

    // Get test case to access schemeLevel and module
    const testCase = await prisma.xpsTestCase.findUnique({
      where: { id },
    });

    if (!testCase) {
      return NextResponse.json(
        { error: "Test case not found" },
        { status: 404 }
      );
    }

    // Generate filename
    const timestamp = Date.now();
    const schemeLevel = testCase.schemeLevel || "Unknown";
    const module = testCase.module || "Unknown";
    const sanitizedTestCaseId = testCaseId.replace(/[^a-zA-Z0-9]/g, "_");
    const sanitizedSchemeLevel = schemeLevel.replace(/[^a-zA-Z0-9]/g, "_");
    const sanitizedModule = module.replace(/[^a-zA-Z0-9]/g, "_");

    let filename = `${sanitizedTestCaseId}_${sanitizedSchemeLevel}_${sanitizedModule}_${timestamp}.png`;
    let filePath = path.join(SCREENSHOTS_DIR, filename);
    let counter = 2;

    // Check if file exists and increment counter
    while (existsSync(filePath)) {
      filename = `${sanitizedTestCaseId}_${sanitizedSchemeLevel}_${sanitizedModule}_${timestamp}_${counter}.png`;
      filePath = path.join(SCREENSHOTS_DIR, filename);
      counter++;
    }

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Update database
    let screenshots = [];
    const currentScreenshots = testCase.screenshots;

    console.log("Current screenshots value:", currentScreenshots);
    console.log("Type of screenshots:", typeof currentScreenshots);

    try {
      if (currentScreenshots && typeof currentScreenshots === "string") {
        screenshots = JSON.parse(currentScreenshots);
      } else if (Array.isArray(currentScreenshots)) {
        screenshots = currentScreenshots;
      } else {
        screenshots = [];
      }
    } catch (parseError) {
      console.error("Error parsing screenshots JSON:", parseError);
      console.error("Raw screenshots value:", currentScreenshots);
      screenshots = [];
    }

    const relativePath = `/screenshots/${filename}`;
    screenshots.push(relativePath);

    console.log("Updating database with screenshots:", screenshots);
    console.log("Screenshots as JSON string:", JSON.stringify(screenshots));

    try {
      const updated = await prisma.xpsTestCase.update({
        where: { id },
        data: {
          screenshots: JSON.stringify(screenshots),
        },
      });
      console.log("Database update successful:", updated);
    } catch (dbError) {
      console.error("Database update error:", dbError);
      console.error("Error code:", dbError.code);
      console.error("Error message:", dbError.message);
      // If database update fails, try to delete the file we just created
      try {
        if (existsSync(filePath)) {
          await unlink(filePath);
        }
      } catch (cleanupError) {
        console.error("Error cleaning up file:", cleanupError);
      }
      throw dbError;
    }

    return NextResponse.json({
      success: true,
      screenshotPath: relativePath,
      filename,
    });
  } catch (error) {
    console.error("Error uploading screenshot:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to upload screenshot",
        details:
          process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete screenshot
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const filename = searchParams.get("filename");

    if (!id || !filename) {
      return NextResponse.json(
        { error: "Missing required fields: id or filename" },
        { status: 400 }
      );
    }

    // Get test case
    const testCase = await prisma.xpsTestCase.findUnique({
      where: { id },
    });

    if (!testCase) {
      return NextResponse.json(
        { error: "Test case not found" },
        { status: 404 }
      );
    }

    // Remove screenshot from array
    const screenshots = JSON.parse(testCase.screenshots || "[]");
    const relativePath = `/screenshots/${filename}`;
    const updatedScreenshots = screenshots.filter(
      (path) => path !== relativePath
    );

    // Delete file from filesystem
    const filePath = path.join(SCREENSHOTS_DIR, filename);
    if (existsSync(filePath)) {
      await unlink(filePath);
    }

    // Update database
    await prisma.xpsTestCase.update({
      where: { id },
      data: {
        screenshots: JSON.stringify(updatedScreenshots),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting screenshot:", error);
    return NextResponse.json(
      { error: "Failed to delete screenshot" },
      { status: 500 }
    );
  }
}

// GET - Get screenshots for a test case
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing required field: id" },
        { status: 400 }
      );
    }

    const testCase = await prisma.xpsTestCase.findUnique({
      where: { id },
    });

    if (!testCase) {
      return NextResponse.json(
        { error: "Test case not found" },
        { status: 404 }
      );
    }

    const screenshots = JSON.parse(testCase.screenshots || "[]");

    return NextResponse.json({ screenshots });
  } catch (error) {
    console.error("Error fetching screenshots:", error);
    return NextResponse.json(
      { error: "Failed to fetch screenshots" },
      { status: 500 }
    );
  }
}
