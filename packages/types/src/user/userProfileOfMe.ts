import { z } from 'zod';

import { Provider } from './provider';

export const UserProfileOfMeSchema = z.object({
  id: z.number(),
  nickname: z.string(),
  profileImageUrl: z.string().url(),
  provider: z.enum([Provider.github, Provider.google, Provider.guest]),
});

export type UserProfileOfMeResponse = z.infer<typeof UserProfileOfMeSchema>;
