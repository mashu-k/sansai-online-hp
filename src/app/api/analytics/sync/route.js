import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { getAdminDb } from "@/lib/firebase-admin";

const propertyId = process.env.GA4_PROPERTY_ID;

function getAnalyticsClient() {
  return new BetaAnalyticsDataClient({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
  });
}

// Firestoreからアナリティクスデータを取得（Admin SDK経由）
export async function GET() {
  try {
    const snapshot = await getAdminDb().collection("analytics").get();
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return Response.json({ data });
  } catch (error) {
    console.error("Analytics fetch error:", error);
    return Response.json({ data: [], error: error.message }, { status: 200 });
  }
}

// GA4からデータを取得してFirestoreに同期
export async function POST() {
  try {
    const client = getAnalyticsClient();

    // 1. Firestoreから公開済み記事を取得
    const postsSnapshot = await getAdminDb()
      .collection("posts")
      .where("status", "==", "published")
      .get();

    const posts = postsSnapshot.docs.map((doc) => ({
      id: doc.id,
      title: doc.data().title,
    }));

    if (posts.length === 0) {
      return Response.json({ message: "公開記事がありません" }, { status: 200 });
    }

    // 2. GA4: 記事別メトリクス取得
    const [metricsResponse] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: "2025-01-01", endDate: "today" }],
      dimensions: [{ name: "pagePath" }],
      metrics: [
        { name: "totalUsers" },
        { name: "screenPageViews" },
        { name: "sessions" },
        { name: "newUsers" },
      ],
      dimensionFilter: {
        filter: {
          fieldName: "pagePath",
          stringFilter: { matchType: "CONTAINS", value: "/blog/" },
        },
      },
      limit: 100,
    });

    // 3. GA4: 記事別×チャネル取得
    const [channelResponse] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: "2025-01-01", endDate: "today" }],
      dimensions: [
        { name: "pagePath" },
        { name: "sessionDefaultChannelGroup" },
      ],
      metrics: [{ name: "totalUsers" }, { name: "sessions" }],
      dimensionFilter: {
        filter: {
          fieldName: "pagePath",
          stringFilter: { matchType: "CONTAINS", value: "/blog/" },
        },
      },
      limit: 500,
    });

    // 4. GA4: 直近30日の日別トレンド
    const [trendResponse] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensions: [{ name: "date" }, { name: "pagePath" }],
      metrics: [
        { name: "totalUsers" },
        { name: "screenPageViews" },
        { name: "sessions" },
      ],
      dimensionFilter: {
        filter: {
          fieldName: "pagePath",
          stringFilter: { matchType: "CONTAINS", value: "/blog/" },
        },
      },
      limit: 1000,
    });

    // 5. データを記事IDごとに整理
    const postMap = {};
    posts.forEach((p) => {
      postMap[p.id] = {
        postId: p.id,
        title: p.title,
        summary: { totalUsers: 0, pageViews: 0, sessions: 0, newUsers: 0 },
        channels: {},
        dailyTrends: [],
      };
    });

    // メトリクス
    metricsResponse.rows?.forEach((row) => {
      const path = row.dimensionValues[0].value;
      const postId = path.replace("/blog/", "");
      if (postMap[postId]) {
        postMap[postId].summary = {
          totalUsers: parseInt(row.metricValues[0].value) || 0,
          pageViews: parseInt(row.metricValues[1].value) || 0,
          sessions: parseInt(row.metricValues[2].value) || 0,
          newUsers: parseInt(row.metricValues[3].value) || 0,
        };
      }
    });

    // チャネル
    channelResponse.rows?.forEach((row) => {
      const path = row.dimensionValues[0].value;
      const channel = row.dimensionValues[1].value;
      const postId = path.replace("/blog/", "");
      if (postMap[postId]) {
        postMap[postId].channels[channel] = {
          users: parseInt(row.metricValues[0].value) || 0,
          sessions: parseInt(row.metricValues[1].value) || 0,
        };
      }
    });

    // 日別トレンド
    trendResponse.rows?.forEach((row) => {
      const dateStr = row.dimensionValues[0].value;
      const path = row.dimensionValues[1].value;
      const postId = path.replace("/blog/", "");
      if (postMap[postId]) {
        postMap[postId].dailyTrends.push({
          date: `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`,
          users: parseInt(row.metricValues[0].value) || 0,
          pageViews: parseInt(row.metricValues[1].value) || 0,
          sessions: parseInt(row.metricValues[2].value) || 0,
        });
      }
    });

    // 日別トレンドを日付順にソート
    Object.values(postMap).forEach((data) => {
      data.dailyTrends.sort((a, b) => a.date.localeCompare(b.date));
    });

    // 6. Firestoreに書き込み
    const batch = getAdminDb().batch();
    const now = new Date().toISOString();

    Object.entries(postMap).forEach(([postId, data]) => {
      const { summary, channels } = data;

      // トップチャネルを算出
      const topChannel =
        Object.entries(channels).sort(
          ([, a], [, b]) => b.users - a.users
        )[0]?.[0] || "N/A";

      // posts ドキュメントに analytics サマリーを更新
      const postRef = getAdminDb().collection("posts").doc(postId);
      batch.update(postRef, {
        analytics: {
          totalUsers: summary.totalUsers,
          pageViews: summary.pageViews,
          sessions: summary.sessions,
          newUsers: summary.newUsers,
          topChannel,
          lastUpdated: now,
        },
      });

      // analytics コレクションに詳細データを保存
      const analyticsRef = getAdminDb().collection("analytics").doc(postId);
      batch.set(
        analyticsRef,
        { ...data, lastUpdated: now },
        { merge: true }
      );
    });

    await batch.commit();

    return Response.json({
      success: true,
      updatedPosts: Object.keys(postMap).length,
      lastUpdated: now,
    });
  } catch (error) {
    console.error("Analytics sync error:", error);
    return Response.json(
      { error: error.message || "同期に失敗しました" },
      { status: 500 }
    );
  }
}
