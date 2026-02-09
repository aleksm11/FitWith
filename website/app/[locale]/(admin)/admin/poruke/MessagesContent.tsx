"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { mockMessages, type ContactMessage } from "@/lib/admin/mock-data";

export default function MessagesContent() {
  const t = useTranslations("Admin");
  const [messages, setMessages] = useState(mockMessages);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  const filtered = messages.filter((msg) => {
    if (filter === "unread") return !msg.isRead;
    if (filter === "read") return msg.isRead;
    return true;
  });

  const unreadCount = messages.filter((m) => !m.isRead).length;

  function handleToggleRead(id: string) {
    setMessages(
      messages.map((m) => (m.id === id ? { ...m, isRead: !m.isRead } : m))
    );
    if (selectedMessage?.id === id) {
      setSelectedMessage({ ...selectedMessage, isRead: !selectedMessage.isRead });
    }
  }

  function handleSelect(msg: ContactMessage) {
    setSelectedMessage(selectedMessage?.id === msg.id ? null : msg);
    if (!msg.isRead) {
      setMessages(messages.map((m) => (m.id === msg.id ? { ...m, isRead: true } : m)));
    }
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("sr-Latn", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-sora)] font-bold text-[36px] leading-[44px] max-sm:text-[28px] max-sm:leading-[36px] text-white mb-[8px]">
        {t("messagesTitle")}
      </h1>
      <p className="font-[family-name:var(--font-roboto)] text-[16px] text-white/50 mb-[32px]">
        {unreadCount} nepročitanih od {messages.length} poruka
      </p>

      {/* Filter tabs */}
      <div className="flex gap-[8px] mb-[24px]">
        {(["all", "unread", "read"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-[16px] py-[8px] font-[family-name:var(--font-roboto)] text-[13px] transition-colors ${
              filter === f
                ? "bg-orange-500/10 text-orange-400 border border-orange-500/30"
                : "bg-white/[0.03] text-white/50 border border-white/10 hover:border-white/20"
            }`}
          >
            {f === "all" ? `Sve (${messages.length})` : f === "unread" ? `${t("unread")} (${unreadCount})` : `${t("read")} (${messages.length - unreadCount})`}
          </button>
        ))}
      </div>

      {/* Messages list */}
      <div className="space-y-0">
        {filtered.map((msg) => (
          <button
            key={msg.id}
            onClick={() => handleSelect(msg)}
            className={`w-full text-left border-b border-white/5 px-[20px] py-[16px] hover:bg-white/[0.02] transition-colors ${
              selectedMessage?.id === msg.id ? "bg-orange-500/5" : ""
            } ${!msg.isRead ? "bg-white/[0.02]" : ""}`}
          >
            <div className="flex items-start justify-between gap-[16px]">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-[8px] mb-[4px]">
                  {!msg.isRead && (
                    <span className="w-[8px] h-[8px] bg-orange-500 rounded-full shrink-0" />
                  )}
                  <span className={`font-[family-name:var(--font-roboto)] text-[14px] ${!msg.isRead ? "text-white font-semibold" : "text-white/70"}`}>
                    {msg.name}
                  </span>
                  <span className="font-[family-name:var(--font-roboto)] text-[12px] text-white/30">
                    &lt;{msg.email}&gt;
                  </span>
                </div>
                <p className="font-[family-name:var(--font-roboto)] text-[13px] text-white/50 truncate">
                  {msg.message}
                </p>
              </div>
              <span className="font-[family-name:var(--font-roboto)] text-[12px] text-white/30 shrink-0 max-sm:hidden">
                {formatDate(msg.createdAt)}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Selected message detail */}
      {selectedMessage && (
        <div className="mt-[24px] bg-white/[0.03] border border-white/10 p-[24px]">
          <div className="flex items-start justify-between mb-[20px]">
            <div>
              <h2 className="font-[family-name:var(--font-sora)] font-bold text-[20px] text-white">
                {selectedMessage.name}
              </h2>
              <div className="flex items-center gap-[16px] mt-[4px]">
                <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/40">
                  {selectedMessage.email}
                </span>
                <span className="font-[family-name:var(--font-roboto)] text-[13px] text-white/40">
                  {selectedMessage.phone}
                </span>
              </div>
              <span className="font-[family-name:var(--font-roboto)] text-[12px] text-white/30 mt-[4px] inline-block">
                {formatDate(selectedMessage.createdAt)}
              </span>
            </div>
            <button
              onClick={() => handleToggleRead(selectedMessage.id)}
              className="border border-white/20 text-white/50 px-[12px] py-[6px] font-[family-name:var(--font-roboto)] text-[12px] hover:border-white/40 hover:text-white/70 transition-colors"
            >
              {selectedMessage.isRead ? t("markAsUnread") : t("markAsRead")}
            </button>
          </div>
          <div className="border-t border-white/5 pt-[16px]">
            <p className="font-[family-name:var(--font-roboto)] text-[15px] text-white/80 leading-[24px] whitespace-pre-wrap">
              {selectedMessage.message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
