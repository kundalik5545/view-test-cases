"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BadgeCheck,
  Ban,
  BarChart2,
  Bug,
  Grid,
  Hourglass,
  Layers,
  Loader2,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const fetchStats = async () => {
  const res = await fetch("/api/test-cases/xps/stats", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch stats");
  const data = await res.json();
  return data.stats;
};

const COLORS = [
  "#10b981",
  "#ef4444",
  "#f59e0b",
  "#64748b",
  "#a78bfa",
  "#06b6d4",
  "#f97316",
  "#60a5fa",
];

const toPercent = (val) => {
  if (val == null) return 0;
  const n = typeof val === "string" ? Number(val) : val;
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(100, Number(n)));
};

export default function XpsTestCases() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    fetchStats()
      .then((s) => setStats(s))
      .catch((e) => setErr(e.message || String(e)))
      .finally(() => setLoading(false));
  }, []);

  const status = stats?.testStatus || {};
  const automation = stats?.automationStatus || {};
  const defects = stats?.defects || {};
  const client = stats?.client || {};
  const module = stats?.module || {};
  const schemeLevel = stats?.schemeLevel || {};

  const moduleChartData = useMemo(() => {
    return Object.entries(module)
      .filter(([k]) => k && k !== "NotSet")
      .map(([k, v]) => ({ name: k, value: v.count ?? 0 }));
  }, [module]);

  const schemeChartData = useMemo(() => {
    return Object.entries(schemeLevel)
      .filter(([k]) => k && k !== "NotSet")
      .map(([k, v]) => ({ name: k, value: v.count ?? 0 }));
  }, [schemeLevel]);

  const statusPie = useMemo(() => {
    return [
      { name: "Passed", value: status.Passed?.count ?? 0 },
      { name: "Failed", value: status.Failed?.count ?? 0 },
      { name: "Blocked", value: status.Blocked?.count ?? 0 },
      { name: "Skipped", value: status.Skipped?.count ?? 0 },
      { name: "Not Run", value: status.NotRun?.count ?? 0 },
    ];
  }, [status]);

  // small stat tile component
  const Tile = ({ icon, label, value, percent, accent }) => (
    <div className="flex items-center gap-4 bg-white dark:bg-muted border rounded-lg p-4 shadow-sm">
      <div className={`p-3 rounded-md ${accent} bg-opacity-10`}>{icon}</div>
      <div className="flex-1">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="text-2xl font-extrabold mt-1">{value ?? 0}</div>
        {typeof percent !== "undefined" && (
          <div className="text-xs text-muted-foreground mt-1">
            {toPercent(percent).toFixed(2)}%
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 py-8">
      <div className="container mx-auto max-w-7xl px-6">
        {/* header */}
        <div className="flex items-start gap-6 mb-6">
          <div className="flex items-center gap-4">
            <BarChart2 className="h-9 w-9 text-sky-600" />
            <div>
              <h1 className="text-3xl font-extrabold">XPS TC Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                High‑visibility dashboard with charts and large, readable
                metrics
              </p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <Button asChild variant="ghost" className="text-sm">
              <Link href="/xps-test-cases/view">View Test Cases</Link>
            </Button>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="animate-spin h-6 w-6 text-muted-foreground mr-3" />
            <span className="text-lg text-muted-foreground">
              Loading statistics...
            </span>
          </div>
        )}

        {err && (
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-lg">
            {err}
          </div>
        )}

        {!loading && stats && (
          <>
            {/* top cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="shadow-sm border">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Total Test Cases
                      </div>
                      <div className="text-4xl font-extrabold mt-2">
                        {stats.total ?? 0}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Updated: {stats.lastUpdated ?? "—"}
                      </div>
                    </div>
                    <div className="p-2 rounded bg-sky-50">
                      <BarChart2 className="h-8 w-8 text-sky-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Automation Coverage
                      </div>
                      <div className="text-3xl font-extrabold mt-2">
                        {automation.Automated?.percentage
                          ? `${Number(automation.Automated.percentage).toFixed(
                              1
                            )}%`
                          : "—"}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Automated vs Manual
                      </div>
                    </div>
                    <div className="p-2 rounded bg-emerald-50">
                      <BadgeCheck className="h-8 w-8 text-emerald-600" />
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500"
                        style={{
                          width: `${toPercent(
                            automation.Automated?.percentage
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-lg border p-3 text-center">
                      <div className="text-sm text-muted-foreground">
                        Automated
                      </div>
                      <div className="text-xl font-semibold">
                        {automation.Automated?.count ?? 0}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg border p-3 text-center">
                      <div className="text-sm text-muted-foreground">
                        Manual
                      </div>
                      <div className="text-xl font-semibold">
                        {automation.NotAutomated?.count ?? 0}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Defects
                      </div>
                      <div className="text-3xl font-extrabold mt-2">
                        {defects.withDefect?.count ?? 0}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        With defects
                      </div>
                    </div>
                    <div className="p-2 rounded bg-orange-50">
                      <Bug className="h-8 w-8 text-orange-600" />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500"
                        style={{
                          width: `${toPercent(
                            defects.withDefect?.percentage
                          )}%`,
                        }}
                      />
                    </div>
                    <div className="text-sm font-semibold">
                      {defects.withoutDefect?.count ?? 0} clean
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <Card className="shadow-sm border">
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">Status Distribution</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div style={{ width: "100%", height: 260 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={statusPie}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={4}
                        >
                          {statusPie.map((entry, idx) => (
                            <Cell
                              key={`cell-${idx}`}
                              fill={COLORS[idx % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border">
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">Modules (Bar)</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div style={{ width: "100%", height: 260 }}>
                    <ResponsiveContainer>
                      <BarChart
                        data={moduleChartData}
                        margin={{ top: 10, right: 10, left: -10, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value">
                          {moduleChartData.map((entry, idx) => (
                            <Cell
                              key={`cell-${idx}`}
                              fill={COLORS[idx % COLORS.length]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border">
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">
                    Scheme Levels (Line)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div style={{ width: "100%", height: 260 }}>
                    <ResponsiveContainer>
                      <LineChart
                        data={schemeChartData}
                        margin={{ top: 10, right: 10, left: -10, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#6366f1"
                          strokeWidth={3}
                          dot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* small stat tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Tile
                icon={<BadgeCheck className="h-6 w-6 text-green-600" />}
                label="Passed"
                value={status.Passed?.count ?? 0}
                percent={status.Passed?.percentage}
                accent="bg-emerald-100"
              />
              <Tile
                icon={<Ban className="h-6 w-6 text-red-600" />}
                label="Failed"
                value={status.Failed?.count ?? 0}
                percent={status.Failed?.percentage}
                accent="bg-red-100"
              />
              <Tile
                icon={<Hourglass className="h-6 w-6 text-yellow-600" />}
                label="Blocked"
                value={status.Blocked?.count ?? 0}
                percent={status.Blocked?.percentage}
                accent="bg-yellow-100"
              />
              <Tile
                icon={<Bug className="h-6 w-6 text-orange-600" />}
                label="With Defects"
                value={defects.withDefect?.count ?? 0}
                percent={defects.withDefect?.percentage}
                accent="bg-orange-100"
              />
            </div>

            {/* Modules + Scheme lists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-sm border">
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">Modules</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {moduleChartData.length > 0 ? (
                    moduleChartData.map((m, idx) => (
                      <div
                        key={m.name}
                        className="flex items-center justify-between gap-3 bg-white rounded-lg border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded bg-slate-50">
                            {idx % 3 === 0 ? (
                              <Layers className="h-6 w-6 text-sky-600" />
                            ) : idx % 3 === 1 ? (
                              <Grid className="h-6 w-6 text-emerald-600" />
                            ) : (
                              <Tag className="h-6 w-6 text-purple-600" />
                            )}
                          </div>
                          <div>
                            <div className="text-lg font-semibold">
                              <Link href={`/xps-test-cases/${m.name}`}>
                                {m.name}
                              </Link>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {m.value} test(s) •{" "}
                              {module[m.name]?.percentage
                                ? `${Number(module[m.name].percentage).toFixed(
                                    1
                                  )}%`
                                : "—"}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-base font-bold">{m.value}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      No module data
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-sm border">
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">Scheme Levels</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {schemeChartData.length > 0 ? (
                    schemeChartData.map((s, idx) => (
                      <div
                        key={s.name}
                        className="flex items-center justify-between gap-3 bg-white rounded-lg border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded bg-slate-50">
                            {idx % 2 === 0 ? (
                              <Tag className="h-6 w-6 text-indigo-600" />
                            ) : (
                              <Layers className="h-6 w-6 text-emerald-600" />
                            )}
                          </div>
                          <div>
                            <div className="text-lg font-semibold">
                              <Link href={`/xps-test-cases/${s.name}`}>
                                {s.name}
                              </Link>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {s.value} test(s) •{" "}
                              {schemeLevel[s.name]?.percentage
                                ? `${Number(
                                    schemeLevel[s.name].percentage
                                  ).toFixed(1)}%`
                                : "—"}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-base font-bold">{s.value}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      No scheme level data
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
