import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Get all test cases
    const allTestCases = await prisma.eMemberTestCase.findMany();

    const totalCount = allTestCases.length;

    // Count by test status
    const testStatusCounts = {
      Passed: 0,
      Failed: 0,
      Blocked: 0,
      Skipped: 0,
      NotRun: 0,
      null: 0,
    };

    // Count by automation status
    const automationStatusCounts = {
      Automated: 0,
      NotAutomated: 0,
      Blocked: 0,
      InProgress: 0,
      null: 0,
    };

    // Count by portal
    const portalCounts = {
      Admin: 0,
      Public: 0,
      CAT: 0,
      Fusion: 0,
      Umbraco: 0,
      DataHub: 0,
      Other: 0,
      null: 0,
    };

    // Count test cases with defect IDs
    let defectCount = 0;

    // Process each test case
    allTestCases.forEach((testCase) => {
      // Test status counts
      const testStatus = testCase.testStatus || "null";
      if (testStatusCounts.hasOwnProperty(testStatus)) {
        testStatusCounts[testStatus]++;
      }

      // Automation status counts
      const automationStatus = testCase.automationStatus || "null";
      if (automationStatusCounts.hasOwnProperty(automationStatus)) {
        automationStatusCounts[automationStatus]++;
      }

      // Portal counts
      const portal = testCase.portal || "null";
      if (portalCounts.hasOwnProperty(portal)) {
        portalCounts[portal]++;
      }

      // Defect count
      if (testCase.defectId) {
        defectCount++;
      }
    });

    // Calculate percentages
    const calculatePercentage = (count) => {
      return totalCount > 0 ? ((count / totalCount) * 100).toFixed(2) : "0.00";
    };

    const stats = {
      total: totalCount,
      testStatus: {
        Passed: {
          count: testStatusCounts.Passed,
          percentage: calculatePercentage(testStatusCounts.Passed),
        },
        Failed: {
          count: testStatusCounts.Failed,
          percentage: calculatePercentage(testStatusCounts.Failed),
        },
        Blocked: {
          count: testStatusCounts.Blocked,
          percentage: calculatePercentage(testStatusCounts.Blocked),
        },
        Skipped: {
          count: testStatusCounts.Skipped,
          percentage: calculatePercentage(testStatusCounts.Skipped),
        },
        NotRun: {
          count: testStatusCounts.NotRun,
          percentage: calculatePercentage(testStatusCounts.NotRun),
        },
        NotSet: {
          count: testStatusCounts.null,
          percentage: calculatePercentage(testStatusCounts.null),
        },
      },
      automationStatus: {
        Automated: {
          count: automationStatusCounts.Automated,
          percentage: calculatePercentage(automationStatusCounts.Automated),
        },
        NotAutomated: {
          count: automationStatusCounts.NotAutomated,
          percentage: calculatePercentage(automationStatusCounts.NotAutomated),
        },
        Blocked: {
          count: automationStatusCounts.Blocked,
          percentage: calculatePercentage(automationStatusCounts.Blocked),
        },
        InProgress: {
          count: automationStatusCounts.InProgress,
          percentage: calculatePercentage(automationStatusCounts.InProgress),
        },
        NotSet: {
          count: automationStatusCounts.null,
          percentage: calculatePercentage(automationStatusCounts.null),
        },
      },
      portal: {
        Admin: {
          count: portalCounts.Admin,
          percentage: calculatePercentage(portalCounts.Admin),
        },
        Public: {
          count: portalCounts.Public,
          percentage: calculatePercentage(portalCounts.Public),
        },
        CAT: {
          count: portalCounts.CAT,
          percentage: calculatePercentage(portalCounts.CAT),
        },
        Fusion: {
          count: portalCounts.Fusion,
          percentage: calculatePercentage(portalCounts.Fusion),
        },
        Umbraco: {
          count: portalCounts.Umbraco,
          percentage: calculatePercentage(portalCounts.Umbraco),
        },
        DataHub: {
          count: portalCounts.DataHub,
          percentage: calculatePercentage(portalCounts.DataHub),
        },
        Other: {
          count: portalCounts.Other,
          percentage: calculatePercentage(portalCounts.Other),
        },
        NotSet: {
          count: portalCounts.null,
          percentage: calculatePercentage(portalCounts.null),
        },
      },
      defects: {
        withDefect: {
          count: defectCount,
          percentage: calculatePercentage(defectCount),
        },
        withoutDefect: {
          count: totalCount - defectCount,
          percentage: calculatePercentage(totalCount - defectCount),
        },
      },
    };

    console.log("stats", stats);
    return NextResponse.json({ stats });
  } catch (error) {
    console.error("Error fetching eMember stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
