"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { LOGO_IMAGES } from "@/data/images.js";
import { getLp } from "@/lib/lp-config";
import { lpEvent } from "@/lib/lp-tracking";
import "@/app/(site)/sansai-delivery-01/sansai-delivery-01.css";

/* ============================================================
   プロジェクト設定（名前は「仮」。ここを差し替えれば全体に反映）
   シリーズ第2弾以降は edition / expedition / 画像 / Stripe を変えて複製。
   ============================================================ */
/* 受注受付の終了フラグ。true にすると購入ボタン・追従バーを止め、
   ページ全体を「受付終了・お礼」表示に切り替える。再販時は false に戻す。 */
const CAMPAIGN_CLOSED = true;

const PROJECT = {
  series: "SANSAI Delivery",
  edition: "Vol.01",
  expedition: "NEPAL HIMALAYA",
  year: "2026",
  price: "12,500",
  deadline: "2026年8月31日（月）",
  delivery: "2026年冬ごろ予定",
};

/* 特別特典：オンライン報告会（購入者限定） */
const REPORT_EVENT = {
  date: "2026年11月8日（日）",
  time: "18:00〜19:30",
};

/* Stripe（購入ボタン）。publishable-key は公開値なので記載可。
   ※ いただいたキーが途中で切れている可能性があるため、Stripeダッシュボードの
     完全な値であることを必ず確認してください。 */
const STRIPE_BUY_BUTTON_ID = "buy_btn_1TfKMIAbxIPTFUEEagQgxtE2";
const STRIPE_PUBLISHABLE_KEY =
  "pk_live_51TfJGcAbxIPTFUEEn7gedMMTOZQiPJ19PCYJNACrWpgKW9vpaAg7dVdeHm6yfyxU3WCZMZiL9ZPddOK6yVQxCo0y00cTUmdY6D";

const IMG = {
  hero: "/img/shop-lp/2026/IMG_6911.JPG",
  earth: "/img/shop-lp/2026/IMG_6938.JPG",
  postcard: "/img/shop-lp/2026/IMG_6932.JPG",
  tee: "/img/shop-lp/2026/IMG_6914.jpg",
  tetsu: "/img/shop-lp/2026/IMG_5384.JPG",
};

const FAQ = [
  {
    q: "いつ届きますか？",
    a: "遠征から帰国後の制作・発送となり、2026年冬ごろのお届けを予定しています。遠征の状況により前後する場合があります。",
  },
  {
    q: "デザインはどんなものになりますか？",
    a: "Tシャツのデザインは、テツが遠征から持ち帰った現地写真をもとに帰国後に制作します。ネイビーボディの背面グラフィックを予定していますが、デザイン・カラー等の内容は変更になる場合があります。",
  },
  {
    q: "支払いのタイミングは？",
    a: "ご注文時に即時決済されます。商品のお届けは後日（2026年冬ごろ予定）となります。",
  },
  {
    q: "サイズ展開は？",
    a: "S / M / L / XL / XXL の5サイズ。各サイズの寸法は「商品仕様と予約」のサイズ表をご確認ください。綿100%・6.1ozのヘビーウェイトボディで、着るごとに風合いが増していきます。なお、染め加工時の縮みのため商品サイズには個体差がございます。",
  },
  {
    q: "オンライン報告会には誰でも参加できますか？",
    a: `ご購入者限定の特典です。${REPORT_EVENT.date}${REPORT_EVENT.time}に開催し、ご購入後に参加リンクをお送りします。報告会実施後には、アーカイブ動画をメールでお送りしますので、当日参加できない方もお楽しみいただけます。`,
  },
  {
    q: "キャンセル・返品はできますか？",
    a: "受注生産のため、受付後のキャンセル・変更・返品はお受けできません。サイズ等をご確認のうえご注文ください。",
  },
  {
    q: "送料はかかりますか？",
    a: "価格 ¥12,500 に送料を含みます（全国一律・送料込み）。",
  },
];

