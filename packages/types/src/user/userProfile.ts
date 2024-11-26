import { z } from 'zod';
import { Provider } from './provider';

export const UserProfileSchema = z.object({
  id: z.number(),
  nickname: z.string(),
  profileImageUrl: z.string().url(),
  provider: z.enum([Provider.github, Provider.google, Provider.guest]),
  ticles: z.array(z.string()),
});

export type UserProfileResponse = z.infer<typeof UserProfileSchema>;
