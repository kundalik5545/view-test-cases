import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function POST(request) {
  try {
    const body = await request.json();
    const { type, filters } = body;

    if (!type || !["xps", "emember"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid type. Must be 'xps' or 'emember'" },
        { status: 400 }
      );
    }

    // Build where clause for filtering
    const where = {};

    if (filters) {
      if (filters.automationStatus) {
        where.automationStatus = filters.automationStatus;
      }

      if (filters.testStatus) {
        where.testStatus = filters.testStatus;
      }

      if (type === "xps") {
        if (filters.module) {
          where.module = filters.module;
        }
        if (filters.schemeLevel) {
          where.schemeLevel = filters.schemeLevel;
        }
        if (filters.client) {
          where.client = filters.client;
        }
      } else if (type === "emember") {
        if (filters.portal) {
          where.portal = filters.portal;
        }
      }
    }

    // Fetch filtered test cases
    let testCases = [];
    if (type === "xps") {
      testCases = await prisma.xpsTestCase.findMany({
        where: Object.keys(where).length > 0 ? where : undefined,
      });
    } else {
      testCases = await prisma.eMemberTestCase.findMany({
        where: Object.keys(where).length > 0 ? where : undefined,
      });
    }

    if (testCases.length === 0) {
      return NextResponse.json(
        { error: "No test cases found with the specified filters" },
        { status: 404 }
      );
    }

    // Prepare data for Excel (remove internal fields and format)
    const excelData = testCases.map((tc) => {
      const row = {
        "Test Case ID": tc.testCaseId,
        Location: tc.location,
        "Test Case Name": tc.testCaseName,
        "Expected Result": tc.expectedResult || "",
        "Actual Result": tc.actualResult || "",
        "Automation Status": tc.automationStatus || "",
        "Test Status": tc.testStatus || "",
        Comments: tc.comments || "",
        "Defect ID": tc.defectId || "",
      };

      if (type === "xps") {
        row.Module = tc.module || "";
        row["Scheme Level"] = tc.schemeLevel || "";
        row.Client = tc.client || "";
      } else {
        row.Portal = tc.portal || "";
      }

      return row;
    });

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set column widths based on type
    const columnWidths =
      type === "xps"
        ? [
            { wch: 15 }, // Test Case ID
            { wch: 20 }, // Location
            { wch: 30 }, // Test Case Name
            { wch: 25 }, // Expected Result
            { wch: 25 }, // Actual Result
            { wch: 18 }, // Automation Status
            { wch: 12 }, // Test Status
            { wch: 15 }, // Module
            { wch: 12 }, // Scheme Level
            { wch: 10 }, // Client
            { wch: 30 }, // Comments
            { wch: 15 }, // Defect ID
          ]
        : [
            { wch: 15 }, // Test Case ID
            { wch: 20 }, // Location
            { wch: 30 }, // Test Case Name
            { wch: 25 }, // Expected Result
            { wch: 25 }, // Actual Result
            { wch: 18 }, // Automation Status
            { wch: 12 }, // Test Status
            { wch: 15 }, // Portal
            { wch: 30 }, // Comments
            { wch: 15 }, // Defect ID
          ];
    worksheet["!cols"] = columnWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Test Cases");

    // Generate Excel file buffer
    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    // Generate filename with timestamp
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, "-")
      .slice(0, -5);
    const filename = `${type}-test-cases-${timestamp}.xlsx`;

    // Return Excel file
    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error exporting test cases:", error);
    return NextResponse.json(
      { error: "Failed to export test cases" },
      { status: 500 }
    );
  }
}
