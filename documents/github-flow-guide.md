# GitHub Flow와 병합 전략 가이드

## 목차

1. [GitHub Flow 이해하기](#1-github-flow-이해하기)
2. [브랜치 전략](#2-브랜치-전략)
3. [병합 전략](#3-병합-전략)
4. [Pull과 Merge의 차이](#4-pull과-merge의-차이)

## 1. GitHub Flow 이해하기

### 1.1 GitHub Flow란?
GitHub Flow는 간단하고 효율적인 브랜치 전략으로, 다음과 같은 특징이 있습니다:

- `main` 브랜치는 항상 배포 가능한 상태 유지
- 새로운 작업은 항상 브랜치를 생성하여 진행
- 정기적으로 원격 저장소에 push하여 백업 및 협업
- Pull Request를 통한 코드 리뷰
- 승인 후 `main` 브랜치에 병합

### 1.2 기본 규칙
1. `main` 브랜치는 항상 안정적이어야 함
2. 모든 작업은 feature 브랜치에서 진행
3. 커밋 메시지는 명확하게 작성
4. Pull Request로 코드 리뷰 진행
5. 테스트 통과 후 병합 가능

## 2. 브랜치 전략

### 2.1 브랜치 명명 규칙
```
feature/   : 새로운 기능 개발
bugfix/    : 버그 수정
hotfix/    : 긴급 수정
release/   : 배포 준비
docs/      : 문서 작업
refactor/  : 코드 리팩토링
```

### 2.2 작업 흐름
1. main 브랜치에서 새 브랜치 생성
```bash
git checkout -b feature/new-feature main
```

2. 정기적으로 커밋 및 푸시
```bash
git commit -m "Add new feature"
git push origin feature/new-feature
```

3. Pull Request 생성 및 리뷰
4. 승인 후 병합 및 브랜치 삭제

## 3. 병합 전략

### 3.1 Merge 종류

#### 1. Regular Merge (일반 병합)
```bash
git merge feature/branch
```
- **사용 시기**: 브랜치의 히스토리를 보존해야 할 때
- **장점**: 모든 커밋 히스토리 유지
- **단점**: 히스토리가 복잡해질 수 있음

#### 2. Squash Merge
```bash
git merge --squash feature/branch
```
- **사용 시기**:
  - 피처 브랜치의 커밋들을 하나로 합치고 싶을 때
  - 작은 기능 개발이나 버그 수정
  - 커밋 히스토리를 깔끔하게 유지하고 싶을 때
- **장점**: 
  - 깔끔한 커밋 히스토리
  - 롤백이 용이
- **단점**: 상세한 커밋 히스토리 손실

#### 3. Rebase Merge
```bash
git rebase main
```
- **사용 시기**:
  - 장기적인 feature 브랜치 작업 시
  - main의 최신 변경사항을 자주 반영해야 할 때
  - 선형적인 히스토리가 필요할 때
- **장점**:
  - 깔끔한 선형 히스토리
  - 충돌을 점진적으로 해결 가능
- **단점**:
  - 이미 push한 커밋을 rebase하면 문제 발생
  - 충돌 해결이 복잡할 수 있음

### 3.2 상황별 권장 전략

1. **Squash Merge 사용**
   - 작은 기능 개발
   - 단순 버그 수정
   - 문서 업데이트
   - 임시 작업 병합

2. **Rebase 사용**
   - 장기 개발 브랜치
   - main 브랜치 변경사항 동기화
   - 개인 작업 브랜치 정리
   - 깔끔한 히스토리 필요 시

3. **Regular Merge 사용**
   - 릴리스 브랜치 병합
   - 주요 기능 병합
   - 히스토리 보존 필요 시

### 3.3 병합 전략 시각화

```
1. Regular Merge
   (브랜치 히스토리 보존)

main     : A---B---C-------------M
                   \           /
feature  :          D---E---F-/

결과: 모든 커밋(A,B,C,D,E,F)과 병합 커밋(M) 유지


2. Squash Merge
   (커밋들을 하나로 압축)

main     : A---B---C---S
                   \
feature  :          D---E---F
                   
결과: main에는 하나의 커밋(S)으로 압축됨
      (D,E,F의 변경사항이 S에 모두 포함)


3. Rebase
   (선형적 히스토리)

Before:
main     : A---B---C
                   \
feature  :          D---E---F

After:
main     : A---B---C
                   \
feature  :          D'---E'---F'

결과: 깔끔한 선형 히스토리
      (D,E,F가 C 이후로 재배치됨)


병합 전략 비교:
┌──────────────┬─────────────┬───────────┬───────────────┐
│ 특성         │ Regular     │ Squash     │ Rebase        │
├────────────┼─────────────┼────────────┼────────────────┤
│ 히스토리      │ 보존        │ 압축         │ 재작성          │
│ 커밋 수      │ 모두 유지     │ 하나로 통합   │ 재배치          │
│ 복잡도       │ 높음        │ 낮음         │ 중간            │
│ 추적성       │ 높음        │ 낮음         │ 중간            │
└──────────────┴─────────────┴──────────────┴────────────┘
```

### 3.4 병합 전략 선택 가이드

```
            ┌─ 작은 기능/버그수정 ─── Squash Merge
            │
작업 규모 ──┼─ 중간 기능 ────────── Regular Merge
            │
            └─ 대규모 기능 ──────── Rebase
                                   (주기적 main 동기화)

            ┌─ 단순 명확 ────────── Squash Merge
            │
복잡도 ────┼─ 보통 ─────────────── Regular Merge
            │
            └─ 복잡 ─────────────── Regular Merge
                                   (히스토리 추적 필요)

            ┌─ 빠른 통합 필요 ───── Squash Merge
            │
시급성 ────┼─ 보통 ─────────────── Regular/Rebase
            │
            └─ 장기 작업 ──────── Rebase
                                 (주기적 동기화)
```

### 3.5 중요 주의사항: 상위 브랜치 작업 금지

```
❌ 잘못된 작업 방식:
main     : A---B---C---D (직접 main에서 작업)
                     ↑
                  위험한 상황!

✅ 올바른 작업 방식:
main     : A---B---C---------M
                   \       /
feature  :          D---E-/
```

#### 상위 브랜치 직접 작업을 금지하는 이유:

1. **안정성 위험**
   - main과 같은 상위 브랜치는 항상 안정적이고 배포 가능한 상태여야 함
   - 직접 작업 시 버그나 미완성 코드가 바로 프로덕션에 영향을 미칠 수 있음

2. **코드 리뷰 우회**
   - 브랜치를 따로 만들지 않고 직접 작업하면 Pull Request 과정을 건너뛰게 됨
   - 팀 리뷰 없이 코드가 들어가 품질 저하 위험

3. **롤백 어려움**
   - 문제 발생 시 특정 변경사항만 롤백하기 어려움
   - 여러 변경사항이 섞여 있어 특정 기능만 되돌리기 복잡

4. **협업 충돌**
   - 여러 개발자가 같은 브랜치에서 작업 시 충돌 가능성 매우 높음
   - 변경사항 추적이 어려워져 누가 무엇을 변경했는지 파악 곤란

5. **테스트 불가**
   - 격리된 환경에서 테스트할 수 없음
   - 다른 변경사항과 섞여 특정 기능만 테스트하기 어려움

#### 권장 작업 흐름:

```
1. 항상 새로운 브랜치 생성
   git checkout -b feature/new-feature main

2. 브랜치에서 작업 및 커밋
   git add .
   git commit -m "Add new feature"

3. 원격 저장소에 푸시
   git push origin feature/new-feature

4. Pull Request 생성 및 리뷰 진행

5. 승인 후 병합
   (GitHub UI 또는 git merge 사용)
```

## 4. Pull과 Merge의 차이

### 4.1 Git Pull
```bash
git pull origin main
```
- `git fetch` + `git merge` 의 조합
- 원격의 변경사항을 가져와서 자동으로 병합
- 간편하지만 세밀한 제어가 어려움

### 4.2 Git Fetch + Merge
```bash
git fetch origin
git merge origin/main
```
- 변경사항을 가져오고 병합을 수동으로 진행
- 더 세밀한 제어 가능
- 병합 전에 변경사항 확인 가능

### 4.3 권장 사용법

1. **일반적인 상황**
   ```bash
   git pull origin main
   ```

2. **신중한 병합이 필요한 상황**
   ```bash
   git fetch origin
   git log HEAD..origin/main  # 변경사항 확인
   git merge origin/main
   ```

3. **Rebase를 사용하는 상황**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

### 4.4 주의사항

1. **Pull 사용 시**
   - 자동 병합으로 인한 예상치 못한 충돌 가능
   - 히스토리가 복잡해질 수 있음

2. **Fetch + Merge 사용 시**
   - 추가 단계가 필요하지만 안전
   - 변경사항을 확인하고 병합 가능
   - 필요한 경우 병합을 취소하거나 다른 전략 선택 가능 