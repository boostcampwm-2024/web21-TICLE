import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';

import Button from '@/components/common/Button';
import TextArea from '@/components/common/TextArea';
import TextInput from '@/components/common/TextInput';

import FormBox from './FormBox';

function Open() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
  });
  const navigate = useNavigate();

  const onSubmit = () => {
    navigate({ to: '/' });
  };

  return (
    <div>
      <h1 className="mb-14 text-head1 text-main">티클 개설하기</h1>
      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormBox title="발표자 정보">
          <TextInput
            label="이름(닉네임)"
            required
            {...register('name', {
              required: {
                value: true,
                message: '필수로 입력해 주세요.',
              },
              maxLength: {
                value: 10,
                message: '10자 이내로 입력해 주세요.',
              },
            })}
            errorMessage={errors.name?.message as string}
          />
          <TextInput
            label="이메일"
            type="email"
            required
            {...register('email', {
              required: {
                value: true,
                message: '필수로 입력해 주세요.',
              },
            })}
            errorMessage={errors.email?.message as string}
          />
          <TextArea
            label="자기소개"
            description="개설할 티클과 관련하여 자신에 대해 알리고 싶은 내용을 적어주세요."
            size="md"
            required
            maxLength={500}
            {...register('selfIntroduction', {
              required: {
                value: true,
                message: '필수로 입력해 주세요.',
              },
              maxLength: {
                value: 500,
                message: '500자 이내로 입력해 주세요.',
              },
            })}
            errorMessage={errors.selfIntroduction?.message as string}
          />
        </FormBox>
        <FormBox title="티클 정보" className="mt-14">
          <TextInput
            label="제목"
            required
            {...register('title', {
              required: {
                value: true,
                message: '필수로 입력해 주세요.',
              },
              maxLength: {
                value: 30,
                message: '30자 이내로 입력해 주세요.',
              },
            })}
            errorMessage={errors.title?.message as string}
          />
          <TextArea
            label="상세 설명"
            description="티클에 대한 자세한 정보를 적어주세요."
            size="sm"
            required
            maxLength={1500}
            {...register('ticleIntroduction', {
              required: {
                value: true,
                message: '필수로 입력해 주세요.',
              },
              maxLength: {
                value: 1500,
                message: '1500자 이내로 입력해 주세요.',
              },
            })}
            errorMessage={errors.ticleIntroduction?.message as string}
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
