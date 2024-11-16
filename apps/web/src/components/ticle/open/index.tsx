import Button from '@/components/common/Button';
import TextArea from '@/components/common/TextArea';
import TextInput from '@/components/common/TextInput';

import FormBox from './FormBox';

function Open() {
  return (
    <div>
      <h1 className="mb-14 text-head1 text-main">티클 개설하기</h1>
      <main className="flex flex-col gap-14">
        <FormBox title="발표자 정보">
          <TextInput label="이름(닉네임)" required />
          <TextInput label="이메일" type="email" required />
          <TextArea
            label="자기소개"
            description="개설할 티클과 관련하여 자신에 대해 알리고 싶은 내용을 적어주세요."
            size="sm"
            required
          />
        </FormBox>
        <FormBox title="티클 정보">
          <TextInput label="제목" required />
          <TextArea
            label="상세 설명"
            description="티클에 대한 자세한 정보를 적어주세요."
            size="sm"
            required
          />
          <TextInput label="해시태그" required />
        </FormBox>
      </main>
      <div className="mt-9 flex w-full justify-end">
        <Button size="lg">티클 개설하기</Button>
      </div>
    </div>
  );
}

export default Open;
