# 🎨 Sion LoL Theme - Style Guide

## 개요

이 프로젝트는 **League of Legends의 Mecha Zero Sion 캐릭터**를 테마로 한 **사이버펑크 스타일 UI**를 사용합니다.

### 🎯 디자인 철학
- **어두운 배경**: 사이버펑크 미래 도시 분위기
- **네온 글로우**: 파란색(#0099ff)과 청록색(#00ffff) 주로 사용
- **생동감**: 펄스, 플로트, 스캔 라인 애니메이션
- **게임성**: League of Legends의 세계관과 Sion의 기계화된 테마 반영

---

## 📁 파일 구조

```
src/styles/
├── LoLTheme.css           # 🎨 메인 테마 (색상, 기본 레이아웃, 변수)
├── ControlPanel.css       # 🎮 조종 패널 (상태, 배터리, 모드 선택)
├── TacticalMap.css        # 🗺️ 전술 맵 (캔버스, 그리드)
├── StatusPanel.css        # 📊 상태 패널 (메트릭, 좌표, 적)
├── Chat.css              # 💬 채팅 (메시지, 입력, 애니메이션)
└── SionCharacter.css     # ⚡ Sion 캐릭터 테마 (특수 효과, 글로우)
```

---

## 🎨 색상 팔레트

### 주요 색상
```css
--color-primary: #0099ff;        /* 기본 청색 */
--color-primary-dark: #0066cc;   /* 진한 청색 */
--color-secondary: #00ff99;      /* 네온 초록 */
--color-glow: #00ffff;           /* 네온 청록 */
--color-danger: #ff0055;         /* 위험 빨강 */
--color-warning: #ffaa00;        /* 경고 주황 */
```

### 배경 색상
```css
--color-bg-dark: #0a0e27;        /* 진한 파란색 배경 */
--color-bg-darker: #050810;      /* 더 진한 배경 */
--color-text-light: #e0e8ff;     /* 밝은 텍스트 */
--color-text-muted: #8899cc;     /* 회색 텍스트 */
```

---

## 🧩 컴포넌트별 스타일

### 1. Header (LoLTheme.css)

**기능**:
- 로고에 글로우 애니메이션 적용
- 상태 표시 (온라인/오프라인)
- 반응형 디자인

**클래스**:
```html
<header class="header">
  <div class="header-left">
    <div class="header-logo">SION</div>
    <div class="header-status">
      <div class="status-indicator connected"></div>
      Connected
    </div>
  </div>
  <div class="header-right">System Status: Online</div>
</header>
```

### 2. ControlPanel (ControlPanel.css)

**기능**:
- 상태 정보 표시
- 배터리 바
- 모드 선택 (버튼)
- 명령 버튼

**클래스**:
```html
<div class="left-panel">
  <div class="panel">
    <div class="panel-header"><h3>제어</h3></div>
    <div class="control-content">
      <div class="status-info">
        <div class="status-item">
          <div class="label">상태</div>
          <div class="value state">Active</div>
        </div>
      </div>
      <div class="battery-bar">
        <div class="battery-bar-container">
          <div class="battery-fill" style="width: 85%;"></div>
        </div>
        <div class="battery-percent">85%</div>
      </div>
    </div>
  </div>
</div>
```

### 3. TacticalMap (TacticalMap.css)

**기능**:
- 캔버스 기반 지도
- 드롭 섀도우 효과
- 그리드 백그라운드

**클래스**:
```html
<div class="center-panel">
  <div class="panel tactical-map">
    <div class="panel-header"><h3>전술 맵</h3></div>
    <div class="map-container">
      <canvas id="map" class="map-canvas"></canvas>
    </div>
    <div class="map-info">
      <div>X: 1240 Y: 560</div>
      <div>Zoom: 1.0</div>
    </div>
  </div>
</div>
```

### 4. StatusPanel (StatusPanel.css)

**기능**:
- 연결 상태
- 좌표 정보
- 메트릭 (거리, 각도 등)
- 적 목록

**클래스**:
```html
<div class="right-panel">
  <div class="panel status-panel">
    <div class="panel-header"><h3>상태</h3></div>
    <div class="status-content">
      <div class="status-group">
        <div class="label-header">연결</div>
        <div class="status-item">
          <div class="label">서버</div>
          <span class="badge success">Connected</span>
        </div>
      </div>
      <div class="status-group">
        <div class="label-header">좌표</div>
        <div class="coordinate">
          <div>X: 1240.5</div>
          <div>Y: 560.3</div>
        </div>
      </div>
      <div class="status-group">
        <div class="label-header">메트릭</div>
        <div class="metrics">
          <div class="metric-item">
            <div class="label">거리</div>
            <div class="value">23.5m</div>
          </div>
          <div class="metric-item">
            <div class="label">각도</div>
            <div class="value">45°</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

### 5. Chat (Chat.css)

**기능**:
- 메시지 표시 (User/AI/System)
- 타이핑 인디케이터
- 입력 필드 및 전송 버튼
- 메시지 애니메이션

**클래스**:
```html
<div class="chat-container">
  <div class="commentary-panel-container">
    <div class="commentary-panel" id="messages">
      <div class="commentary-item user">안녕하세요!</div>
      <div class="commentary-item ai">안녕하세요. Sion AI입니다.</div>
      <div class="commentary-item system">✓ 시스템 준비 완료</div>
    </div>
  </div>
  <div class="chat-input-container">
    <div class="chat-input-wrapper">
      <input type="text" class="chat-input" placeholder="메시지를 입력하세요...">
      <button class="send-btn">전송</button>
    </div>
  </div>
</div>
```

### 6. SionCharacter (SionCharacter.css)

**특수 클래스들**:

#### a. Glow 효과
```html
<div class="header-logo">SION</div> <!-- 자동 glow-pulse 애니메이션 -->
```

#### b. Energy Orb
```html
<div class="sion-energy-orb"></div> <!-- 펄싱 에너지 구체 -->
```

#### c. Status Light
```html
<div class="sion-status-light"></div> <!-- 활성 상태 -->
<div class="sion-status-light inactive"></div> <!-- 비활성 상태 -->
```

#### d. Loading Bar
```html
<div class="sion-loading-bar">
  <div class="sion-loading-bar-fill"></div>
</div>
```

#### e. Power Indicator
```html
<div class="sion-power-indicator">
  <div class="sion-power-level active"></div>
  <div class="sion-power-level active"></div>
  <div class="sion-power-level"></div>
</div>
```

---

## ⚙️ 주요 애니메이션

### 1. Glow Pulse (글로우 펄스)
```css
/* 2초 주기로 글로우 강도 변화 */
@keyframes glow-pulse { /* LoLTheme.css */ }
```

### 2. Battery Alert (배터리 경고)
```css
/* 배터리 부족 시 깜박임 */
@keyframes battery-alert { /* ControlPanel.css */ }
```

### 3. Scan Lines (스캔 라인)
```css
/* 위에서 아래로 스캔 라인 이동 */
@keyframes sion-scan { /* SionCharacter.css */ }
```

### 4. Pulse (펄스)
```css
/* 에너지 구체 펄싱 */
@keyframes sion-pulse { /* SionCharacter.css */ }
```

### 5. Float (플로팅)
```css
/* 위아래로 부드럽게 움직임 */
@keyframes sion-float { /* SionCharacter.css */ }
```

---

## 🎯 사용 가이드

### 메인 스타일시트 임포트

```html
<!-- index.html 또는 main.jsx 에서 -->
<link rel="stylesheet" href="./styles/LoLTheme.css">
<link rel="stylesheet" href="./styles/ControlPanel.css">
<link rel="stylesheet" href="./styles/TacticalMap.css">
<link rel="stylesheet" href="./styles/StatusPanel.css">
<link rel="stylesheet" href="./styles/Chat.css">
<link rel="stylesheet" href="./styles/SionCharacter.css">
```

또는 CSS에서:

```css
@import './LoLTheme.css';
@import './ControlPanel.css';
@import './TacticalMap.css';
@import './StatusPanel.css';
@import './Chat.css';
@import './SionCharacter.css';
```

### 커스터마이징

#### 색상 변경
```css
:root {
  --color-primary: #0099ff; /* 이 값 변경 */
  --color-glow: #00ffff;
}
```

#### 애니메이션 속도 변경
```css
.header-logo {
  animation: glow-pulse 2s ease-in-out infinite; /* 2s -> 4s로 변경 */
}
```

#### 글로우 강도 조절
```css
.panel {
  box-shadow: 0 0 20px rgba(0, 153, 255, 0.3); /* 0.3 -> 0.5로 증가 */
}
```

---

## 📱 반응형 디자인

### 브레이크포인트

| 사이즈 | 변경 사항 |
|--------|----------|
| **1400px 이상** | 3단 레이아웃 (좌패널, 중앙, 우패널) |
| **1024px - 1399px** | 2단 레이아웃 |
| **768px 이하** | 1단 레이아웃 (모바일) |

### 모바일 최적화

```css
@media (max-width: 768px) {
  header.header {
    flex-direction: column;  /* 세로 정렬 */
    gap: 10px;
  }

  .main-content {
    grid-template-columns: 1fr; /* 1단 레이아웃 */
    grid-template-rows: auto auto auto;
  }
}
```

---

## 🌙 다크 모드

현재 디자인이 다크 모드 기반입니다.

시스템 다크 모드 감지:
```css
@media (prefers-color-scheme: dark) {
  /* 자동 적용 */
}
```

---

## 🐛 브라우저 호환성

| 브라우저 | 지원 |
|----------|------|
| Chrome | ✅ 완전 지원 |
| Firefox | ✅ 완전 지원 |
| Safari | ✅ 완전 지원 |
| Edge | ✅ 완전 지원 |
| IE 11 | ❌ 미지원 |

---

## 📚 참고

### Sion (League of Legends)
- **역할**: Top Laner / Tank
- **테마**: Mecha Zero Sion (사이버펑크 기계화 버전)
- **특징**: 거대한 망치, 하이퍼 차지, 무적 상태

### 색상 의미
- **파란색 (#0099ff)**: 기술, 신뢰, 평온
- **청록색 (#00ffff)**: 에너지, 미래, 고급
- **초록색 (#00ff99)**: 성공, 활성, 생명
- **빨강색 (#ff0055)**: 위험, 긴급, 경고

---

## ✅ 체크리스트

- [x] LoLTheme.css - 메인 테마 및 변수
- [x] ControlPanel.css - 조종 패널
- [x] TacticalMap.css - 전술 맵
- [x] StatusPanel.css - 상태 표시 패널
- [x] Chat.css - 채팅 인터페이스
- [x] SionCharacter.css - 캐릭터 테마 효과
- [x] 반응형 디자인
- [x] 애니메이션 효과
- [x] 접근성 고려

---

**마지막 업데이트**: 2025년 12월 23일
**제작**: Sion AI Project Team
**테마**: League of Legends - Mecha Zero Sion
