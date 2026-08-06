"use server";

import { supabase } from "@/lib/supabase";

export async function submitRSVP(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const attending = formData.get("attending") as string;
  const guestsCount = Number(
    formData.get("guests_count")
  );
  const message = formData.get("message") as string;


  const { error } = await supabase
    .from("guests")
    .insert([
      {
        name,
        email,
        attending,
        guests_count: guestsCount,
        message,
      },
    ]);


  if (error) {
    console.error(error);
    throw new Error(
      "RSVP opslaan mislukt"
    );
  }


  return {
    success: true,
  };
}