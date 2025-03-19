"use server";

import {
  ServerValidateError,
  createServerValidate,
} from "@tanstack/react-form/nextjs";
import { formOpts } from "./schemas/news-form";

const serverValidate = createServerValidate({
  ...formOpts,
  onServerValidate: ({ value }) => {
    if (value.temp < 31 || value.temp > 42) {
      return "Server validation: Temperature must be between 31 and 42";
    }
    if (value.hr < 25 || value.hr > 220) {
      return "Server validation: Heart rate must be between 25 and 220";
    }
    if (value.rr < 3 || value.rr > 60) {
      return "Server validation: Respiratory rate must be between 3 and 60";
    }
  },
});

export default async function validateAndSubmitMeasurements(
  prev: unknown,
  formData: FormData
) {
  try {
    await serverValidate(formData);
  } catch (e) {
    if (e instanceof ServerValidateError) {
      return e.formState;
    }

    throw e;
  }

  const res = await fetch("http://localhost:5147/news", {
    method: "POST",
    body: JSON.stringify({
      measurements: [
        {
          type: "temp",
          value: Number(formData.get("temp")),
        },
        {
          type: "hr",
          value: Number(formData.get("hr")),
        },
        {
          type: "rr",
          value: Number(formData.get("rr")), // + 999,
        },
      ],
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  return data;
}
