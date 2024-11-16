import { z } from 'zod';

const customErrorMap: z.ZodErrorMap = (issue: z.IssueData, ctx: z.ErrorMapCtx) => {
  let message = ctx.defaultError;

  switch (issue.code) {
    case z.ZodIssueCode.too_small:
      if (issue.type === 'string') {
        if (issue.minimum === 1) {
          message = '필수로 입력해 주세요.';
        }
      }
      break;
    case z.ZodIssueCode.too_big:
      if (issue.type === 'string') {
        message = `${issue.maximum}자 이내로 입력해 주세요.`;
      }
      break;
    case z.ZodIssueCode.invalid_string:
      if (issue.validation === 'email') {
        message = '올바른 이메일 형식이 아닙니다.';
      }
      break;
  }
  return { message };
};

z.setErrorMap(customErrorMap);

export const ticleOpenFormSchema = z.object({
  name: z.string().min(1).max(10),
  email: z.string().min(1).email(),
  selfIntroduction: z.string().min(1).max(500),
  title: z.string().min(1).max(30),
  ticleIntroduction: z.string().min(1).max(1500),
  hashtags: z.string().min(1),
});

export type OpenFormInputs = z.infer<typeof ticleOpenFormSchema>;
