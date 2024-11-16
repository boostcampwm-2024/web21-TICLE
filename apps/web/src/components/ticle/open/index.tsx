import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';

import Button from '@/components/common/Button';
import TextArea from '@/components/common/TextArea';
import TextInput from '@/components/common/TextInput';

import FormBox from './FormBox';
import HashtagInput from './HashtagInput';
import {
  OpenFormInputs,
  ticleOpenFormSchema,
} from '../../../../../../packages/types/src/formSchema';

function Open() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<OpenFormInputs>({
    resolver: zodResolver(ticleOpenFormSchema),
    mode: 'onChange',
    defaultValues: {
      hashtag: [],
    },
  });
  const navigate = useNavigate();

  const onSubmit = (inputs: OpenFormInputs) => {
    // TODO: API
    navigate({ to: '/' }); // TODO: 생성된 티클로 redirect -> post시 응답값으로 ticleId가 필요
  };

  return (
    <div>
      <h1 className="mb-14 text-head1 text-main">티클 개설하기</h1>
      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormBox title="발표자 정보">
          <TextInput
            label="이름(닉네임)"
            required
            {...register('name')}
            errorMessage={errors.name?.message}
          />
          <TextInput
            label="이메일"
            type="email"
            required
            {...register('email')}
            errorMessage={errors.email?.message}
          />
          <TextArea
            label="자기소개"
            description="개설할 티클과 관련하여 자신에 대해 알리고 싶은 내용을 적어주세요."
            size="md"
            required
            maxLength={500}
            {...register('selfIntroduction')}
            errorMessage={errors.selfIntroduction?.message}
          />
        </FormBox>
        <FormBox title="티클 정보" className="mt-14">
          <TextInput
            label="제목"
            required
            {...register('title')}
            errorMessage={errors.title?.message}
          />
          <TextArea
            label="상세 설명"
            description="티클에 대한 자세한 정보를 적어주세요."
            size="sm"
            required
            maxLength={1500}
            {...register('ticleIntroduction')}
            errorMessage={errors.ticleIntroduction?.message}
          />
          <HashtagInput label="해시태그" required control={control} />
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
