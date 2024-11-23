import { DashboardApplicantsResponse } from '@repo/types';

import Avatar from '@/components/common/Avatar';
import { Dialog } from '@/components/common/Dialog';

interface ApplicantsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  applicants: DashboardApplicantsResponse;
}

function ApplicantsDialog({ isOpen, onClose, applicants }: ApplicantsDialogProps) {
  return (
    <Dialog.Root isOpen={isOpen} onClose={onClose}>
      <Dialog.Title align="center">신청자 목록</Dialog.Title>
      <Dialog.Close onClose={onClose} />
      <Dialog.Content className="h-56 overflow-y-scroll">
        <ul className="flex flex-col gap-4">
          {applicants.map((applicant) => (
            <li key={applicant.id} className="flex items-center gap-2.5">
              <Avatar src={applicant.user.profileImageUrl} size="sm" />
              <span className="text-body1 text-alt">{applicant.user.nickname}</span>
            </li>
          ))}
        </ul>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export default ApplicantsDialog;
