// src/components/ErrorExample.tsx

import React, { useState } from 'react';

// lint 에러 발생: 사용하지 않는 import
import { Button } from './Button';

// TypeScript 에러 발생: 타입 정의 누락
export const ErrorExample = (props) => {
  // lint 에러 발생: 선언했지만 사용하지 않는 상태
  const [count, setCount] = useState(0);

  // TypeScript 에러 발생: 타입 불일치
  const handleClick = (event: number) => {
    console.log(event);
  };

  // lint 에러 발생:
  // - console.log 사용
  // - 불필요한 세미콜론 사용 (eslint 설정에 따라)
  console.log('rendering');

  // TypeScript 에러 발생: children의 타입이 지정되지 않음
  return <div onClick={handleClick}>{props.children}</div>;
};
