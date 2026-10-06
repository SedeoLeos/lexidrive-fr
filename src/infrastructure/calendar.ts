export function reminderCalendar(hour: number, now = new Date()) {
  const start = new Date(now);
  start.setHours(hour, 0, 0, 0);
  if (start <= now) start.setDate(start.getDate() + 1);
  const date = `${start.getFullYear()}${String(start.getMonth() + 1).padStart(2, "0")}${String(start.getDate()).padStart(2, "0")}T${String(hour).padStart(2, "0")}0000`;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//LexiDrive-fr//Apprentissage//FR",
    "BEGIN:VEVENT",
    `UID:lexidrive-daily-${now.getTime()}@local`,
    `DTSTAMP:${now
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d+Z/, "Z")}`,
    `DTSTART:${date}`,
    "DURATION:PT10M",
    "RRULE:FREQ=DAILY",
    "SUMMARY:Mon rendez-vous français — LexiDrive",
    "DESCRIPTION:Quelques minutes pour lire écrire et progresser.",
    "BEGIN:VALARM",
    "TRIGGER:PT0M",
    "ACTION:DISPLAY",
    "DESCRIPTION:Ouvre LexiDrive pour ton entraînement.",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}
