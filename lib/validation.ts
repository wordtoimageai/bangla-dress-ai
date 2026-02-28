import { z } from "zod";

export const measurementSchema = z.object({
  height_cm: z.number().min(140).max(190),
  bust_cm: z.number().min(70).max(130),
  waist_cm: z.number().min(50).max(120),
  hip_cm: z.number().min(70).max(140),
  shoulder_cm: z.number().min(30).max(50),
});

export type MeasurementValues = z.infer<typeof measurementSchema>;

export const designUploadSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().optional(),
  fabric: z.enum(["lawn", "chiffon", "jamdani", "tangail", "silk", "cotton"]),
  occasion: z.enum(["daily", "eid", "wedding", "party"]),
  price_bdt: z.number().min(2000).max(15000),
  primary_color: z.string().min(1),
  secondary_color: z.string().optional(),
});
