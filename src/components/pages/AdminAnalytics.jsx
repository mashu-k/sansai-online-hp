"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Users,
  Eye,
  Activity,
  UserPlus,
  RefreshCw,
  ArrowLeft,
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
  Table as TableIcon,
} from "lucide-react";

const CHART_COLORS = [
  "hsl(180, 70%, 45%)",
  "hsl(220, 70%, 55%)",
  "hsl(340, 70%, 55%)",
  "hsl(45, 80%, 50%)",
  "hsl(130, 60%, 45%)",
  "hsl(270, 60%, 55%)",
];

const CHANNEL_LABELS = {
  "Organic Search": "Google検索",
  "Organic Social": "SNS（自然流入）",
  "Paid Search": "検索広告",
  "Paid Social": "SNS広告",
  "Direct": "直接アクセス",
  "Referral": "外部サイト経由",
  "Email": "メール",
  "Cross-network": "クロスネットワーク",
  "Unassigned": "未分類",
  "Display": "ディスプレイ広告",
  "Affiliates": "アフィリエイト",
  "Video": "動画",
};

const toJa = (channel) => CHANNEL_LABELS[channel] || channel;

const AdminAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState("all");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/analytics/sync");
      const result = await res.json();
      const data = result.data || [];
      setAnalyticsData(data);

      // 最終更新日を取得
      const dates = data
        .map((d) => d.lastUpdated)
        .filter(Boolean)
        .sort()
        .reverse();
      if (dates.length > 0) setLastUpdated(dates[0]);
    } catch (error) {
      console.error("Analytics fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      const res = await fetch("/api/analytics/sync", { method: "POST" });
      const result = await res.json();
      if (result.success) {
        setLastUpdated(result.lastUpdated);
        await fetchAnalytics();
      } else {
        alert(`同期エラー: ${result.error}`);
      }
    } catch (error) {
      alert(`同期に失敗しました: ${error.message}`);
    } finally {
      setSyncing(false);
    }
  };

  // 集計データ
  const totals = analyticsData.reduce(
    (acc, d) => ({
      users: acc.users + (d.summary?.totalUsers || 0),
      pageViews: acc.pageViews + (d.summary?.pageViews || 0),
      sessions: acc.sessions + (d.summary?.sessions || 0),
      newUsers: acc.newUsers + (d.summary?.newUsers || 0),
    }),
    { users: 0, pageViews: 0, sessions: 0, newUsers: 0 }
  );

  // 記事比較バーチャート用データ
  const barData = analyticsData
    .sort((a, b) => (b.summary?.totalUsers || 0) - (a.summary?.totalUsers || 0))
    .map((d) => ({
      name: d.title?.length > 12 ? d.title.slice(0, 12) + "..." : d.title,
      fullName: d.title,
      ユーザー: d.summary?.totalUsers || 0,
      PV: d.summary?.pageViews || 0,
      セッション: d.summary?.sessions || 0,
    }));

  // チャネル分析用データ
  const getChannelData = () => {
    if (selectedArticle === "all") {
      const channelTotals = {};
      analyticsData.forEach((d) => {
        Object.entries(d.channels || {}).forEach(([ch, val]) => {
          channelTotals[ch] = (channelTotals[ch] || 0) + (val.users || 0);
        });
      });
      return Object.entries(channelTotals).map(([name, value]) => ({
        name: toJa(name),
        value,
      }));
    }
    const article = analyticsData.find((d) => d.postId === selectedArticle);
    if (!article?.channels) return [];
    return Object.entries(article.channels).map(([name, val]) => ({
      name: toJa(name),
      value: val.users || 0,
    }));
  };

  // 日別トレンド用データ
  const getTrendData = () => {
    const target =
      selectedArticle === "all" ? analyticsData : analyticsData.filter((d) => d.postId === selectedArticle);

    const dateMap = {};
    target.forEach((d) => {
      (d.dailyTrends || []).forEach((t) => {
        if (!dateMap[t.date]) {
          dateMap[t.date] = { date: t.date, ユーザー: 0, PV: 0, セッション: 0 };
        }
        dateMap[t.date].ユーザー += t.users || 0;
        dateMap[t.date].PV += t.pageViews || 0;
        dateMap[t.date].セッション += t.sessions || 0;
      });
    });

    return Object.values(dateMap)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((d) => ({ ...d, date: d.date.slice(5) }));
  };

  const formatDate = (iso) => {
    if (!iso) return "未取得";
    const d = new Date(iso);
    return d.toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-20 flex items-center justify-center">
        <p className="text-muted-foreground">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pt-20">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* ヘッダー */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <Link
                href="/admin"
                className="text-muted-foreground hover:text-foreground text-sm flex items-center gap-1 mb-2"
              >
                <ArrowLeft className="w-4 h-4" /> 管理画面に戻る
              </Link>
              <h1 className="text-3xl font-bold mb-1">アクセス解析</h1>
              <p className="text-muted-foreground text-sm">
                最終更新: {formatDate(lastUpdated)}
              </p>
            </div>
            <Button onClick={handleSync} disabled={syncing} size="lg">
              <RefreshCw
                className={`w-5 h-5 mr-2 ${syncing ? "animate-spin" : ""}`}
              />
              {syncing ? "同期中..." : "データ更新"}
            </Button>
          </div>

          {/* 概要カード */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              {
                label: "総ユーザー数",
                value: totals.users,
                icon: Users,
                color: "text-blue-500",
              },
              {
                label: "総PV数",
                value: totals.pageViews,
                icon: Eye,
                color: "text-green-500",
              },
              {
                label: "総セッション数",
                value: totals.sessions,
                icon: Activity,
                color: "text-purple-500",
              },
              {
                label: "新規ユーザー",
                value: totals.newUsers,
                icon: UserPlus,
                color: "text-orange-500",
              },
            ].map((item) => (
              <Card
                key={item.label}
                className="bg-card/50 backdrop-blur-sm border-border/50"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      {item.label}
                    </span>
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div className="text-3xl font-bold">{item.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* タブ */}
          <Tabs defaultValue="comparison" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-card/50 backdrop-blur-sm">
              <TabsTrigger value="comparison" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">記事別比較</span>
              </TabsTrigger>
              <TabsTrigger value="channels" className="flex items-center gap-2">
                <PieChartIcon className="w-4 h-4" />
                <span className="hidden sm:inline">流入元分析</span>
              </TabsTrigger>
              <TabsTrigger value="trends" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">日別トレンド</span>
              </TabsTrigger>
              <TabsTrigger value="table" className="flex items-center gap-2">
                <TableIcon className="w-4 h-4" />
                <span className="hidden sm:inline">詳細データ</span>
              </TabsTrigger>
            </TabsList>

            {/* 記事別比較 */}
            <TabsContent value="comparison">
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle>記事別アクセス比較</CardTitle>
                </CardHeader>
                <CardContent>
                  {barData.length === 0 ? (
                    <p className="text-center text-muted-foreground py-12">
                      データがありません。「データ更新」ボタンを押してください。
                    </p>
                  ) : (
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData} margin={{ bottom: 60 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis
                            dataKey="name"
                            angle={-30}
                            textAnchor="end"
                            height={80}
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                            }}
                            labelFormatter={(_, payload) =>
                              payload?.[0]?.payload?.fullName || ""
                            }
                          />
                          <Legend />
                          <Bar dataKey="ユーザー" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} />
                          <Bar dataKey="PV" fill={CHART_COLORS[1]} radius={[4, 4, 0, 0]} />
                          <Bar dataKey="セッション" fill={CHART_COLORS[2]} radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* 流入元分析 */}
            <TabsContent value="channels">
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <CardTitle>流入元チャネル分析</CardTitle>
                    <select
                      value={selectedArticle}
                      onChange={(e) => setSelectedArticle(e.target.value)}
                      className="bg-muted text-foreground px-3 py-2 rounded-lg text-sm"
                    >
                      <option value="all">全記事合計</option>
                      {analyticsData.map((d) => (
                        <option key={d.postId} value={d.postId}>
                          {d.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </CardHeader>
                <CardContent>
                  {getChannelData().length === 0 ? (
                    <p className="text-center text-muted-foreground py-12">
                      データがありません
                    </p>
                  ) : (
                    <div className="flex flex-col lg:flex-row items-center gap-8">
                      <div className="h-[300px] w-full lg:w-1/2">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={getChannelData()}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={110}
                              paddingAngle={3}
                              dataKey="value"
                              label={({ name, percent }) =>
                                `${name} ${(percent * 100).toFixed(0)}%`
                              }
                            >
                              {getChannelData().map((_, i) => (
                                <Cell
                                  key={i}
                                  fill={CHART_COLORS[i % CHART_COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "hsl(var(--card))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "8px",
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="w-full lg:w-1/2 space-y-3">
                        {getChannelData()
                          .sort((a, b) => b.value - a.value)
                          .map((ch, i) => (
                            <div
                              key={ch.name}
                              className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{
                                    backgroundColor:
                                      CHART_COLORS[i % CHART_COLORS.length],
                                  }}
                                />
                                <span className="text-sm">{ch.name}</span>
                              </div>
                              <Badge variant="secondary">
                                {ch.value} ユーザー
                              </Badge>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* 日別トレンド */}
            <TabsContent value="trends">
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <CardTitle>日別アクセス推移（直近30日）</CardTitle>
                    <select
                      value={selectedArticle}
                      onChange={(e) => setSelectedArticle(e.target.value)}
                      className="bg-muted text-foreground px-3 py-2 rounded-lg text-sm"
                    >
                      <option value="all">全記事合計</option>
                      {analyticsData.map((d) => (
                        <option key={d.postId} value={d.postId}>
                          {d.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </CardHeader>
                <CardContent>
                  {getTrendData().length === 0 ? (
                    <p className="text-center text-muted-foreground py-12">
                      日別データがありません。「データ更新」ボタンを押してください。
                    </p>
                  ) : (
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={getTrendData()}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                            }}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="ユーザー"
                            stroke={CHART_COLORS[0]}
                            strokeWidth={2}
                            dot={{ r: 3 }}
                            activeDot={{ r: 5 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="PV"
                            stroke={CHART_COLORS[1]}
                            strokeWidth={2}
                            dot={{ r: 3 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="セッション"
                            stroke={CHART_COLORS[2]}
                            strokeWidth={2}
                            dot={{ r: 3 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* 詳細テーブル */}
            <TabsContent value="table">
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle>記事別詳細データ</CardTitle>
                </CardHeader>
                <CardContent>
                  {analyticsData.length === 0 ? (
                    <p className="text-center text-muted-foreground py-12">
                      データがありません
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border/50">
                            <th className="text-left p-3 text-muted-foreground font-medium">
                              #
                            </th>
                            <th className="text-left p-3 text-muted-foreground font-medium">
                              記事タイトル
                            </th>
                            <th className="text-right p-3 text-muted-foreground font-medium">
                              ユーザー
                            </th>
                            <th className="text-right p-3 text-muted-foreground font-medium">
                              PV
                            </th>
                            <th className="text-right p-3 text-muted-foreground font-medium">
                              セッション
                            </th>
                            <th className="text-right p-3 text-muted-foreground font-medium">
                              新規
                            </th>
                            <th className="text-left p-3 text-muted-foreground font-medium">
                              トップチャネル
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {analyticsData
                            .sort(
                              (a, b) =>
                                (b.summary?.totalUsers || 0) -
                                (a.summary?.totalUsers || 0)
                            )
                            .map((d, i) => {
                              const topChannel = toJa(
                                Object.entries(d.channels || {}).sort(
                                  ([, a], [, b]) => b.users - a.users
                                )[0]?.[0] || "-"
                              );
                              return (
                                <tr
                                  key={d.postId}
                                  className="border-b border-border/30 hover:bg-muted/30 transition-colors"
                                >
                                  <td className="p-3 text-muted-foreground">
                                    {i + 1}
                                  </td>
                                  <td className="p-3">
                                    <Link
                                      href={`/blog/${d.postId}`}
                                      className="hover:text-accent transition-colors"
                                    >
                                      {d.title}
                                    </Link>
                                  </td>
                                  <td className="p-3 text-right font-mono">
                                    {d.summary?.totalUsers || 0}
                                  </td>
                                  <td className="p-3 text-right font-mono">
                                    {d.summary?.pageViews || 0}
                                  </td>
                                  <td className="p-3 text-right font-mono">
                                    {d.summary?.sessions || 0}
                                  </td>
                                  <td className="p-3 text-right font-mono">
                                    {d.summary?.newUsers || 0}
                                  </td>
                                  <td className="p-3">
                                    <Badge variant="outline" className="text-xs">
                                      {topChannel}
                                    </Badge>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
