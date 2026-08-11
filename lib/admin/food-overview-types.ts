import type { DietaryPreference } from "@/lib/invitations/rsvp";

export type AdminFoodOverviewPerson = {
  inviteId: number;
  inviteCode: string;
  familyName: string;
  attendeePosition: 1 | 2;
  name: string;
  dietaryPreference: DietaryPreference;
  notes: string | null;
};

export type AdminFoodOverview = {
  people: AdminFoodOverviewPerson[];
  counts: {
    vegetarian: number;
    vegan: number;
    withNotes: number;
  };
};
