#!/usr/bin/env bash

branch="$(git rev-parse --abbrev-ref HEAD)"

IFS='/' read -ra PARTS <<< "$branch"

if [ ${#PARTS[@]} -ne 3 ]; then
    echo "\n오류: 브랜치 이름 '$branch'이(가) 올바른 형식이 아닙니다."
    echo "브랜치 이름은 다음 패턴을 따라야 합니다: <타입>/#<이슈번호>/<브랜치이름-케밥-케이스>"
    echo "예시: feat/#123/새로운-기능-추가\n"
    exit 1
fi

type="${PARTS[0]}"
issue="${PARTS[1]}"
name="${PARTS[2]}"

valid_types=("feat" "test" "fix" "docs" "refactor" "design" "style" "chore")
if [[ ! " ${valid_types[@]} " =~ " ${type} " ]]; then
    echo "\n오류: 유효하지 않은 브랜치 타입 '$type'"
    echo "유효한 타입: ${valid_types[*]}\n"
    exit 1
fi

if [[ ! $issue =~ ^#[0-9]+$ ]]; then
    echo "\n오류: 유효하지 않은 이슈 번호 '$issue'"
    echo "이슈 번호는 #으로 시작하고 그 뒤에 숫자가 와야 합니다\n"
    exit 1
fi

if [[ ! $name =~ ^[a-z0-9-]+$ ]]; then
    echo "\n오류: 유효하지 않은 브랜치 이름 '$name'"
    echo "브랜치 이름은 케밥-케이스여야 합니다 (소문자, 숫자, 하이픈만 사용)\n"
    exit 1
fi

echo "\n브랜치 이름이 유효합니다: $branch\n"
exit 0