import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { getAdminDb } from "@/lib/firebase-admin";
import { LP_LIST } from "@/lib/lp-config";
import { logger } from "@/lib/logger";

const propertyId = process.env.GA4_PROPERTY_ID;

function getAnalyticsClient() {
  return new BetaAnalyticsDataClient({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
  });
}

// FirestoreからLP解析データを取得（Admin SDK経由）
export async function GET() {
  try {
    const snapshot = await getAdminDb().collection("lpAnalytics").get();
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return Response.json({ data });
  } catch (error) {
    logger.error("LP analytics fetch error:", error);
    return Response.json({ data: [], error: error.message }, { status: 200 });
  }
}

// GA4からLPのアクセス・イベントデータを取得してFirestoreに同期
export async function POST() {
  try {
    const client = getAnalyticsClient();
    const now = new Date().toISOString();
    const batch = getAdminDb().batch();

    for (const lp of LP_LIST) {
      // 1. ページ指標（LP本体とサンクスページをまとめて取得）
      const [pageResponse] = await client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: lp.startDate, endDate: "today" }],
        dimensions: [{ name: "pagePath" }],
        metrics: [
          { name: "sessions" },
          { name: "totalUsers" },
          { name: "screenPageViews" },
          { name: "newUsers" },
          { name: "bounceRate" },
          { name: "averageSessionDuration" },
        ],
        dimensionFilter: {
          filter: {
            fieldName: "pagePath",
            stringFilter: { matchType: "BEGINS_WITH", value: lp.path },
          },
        },
        limit: 50,
      });

      const summary = {
        sessions: 0,
        totalUsers: 0,
        pageViews: 0,
        newUsers: 0,
        bounceRate: 0,
        avgSessionDurationSec: 0,
      };
      const purchase = { sessions: 0, totalUsers: 0, pageViews: 0 };

      pageResponse.rows?.forEach((row) => {
        const path = row.dimensionValues[0].value.replace(/\/$/, "");
        const m = row.metricValues;
        if (path === lp.path) {
          summary.sessions = parseInt(m[0].value) || 0;
          summary.totalUsers = parseInt(m[1].value) || 0;
          summary.pageViews = parseInt(m[2].value) || 0;
          summary.newUsers = parseInt(m[3].value) || 0;
          summary.bounceRate = parseFloat(m[4].value) || 0;
          summary.avgSessionDurationSec = parseFloat(m[5].value) || 0;
        } else if (path === lp.thanksPath) {
          purchase.sessions = parseInt(m[0].value) || 0;
          purchase.totalUsers = parseInt(m[1].value) || 0;
          purchase.pageViews = parseInt(m[2].value) || 0;
        }
      });

      // 2. 流入元チャネル（LP本体のみ）
      const [channelResponse] = await client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: lp.startDate, endDate: "today" }],
        dimensions: [
          { name: "pagePath" },
          { name: "sessionDefaultChannelGroup" },
        ],
        metrics: [{ name: "sessions" }, { name: "totalUsers" }],
        dimensionFilter: {
          filter: {
            fieldName: "pagePath",
            stringFilter: { matchType: "EXACT", value: lp.path },
          },
        },
        limit: 100,
      });

      const channels = {};
      channelResponse.rows?.forEach((row) => {
        const channel = row.dimensionValues[1].value;
        channels[channel] = {
          sessions: parseInt(row.metricValues[0].value) || 0,
          users: parseInt(row.metricValues[1].value) || 0,
        };
      });

      // 3. 直近30日の日別トレンド（LP本体のみ）
      const [trendResponse] = await client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
        dimensions: [{ name: "date" }, { name: "pagePath" }],
        metrics: [
          { name: "sessions" },
          { name: "totalUsers" },
          { name: "screenPageViews" },
        ],
        dimensionFilter: {
          filter: {
            fieldName: "pagePath",
            stringFilter: { matchType: "EXACT", value: lp.path },
          },
        },
        limit: 100,
      });

      const dailyTrends = (trendResponse.rows || [])
        .map((row) => {
          const d = row.dimensionValues[0].value;
          return {
            date: `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`,
            sessions: parseInt(row.metricValues[0].value) || 0,
            users: parseInt(row.metricValues[1].value) || 0,
            pageViews: parseInt(row.metricValues[2].value) || 0,
          };
        })
        .sort((a, b) => a.date.localeCompare(b.date));

      // 4. LPカスタムイベント（セクション到達・CTAクリック・購入ボタン操作）
      const [eventResponse] = await client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: lp.startDate, endDate: "today" }],
        dimensions: [{ name: "eventName" }],
        metrics: [{ name: "eventCount" }, { name: "totalUsers" }],
        dimensionFilter: {
          filter: {
            fieldName: "eventName",
            stringFilter: { matchType: "BEGINS_WITH", value: `${lp.eventPrefix}_` },
          },
        },
        limit: 200,
      });

      const events = {};
      eventResponse.rows?.forEach((row) => {
        events[row.dimensionValues[0].value] = {
          count: parseInt(row.metricValues[0].value) || 0,
          users: parseInt(row.metricValues[1].value) || 0,
        };
      });

      const sections = lp.sections.map((s) => ({
        id: s.id,
        label: s.label,
        ...(events[`${lp.eventPrefix}_section_${s.id}`] || { count: 0, users: 0 }),
      }));
      const ctas = lp.ctas.map((c) => ({
        id: c.id,
        label: c.label,
        ...(events[`${lp.eventPrefix}_cta_${c.id}`] || { count: 0, users: 0 }),
      }));
      const checkout =
        events[`${lp.eventPrefix}_checkout_focus`] || { count: 0, users: 0 };

      const docRef = getAdminDb().collection("lpAnalytics").doc(lp.id);
      batch.set(
        docRef,
        {
          lpId: lp.id,
          title: lp.title,
          path: lp.path,
          summary,
          channels,
          dailyTrends,
          sections,
          ctas,
          checkout,
          purchase,
          lastUpdated: now,
        },
        { merge: true }
      );
    }

    await batch.commit();

    return Response.json({
      success: true,
      updatedLps: LP_LIST.length,
      lastUpdated: now,
    });
  } catch (error) {
    logger.error("LP analytics sync error:", error);
    return Response.json(
      { error: error.message || "同期に失敗しました" },
      { status: 500 }
    );
  }
}
