import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // Build where clause for filtering
    const where = {};

    if (searchParams.get("automationStatus")) {
      where.automationStatus = searchParams.get("automationStatus");
    }

    if (searchParams.get("testStatus")) {
      where.testStatus = searchParams.get("testStatus");
    }

    if (searchParams.get("portal")) {
      where.portal = searchParams.get("portal");
    }

    if (searchParams.get("emReleaseNo")) {
      where.emReleaseNo = searchParams.get("emReleaseNo");
    }

    if (searchParams.get("priority")) {
      where.priority = searchParams.get("priority");
    }

    // Handle search parameter (searches in testCaseId and testCaseName)
    const searchTerm = searchParams.get("search");
    if (searchTerm && searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      // For SQLite, we'll fetch all matching records and filter in memory for case-insensitive search
      // This is acceptable for reasonable dataset sizes
      where.OR = [
        {
          testCaseId: {
            contains: searchTerm,
          },
        },
        {
          testCaseName: {
            contains: searchTerm,
          },
        },
      ];
    }

    const testCases = await prisma.eMemberTestCase.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      orderBy: {
        testCaseId: "asc",
      },
    });

    // Apply case-insensitive filtering if search term exists
    let filteredTestCases = testCases;
    if (searchTerm && searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filteredTestCases = testCases.filter(
        (tc) =>
          tc.testCaseId.toLowerCase().includes(searchLower) ||
          tc.testCaseName.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json({
      testCases: filteredTestCases,
      count: filteredTestCases.length,
    });
  } catch (error) {
    console.error("Error fetching test cases:", error);
    return NextResponse.json(
      { error: "Failed to fetch test cases" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      testCaseId,
      location,
      testCaseName,
      expectedResult,
      actualResult,
      automationStatus,
      testStatus,
      portal,
      comments,
      defectId,
    } = body;

    // Validate required fields
    if (!testCaseId) {
      return NextResponse.json(
        { error: "testCaseId is required" },
        { status: 400 }
      );
    }

    if (!location) {
      return NextResponse.json(
        { error: "location is required" },
        { status: 400 }
      );
    }

    if (!testCaseName) {
      return NextResponse.json(
        { error: "testCaseName is required" },
        { status: 400 }
      );
    }

    if (!comments) {
      return NextResponse.json(
        { error: "comments is required" },
        { status: 400 }
      );
    }

    const newTestCase = await prisma.eMemberTestCase.create({
      data: {
        testCaseId,
        location,
        testCaseName,
        expectedResult: expectedResult || null,
        actualResult: actualResult || null,
        automationStatus: automationStatus || null,
        testStatus: testStatus || null,
        portal: portal || null,
        comments,
        defectId: defectId || null,
        screenshots: "[]",
      },
    });

    return NextResponse.json({ testCase: newTestCase }, { status: 201 });
  } catch (error) {
    console.error("Error creating test case:", error);
    return NextResponse.json(
      { error: "Failed to create test case" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Test case ID is required" },
        { status: 400 }
      );
    }

    // Validate required fields if they're being updated
    if (updateData.testCaseId !== undefined && !updateData.testCaseId) {
      return NextResponse.json(
        { error: "testCaseId is required" },
        { status: 400 }
      );
    }

    if (updateData.location !== undefined && !updateData.location) {
      return NextResponse.json(
        { error: "location is required" },
        { status: 400 }
      );
    }

    if (updateData.testCaseName !== undefined && !updateData.testCaseName) {
      return NextResponse.json(
        { error: "testCaseName is required" },
        { status: 400 }
      );
    }

    if (updateData.comments !== undefined && !updateData.comments) {
      return NextResponse.json(
        { error: "comments is required" },
        { status: 400 }
      );
    }

    const updatedTestCase = await prisma.eMemberTestCase.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ testCase: updatedTestCase });
  } catch (error) {
    console.error("Error updating test case:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Test case not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update test case" },
      { status: 500 }
    );
  }
}
