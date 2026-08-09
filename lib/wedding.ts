export type WeddingScheduleTitle =
  | "Stadhuis"
  | "Ceremonie"
  | "Dagsreceptie"
  | "Diner"
  | "Avondreceptie"
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
  },

  venue: {
    name: "Kattebroek",
    city: "Dilbeek",
    address: "Kattebroekstraat, Dilbeek",
  },

  schedule: [
    {
      time: "13:00",
      title: "Stadhuis",
    },
    {
      time: "16:30",
      title: "Ceremonie",
      description: "Onze ceremonie start stipt om 16:30.",
    },
    {
      time: "18:00",
      title: "Dagsreceptie",
      description: "We klinken samen op een prachtige dag.",
    },
    {
      time: "19:00",
      title: "Diner",
      description: "Een feestelijk diner met familie en vrienden.",
    },
    {
      title: "Avondreceptie",
    },
    {
      time: "22:00–23:00",
      title: "Avondfeest",
      description: "De dansvloer gaat open!",
    },
    {
      time: "00:30",
      title: "Midnight snack",
    },
    {
      time: "05:00",
      title: "Einde",
      description: "Bedankt om onze dag onvergetelijk te maken.",
    },
  ] satisfies WeddingScheduleEvent[],

  dresscode: "Christmas Chique",

  gift:
    "Jullie aanwezigheid is het mooiste cadeau. Wie graag iets extra geeft, mag kiezen voor een financiële bijdrage aan onze huwelijksreis.",

  hotels: [
    {
      name: "Waerboom",
      distance: "2 min",
    },
  ],
};

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
