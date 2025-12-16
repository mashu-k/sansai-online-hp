"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import {
  ArrowLeft,
  Save,
  Eye,
  X,
  Image,
  Bold,
  Italic,
  List,
  Link2,
  Code,
  Heading2,
  Heading3,
  Heading4,
} from "lucide-react";
import { db, storage } from "@/lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const AdminEdit = ({ isNewPost = false }) => {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const isNew = isNewPost || !id;

  const [post, setPost] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    location: "",
    author: "SANSAI ONLINE",
    thumbnail: "",
    status: "draft",
    tags: [],
  });

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [textareaRef, setTextareaRef] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewImages, setPreviewImages] = useState({}); // ローカルプレビュー用
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

  useEffect(() => {
    if (!isNew && id) {
      fetchPost();
    } else {
      setLoading(false);
    }
  }, [id, isNew]);

  // コンポーネントのアンマウント時にローカルプレビューURLをクリーンアップ
  useEffect(() => {
    return () => {
      Object.keys(previewImages).forEach((url) => {
        if (previewImages[url] === true) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []);

  const fetchPost = async () => {
    // 新規作成の場合やIDがない場合は早期リターン
    if (isNew || !id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const docRef = doc(db, "posts", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPost({
          id: docSnap.id,
          ...data,
          date:
            data.createdAt?.toDate().toLocaleDateString("ja-JP") || data.date,
        });
      }
    } catch (error) {
      console.error("記事の取得に失敗しました:", error);
    } finally {
      setLoading(false);
    }
  };

  const savePost = async (status = post.status) => {
    try {
      setSaving(true);
      const postData = {
        ...post,
        status,
        updatedAt: serverTimestamp(),
      };

      if (isNew) {
        const docRef = await addDoc(collection(db, "posts"), {
          ...postData,
          createdAt: serverTimestamp(),
        });
        console.log("新規記事を作成しました。ID:", docRef.id);
      } else if (id) {
        await setDoc(doc(db, "posts", id), postData, { merge: true });
        console.log("記事を更新しました。ID:", id);
      } else {
        console.error("IDが指定されていません");
        alert("エラー: IDが指定されていません");
        return;
      }

      alert("保存に成功しました！");
      router.push("/admin");
    } catch (error) {
      console.error("保存エラー:", error);
      console.error("エラーの詳細:", error.message);
      console.error("エラーコード:", error.code);
      alert(`保存に失敗しました: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !post.tags.includes(tagInput.trim())) {
      setPost((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setPost((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  // サムネイルアップロード処理
  const handleThumbnailUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingThumbnail(true);

    try {
      // ファイル名を生成
      const timestamp = Date.now();
      const fileName = `thumbnails/${timestamp}_${file.name}`;

      // Firebase Storage にアップロード
      const storageRef = ref(storage, fileName);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // サムネイルURLを設定
      setPost((prev) => ({ ...prev, thumbnail: downloadURL }));

      console.log("サムネイルアップロード成功:", downloadURL);
    } catch (error) {
      console.error("サムネイルアップロードエラー:", error);
      alert("サムネイルのアップロードに失敗しました。");
    } finally {
      setUploadingThumbnail(false);
      if (e.target) {
        e.target.value = "";
      }
    }
  };

  // テキストエリアに文字を挿入する関数
  const insertTextAtCursor = (text) => {
    if (!textareaRef) return;

    const start = textareaRef.selectionStart;
    const end = textareaRef.selectionEnd;
    const currentContent = post.content;

    const newContent =
      currentContent.substring(0, start) + text + currentContent.substring(end);

    setPost((prev) => ({ ...prev, content: newContent }));

    // カーソル位置を調整
    setTimeout(() => {
      textareaRef.selectionStart = start + text.length;
      textareaRef.selectionEnd = start + text.length;
      textareaRef.focus();
    }, 0);
  };

  // 選択テキストを囲む関数
  const wrapSelectedText = (before, after) => {
    if (!textareaRef) return;

    const start = textareaRef.selectionStart;
    const end = textareaRef.selectionEnd;
    const currentContent = post.content;
    const selectedText = currentContent.substring(start, end);

    const newText = before + selectedText + after;
    const newContent =
      currentContent.substring(0, start) +
      newText +
      currentContent.substring(end);

    setPost((prev) => ({ ...prev, content: newContent }));

    // カーソル位置を調整
    setTimeout(() => {
      textareaRef.selectionStart = start + before.length;
      textareaRef.selectionEnd = start + before.length + selectedText.length;
      textareaRef.focus();
    }, 0);
  };

  // 画像アップロード処理
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.log("ファイルが選択されていません");
      return;
    }

    console.log("アップロード開始:", file.name, "サイズ:", file.size);
    setUploadingImage(true);

    try {
      // ローカルプレビュー用のURLを先に作成（高速表示用）
      const localPreviewUrl = URL.createObjectURL(file);

      // ファイル名を生成（タイムスタンプ + オリジナルファイル名）
      const timestamp = Date.now();
      const fileName = `posts/${timestamp}_${file.name}`;
      console.log("アップロード先:", fileName);

      // 一時的にローカルプレビューURLでMarkdownを挿入
      const tempMarkdown = `\n![${file.name}](${localPreviewUrl})\n`;
      const cursorPos = textareaRef?.selectionStart || 0;
      insertTextAtCursor(tempMarkdown);

      // プレビュー用画像マップに追加
      setPreviewImages((prev) => ({
        ...prev,
        [localPreviewUrl]: true,
      }));

      // Firebase Storage にバックグラウンドでアップロード
      console.log("Storage参照を作成中...");
      const storageRef = ref(storage, fileName);

      console.log("ファイルをアップロード中...");
      const snapshot = await uploadBytes(storageRef, file);
      console.log("アップロード完了:", snapshot);

      console.log("ダウンロードURLを取得中...");
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log("ダウンロードURL取得成功:", downloadURL);

      // アップロード完了後、ローカルURLを実際のURLに置換
      setPost((prev) => {
        const updatedContent = prev.content.replace(
          localPreviewUrl,
          downloadURL
        );
        return { ...prev, content: updatedContent };
      });

      // プレビュー画像マップを更新
      setPreviewImages((prev) => {
        const newMap = { ...prev };
        delete newMap[localPreviewUrl];
        newMap[downloadURL] = false; // Firebaseの画像はfalse
        return newMap;
      });

      console.log("画像アップロード成功:", downloadURL);
    } catch (error) {
      console.error("画像アップロードエラーの詳細:", error);
      console.error("エラーコード:", error.code);
      console.error("エラーメッセージ:", error.message);

      // より詳細なエラーメッセージ
      let errorMessage = "画像のアップロードに失敗しました。\n";
      if (error.code === "storage/unauthorized") {
        errorMessage +=
          "権限がありません。Firebase Storageのルールを確認してください。";
      } else if (error.code === "storage/canceled") {
        errorMessage += "アップロードがキャンセルされました。";
      } else if (error.code === "storage/unknown") {
        errorMessage +=
          "不明なエラーが発生しました。コンソールを確認してください。";
      } else {
        errorMessage += error.message;
      }
      alert(errorMessage);
    } finally {
      setUploadingImage(false);
      // ファイル入力をリセット
      if (e.target) {
        e.target.value = "";
      }
    }
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
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* ヘッダー */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  戻る
                </Button>
              </Link>
              <h1 className="text-3xl font-bold">
                {isNew ? "新規記事作成" : "記事編集"}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setPreviewMode(!previewMode)}
              >
                <Eye className="w-4 h-4 mr-2" />
                {previewMode ? "エディタ" : "プレビュー"}
              </Button>
              <Button
                onClick={() => savePost("draft")}
                disabled={saving}
                variant="outline"
              >
                下書き保存
              </Button>
              <Button onClick={() => savePost("published")} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                公開
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* メインエディタ */}
            <div className="lg:col-span-2">
              {previewMode ? (
                <div className="lg:col-span-3">
                  <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>プレビュー</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setPreviewMode(false)}
                        >
                          <X className="w-4 h-4 mr-2" />
                          編集に戻る
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="prose prose-lg max-w-none">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h2: ({ children }) => (
                              <h2 className="text-2xl font-bold mt-8 mb-4 text-accent">
                                {children}
                              </h2>
                            ),
                            h3: ({ children }) => (
                              <h3 className="text-xl font-semibold mt-6 mb-3 text-accent">
                                {children}
                              </h3>
                            ),
                            h4: ({ children }) => (
                              <h4 className="text-lg font-medium mt-4 mb-2 text-accent/80">
                                {children}
                              </h4>
                            ),
                            p: ({ children }) => (
                              <p className="mb-4 leading-relaxed">{children}</p>
                            ),
                            strong: ({ children }) => (
                              <strong className="text-accent">
                                {children}
                              </strong>
                            ),
                            em: ({ children }) => (
                              <em className="italic">{children}</em>
                            ),
                            code: ({ children }) => (
                              <code className="px-1 py-0.5 bg-muted rounded text-sm">
                                {children}
                              </code>
                            ),
                            li: ({ children }) => (
                              <li className="ml-4 mb-2">{children}</li>
                            ),
                            ul: ({ children }) => (
                              <ul className="mb-4">{children}</ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="mb-4 list-decimal list-inside">
                                {children}
                              </ol>
                            ),
                            blockquote: ({ children }) => (
                              <blockquote className="border-l-4 border-accent pl-4 py-2 my-4 bg-muted/30 italic">
                                {children}
                              </blockquote>
                            ),
                            a: ({ href, children }) => (
                              <a
                                href={href}
                                className="text-accent hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {children}
                              </a>
                            ),
                            img: ({ src, alt }) => (
                              <div className="my-6">
                                <img
                                  src={src}
                                  alt={alt}
                                  className="w-full rounded-lg shadow-lg"
                                />
                                {alt && (
                                  <p className="text-center text-sm text-muted-foreground mt-2">
                                    {alt}
                                  </p>
                                )}
                              </div>
                            ),
                          }}
                        >
                          {post.content}
                        </ReactMarkdown>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="space-y-6">
                  <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                    <CardHeader>
                      <CardTitle>記事内容</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          タイトル
                        </label>
                        <Input
                          value={post.title}
                          onChange={(e) =>
                            setPost((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                          placeholder="記事のタイトルを入力..."
                          className="text-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          概要
                        </label>
                        <Textarea
                          value={post.excerpt}
                          onChange={(e) =>
                            setPost((prev) => ({
                              ...prev,
                              excerpt: e.target.value,
                            }))
                          }
                          placeholder="記事の概要を入力..."
                          rows={3}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          本文
                        </label>

                        {/* エディタツールバー */}
                        <div className="flex flex-wrap gap-1 p-2 border border-border rounded-t-md bg-muted/30">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => wrapSelectedText("**", "**")}
                            title="太字"
                          >
                            <Bold className="w-4 h-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => wrapSelectedText("*", "*")}
                            title="斜体"
                          >
                            <Italic className="w-4 h-4" />
                          </Button>

                          {/* 見出しボタンをグループ化 */}
                          <div className="flex border border-border rounded-md">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => insertTextAtCursor("\n## ")}
                              title="見出し2 (##)"
                              className="rounded-r-none border-r border-border"
                            >
                              <Heading2 className="w-4 h-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => insertTextAtCursor("\n### ")}
                              title="見出し3 (###)"
                              className="rounded-none border-r border-border"
                            >
                              <Heading3 className="w-4 h-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => insertTextAtCursor("\n#### ")}
                              title="見出し4 (####)"
                              className="rounded-l-none"
                            >
                              <Heading4 className="w-4 h-4" />
                            </Button>
                          </div>

                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => insertTextAtCursor("\n- ")}
                            title="リスト"
                          >
                            <List className="w-4 h-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => wrapSelectedText("[", "](url)")}
                            title="リンク"
                          >
                            <Link2 className="w-4 h-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => wrapSelectedText("`", "`")}
                            title="コード"
                          >
                            <Code className="w-4 h-4" />
                          </Button>

                          <div className="border-l border-border mx-1" />

                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                            disabled={uploadingImage}
                            id="image-upload-input"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              document
                                .getElementById("image-upload-input")
                                ?.click()
                            }
                            disabled={uploadingImage}
                            title="画像を挿入"
                          >
                            <Image className="w-4 h-4 mr-1" />
                            {uploadingImage ? "処理中..." : "画像"}
                          </Button>
                        </div>

                        <Textarea
                          ref={(el) => setTextareaRef(el)}
                          value={post.content}
                          onChange={(e) =>
                            setPost((prev) => ({
                              ...prev,
                              content: e.target.value,
                            }))
                          }
                          placeholder="記事の本文を入力... (Markdownが使用できます)"
                          rows={20}
                          className="font-mono rounded-t-none"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Markdownが使用できます。ツールバーから書式を選択するか、直接入力してください。
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

            {/* サイドバー */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* 基本情報 */}
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle>基本情報</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        カテゴリー
                      </label>
                      <select
                        value={post.category}
                        onChange={(e) =>
                          setPost((prev) => ({
                            ...prev,
                            category: e.target.value,
                          }))
                        }
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">選択してください</option>
                        <option value="海外遠征">海外遠征</option>
                        <option value="冬期クライミング">
                          冬期クライミング
                        </option>
                        <option value="フリークライミング">
                          フリークライミング
                        </option>
                        <option value="沢登り">沢登り</option>
                        <option value="スキー">スキー</option>
                        <option value="その他">その他</option>
                        <option value="お知らせ">お知らせ</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        場所
                      </label>
                      <Input
                        value={post.location}
                        onChange={(e) =>
                          setPost((prev) => ({
                            ...prev,
                            location: e.target.value,
                          }))
                        }
                        placeholder="槍ヶ岳、富士山など"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        サムネイル
                      </label>
                      {post.thumbnail ? (
                        <div className="space-y-2">
                          <img
                            src={post.thumbnail}
                            alt="サムネイル"
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setPost((prev) => ({ ...prev, thumbnail: "" }))
                            }
                            className="w-full"
                          >
                            <X className="w-4 h-4 mr-2" />
                            削除
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleThumbnailUpload}
                            disabled={uploadingThumbnail}
                            id="thumbnail-upload-input"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              document
                                .getElementById("thumbnail-upload-input")
                                ?.click()
                            }
                            disabled={uploadingThumbnail}
                            className="w-full"
                          >
                            <Image className="w-4 h-4 mr-2" />
                            {uploadingThumbnail
                              ? "アップロード中..."
                              : "画像を選択"}
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* タグ */}
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle>タグ</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="タグを入力..."
                        className="flex-1"
                      />
                      <Button onClick={addTag} size="sm">
                        追加
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminEdit;
