import { formOptions } from "@tanstack/react-form/nextjs";
import { z } from "zod";

const measurementsSchema = z.object({
  temp: z.coerce
    .number()
    .min(31, "Minimum temperature is 31")
    .max(42, "Maximum temperature is 42"),
  hr: z.coerce
    .number()
    .min(25, "Minimum heart rate is 25")
    .max(220, "Maximum heart rate is 220"),
  rr: z.coerce
    .number()
    .min(3, "Minimum respiratory rate is 3")
    .max(60, "Maximum respiratory rate is 60"),
});

export const formOpts = formOptions({
  defaultValues: {
    temp: 0,
    hr: 0,
    rr: 0,
  },
  validators: {
    // onBlur: measurementsSchema,
    onChange: measurementsSchema,
  },
});
