"use client";

import { createClientId } from "@/lib/utils";
import type { SongRequest } from "@/lib/types";

const SESSION_KEY = "dj-connect:guest-session-id";
const REQUESTS_KEY = "dj-connect:my-requests";
const VOTES_KEY = "dj-connect:poll-votes";

export function getGuestSessionId() {
  if (typeof window === "undefined") return "server-session";
  const existing = window.localStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const next = createClientId("guest");
  window.localStorage.setItem(SESSION_KEY, next);
  return next;
}

export function getStoredRequests(eventId: string) {
  if (typeof window === "undefined") return [] as SongRequest[];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(REQUESTS_KEY) || "[]") as SongRequest[];
    return parsed.filter((item) => item.event_id === eventId);
  } catch {
    return [] as SongRequest[];
  }
}

export function storeRequest(request: SongRequest) {
  if (typeof window === "undefined") return;
  const current = getAllStoredRequests().filter((item) => item.id !== request.id);
  window.localStorage.setItem(REQUESTS_KEY, JSON.stringify([request, ...current].slice(0, 30)));
}

function getAllStoredRequests() {
  try {
    return JSON.parse(window.localStorage.getItem(REQUESTS_KEY) || "[]") as SongRequest[];
  } catch {
    return [] as SongRequest[];
  }
}

export function hasVoted(pollId: string) {
  if (typeof window === "undefined") return false;
  const votes = getVoteMap();
  return Boolean(votes[pollId]);
}

export function markVoted(pollId: string, optionId: string) {
  if (typeof window === "undefined") return;
  const votes = getVoteMap();
  votes[pollId] = optionId;
  window.localStorage.setItem(VOTES_KEY, JSON.stringify(votes));
}

export function getVoteMap() {
  try {
    return JSON.parse(window.localStorage.getItem(VOTES_KEY) || "{}") as Record<string, string>;
  } catch {
    return {} as Record<string, string>;
  }
}
