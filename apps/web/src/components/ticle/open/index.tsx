import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { CreateTicleFormSchema, CreateTicleFormType } from '@repo/types';

import Button from '@/components/common/Button';
import TextArea from '@/components/common/TextArea';
import TextInput from '@/components/common/TextInput';
import { useCreateTicle } from '@/hooks/api/ticle';

import DateTimePicker from './DateTimePicker';
import FormBox from './FormBox';
import HashtagInput from './HashtagInput';
import 'react-datepicker/dist/react-datepicker.css';

function Open() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateTicleFormType>({
    resolver: zodResolver(CreateTicleFormSchema),
    mode: 'onChange',
    defaultValues: { tags: [], hashtagInput: '' },
  });

  const navigate = useNavigate();

  const { mutateAsync } = useCreateTicle();

  const onSubmit = async (inputs: CreateTicleFormType) => {
    const { hashtagInput, ...submitData } = inputs;

    try {
      const { data } = await mutateAsync(submitData);
      navigate({ to: `/ticle/${data.ticleId}` });
    } catch (error) {
      // TODO: 에러 토스트
      console.error('티클 생성 실패:', error);
    }
  };

  return (
    <div>
      <h1 className="mb-14 text-head1 text-main">티클 개설하기</h1>
      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormBox title="발표자 정보">
          <TextInput
            label="이름(닉네임)"
            required
            {...register('speakerName')}
            errorMessage={errors.speakerName?.message}
          />
          <TextInput
            label="이메일"
            type="email"
            required
            {...register('speakerEmail')}
            errorMessage={errors.speakerEmail?.message}
          />
          <TextArea
            label="자기소개"
            description="개설할 티클과 관련하여 자신에 대해 알리고 싶은 내용을 적어주세요."
            size="md"
            required
            maxLength={500}
            {...register('speakerIntroduce')}
            errorMessage={errors.speakerIntroduce?.message}
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
            size="lg"
            required
            maxLength={1500}
            {...register('content')}
            errorMessage={errors.content?.message}
          />
          <HashtagInput required control={control} />
          <DateTimePicker required control={control} />
        </FormBox>
        <div className="mt-9 flex w-full justify-end">
          <Button size="lg" type="submit" disabled={isSubmitting}>
            티클 개설하기
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Open;
