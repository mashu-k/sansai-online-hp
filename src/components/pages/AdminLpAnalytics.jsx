"use client";
import React, { useState, useEffect } from "react";
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
  LabelList,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Users,
  Activity,
  RefreshCw,
  TrendingUp,
  MousePointerClick,
  ShoppingCart,
  Timer,
  LogOut,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { logger } from "@/lib/logger";

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

// 割合表示（分母0は "-"）
const pct = (num, den) => (den > 0 ? `${((num / den) * 100).toFixed(1)}%` : "-");

const formatDuration = (sec) => {
  if (!sec) return "-";
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${m}分${s}秒`;
};

const AdminLpAnalytics = () => {
  const [lpData, setLpData] = useState([]);
  const [selectedLp, setSelectedLp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/analytics/lp");
      const result = await res.json();
      const data = result.data || [];
      setLpData(data);
      setSelectedLp((prev) => prev || data[0]?.lpId || null);
    } catch (error) {
      logger.error("LP解析データ取得エラー:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      const res = await fetch("/api/analytics/lp", { method: "POST" });
      const result = await res.json();
      if (result.success) {
        await fetchData();
      } else {
        alert(`同期エラー: ${result.error}`);
      }
    } catch (error) {
      alert(`同期に失敗しました: ${error.message}`);
    } finally {
      setSyncing(false);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return "未取得";
    return new Date(iso).toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">読み込み中...</p>
      </div>
    );
  }

  const lp = lpData.find((d) => d.lpId === selectedLp);
  const summary = lp?.summary || {};
  const sessions = summary.sessions || 0;
  const users = summary.totalUsers || 0;
  const checkout = lp?.checkout || { count: 0, users: 0 };
  const purchase = lp?.purchase || { sessions: 0, totalUsers: 0 };

  // CTAクリック率：いずれかのCTAをクリックしたユーザー数は取れないため
  // 最大値（重複を含まない下限）を採用
  const ctaMaxUsers = Math.max(0, ...(lp?.ctas || []).map((c) => c.users || 0));
  const orderSection = (lp?.sections || []).find((s) => s.id === "order");

  const funnelData = (lp?.sections || []).map((s) => ({
    name: s.label,
    到達ユーザー: s.users || 0,
    rate: users > 0 ? ((s.users || 0) / users) * 100 : 0,
  }));

  const channelData = Object.entries(lp?.channels || {})
    .map(([name, v]) => ({ name: toJa(name), value: v.sessions || 0 }))
    .sort((a, b) => b.value - a.value);

  const trendData = (lp?.dailyTrends || []).map((d) => ({
    date: d.date.slice(5),
    セッション: d.sessions,
    ユーザー: d.users,
    PV: d.pageViews,
  }));

  const kpiTop = [
    { label: "セッション数", value: sessions, icon: Activity, color: "text-blue-500" },
    { label: "ユーザー数", value: users, icon: Users, color: "text-teal-500" },
    {
      label: "直帰率",
      value: sessions > 0 ? `${(summary.bounceRate * 100).toFixed(1)}%` : "-",
      icon: LogOut,
      color: "text-orange-500",
    },
    {
      label: "平均滞在時間",
      value: formatDuration(summary.avgSessionDurationSec),
      icon: Timer,
      color: "text-purple-500",
    },
  ];

  const kpiCv = [
    {
      label: "CTAクリック率",
      value: pct(ctaMaxUsers, users),
      sub: "クリックユーザー ÷ 訪問ユーザー",
      icon: MousePointerClick,
      color: "text-green-500",
    },
    {
      label: "予約セクション到達率",
      value: pct(orderSection?.users || 0, users),
      sub: "商品仕様・予約の表示ユーザー",
      icon: TrendingUp,
      color: "text-blue-500",
    },
    {
      label: "購入ボタン操作率",
      value: pct(checkout.users, users),
      sub: `操作ユーザー ${checkout.users} 人`,
      icon: ShoppingCart,
      color: "text-yellow-500",
    },
    {
      label: "購入数 / CVR",
      value: `${purchase.sessions} 件 / ${pct(purchase.sessions, sessions)}`,
      sub: "サンクスページ到達ベース",
      icon: ShoppingCart,
      color: "text-red-500",
    },
  ];

  // カゴ落ち率：購入ボタンを操作したが購入完了に至らなかった割合（簡易計測）
  const cartAbandonRate =
    checkout.users > 0
      ? `${(Math.max(0, 1 - purchase.totalUsers / checkout.users) * 100).toFixed(1)}%`
      : "-";

  return (
    <div className="p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* ヘッダー */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">LP解析</h1>
            <p className="text-muted-foreground text-sm">
              最終更新: {formatDate(lp?.lastUpdated)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {lpData.length > 1 && (
              <select
                value={selectedLp || ""}
                onChange={(e) => setSelectedLp(e.target.value)}
                className="bg-muted text-foreground px-3 py-2 rounded-lg text-sm"
              >
                {lpData.map((d) => (
                  <option key={d.lpId} value={d.lpId}>
                    {d.title}
                  </option>
                ))}
              </select>
            )}
            <Button onClick={handleSync} disabled={syncing} size="lg">
              <RefreshCw className={`w-5 h-5 mr-2 ${syncing ? "animate-spin" : ""}`} />
              {syncing ? "同期中..." : "データ更新"}
            </Button>
          </div>
        </div>

        {!lp ? (
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                まだデータがありません。「データ更新」ボタンでGA4から同期してください。
              </p>
              <p className="text-xs text-muted-foreground">
                ※ LPのカスタムイベントはGA4への反映に最大24〜48時間かかります
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* 対象LP */}
            <div className="flex items-center gap-2 mb-6">
              <Badge variant="outline">{lp.title}</Badge>
              <Link
                href={lp.path}
                target="_blank"
                className="text-xs text-muted-foreground hover:text-accent flex items-center gap-1"
              >
                {lp.path} <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            {/* トップファネルKPI */}
            <h2 className="text-sm font-medium text-muted-foreground mb-3">トップファネル</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {kpiTop.map((item) => (
                <Card key={item.label} className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div className="text-3xl font-bold">{item.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* コンバージョンKPI */}
            <h2 className="text-sm font-medium text-muted-foreground mb-3">コンバージョン</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
              {kpiCv.map((item) => (
                <Card key={item.label} className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div className="text-2xl font-bold">{item.value}</div>
                    <p className="text-xs text-muted-foreground mt-1">{item.sub}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mb-8">
              ※ カゴ落ち率（購入ボタン操作 → 未購入）: <b>{cartAbandonRate}</b>。
              購入数はStripe決済後のサンクスページ到達ベースの簡易計測です。Stripe連携後に正確な値に置き換え予定。
            </p>

            {/* セクション到達ファネル */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 mb-8">
              <CardHeader>
                <CardTitle>セクション到達率（どこまで読まれているか）</CardTitle>
              </CardHeader>
              <CardContent>
                {funnelData.every((d) => d.到達ユーザー === 0) ? (
                  <p className="text-center text-muted-foreground py-12">
                    イベントデータがまだありません（GA4反映まで最大24〜48時間）
                  </p>
                ) : (
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={funnelData} layout="vertical" margin={{ left: 40, right: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis type="number" tick={{ fontSize: 12 }} allowDecimals={false} />
                        <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                          formatter={(value, name, props) => [
                            `${value} 人（到達率 ${props.payload.rate.toFixed(1)}%）`,
                            "到達ユーザー",
                          ]}
                        />
                        <Bar dataKey="到達ユーザー" fill={CHART_COLORS[0]} radius={[0, 4, 4, 0]}>
                          <LabelList
                            dataKey="rate"
                            position="right"
                            formatter={(v) => `${v.toFixed(0)}%`}
                            style={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* CTAクリック + 流入元 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle>CTAクリック</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(lp.ctas || []).map((c, i) => (
                      <div
                        key={c.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                          />
                          <span className="text-sm">{c.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{c.count || 0} 回</Badge>
                          <Badge variant="outline">{pct(c.users || 0, users)}</Badge>
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/50">
                      <span className="text-sm font-medium">購入ボタン操作</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{checkout.users} 人</Badge>
                        <Badge variant="outline">{pct(checkout.users, users)}</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle>流入元チャネル（セッション）</CardTitle>
                </CardHeader>
                <CardContent>
                  {channelData.length === 0 ? (
                    <p className="text-center text-muted-foreground py-12">データがありません</p>
                  ) : (
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={channelData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={3}
                            dataKey="value"
                            label={({ name, percent }) =>
                              `${name} ${(percent * 100).toFixed(0)}%`
                            }
                          >
                            {channelData.map((_, i) => (
                              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
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
                  )}
                </CardContent>
              </Card>
            </div>

            {/* 日別トレンド */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>日別アクセス推移（直近30日）</CardTitle>
              </CardHeader>
              <CardContent>
                {trendData.length === 0 ? (
                  <p className="text-center text-muted-foreground py-12">
                    日別データがありません
                  </p>
                ) : (
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
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
                          dataKey="セッション"
                          stroke={CHART_COLORS[0]}
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="ユーザー"
                          stroke={CHART_COLORS[1]}
                          strokeWidth={2}
                          dot={{ r: 3 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="PV"
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
          </>
        )}
      </motion.div>
    </div>
  );
};

export default AdminLpAnalytics;
