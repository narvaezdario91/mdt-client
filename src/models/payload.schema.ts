import { z } from 'zod';

export const InstructionSchema = z.object({
  instruction: z.string(),
  actions: z.array(z.record(z.string(), z.any())).optional().nullable(),
  execution: z.record(z.string(), z.any()).optional().nullable()
});

export const StepSchema = z.object({
  stepText: z.string(),
  instructions: z.array(InstructionSchema),
});

export const CacheContentSchema = z.object({
  featureName: z.string(),
  scenarioName: z.string(),
  createdAt: z.string().optional(),
  lastSuccessAt: z.string().optional().nullable(),
  steps: z.array(StepSchema),
});

export const PayloadSchema = z.object({
  cache_content: CacheContentSchema,
  mcp_config: z.record(z.string(), z.any()).optional().nullable(),
  env_params: z.record(z.string(), z.any()).optional().nullable()
});

// Tipos estáticos inferidos para TypeScript
export type Instruction = z.infer<typeof InstructionSchema>;
export type Step = z.infer<typeof StepSchema>;
export type CacheContent = z.infer<typeof CacheContentSchema>;
export type Payload = z.infer<typeof PayloadSchema>;