const NOTES = [
  "本商品は遠征帰国後のお届けとなります（2026年冬ごろ予定）。",
  "ご注文時に即時決済されます。",
  "Tシャツのデザイン・内容は帰国後に現地写真をもとに制作します。",
  "Tシャツの内容（デザイン・カラー等）は変更になる場合があります。",
  "受注生産のため、受付後のキャンセル・変更はお受けできません。",
  "染め加工時の縮みのため、商品サイズに個体差がございます。",
  "発送時期は遠征の状況により前後する場合があります。",
  "オンライン報告会の参加リンクは、ご購入後にお送りします（実施後にアーカイブ動画も配信します）。",
];

// GA4イベントの接頭辞（lp-config.js と対で管理）
const EV = getLp("sansai-delivery-01").eventPrefix;

const PrintHarvest = () => {
  const progressRef = useRef(null);
  const heroRef = useRef(null);
  const [stickyShown, setStickyShown] = useState(false);

  // セクション到達計測：data-lp-section を持つ各セクションが
  // 画面下部20%より上に入った時点で1回だけイベント送信
  useEffect(() => {
    const targets = document.querySelectorAll("[data-lp-section]");
    if (targets.length === 0 || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          lpEvent(`${EV}_section_${entry.target.dataset.lpSection}`);
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -20% 0px", threshold: 0 }
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Stripe購入ボタン操作計測：ボタンはiframe内のためクリックを直接拾えない。
  // フォーカスがiframeへ移った際の window blur で操作開始を検知する
  useEffect(() => {
    const onBlur = () => {
      const ae = document.activeElement;
      if (ae && ae.closest && ae.closest(".ph-buy-mount")) {
        lpEvent(`${EV}_checkout_focus`);
      }
    };
    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, []);

  // スクロール進捗（標高レール）＋ 追従購入バーの表示制御
  useEffect(() => {
    const doc = document.documentElement;
    const onScroll = () => {
      const max = doc.scrollHeight - doc.clientHeight;
      const p = max > 0 ? doc.scrollTop / max : 0;
      if (progressRef.current) progressRef.current.style.height = `${p * 100}%`;
      if (heroRef.current) {
        const heroBottom = heroRef.current.getBoundingClientRect().bottom;
        setStickyShown(heroBottom <= 0);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToOrder = (ctaId) => {
    if (ctaId) lpEvent(`${EV}_cta_${ctaId}`, { once: false });
    document.getElementById("ph-order")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="ph-root">
      {!CAMPAIGN_CLOSED && (
        <Script src="https://js.stripe.com/v3/buy-button.js" strategy="afterInteractive" />
      )}

      {/* edition rail */}
      <aside className="ph-rail" aria-hidden="true">
        <div className="ph-progress-wrap">
          <div className="ph-progress" ref={progressRef}></div>
        </div>
        <span className="ph-tick">{PROJECT.series} ↑</span>
        <span className="ph-tick">{PROJECT.edition}</span>
        <span className="ph-tick">{PROJECT.expedition}</span>
        <span className="ph-tick">{PROJECT.year}</span>
      </aside>

      <div className="ph-shell">
        {/* ============ 受付終了バナー ============ */}
        {CAMPAIGN_CLOSED && (
          <div className="ph-closed-strip" role="status">
            <b>CLOSED</b>
            {PROJECT.series} {PROJECT.edition} の受注受付は終了しました。たくさんのご予約、誠にありがとうございました。
          </div>
        )}

        {/* ============ HERO ============ */}
        <section className="ph-hero" ref={heroRef} data-lp-section="hero">
          <div className="ph-hero-img">
            <img src={IMG.hero} alt="垂壁を登るクライマー" />
          </div>
          <div className="ph-hero-content">
            <div className="ph-hero-inner">
              <div className="ph-kicker">
                <span className="ph-eyebrow">
                  {PROJECT.series} — {PROJECT.edition}
                </span>
                <span className="ph-mono" style={{ fontSize: "0.7rem", color: "var(--mist)" }}>
                  完全限定 / {PROJECT.expedition}
                </span>
              </div>
              <h1 className="ph-display">
                SANSAI<br />
                <span className="ph-l2">DELIVERY</span>
              </h1>
              <p className="ph-jp-lead">限界のその先で、見えた景色を。あなたにも。</p>
              <p className="ph-lede">
                この秋、テツはネパール・ヒマラヤへ。遠征から持ち帰る一枚の写真が、そのまま一枚のTシャツになる。
              </p>
              <div className="ph-meta-row">
                {CAMPAIGN_CLOSED ? (
                  <>
                    <button className="ph-cta" disabled>
                      受付は終了しました
                    </button>
                    <span className="ph-mono" style={{ fontSize: "0.78rem", color: "var(--mist)" }}>
                      受注受付は {PROJECT.deadline} をもって終了しました
                    </span>
                  </>
                ) : (
                  <>
                    <button className="ph-cta" onClick={() => scrollToOrder("hero")}>
                      予約する <span className="ph-arr">→</span>
                    </button>
                    <span className="ph-mono" style={{ fontSize: "0.78rem", color: "var(--mist)" }}>
                      ¥{PROJECT.price} / 送料込 · 受注締切 {PROJECT.deadline}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="ph-scrollcue" aria-hidden="true">SCROLL ↓</div>
        </section>

        {/* ============ CONCEPT / STORY ============ */}
        <section className="ph-story" data-lp-section="story">
          <div className="ph-wrap ph-block">
            <span className="ph-eyebrow">新プロジェクト始動 — {PROJECT.series} / {PROJECT.edition}</span>
            <div className="ph-sec-head" style={{ marginTop: "14px", marginBottom: "36px" }}>
              <h2>山から、デザインを持ち帰る。</h2>
            </div>

            {/* プロジェクトの定義（目立たせる） */}
            <div className="ph-concept-callout">
              <p>
                <span className="ph-pj-name">SANSAI Delivery</span>
                <span className="ph-pj-read">山菜デリバリー</span>
                は、「山菜採りオンライン」が遠征へ出るたび、
                現地で<em>“収穫”した一枚の写真</em>をそのままTシャツに刷り込み、
                完全限定で届ける——登攀ごとに続いていくプロジェクトです。
                その記念すべき第一弾（{PROJECT.edition}）が、
                <strong>テツのネパール・ヒマラヤ遠征</strong>。
              </p>
            </div>

            <div className="ph-story-inner ph-grid">
              <div className="ph-body">
                <p>
                  こんにちは、テツです。いつも応援していただき、ありがとうございます。この秋、僕はパートナーと2人でネパール・ヒマラヤへ向かいます。
                  <strong>標高7,000mを超え、標高差は1,700mにも及ぶ、これまでで最も困難な挑戦</strong>です。
                </p>
                <p>
                  壁の大きさ以外にも、コンディションに恵まれなければ登頂が難しく、過去数パーティにトライされていますが、
                  どのパーティも敗退を余儀なくされています。今回はその壁の山頂へ抜けるダイレクトラインを登攀する予定です。
                </p>
                <p>
                  帰国後、現地で撮影した写真を素材に、Tシャツとポストカードを制作・販売します。
                  <strong>売上は、この遠征の撮影費等に充てさせていただきます。</strong>
                  そして皆様の支えが、壁を登る力になります。
                </p>
              </div>
              <figure className="ph-figure">
                <img src={IMG.earth} alt="挑むルート — ネパール・ヒマラヤ（Google Earth）" />
                <figcaption className="ph-fcap">FIG.01 — 挑むルート / ネパール・ヒマラヤ（Google Earth）</figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* ============ PUNCH LINES ============ */}
        {/* <section className="ph-lines">
          <div className="ph-wrap ph-block">
            <div className="ph-lines-grid">
              <p className="ph-line">登って、撮って、刷る。<span>一枚の写真が、一枚の服になる。</span></p>
              <p className="ph-line">このデザインは、<span>テツもまだ見ていない。</span></p>
              <p className="ph-line">次に何を持ち帰れるかは、<span>登ってみないと分からない。</span></p>
            </div>
          </div>
        </section> */}

        {/* ============ TETSU INTRO ============ */}
        <section className="ph-intro" data-lp-section="climber">
          <div className="ph-wrap ph-block">
            <span className="ph-eyebrow">The Climber</span>
            <div className="ph-sec-head" style={{ marginTop: "14px", marginBottom: "44px" }}>
              <h2>誰が挑むのか？</h2>
            </div>
            <div className="ph-grid">
              <div className="ph-portrait">
                <img src={IMG.tetsu} alt="橋本 哲（テツ）" />
              </div>
              <div className="ph-bio">
                <div className="ph-name">
                  <h3>橋本 哲</h3>
                  <span className="ph-en">Tetsu Hashimoto</span>
                </div>
                <div className="ph-creds">
                  <span>El Capitan "The Nose"</span>
                  <span>Rahman Zom 西壁 6,350m 初登攀</span>
                  <span>Shiyko Zom 北壁 初登頂</span>
                </div>
                <p>
                  アルパインクライミングチーム「山菜採りオンライン」のクライマー。ヨセミテ El Capitan の登攀、
                  パキスタンでの未踏壁の初登攀・初登頂を重ねてきた。
                  <strong style={{ color: "var(--snow)", fontWeight: 500 }}>
                    6,350mの未踏壁を登りきった彼が、次に挑むのは7,000m級。
                  </strong>
                  その記録の一枚を、あなたの手元へ。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============ PROCESS ============ */}
        <section className="ph-process" data-lp-section="process">
          <div className="ph-wrap ph-block">
            <div className="ph-sec-head">
              <span className="ph-eyebrow">How it's made</span>
              <h2>登って、撮って、一枚にする。</h2>
              <p>このTシャツのデザインは、まだ世界のどこにもありません。遠征から帰ってはじめて生まれます。</p>
            </div>
            <div className="ph-steps">
              <div className="ph-step">
                <div className="ph-n">01</div>
                <h3>登る</h3>
                <p>2026年秋、ヒマラヤへ。7000m級の最も困難な壁へ。必ず登頂できる保証はありません。だから冒険と思っています。<br />その土地、その壁でしか味わえない挑戦をしてきます。</p>
              </div>
              <div className="ph-step">
                <div className="ph-n">02</div>
                <h3>撮る</h3>
                <p>ほとんど人が踏み入れたことがないその場所へ。<br />そこでしか見られない稜線、氷壁、光の瞬間を"収穫"してきます。</p>
              </div>
              <div className="ph-step">
                <div className="ph-n">03</div>
                <h3>刷る</h3>
                <p>持ち帰った景色をTシャツとポストカードにしてお届けします。</p>
              </div>
            </div>
          </div>
        </section>

        {/* ============ SIGNATURE ============ */}
        <section className="ph-slot" data-lp-section="signature">
          <div className="ph-wrap ph-block">
            <div className="ph-frame">
              <span className="ph-corner ph-c1"></span>
              <span className="ph-corner ph-c2"></span>
              <span className="ph-corner ph-c3"></span>
              <span className="ph-corner ph-c4"></span>
              <div className="ph-inner">
                <span className="ph-badge">未撮影 / NOT YET PHOTOGRAPHED</span>
                <h2 className="ph-display">デザインは<br />山の上で決まる</h2>
                <p>
                  背面グラフィックは、遠征で"収穫"した現地写真をもとに制作します。あなたが予約するのは、
                  まだ誰も見たことのない景色そのもの。お届けは{PROJECT.delivery}です。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============ SET CONTENTS ============ */}
        <section className="ph-set" data-lp-section="set">
          <div className="ph-wrap ph-block">
            <div className="ph-sec-head">
              <span className="ph-eyebrow">Set contents</span>
              <h2>セット内容</h2>
              <p>Tシャツ 1枚 ＋ 現地撮影のポストカード 1枚 ＋ オンライン報告会。</p>
            </div>
            <div className="ph-grid">
              <div className="ph-card">
                <div className="ph-ph">
                  <img src={IMG.tee} alt="背面グラフィックTシャツ（前作イメージ）" />
                  <span className="ph-tag">ITEM 01 / T-SHIRT</span>
                  <span className="ph-note">※前作イメージ</span>
                </div>
                <div className="ph-cbody">
                  <div className="ph-k">COTTON 100% · 6.1 oz · NAVY</div>
                  <h3>背面グラフィック Tシャツ</h3>
                  <p>
                    テツがクライミングで愛用するブランドを採用。綿100%・6.1ozの厚手ボディは、着るごとに風合いを増します。
                    カラーはネイビー（予定）、背面に現地写真のグラフィック。
                  </p>
                </div>
              </div>
              <div className="ph-card">
                <div className="ph-ph">
                  <img src={IMG.postcard} alt="現地撮影ポストカード（イメージ）" />
                  <span className="ph-tag">ITEM 02 / POSTCARD</span>
                  <span className="ph-note">※イメージ</span>
                </div>
                <div className="ph-cbody">
                  <div className="ph-k">FIELD PHOTO · 1 PC</div>
                  <h3>現地撮影ポストカード</h3>
                  <p>
                    遠征の現場で切り取った一枚を、手元に残るポストカードに。Tシャツとあわせて、この挑戦の記録を持ち帰ってください。
                  </p>
                </div>
              </div>
              <div className="ph-card">
                <div className="ph-ph ph-ph--event">
                  <span className="ph-tag">ITEM 03 / SPECIAL</span>
                  <div className="ph-event-visual" aria-hidden="true">
                    <span className="ph-event-badge">購入者限定 特典</span>
                    <span className="ph-event-date">11.8 <small>SUN</small></span>
                    <span className="ph-event-time">18:00 — 19:30</span>
                  </div>
                </div>
                <div className="ph-cbody">
                  <div className="ph-k">LIVE REPORT · ONLINE</div>
                  <h3>オンライン報告会</h3>
                  <p>
                    ご購入者限定で、遠征の報告会をオンラインで実施します。日程は{REPORT_EVENT.date}{REPORT_EVENT.time}。
                    ご購入後に参加リンクをお送りし、実施後にはアーカイブ動画もメールでお届けします。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ SPEC + ORDER ============ */}
        <section className="ph-spec" id="ph-order" data-lp-section="order">
          <div className="ph-wrap ph-block">
            <div className="ph-sec-head">
              <span className="ph-eyebrow">Specifications</span>
              <h2>商品仕様と予約</h2>
            </div>
            <div className="ph-grid">
              <dl>
                <div className="ph-row"><dt>セット</dt><dd>Tシャツ ×1 ／ ポストカード ×1 ／ オンライン報告会ご招待</dd></div>
                <div className="ph-row"><dt>素材</dt><dd>綿100% ／ 6.1 oz</dd></div>
                <div className="ph-row"><dt>カラー</dt><dd>ネイビー（背面グラフィック・予定）</dd></div>
                <div className="ph-row ph-row--stack">
                  <dt>サイズ</dt>
                  <dd>
                    <table className="ph-sizechart">
                      <thead>
                        <tr><th>サイズ</th><th>着丈</th><th>身幅</th><th>袖丈</th><th>肩幅</th></tr>
                      </thead>
                      <tbody>
                        <tr><th>S</th><td>66</td><td>47</td><td>18</td><td>46</td></tr>
                        <tr><th>M</th><td>71</td><td>52</td><td>21</td><td>50</td></tr>
                        <tr><th>L</th><td>73</td><td>54</td><td>22</td><td>52</td></tr>
                        <tr><th>XL</th><td>77</td><td>59</td><td>23</td><td>57</td></tr>
                        <tr><th>XXL</th><td>80</td><td>65</td><td>24</td><td>60</td></tr>
                      </tbody>
                    </table>
                    <span className="ph-sizechart-unit">単位：cm ／ S〜XXL の5サイズ展開</span>
                    <span className="ph-sizechart-unit">※染め加工時の縮みのため、商品サイズに個体差がございます。</span>
                  </dd>
                </div>
                <div className="ph-row"><dt>受注締切</dt><dd>{PROJECT.deadline}</dd></div>
                <div className="ph-row"><dt>お届け</dt><dd>遠征帰国後 ／ {PROJECT.delivery}</dd></div>
                <div className="ph-row">
                  <dt>備考</dt>
                  <dd>
                    ご購入者限定のオンライン報告会にご招待します（{REPORT_EVENT.date}{REPORT_EVENT.time}）。参加リンクはご購入後にお送りし、実施後にはアーカイブ動画をメールでお届けします。
                  </dd>
                </div>
              </dl>
              <div className="ph-priceblock">
                <div className="ph-pl">PRICE / 送料込み</div>
                <div className="ph-pv"><span className="ph-yen">¥</span>{PROJECT.price}</div>
                <div className="ph-ship">送料込み · 全国一律</div>
                {CAMPAIGN_CLOSED ? (
                  <div className="ph-closed-box">
                    <span className="ph-closed-pill">受付終了 / CLOSED</span>
                    <p>
                      本商品の受注受付は {PROJECT.deadline} をもって終了しました。
                      <br />
                      たくさんのご予約、誠にありがとうございました。
                    </p>
                    <p className="ph-closed-sub">ご予約分のお届けは {PROJECT.delivery} です。</p>
                  </div>
                ) : (
                  <>
                    <div className="ph-buy-mount">
                      <stripe-buy-button
                        buy-button-id={STRIPE_BUY_BUTTON_ID}
                        publishable-key={STRIPE_PUBLISHABLE_KEY}
                      ></stripe-buy-button>
                    </div>
                    <div className="ph-deadline">受注締切 <b>{PROJECT.deadline}</b> · 即時決済</div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ============ FAQ ============ */}
        <section className="ph-faq" data-lp-section="faq">
          <div className="ph-wrap ph-block">
            <div className="ph-sec-head">
              <span className="ph-eyebrow">FAQ</span>
              <h2>よくある質問</h2>
            </div>
            <div className="ph-list">
              {FAQ.map((item) => (
                <details key={item.q}>
                  <summary>
                    <span>{item.q}</span>
                    <span className="ph-plus" aria-hidden="true">+</span>
                  </summary>
                  <div className="ph-ans">{item.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ============ NOTES ============ */}
        <section className="ph-notes">
          <div className="ph-wrap ph-block">
            <div className="ph-box">
              <h3>⚠ ご注文前に必ずお読みください</h3>
              <ul>
                {NOTES.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ============ FINAL CTA ============ */}
        <section className="ph-final" data-lp-section="final">
          <div className="ph-wrap ph-block">
            <span className="ph-eyebrow">{PROJECT.series} — {PROJECT.edition}</span>
            {CAMPAIGN_CLOSED ? (
              <>
                <h2>ありがとうございました。</h2>
                <p>
                  {PROJECT.edition} の受注受付は {PROJECT.deadline} をもって終了しました。
                  ご予約いただいた皆さまの応援が、テツの遠征を支えます。
                  持ち帰った景色は、{PROJECT.delivery}にお手元へお届けします。
                </p>
                <span className="ph-closed-pill">受付終了 / CLOSED</span>
              </>
            ) : (
              <>
                <h2>この一枚で、次の一歩を。</h2>
                <p>あなたの予約が、テツの遠征を支えます。まだ存在しない景色を、一緒に持ち帰りましょう。</p>
                <button className="ph-cta" onClick={() => scrollToOrder("final")}>
                  予約して遠征を応援する <span className="ph-arr">→</span>
                </button>
              </>
            )}
          </div>
        </section>

        {/* ============ LP FOOTER（最小・離脱防止） ============ */}
        <footer className="ph-footer">
          <div className="ph-wrap">
            <div className="ph-frow">
              <div className="ph-flogo">
                <Link href="/">
                  <img src={LOGO_IMAGES.longWhite} alt="SANSAI ONLINE" />
                </Link>
              </div>
              <nav className="ph-flinks">
                <Link href="/contact">お問い合わせ</Link>
                <Link href="/tokushoho">特定商取引法に基づく表記</Link>
                <Link href="/privacy">プライバシーポリシー</Link>
                <Link href="/terms">利用規約</Link>
              </nav>
            </div>
            <div className="ph-copy">
              © {PROJECT.year} SANSAI ONLINE · ALPINE CLIMBING TEAM · {PROJECT.series}
            </div>
          </div>
        </footer>
      </div>

      {/* ============ STICKY BUY BAR（受付終了後は表示しない） ============ */}
      {!CAMPAIGN_CLOSED && (
        <div className={`ph-sticky${stickyShown ? " ph-show" : ""}`}>
          <div className="ph-srow">
            <div className="ph-sinfo">
              <span className="ph-st">{PROJECT.series} {PROJECT.edition} 限定セット</span>
              <span className="ph-sp"><span className="ph-yen">¥</span>{PROJECT.price}</span>
              <span className="ph-sddl">受注締切 {PROJECT.deadline} · 送料込</span>
            </div>
            <button className="ph-cta" onClick={() => scrollToOrder("sticky")}>予約する</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrintHarvest;
