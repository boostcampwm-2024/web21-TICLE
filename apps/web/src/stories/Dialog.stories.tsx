import Button from '@/components/common/Button';
import { Dialog } from '@/components/common/Dialog';
import useModal from '@/hooks/useModal';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Dialog.Root> = {
  title: 'common/Dialog',
  component: Dialog.Root,
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: '다이얼로그의 열림/닫힘 상태를 제어합니다.',
      table: {
        type: { summary: 'boolean' },
      },
    },
    onClose: {
      description: '다이얼로그가 닫힐 때 호출되는 함수입니다.',
      table: {
        type: { summary: '() => void' },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
<h3>Usage</h3>

\`\`\`tsx
import { Dialog } from '@/components/common/Dialog';
import useModal from '@/hooks/useModal';

function MyComponent() {
  const { isOpen, onOpen, onClose } = useModal();
  
  return (
    <>
      <Button onClick={onOpen}>다이얼로그 열기</Button>
      
      <Dialog.Root isOpen={isOpen} onClose={onClose}>
        <Dialog.Close onClose={onClose} />
        <Dialog.Title>제목</Dialog.Title>
        <Dialog.Description>설명 텍스트</Dialog.Description>
        <Dialog.Content>메인 컨텐츠</Dialog.Content>
        <Dialog.Footer>
          <Button size="full" onClick={onClose}>닫기</Button>
        </Dialog.Footer>
      </Dialog.Root>
    </>
  );
}
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dialog.Root>;

function DefaultDialog() {
  const { isOpen, onOpen, onClose } = useModal();

  return (
    <>
      <Button onClick={onOpen}>다이얼로그 열기</Button>
      <Dialog.Root isOpen={isOpen} onClose={onClose}>
        <Dialog.Title>다이얼로그 제목</Dialog.Title>
        <Dialog.Description>
          다이얼로그에 대한 설명입니다. 다이얼로그의 목적에 대해 자세히 설명합니다.
        </Dialog.Description>
        <Dialog.Content>
          <p>다이얼로그의 메인 컨텐츠 영역입니다.</p>
          <p>이곳에 원하는 내용을 넣을 수 있습니다.</p>
        </Dialog.Content>
        <Dialog.Footer>
          <Button size="full" onClick={onClose} variant="primary">
            닫기
          </Button>
        </Dialog.Footer>
      </Dialog.Root>
    </>
  );
}

export const Default: Story = {
  render: () => <DefaultDialog />,
};
function TitleAlignDialog() {
  const dialog1 = useModal();
  const dialog2 = useModal();
  const dialog3 = useModal();

  return (
    <div className="flex gap-2">
      <Button onClick={dialog1.onOpen}>좌측 정렬</Button>
      <Dialog.Root isOpen={dialog1.isOpen} onClose={dialog1.onClose}>
        <Dialog.Title align="start">왼쪽 정렬 제목</Dialog.Title>
        <Dialog.Description>제목이 왼쪽으로 정렬되어 있습니다.</Dialog.Description>
        <Dialog.Content>
          <p>다이얼로그 내용입니다.</p>
        </Dialog.Content>
        <Dialog.Footer>
          <Button size="full" onClick={dialog1.onClose} variant="secondary">
            닫기
          </Button>
        </Dialog.Footer>
      </Dialog.Root>

      <Button onClick={dialog2.onOpen}>중앙 정렬</Button>
      <Dialog.Root isOpen={dialog2.isOpen} onClose={dialog2.onClose}>
        <Dialog.Title align="center">중앙 정렬 제목</Dialog.Title>
        <Dialog.Description>제목이 중앙으로 정렬되어 있습니다.</Dialog.Description>
        <Dialog.Content>
          <p>다이얼로그 내용입니다.</p>
        </Dialog.Content>
        <Dialog.Footer>
          <Button size="full" onClick={dialog2.onClose} variant="secondary">
            닫기
          </Button>
        </Dialog.Footer>
      </Dialog.Root>

      <Button onClick={dialog3.onOpen}>우측 정렬</Button>
      <Dialog.Root isOpen={dialog3.isOpen} onClose={dialog3.onClose}>
        <Dialog.Title align="end">오른쪽 정렬 제목</Dialog.Title>
        <Dialog.Description>제목이 오른쪽으로 정렬되어 있습니다.</Dialog.Description>
        <Dialog.Content>
          <p>다이얼로그 내용입니다.</p>
        </Dialog.Content>
        <Dialog.Footer>
          <Button size="full" onClick={dialog3.onClose} variant="secondary">
            닫기
          </Button>
        </Dialog.Footer>
      </Dialog.Root>
    </div>
  );
}

export const TitleAlignment: Story = {
  render: () => <TitleAlignDialog />,
};

function CloseButtonDialog() {
  const { isOpen, onOpen, onClose } = useModal();

  return (
    <>
      <Button onClick={onOpen}>다이얼로그 열기</Button>
      <Dialog.Root isOpen={isOpen} onClose={onClose}>
        <Dialog.Title>다이얼로그 제목</Dialog.Title>
        <Dialog.Close onClose={onClose} />
        <Dialog.Description>이 다이얼로그에는 닫기 버튼이 포함되어 있습니다.</Dialog.Description>
      </Dialog.Root>
    </>
  );
}

export const WithCloseButton: Story = {
  render: () => <CloseButtonDialog />,
};

function FooterVariantDialog() {
  const dialog1 = useModal();
  const dialog2 = useModal();
  const dialog3 = useModal();

  return (
    <div className="flex gap-2">
      <Button onClick={dialog1.onOpen}>단일 버튼</Button>
      <Dialog.Root isOpen={dialog1.isOpen} onClose={dialog1.onClose}>
        <Dialog.Title>단일 버튼 예시</Dialog.Title>
        <Dialog.Description>
          Footer variant가 'single'인 경우입니다. 사용자 액션이 하나일 경우 사용합니다.
        </Dialog.Description>
        <Dialog.Footer variant="single">
          <Button size="full" onClick={dialog1.onClose}>
            확인
          </Button>
        </Dialog.Footer>
      </Dialog.Root>

      <Button onClick={dialog2.onOpen}>가로 배치</Button>
      <Dialog.Root isOpen={dialog2.isOpen} onClose={dialog2.onClose}>
        <Dialog.Title>가로 버튼 배치 예시</Dialog.Title>
        <Dialog.Description>
          Footer variant가 'horizontal'인 경우입니다. 위계가 유사한 두 개의 액션이 존재할 경우
          사용합니다.
        </Dialog.Description>
        <Dialog.Footer variant="horizontal">
          <Button size="full" onClick={dialog2.onClose} variant="secondary">
            취소
          </Button>
          <Button size="full" onClick={dialog2.onClose}>
            확인
          </Button>
        </Dialog.Footer>
      </Dialog.Root>

      <Button onClick={dialog3.onOpen}>세로 배치</Button>
      <Dialog.Root isOpen={dialog3.isOpen} onClose={dialog3.onClose}>
        <Dialog.Title>세로 버튼 배치 예시</Dialog.Title>
        <Dialog.Description>
          Footer variant가 'vertical'인 경우입니다. 중요도 차이가 큰 두 개의 액션이 존재할 경우
          사용합니다.
        </Dialog.Description>
        <Dialog.Footer variant="vertical">
          <Button size="full" onClick={dialog3.onClose}>
            확인
          </Button>
          <Button size="full" onClick={dialog3.onClose} variant="secondary">
            취소
          </Button>
        </Dialog.Footer>
      </Dialog.Root>
    </div>
  );
}

export const FooterVariants: Story = {
  render: () => <FooterVariantDialog />,
};

function CustomContentDialog() {
  const { isOpen, onOpen, onClose } = useModal();

  return (
    <>
      <Button onClick={onOpen}>커스텀 컨텐츠</Button>
      <Dialog.Root isOpen={isOpen} onClose={onClose}>
        <Dialog.Title>사용자 정보 입력</Dialog.Title>
        <Dialog.Content>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="이름을 입력하세요"
              className="rounded-md border border-gray-300 px-3 py-2"
            />
            <textarea
              placeholder="메시지를 입력하세요"
              className="rounded-md border border-gray-300 px-3 py-2"
              rows={4}
            />
          </div>
        </Dialog.Content>
        <Dialog.Footer variant="horizontal">
          <Button size="full" onClick={onClose} variant="secondary">
            취소
          </Button>
          <Button size="full" onClick={onClose}>
            제출
          </Button>
        </Dialog.Footer>
      </Dialog.Root>
    </>
  );
}

export const CustomContent: Story = {
  render: () => <CustomContentDialog />,
};
