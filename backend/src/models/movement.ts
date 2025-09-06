import { Schema, model, InferSchemaType } from "mongoose";

const movementSchema = new Schema(
  {
    type: { type: String, enum: ["entrada", "salida"], required: true },
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true },
    category: { type: String, required: true, trim: true },
    note: { type: String, maxlength: 280 },
  },
  { timestamps: true }
);

// índices útiles para filtros/agregaciones
movementSchema.index({ date: 1 });
movementSchema.index({ type: 1, date: 1 });
movementSchema.index({ category: 1, date: 1 });

export type MovementDoc = InferSchemaType<typeof movementSchema>;
export const Movement = model("Movement", movementSchema);
