import { cva } from 'class-variance-authority';
import { useState } from 'react';

import { oauthLogin } from '@/api/auth';
import GithubIc from '@/assets/icons/github.svg?react';
import GoogleIc from '@/assets/icons/google.svg?react';

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

  const onLoginBtnClick = (type: OAuthType) => {
    setLoadingOAuthType(type);
    oauthLogin(type);
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
