export function socialUrl(type: string, handle: string): string {
  const h = handle.replace(/^@/, "");
  switch (type) {
    case "instagram":
      return `https://instagram.com/${h}`;
    case "twitter":
      return `https://twitter.com/${h}`;
    case "linkedin":
      return `https://linkedin.com/in/${h}`;
    case "youtube":
      return `https://youtube.com/@${h}`;
    default:
      return "";
  }
}

export function socialLabel(type: string): string {
  return (
    {
      instagram: "Instagram",
      twitter: "Twitter / X",
      linkedin: "LinkedIn",
      youtube: "YouTube",
      other: "Online",
    }[type] ?? type
  );
}
