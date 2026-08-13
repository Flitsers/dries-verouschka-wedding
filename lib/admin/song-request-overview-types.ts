export type AdminSongRequestOverviewPerson = {
  inviteId: number;
  familyName: string;
  attendeePosition: 1 | 2;
  name: string;
  songRequest: string;
};

export type AdminSongRequestOverview = {
  people: AdminSongRequestOverviewPerson[];
  count: number;
};
