export const avatarPresets = [
  { id: "warabi", label: "わらび", emoji: "\u{1F33F}" },
  { id: "kinoko", label: "きのこ", emoji: "\u{1F344}" },
  { id: "taranome", label: "たらの芽", emoji: "\u{1F331}" },
  { id: "yama", label: "山", emoji: "\u{1F3D4}\uFE0F" },
  { id: "ki", label: "木", emoji: "\u{1F332}" },
  { id: "sakura", label: "桜", emoji: "\u{1F338}" },
  { id: "momiji", label: "もみじ", emoji: "\u{1F341}" },
  { id: "donguri", label: "どんぐり", emoji: "\u{1F330}" },
  { id: "kuma", label: "くま", emoji: "\u{1F43B}" },
  { id: "usagi", label: "うさぎ", emoji: "\u{1F430}" },
  { id: "tori", label: "鳥", emoji: "\u{1F426}" },
  { id: "kaeru", label: "かえる", emoji: "\u{1F438}" },
];

export function getAvatarEmoji(avatarId) {
  const preset = avatarPresets.find((p) => p.id === avatarId);
  return preset ? preset.emoji : "\u{1F33F}";
}
