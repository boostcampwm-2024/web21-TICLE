import Button from '@/components/common/Button';

import FormBox from './FormBox';

function Open() {
  return (
    <div>
      <h1 className="mb-14 text-head1 text-main">티클 개설하기</h1>
      <main className="flex flex-col gap-14">
        <FormBox title="발표자 정보"></FormBox>
        <FormBox title="티클 정보"></FormBox>
      </main>
      <div className="mt-9 flex w-full justify-end">
        <Button size="lg">티클 개설하기</Button>
      </div>
    </div>
  );
}

export default Open;
