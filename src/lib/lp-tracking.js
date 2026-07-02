// LP用のGA4イベント送信ヘルパー。gtag はルートレイアウトのGAスニペットで
// グローバルに定義済み。同一ページビュー内の重複送信はここで抑止する。
const sent = new Set();

export function lpEvent(eventName, { once = true } = {}) {
  if (typeof window === "undefined") return;
  if (once) {
    if (sent.has(eventName)) return;
    sent.add(eventName);
  }
  // GAスクリプト（afterInteractive）ロード前の発火も失わないよう、
  // gtag未定義なら標準シムを立てて dataLayer にキューしておく
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== "function") {
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
  }
  window.gtag("event", eventName);
}
