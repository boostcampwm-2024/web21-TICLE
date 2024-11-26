import { cva } from 'class-variance-authority';

import { oauthLogin } from '@/api/auth';
import GithubIc from '@/assets/icons/github.svg?react';
import GoogleIc from '@/assets/icons/google.svg?react';

const oauthButton = cva('flex w-96 justify-center gap-3 rounded-lg py-4 shadow-normal', {
  variants: {
    type: {
      github: 'bg-black text-white',
      google: 'border border-main bg-white text-alt',
    },
  },
  defaultVariants: {
    type: 'github',
  },
});

const OAUTH_LABEL = {
  github: 'Github',
  google: 'Google',
} as const;

type OAuthType = keyof typeof OAUTH_LABEL;

interface OAuthLoginProps {
  type: OAuthType;
}

function OAuthLogin({ type }: OAuthLoginProps) {
  const { handleOauthLogin } = oauthLogin();

  const onLoginBtnClick = (type: OAuthType) => {
    handleOauthLogin(type);
  };

  return (
    <button type="button" className={oauthButton({ type })} onClick={() => onLoginBtnClick(type)}>
      {type === 'github' ? <GithubIc /> : <GoogleIc />}
      <span className="text-head3">{OAUTH_LABEL[type]} 계정으로 로그인</span>
    </button>
  );
}

export default OAuthLogin;
