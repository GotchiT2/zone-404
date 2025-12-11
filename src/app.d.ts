// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  interface SlotWithCalendar {
    id: string;
    title: string;
    start: string;
    end: string;
    calendar: CalendarKey;
  }
}

export {};
