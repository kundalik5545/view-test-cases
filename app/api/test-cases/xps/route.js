import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const testCases = await prisma.xpsTestCase.findMany();
    console.log("testCases", testCases);
    return NextResponse.json({ testCases });
  } catch (error) {
    console.error("Error fetching test cases:", error);
    return NextResponse.json(
      { error: "Failed to fetch test cases" },
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
