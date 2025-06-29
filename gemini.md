// 1-1. 페이지 열기
{ "tool": "playwright", "parameters": { "action": "goto", "url": "https://example.com" } },

// 1-2. 로그인 버튼 클릭
{ "tool": "playwright", "parameters": { "action": "click", "selector": "#login-button" } },

// 1-3. 검색어 입력 및 엔터
{ "tool": "playwright", "parameters": { "action": "fill", "selector": "input[name='q']", "text": "MCP Server" } },
{ "tool": "playwright", "parameters": { "action": "press", "selector": "input[name='q']", "key": "Enter" } },

// 1-4. 스크린샷 저장 (D:/project에 저장)
{ "tool": "playwright", "parameters": { "action": "screenshot", "path": "D:/project/search-results.png" } },

// 1-5. 콘솔 로그 수집
{ "tool": "playwright", "parameters": { "action": "getConsoleLogs" } },

// 1-6. 네트워크 요청 수집
{ "tool": "playwright", "parameters": { "action": "getNetworkRequests" } },

// 1-7. 페이지 타이틀 평가
{ "tool": "playwright", "parameters": { "action": "evaluate", "expression": "document.title" } },

// 1-8. 접근성 스냅샷
{ "tool": "playwright", "parameters": { "action": "accessibilitySnapshot" } }

// 2-1. Git 저장소 초기화 및 첫 커밋
{
  "tool": "git",
  "parameters": {
    "subtool": "RunCommand",
    "path": "D:/project",
    "command": "cmd",
    "args": [
      "/c",
      "git init && " +
      "echo IDE/.vs/ > .gitignore && " +
      "git add . && " +
      "git commit -m \"chore: initial project baseline\""
    ]
  }
},

// 2-2. 특정 파일 커밋 (예: SHORTS_REAL/script_result.php 경로도 D:/project 기준)
{
  "tool": "git",
  "parameters": {
    "subtool": "RunCommand",
    "path": "D:/project",
    "command": "cmd",
    "args": [
      "/c",
      "git add SHORTS_REAL/script_result.php && " +
      "git commit -m \"feat: change button label\""
    ]
  }
},

// 2-3. 디렉토리 전체 목록 조회
{
  "tool": "git",
  "parameters": {
    "subtool": "RunCommand",
    "path": "D:/project",
    "command": "cmd",
    "args": [
      "/c",
      "dir /S"
    ]
  }
}

// 3-1. axios 최신 버전 조회
{
  "tool": "context7",
  "parameters": {
    "query": "axios 최신 버전 알려줘"
  }
},

// 3-2. lodash 사용법 예시 검색
{
  "tool": "context7",
  "parameters": {
    "query": "lodash 사용법 예시"
  }
}

// 4-1. 프로젝트 규칙 초기화
{ "tool": "init_project_rules", "parameters": {} },

// 4-2. 작업 계획 수립
{
  "tool": "plan_task",
  "parameters": {
    "description": "사용자 로그인 기능 추가"
  }
},

// 4-3. 작업 분석
{ "tool": "analyze_task", "parameters": {} },

// 4-4. 사고의 흐름 정리
{ "tool": "process_thought", "parameters": {} },

// 4-5. 개선점 도출 및 반영
{ "tool": "reflect_task", "parameters": {} }

