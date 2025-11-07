import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Get all test cases
    const allTestCases = await prisma.xpsTestCase.findMany();

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

    // Count by module
    const moduleCounts = {
      Details: 0,
      ToolsAndProcesses: 0,
      Letters: 0,
      Leavers: 0,
      Reports: 0,
      Others: 0,
      null: 0,
    };

    // Count by scheme level
    const schemeLevelCounts = {
      TL: 0,
      ML: 0,
      SL: 0,
      null: 0,
    };

    // Count by client
    const clientCounts = {
      XPS: 0,
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

      // Module counts
      const module = testCase.module || "null";
      if (moduleCounts.hasOwnProperty(module)) {
        moduleCounts[module]++;
      }

      // Scheme level counts
      const schemeLevel = testCase.schemeLevel || "null";
      if (schemeLevelCounts.hasOwnProperty(schemeLevel)) {
        schemeLevelCounts[schemeLevel]++;
      }

      // Client counts
      const client = testCase.client || "null";
      if (clientCounts.hasOwnProperty(client)) {
        clientCounts[client]++;
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
      module: {
        Details: {
          count: moduleCounts.Details,
          percentage: calculatePercentage(moduleCounts.Details),
        },
        ToolsAndProcesses: {
          count: moduleCounts.ToolsAndProcesses,
          percentage: calculatePercentage(moduleCounts.ToolsAndProcesses),
        },
        Letters: {
          count: moduleCounts.Letters,
          percentage: calculatePercentage(moduleCounts.Letters),
        },
        Leavers: {
          count: moduleCounts.Leavers,
          percentage: calculatePercentage(moduleCounts.Leavers),
        },
        Reports: {
          count: moduleCounts.Reports,
          percentage: calculatePercentage(moduleCounts.Reports),
        },
        Others: {
          count: moduleCounts.Others,
          percentage: calculatePercentage(moduleCounts.Others),
        },
        NotSet: {
          count: moduleCounts.null,
          percentage: calculatePercentage(moduleCounts.null),
        },
      },
      schemeLevel: {
        TL: {
          count: schemeLevelCounts.TL,
          percentage: calculatePercentage(schemeLevelCounts.TL),
        },
        ML: {
          count: schemeLevelCounts.ML,
          percentage: calculatePercentage(schemeLevelCounts.ML),
        },
        SL: {
          count: schemeLevelCounts.SL,
          percentage: calculatePercentage(schemeLevelCounts.SL),
        },
        NotSet: {
          count: schemeLevelCounts.null,
          percentage: calculatePercentage(schemeLevelCounts.null),
        },
      },
      client: {
        XPS: {
          count: clientCounts.XPS,
          percentage: calculatePercentage(clientCounts.XPS),
        },
        Other: {
          count: clientCounts.Other,
          percentage: calculatePercentage(clientCounts.Other),
        },
        NotSet: {
          count: clientCounts.null,
          percentage: calculatePercentage(clientCounts.null),
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
    console.error("Error fetching XPS stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
