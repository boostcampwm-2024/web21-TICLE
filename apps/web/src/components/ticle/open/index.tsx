import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';

import Button from '@/components/common/Button';
import TextArea from '@/components/common/TextArea';
import TextInput from '@/components/common/TextInput';

import FormBox from './FormBox';

function Open() {
  const { register, handleSubmit, errors } = useForm();
  const navigate = useNavigate();

  const onSubmit = () => {
    navigate({ to: '/' });
  };

  return (
    <div>
      <h1 className="mb-14 text-head1 text-main">티클 개설하기</h1>
      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <FormBox title="발표자 정보">
          <TextInput
            label="이름(닉네임)"
            required
            {...register('name', {
              required: true,
              maxLength: 10,
            })}
          />
          <TextInput
            label="이메일"
            type="email"
            required
            {...register('email', {
              required: true,
            })}
          />
          <TextArea
            label="자기소개"
            description="개설할 티클과 관련하여 자신에 대해 알리고 싶은 내용을 적어주세요."
            size="sm"
            required
            {...register('self-introduction', {
              required: true,
              maxLength: 500,
            })}
          />
        </FormBox>
        <FormBox title="티클 정보" className="mt-14">
          <TextInput
            label="제목"
            required
            {...register('title', {
              required: true,
              maxLength: 30,
            })}
          />
          <TextArea
            label="상세 설명"
            description="티클에 대한 자세한 정보를 적어주세요."
            size="sm"
            required
            {...register('ticle-introduction', {
              required: true,
              maxLength: 1500,
            })}
          />
          <TextInput label="해시태그" required />
        </FormBox>

        <div className="mt-9 flex w-full justify-end">
          <Button size="lg" type="submit">
            티클 개설하기
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Open;
