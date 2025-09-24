import z from "zod";

export const appTitle = "Self Pilot";
export const appDescription = `${appTitle} is a collection of tools and mini-apps for day-to-day life.`;

export const durationNames = z.enum([
  "Now",
  "One Second",
  "One Minute",
  "One Hour",
  "One Day",
  "One Week",
  "One Month",
  "Three Months",
  "Six Months",
  "One Year",
  "Two Years",
  "Three Years",
  "All Time",
  "Forever",
]);
