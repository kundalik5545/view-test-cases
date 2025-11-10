"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Search, Eye } from "lucide-react";

const EmemberTcFilterViewPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [testCases, setTestCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Determine filter value from id param (portal)
  const filterConfig = useMemo(() => {
    const portalValues = [
      "Admin",
      "Public",
      "CAT",
      "Fusion",
      "Umbraco",
      "DataHub",
      "Other",
    ];

    if (portalValues.includes(id)) {
      return { type: "portal", value: id, label: id };
    }
    return null;
  }, [id]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch test cases
  useEffect(() => {
    const fetchTestCases = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (filterConfig) {
          params.append("portal", filterConfig.value);
        }
        if (debouncedSearchTerm.trim()) {
          params.append("search", debouncedSearchTerm.trim());
        }

        const response = await fetch(
          `/api/test-cases/emember?${params.toString()}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch test cases");
        }

        const data = await response.json();
        setTestCases(data.testCases || []);
      } catch (err) {
        console.error("Error fetching test cases:", err);
        setError(err.message || "Failed to load test cases. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTestCases();
  }, [filterConfig, debouncedSearchTerm]);

  const handleViewDetails = (testCaseId) => {
    router.push(`/emember-test-cases/view?testCaseId=${testCaseId}`);
  };

  if (!filterConfig) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Invalid filter parameter. Please use a valid portal name.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          eMember Test Cases - {filterConfig.label}
        </h1>
        <p className="text-muted-foreground">
          Filtered by Portal: {filterConfig.label}
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Test Cases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by Test Case ID or Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-md text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin h-6 w-6 text-muted-foreground mr-3" />
              <span className="text-lg text-muted-foreground">
                Loading test cases...
              </span>
            </div>
          </CardContent>
        </Card>
      ) : testCases.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground py-12">
              {debouncedSearchTerm
                ? "No test cases found matching your search criteria."
                : "No test cases found for this filter."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Test Cases ({testCases.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-semibold text-sm sticky left-0 bg-muted/50 z-10">
                      Test Case ID
                    </th>
                    <th className="text-left p-3 font-semibold text-sm">
                      Test Case Name
                    </th>
                    <th className="text-left p-3 font-semibold text-sm">
                      Portal
                    </th>
                    <th className="text-left p-3 font-semibold text-sm">
                      Test Status
                    </th>
                    <th className="text-left p-3 font-semibold text-sm">
                      Automation Status
                    </th>
                    <th className="text-left p-3 font-semibold text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {testCases.map((testCase) => (
                    <tr
                      key={testCase.id}
                      className="border-b hover:bg-muted/50 transition-colors"
                    >
                      <td className="p-3 text-sm font-medium sticky left-0 bg-background z-10">
                        {testCase.testCaseId}
                      </td>
                      <td className="p-3 text-sm">
                        <div
                          className="max-w-md truncate"
                          title={testCase.testCaseName}
                        >
                          {testCase.testCaseName}
                        </div>
                      </td>
                      <td className="p-3 text-sm">{testCase.portal || "—"}</td>
                      <td className="p-3 text-sm">
                        {testCase.testStatus || "—"}
                      </td>
                      <td className="p-3 text-sm">
                        {testCase.automationStatus || "—"}
                      </td>
                      <td className="p-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(testCase.testCaseId)}
                          className="flex items-center gap-2 whitespace-nowrap"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="hidden sm:inline">View Details</span>
                          <span className="sm:hidden">View</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmemberTcFilterViewPage;

