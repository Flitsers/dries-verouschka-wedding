type RSVPWizardState = {
  step: 1 | 2 | 3;
  attendingGuests: number | null;
  stadhuisAttending: boolean | null;
  ceremonyAttending: boolean | null;
  showAttendanceError: boolean;
  showStadhuisError: boolean;
  showCeremonyError: boolean;
};

type RSVPWizardForm = HTMLFormElement & {
  __rsvpWizardState?: RSVPWizardState;
  __rsvpWizardStop?: () => void;
};

export function startRSVPWizard(root: HTMLFormElement | null): () => void {
  if (!root) return () => undefined;

  const form = root as RSVPWizardForm;
  form.__rsvpWizardStop?.();

  const attendanceInput = form.elements.namedItem(
    "attending_guests",
  ) as HTMLInputElement | null;
  const attendanceOptions = Array.from(
    form.querySelectorAll<HTMLInputElement>('input[name="attendance_option"]'),
  );
  const stadhuisInput = form.elements.namedItem(
    "stadhuis_attending",
  ) as HTMLInputElement | null;
  const stadhuisOptions = Array.from(
    form.querySelectorAll<HTMLInputElement>('input[name="stadhuis_option"]'),
  );
  const ceremonyInput = form.elements.namedItem("ceremony_attending") as HTMLInputElement | null;
  const ceremonyOptions = Array.from(form.querySelectorAll<HTMLInputElement>('input[name="ceremony_option"]'));
  const attendanceNext = form.querySelector<HTMLButtonElement>(
    "[data-rsvp-attendance-next]",
  );
  const detailsNext = form.querySelector<HTMLButtonElement>(
    "[data-rsvp-details-next]",
  );
  const backButton = form.querySelector<HTMLButtonElement>("[data-rsvp-back]");
  const attendanceError = form.querySelector<HTMLElement>(
    "[data-rsvp-attendance-error]",
  );
  const attendanceFieldset = form.querySelector<HTMLFieldSetElement>(
    "[data-rsvp-attendance-fieldset]",
  );
  const stadhuisError = form.querySelector<HTMLElement>(
    "[data-rsvp-stadhuis-error]",
  );
  const stadhuisFieldset = form.querySelector<HTMLFieldSetElement>(
    "[data-rsvp-stadhuis-fieldset]",
  );
  const ceremonyError = form.querySelector<HTMLElement>("[data-rsvp-ceremony-error]");
  const ceremonyFieldset = form.querySelector<HTMLFieldSetElement>("[data-rsvp-ceremony-fieldset]");
  const attendeeBlocks = Array.from(
    form.querySelectorAll<HTMLFieldSetElement>("[data-rsvp-attendee-block]"),
  );
  const attendeeFields = Array.from(
    form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      "[data-rsvp-attendee-block] input, [data-rsvp-attendee-block] select, [data-rsvp-attendee-block] textarea",
    ),
  );
  const initialValue = attendanceInput?.value ?? "";
  const parsedInitialValue = initialValue === "" ? null : Number(initialValue);
  const checkedOption = attendanceOptions.find((option) => option.checked);
  const initialStep = Number(form.dataset.rsvpStep);
  const initialStadhuisValue = form.dataset.rsvpStadhuis;
  const initialCeremonyValue = form.dataset.rsvpCeremony;
  const state: RSVPWizardState = {
    step: initialStep === 2 || initialStep === 3 ? initialStep : 1,
    attendingGuests: Number.isInteger(parsedInitialValue)
      ? parsedInitialValue
      : checkedOption
        ? Number(checkedOption.value)
        : null,
    stadhuisAttending:
      initialStadhuisValue === "true"
        ? true
        : initialStadhuisValue === "false"
          ? false
          : null,
    ceremonyAttending:
      initialCeremonyValue === "true"
        ? true
        : initialCeremonyValue === "false"
          ? false
          : null,
    showAttendanceError: attendanceError ? !attendanceError.hidden : false,
    showStadhuisError: stadhuisError ? !stadhuisError.hidden : false,
    showCeremonyError: ceremonyError ? !ceremonyError.hidden : false,
  };
  const includesStadhuis = form.dataset.rsvpIncludesStadhuis === "true";
  const includesCeremony = form.dataset.rsvpIncludesCeremony === "true";

  form.__rsvpWizardState = state;

  const updateAttendeeAvailability = () => {
    for (const block of attendeeBlocks) {
      const position = Number(block.dataset.attendeePosition);
      const active =
        state.attendingGuests !== null && position <= state.attendingGuests;
      block.hidden = !active;

      for (const field of block.querySelectorAll<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >("input, select, textarea")) {
        field.disabled = !active;
      }
    }
  };

  const updateSummary = () => {
    const attendanceSummary = form.querySelector<HTMLElement>(
      "[data-rsvp-summary-attendance]",
    );

    if (attendanceSummary) {
      attendanceSummary.textContent =
        state.attendingGuests === null
          ? "Nog niet gekozen"
          : state.attendingGuests === 0
            ? "Niet aanwezig"
            : `${state.attendingGuests} ${state.attendingGuests === 1 ? "persoon" : "personen"} aanwezig`;
    }

    const stadhuisSummary = form.querySelector<HTMLElement>(
      "[data-rsvp-summary-stadhuis]",
    );

    if (stadhuisSummary) {
      const effectiveStadhuisAttendance =
        state.attendingGuests === 0 ? false : state.stadhuisAttending;
      const singular = form.dataset.rsvpAllowedGuests === "1";

      stadhuisSummary.textContent =
        effectiveStadhuisAttendance === true
          ? singular
            ? "Ja, ik ben erbij"
            : "Ja, we zijn erbij"
          : effectiveStadhuisAttendance === false
            ? "Nee"
            : "Nog niet gekozen";
    }

    const ceremonySummary = form.querySelector<HTMLElement>("[data-rsvp-summary-ceremony]");
    if (ceremonySummary) {
      const effective = state.attendingGuests === 0 ? false : state.ceremonyAttending;
      const singular = form.dataset.rsvpAllowedGuests === "1";
      ceremonySummary.textContent = effective === true
        ? singular ? "Ja, ik ben erbij" : "Ja, we zijn erbij"
        : effective === false ? "Nee" : "Nog niet gekozen";
    }

    for (const summary of form.querySelectorAll<HTMLElement>(
      "[data-rsvp-summary-attendee]",
    )) {
      const position = Number(summary.dataset.attendeePosition);
      const active =
        state.attendingGuests !== null && position <= state.attendingGuests;
      summary.hidden = !active;
      if (!active) continue;

      const name = form.elements.namedItem(
        `attendee_${position}_name`,
      ) as HTMLInputElement | null;
      const dietaryPreference = form.elements.namedItem(
        `attendee_${position}_dietary_preference`,
      ) as HTMLSelectElement | null;
      const notes = form.elements.namedItem(
        `attendee_${position}_notes`,
      ) as HTMLTextAreaElement | null;
      const songRequest = form.elements.namedItem(
        `attendee_${position}_song_request`,
      ) as HTMLInputElement | null;
      const nameSummary = summary.querySelector<HTMLElement>(
        "[data-rsvp-summary-name]",
      );
      const dietaryPreferenceSummary = summary.querySelector<HTMLElement>(
        "[data-rsvp-summary-dietary-preference]",
      );
      const notesRow = summary.querySelector<HTMLElement>(
        "[data-rsvp-summary-notes-row]",
      );
      const notesSummary = summary.querySelector<HTMLElement>(
        "[data-rsvp-summary-notes]",
      );
      const songRequestRow = summary.querySelector<HTMLElement>(
        "[data-rsvp-summary-song-request-row]",
      );
      const songRequestSummary = summary.querySelector<HTMLElement>(
        "[data-rsvp-summary-song-request]",
      );

      if (nameSummary) {
        nameSummary.textContent = name?.value.trim() || `Persoon ${position}`;
      }
      if (dietaryPreferenceSummary) {
        dietaryPreferenceSummary.textContent =
          dietaryPreference?.selectedOptions[0]?.text ?? "Geen voorkeur";
      }

      const notesValue = notes?.value.trim() ?? "";
      if (notesRow) notesRow.hidden = notesValue === "";
      if (notesSummary) notesSummary.textContent = notesValue;

      const songRequestValue = songRequest?.value.trim() ?? "";
      if (songRequestRow) songRequestRow.hidden = songRequestValue === "";
      if (songRequestSummary) {
        songRequestSummary.textContent = songRequestValue;
      }
    }
  };

  const render = () => {
    form.dataset.rsvpStep = String(state.step);
    form.dataset.rsvpAttendance =
      state.attendingGuests === null ? "" : String(state.attendingGuests);
    form.dataset.rsvpStadhuis =
      state.stadhuisAttending === null
        ? ""
        : String(state.stadhuisAttending);
    form.dataset.rsvpCeremony = state.ceremonyAttending === null ? "" : String(state.ceremonyAttending);
    form.setAttribute("aria-label", `Stap ${state.step} van 3`);

    const stepLabel = form.querySelector<HTMLElement>("[data-rsvp-step-label]");
    if (stepLabel) stepLabel.textContent = `Stap ${state.step} van 3`;

    if (attendanceInput) {
      attendanceInput.value =
        state.attendingGuests === null ? "" : String(state.attendingGuests);
    }


    if (stadhuisInput) {
      const effectiveStadhuisAttendance =
        state.attendingGuests === 0 ? false : state.stadhuisAttending;
      stadhuisInput.value =
        effectiveStadhuisAttendance === null
          ? ""
          : String(effectiveStadhuisAttendance);
    }
    if (ceremonyInput) {
      ceremonyInput.value = state.attendingGuests === 0
        ? "false"
        : state.ceremonyAttending === null ? "" : String(state.ceremonyAttending);
    }

    for (const option of attendanceOptions) {
      option.checked = Number(option.value) === state.attendingGuests;
    }

    for (const option of stadhuisOptions) {
      option.checked =
        (option.value === "true") === state.stadhuisAttending;
    }
    for (const option of ceremonyOptions) {
      option.checked = (option.value === "true") === state.ceremonyAttending;
    }

    if (attendanceError) attendanceError.hidden = !state.showAttendanceError;
    if (stadhuisError) stadhuisError.hidden = !state.showStadhuisError;
    if (ceremonyError) ceremonyError.hidden = !state.showCeremonyError;

    if (attendanceFieldset) {
      if (state.showAttendanceError) {
        attendanceFieldset.setAttribute("aria-describedby", "attendance-error");
      } else {
        attendanceFieldset.removeAttribute("aria-describedby");
      }
    }


    if (stadhuisFieldset) {
      if (state.showStadhuisError) {
        stadhuisFieldset.setAttribute("aria-describedby", "stadhuis-error");
      } else {
        stadhuisFieldset.removeAttribute("aria-describedby");
      }
    }
    if (ceremonyFieldset) {
      if (state.showCeremonyError) ceremonyFieldset.setAttribute("aria-describedby", "ceremony-error");
      else ceremonyFieldset.removeAttribute("aria-describedby");
    }

    for (const panel of form.querySelectorAll<HTMLElement>("[data-rsvp-panel]")) {
      panel.setAttribute(
        "aria-hidden",
        panel.dataset.rsvpPanel === String(state.step) ? "false" : "true",
      );
    }

    updateAttendeeAvailability();
    updateSummary();
  };

  const selectAttendance = (event: Event) => {
    const option = event.currentTarget as HTMLInputElement;
    state.attendingGuests = Number(option.value);
    state.showAttendanceError = false;
    if (state.attendingGuests === 0) state.showStadhuisError = false;
    if (state.attendingGuests === 0) {
      state.showCeremonyError = false;
      state.ceremonyAttending = null;
    }
    render();
  };

  const selectStadhuisAttendance = (event: Event) => {
    const option = event.currentTarget as HTMLInputElement;
    state.stadhuisAttending = option.value === "true";
    state.showStadhuisError = false;
    render();
  };
  const selectCeremonyAttendance = (event: Event) => {
    const option = event.currentTarget as HTMLInputElement;
    state.ceremonyAttending = option.value === "true";
    state.showCeremonyError = false;
    render();
  };

  const goFromAttendance = () => {
    if (state.attendingGuests === null) {
      state.showAttendanceError = true;
      render();
      return;
    }

    state.step = state.attendingGuests === 0 ? 3 : 2;
    state.showAttendanceError = false;
    render();
  };

  const goFromDetails = () => {
    updateAttendeeAvailability();
    if (
      includesStadhuis &&
      state.attendingGuests !== null &&
      state.attendingGuests > 0 &&
      state.stadhuisAttending === null
    ) {
      state.showStadhuisError = true;
      render();
      return;
    }
    if (includesCeremony && state.attendingGuests !== null && state.attendingGuests > 0 && state.ceremonyAttending === null) {
      state.showCeremonyError = true;
      render();
      return;
    }
    if (!form.reportValidity()) return;
    state.step = 3;
    render();
  };

  const goBack = () => {
    state.step = state.step === 3 && state.attendingGuests !== 0 ? 2 : 1;
    render();
  };

  const refreshSummary = () => updateSummary();

  for (const option of attendanceOptions) {
    option.addEventListener("change", selectAttendance);
  }
  for (const option of stadhuisOptions) {
    option.addEventListener("change", selectStadhuisAttendance);
  }
  for (const option of ceremonyOptions) {
    option.addEventListener("change", selectCeremonyAttendance);
  }
  for (const field of attendeeFields) {
    field.addEventListener("input", refreshSummary);
    field.addEventListener("change", refreshSummary);
  }
  attendanceNext?.addEventListener("click", goFromAttendance);
  detailsNext?.addEventListener("click", goFromDetails);
  backButton?.addEventListener("click", goBack);

  render();

  const stop = () => {
    for (const option of attendanceOptions) {
      option.removeEventListener("change", selectAttendance);
    }
    for (const option of stadhuisOptions) {
      option.removeEventListener("change", selectStadhuisAttendance);
    }
    for (const option of ceremonyOptions) {
      option.removeEventListener("change", selectCeremonyAttendance);
    }
    for (const field of attendeeFields) {
      field.removeEventListener("input", refreshSummary);
      field.removeEventListener("change", refreshSummary);
    }
    attendanceNext?.removeEventListener("click", goFromAttendance);
    detailsNext?.removeEventListener("click", goFromDetails);
    backButton?.removeEventListener("click", goBack);

    if (form.__rsvpWizardStop === stop) delete form.__rsvpWizardStop;
  };

  form.__rsvpWizardStop = stop;
  return stop;
}
