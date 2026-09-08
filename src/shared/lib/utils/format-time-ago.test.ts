import assert from "node:assert/strict";
import { test } from "node:test";

import { formatTimeAgo } from "./format-time-ago";

function agoDate(msAgo: number): Date {
  return new Date(Date.now() - msAgo);
}

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

test("formatTimeAgo never duplicates the 'ago' suffix", () => {
  const cases: Array<[string, Date]> = [
    ["seconds", agoDate(5 * SECOND)],
    ["minutes", agoDate(5 * MINUTE)],
    ["hours", agoDate(5 * HOUR)],
    ["days", agoDate(2 * DAY)],
    ["months", agoDate(60 * DAY)],
    ["years", agoDate(400 * DAY)],
  ];

  for (const [unit, date] of cases) {
    const result = formatTimeAgo(date);
    const occurrences = result.match(/ago/g)?.length ?? 0;

    assert.equal(
      occurrences,
      1,
      `expected exactly one "ago" in "${result}" for ${unit}`
    );
    assert.match(
      result,
      /ago$/,
      `expected "${result}" to end with "ago" for ${unit}`
    );
  }
});

test("formatTimeAgo handles invalid or missing input", () => {
  assert.equal(formatTimeAgo(""), "N/A");
  assert.equal(formatTimeAgo("not-a-date"), "Invalid date");
});
