export type WeddingScheduleTitle =
  | "Stadhuis"
  | "Ontvangst ceremonie"
  | "Ceremonie"
  | "Receptie"
  | "Diner"
  | "Ontvangst avondgasten"
  | "Dessertenbuffet"
  | "Avondfeest"
  | "Midnight snack"
  | "Einde";

export type WeddingScheduleEvent = {
  title: WeddingScheduleTitle;
  time?: string;
  description?: string;
};

export const wedding = {
  couple: {
    groom: "Dries Van Handenhove",
    bride: "Verouschka Bogaerts",
    short: "Dries & Verouschka",
  },

  event: {
    date: "2026-12-19",
    dateText: "19 december 2026",
    rsvpDeadline: "2026-12-05",
  },

  venue: {
    name: "Kattebroek",
    city: "Dilbeek",
    address: "Elegemstraat 160",
    postalCode: "1700",
  },

  schedule: [
    {
      time: "12:30",
      title: "Stadhuis",
    },
    {
      time: "15:00",
      title: "Ontvangst ceremonie",
    },
    {
      time: "15:30",
      title: "Ceremonie",
    },
    {
      time: "18:00",
      title: "Receptie",
      description: "We klinken samen op een prachtige dag.",
    },
    {
      time: "19:00",
      title: "Diner",
      description: "Een feestelijk diner met familie en vrienden.",
    },
    {
      time: "20:30–21:00",
      title: "Ontvangst avondgasten",
    },
    {
      time: "21:00–22:30",
      title: "Dessertenbuffet",
    },
    {
      time: "22:00",
      title: "Avondfeest",
      description: "De dansvloer gaat open!",
    },
    {
      title: "Midnight snack",
    },
    {
      time: "05:00",
      title: "Einde",
      description: "Bedankt om onze dag onvergetelijk te maken.",
    },
  ] satisfies WeddingScheduleEvent[],

  dresscode: "Christmas Chic",

  gift:
    "Jullie aanwezigheid is voor ons het mooiste cadeau. Wie ons daarnaast graag iets schenkt, kan vrijblijvend een bijdrage doen via BE92 0018 6704 8623.",

  hotels: [
    {
      name: "B&B Louis 1924",
      address: "Lange Veldstraat 19",
      postalCity: "1700 Dilbeek",
      distance: "4 km",
      website: "https://www.louis1924.be",
    },
    {
      name: "Gosset Hotel",
      address: "Alfons Gossetlaan 52",
      postalCity: "1702 Groot-Bijgaarden",
      distance: "5 km",
      website: "https://www.gosset.be",
    },
    {
      name: "Ibis Groot-Bijgaarden",
      address: "E40 Richting Gent",
      postalCity: "1702 Groot-Bijgaarden",
      distance: "5 km",
      website: "https://all.accor.com/hotel/A241/index.nl.shtml",
    },
    {
      name: "B&B Onsemhoeve",
      address: "Honsemstraat 2",
      postalCity: "1700 Sint-Martens-Bodegem",
      distance: "6 km",
      website: "https://www.onsemhoeve.be",
    },
    {
      name: "Waer Waters",
      address: "Rodenberg 21",
      postalCity: "1702 Groot-Bijgaarden",
      distance: "5 km",
      website: "https://www.waerwaters.com",
    },
  ],
};

function formatDutchCalendarDate(isoDate: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);

  if (!match) {
    throw new Error(`Ongeldige centrale kalenderdatum: ${isoDate}`);
  }

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(Date.UTC(year, month - 1, day, 12));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new Error(`Ongeldige centrale kalenderdatum: ${isoDate}`);
  }

  return new Intl.DateTimeFormat("nl-BE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Brussels",
  }).format(date);
}

export function getRsvpDeadlineText() {
  return formatDutchCalendarDate(wedding.event.rsvpDeadline);
}

export function getWeddingScheduleEvent(title: WeddingScheduleTitle) {
  const event = wedding.schedule.find((scheduleEvent) => scheduleEvent.title === title);

  if (!event) {
    throw new Error(`Ontbrekend centraal planningsmoment: ${title}`);
  }

  return event as WeddingScheduleEvent;
}

export function getWeddingScheduleTime(title: WeddingScheduleTitle) {
  const event = getWeddingScheduleEvent(title);

  if (!event.time) {
    throw new Error(`Ontbrekend centraal tijdstip: ${title}`);
  }

  return event.time;
}

export function getWeddingScheduleStartTime(title: WeddingScheduleTitle) {
  const time = getWeddingScheduleTime(title);
  const startTime = time.match(/^\d{2}:\d{2}/)?.[0];

  if (!startTime) {
    throw new Error(`Ongeldig centraal tijdstip: ${title}`);
  }

  return startTime;
}
