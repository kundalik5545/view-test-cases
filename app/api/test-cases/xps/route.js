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

    if (searchParams.get("module")) {
      where.module = searchParams.get("module");
    }

    if (searchParams.get("schemeLevel")) {
      where.schemeLevel = searchParams.get("schemeLevel");
    }

    if (searchParams.get("client")) {
      where.client = searchParams.get("client");
    }

    const testCases = await prisma.xpsTestCase.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
    });

    return NextResponse.json({ testCases, count: testCases.length });
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
      module,
      schemeLevel,
      client,
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

    const newTestCase = await prisma.xpsTestCase.create({
      data: {
        testCaseId,
        location,
        testCaseName,
        expectedResult: expectedResult || null,
        actualResult: actualResult || null,
        automationStatus: automationStatus || null,
        testStatus: testStatus || null,
        module: module || null,
        schemeLevel: schemeLevel || null,
        client: client || null,
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

    const updatedTestCase = await prisma.xpsTestCase.update({
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
