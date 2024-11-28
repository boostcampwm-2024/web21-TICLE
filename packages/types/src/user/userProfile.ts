import { z } from 'zod';

import { Provider } from './provider';

export const UserProfileSchema = z.object({
  id: z.number(),
  nickname: z.string(),
  profileImageUrl: z.string().url(),
  provider: z.enum([Provider.github, Provider.google, Provider.guest]),
  ticleInfo: z.array(
    z.object({
      title: z.string(),
      ticleId: z.number(),
    })
  ),
});

export type UserProfileResponse = z.infer<typeof UserProfileSchema>;
