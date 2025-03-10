# Git 명령어 가이드

## 목차

1. [기본 명령어](#1-기본-명령어)
2. [브랜치 관련 명령어](#2-브랜치-관련-명령어)
3. [협업 시나리오](#3-협업-시나리오)
4. [부록: 고급 Git 명령어](#4-부록-고급-git-명령어)

## 1. 기본 명령어

### 1.1 저장소 설정
```bash
# Git 설정 확인
git config --list

# 사용자 정보 설정
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 1.2 기본 작업 흐름
```bash
# 변경사항 확인
git status

# 파일 스테이징
git add <file-name>
git add .  # 모든 변경사항 스테이징

# 변경사항 커밋
git commit -m "커밋 메시지"
```

### 1.3 변경사항 확인
```bash
# 커밋 히스토리 보기
git log
git log --oneline  # 한 줄로 보기

# 변경사항 확인
git diff  # 워킹 디렉토리와 스테이징 영역 비교
git diff --staged  # 스테이징 영역과 마지막 커밋 비교
```

## 2. 브랜치 관련 명령어

### 2.1 브랜치 관리
```bash
# 브랜치 목록 보기
git branch  # 로컬 브랜치
git branch -r  # 원격 브랜치
git branch -a  # 모든 브랜치

# 브랜치 생성 및 전환
git checkout -b <branch-name>  # 생성 및 전환
git switch -c <branch-name>    # Git 2.23+ 버전
```

### 2.2 브랜치 동기화
```bash
# 원격 저장소에서 데이터 가져오기
git fetch origin

# 원격 브랜치 변경사항 가져오기
git pull origin <branch-name>

# 로컬 변경사항 원격에 push
git push origin <branch-name>
```

## 3. 협업 시나리오

### 3.1 기능 개발
```bash
# 새로운 기능 브랜치 생성
git checkout -b feature/new-feature main

# 메인 브랜치 변경사항 가져오기
git fetch origin
git rebase origin/main

# 변경사항 푸시
git push origin feature/new-feature
```

### 3.2 긴급 버그 수정
```bash
# 현재 작업 임시 저장
git stash save "현재 작업 내용"

# 핫픽스 브랜치 생성 및 수정
git checkout -b hotfix/bug-fix main

# 작업 복원
git checkout feature/new-feature
git stash pop
```

## 4. 부록: 고급 Git 명령어

### 4.1 커밋 수정 및 되돌리기

#### 4.1.1 커밋 수정
```bash
# 마지막 커밋 수정
git commit --amend --no-edit  # 커밋 메시지 유지
git commit --amend -m "새로운 메시지"  # 메시지 변경

# 여러 커밋 합치기
git rebase -i HEAD~3  # 최근 3개 커밋 수정
```

#### 4.1.2 ⚠️ 변경사항 되돌리기 (주의 필요)
```bash
# 특정 커밋의 변경사항만 되돌리기
git revert <commit-hash>

# 이전 커밋으로 되돌리기 (주의 필요)
git reset --soft HEAD^   # 커밋만 취소
git reset --mixed HEAD^  # 커밋과 스테이징 취소
git reset --hard HEAD^   # 모든 변경사항 취소 (위험!)
```

### 4.2 고급 스태시 기능
```bash
# 스태시 목록 보기
git stash list

# 특정 스태시 적용
git stash apply stash@{n}

# 특정 파일만 스태시
git stash push -m "메시지" <file>
```

### 4.3 특수 상황 해결

#### 4.3.1 커밋에서 특정 파일 제외
```bash
# 마지막 커밋에서 파일 제외하기
git reset --soft HEAD^
git restore --staged <file-to-exclude>
git commit -m "Original commit message"
```

#### 4.3.2 충돌 해결
```bash
# 충돌 시 특정 버전 선택
git checkout --ours <file>   # 현재 브랜치 버전 선택
git checkout --theirs <file> # 병합하려는 브랜치 버전 선택

# 병합 취소
git merge --abort
```

**주의사항:**
1. 고급 명령어 사용 시 반드시 변경사항을 백업하세요
2. `reset --hard`와 같은 위험한 명령어는 신중하게 사용하세요
3. 이미 push된 커밋을 수정할 때는 팀원들과 상의가 필요합니다
4. GitHub Desktop에서 처리할 수 있는 작업은 가능한 GUI를 사용하세요 