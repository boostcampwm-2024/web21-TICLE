import { cva } from 'class-variance-authority';
import { useState } from 'react';

import GithubIc from '@/assets/icons/github.svg?react';
import GoogleIc from '@/assets/icons/google.svg?react';
import { ENV } from '@/constants/env';
import { Route } from '@/routes/auth/oauth';

import Loading from '../common/Loading';

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
  const [loadingOAuthType, setLoadingOAuthType] = useState<OAuthType | null>(null);
  const { redirect } = Route.useSearch();

  const loginUrl = `${ENV.API_URL}/auth/${type}/login?redirect=${redirect || ''}`;

  const onLoginBtnClick = (type: OAuthType) => {
    setLoadingOAuthType(type);
    window.location.href = loginUrl;
  };

  const isCurrentLoading = loadingOAuthType === type;

  return (
    <button
      type="button"
      className={`${oauthButton({ type })} disabled:opacity-50`}
      onClick={() => onLoginBtnClick(type)}
      disabled={loadingOAuthType !== null}
    >
      {isCurrentLoading ? (
        <div className="flex h-8 items-center gap-2">
          <Loading />
        </div>
      ) : (
        <div className="flex h-8 items-center gap-2">
          {type === 'github' ? <GithubIc /> : <GoogleIc />}
          <span className="text-head3">{OAUTH_LABEL[type]} 계정으로 로그인</span>
        </div>
      )}
    </button>
  );
}

export default OAuthLogin;
