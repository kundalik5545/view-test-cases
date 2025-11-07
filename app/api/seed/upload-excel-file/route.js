import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import * as XLSX from "xlsx";

export const dynamic = "force-dynamic"; // in case you use nextjs cache

// This API expects a form-data POST request with two fields:
// 1. "model": either "xpsTestCase" or "eMemberTestCase"
// 2. "file": the Excel file (.xlsx)

export async function POST(req) {
  try {
    // Parse the multipart form
    const contentType = req.headers.get("content-type");
    if (!contentType || !contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Content-Type must be multipart/form-data" },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");
    const model = formData.get("model");

    if (!file || !model) {
      return NextResponse.json(
        { error: "Missing file or model field" },
        { status: 400 }
      );
    }

    const validModels = ["xpsTestCase", "eMemberTestCase"];
    if (!validModels.includes(model)) {
      return NextResponse.json(
        { error: "Invalid model selection" },
        { status: 400 }
      );
    }

    // Read file into ArrayBuffer, then process via XLSX
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert sheet to JSON -- be sure headers in Excel match Prisma field names
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    if (!jsonData.length) {
      return NextResponse.json(
        { error: "Excel sheet is empty or could not be parsed" },
        { status: 400 }
      );
    }

    // Do some light validation: e.g. required fields present?
    // (For simplicity, let Prisma handle further validation)
    let entriesToCreate = jsonData;
    // Optional: coerce or modify fields here if needed

    // Bulk insert
    await prisma[model].createMany({
      data: entriesToCreate,
      //   skipDuplicates: true, // assuming `id` or `testCaseId` is unique
    });

    return NextResponse.json({
      message: "Upload and seeding completed",
      rows: entriesToCreate.length,
    });
  } catch (error) {
    console.error("Error uploading test case Excel:", error);
    return NextResponse.json(
      { error: "Failed to upload and seed test cases" },
      { status: 500 }
    );
  }
}
