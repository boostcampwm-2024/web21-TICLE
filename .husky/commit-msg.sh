#!/bin/sh

# 커밋 메시지 파일의 내용
commit_msg=$(cat "$1")

# 주석과 빈 줄을 제거하는 함수
remove_comments_and_empty_lines() {
    echo "$1" | sed '/^#/d' | sed '/^\s*$/d'
}

# 주석과 빈 줄을 제거한 커밋 메시지
cleaned_msg=$(remove_comments_and_empty_lines "$commit_msg")

subject=$(echo "$cleaned_msg" | head -n1)

pattern="^(feat|test|fix|docs|test|refactor|design|style|chore): .+(\#[0-9]+)?$"

if ! echo "$subject" | grep -qE "$pattern"; then
    echo ""
    echo "오류: 유효하지 않은 커밋 메시지 형식입니다."
    echo "올바른 형식: {타입}: {메시지}{#이슈번호(선택사항)}"
    echo "유효한 타입: feat|test|fix|docs|test|refactor|design|style|chore"
    echo "예시 - fix: 커밋 메시지 #123"
    echo ""
    echo "오류가 발생한 커밋 메시지:"
    echo ""
    echo "$cleaned_msg"
    echo ""
    exit 1
fi

echo "커밋 완료!"
exit 0