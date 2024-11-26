export const ErrorMessage = {
  // user
  USER_NAME_ALREADY_IN_USE: '이미 사용중인 이름입니다',
  INVALID_LOGIN_INFORMATION: '잘못된 로그인 정보입니다',
  LOGIN_REQUIRED: '로그인이 필요합니다',
  INVALID_AUTHENTICATION_INFORMATION: '잘못된 인증 정보입니다',
  USER_NOT_FOUND: '유저 정보가 존재하지 않습니다',

  // ticle
  FAILED_TO_FETCH_CREATED_TICLE: '개설한 티클 조회에 실패했습니다',
  FAILED_TO_FETCH_REQUESTED_TICLE: '신청한 티클 조회에 실패했습니다',
  FAILED_TO_FETCH_PARTICIPANTS_LIST: '참여자 목록 조회에 실패했습니다',
  TICLE_NOT_FOUND: '해당 티클을 찾을 수 없습니다',
  FAILED_TO_CREATE_TICLE: '티클 생성에 실패했습니다',
  CANNOT_REQUEST_OWN_TICLE: '자신이 발표자인 티클에는 신청할 수 없습니다',
  TICLE_ALREADY_REQUESTED: '이미 신청한 티클입니다',

  // socket error
  PEER_NOT_FOUND_IN_ROOM: '방에 해당 peer가 존재하지 않습니다',
  ROOM_NOT_FOUND: '방이 존재하지 않습니다',
  TRANSPORT_NOT_FOUND: 'transport가 존재하지 않습니다',
  PEER_ALREADY_EXISTS_IN_ROOM: '이미 방에 존재하는 Peer입니다',
  FILE_UPLOAD_FAILED: '파일 업로드에 실패했습니다',
} as const;

export type ErrorMessage = (typeof ErrorMessage)[keyof typeof ErrorMessage];
