import { parse, getHours, getMinutes, subDays, addDays } from "date-fns"

export function getBedtimeDates(
  start: string,
  end: string
): { yesterday: { start: Date; end: Date }; today: { start: Date; end: Date } } {
  const now = new Date()
  const yesterday = {
    start: parse(start, "HH:mm", subDays(now, 1)),
    end: parse(end, "HH:mm", now),
  }
  const today = {
    start: parse(start, "HH:mm", now),
    end: parse(end, "HH:mm", addDays(now, 1)),
  }

  return {
    yesterday,
    today,
  }
}
