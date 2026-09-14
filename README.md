# PASS AI - Standing Long Jump Biomechanics Video Analyzer

제자리멀리뛰기(Standing Long Jump) 실기 및 연구 영상을 업로드하면 **PASS 5단계 생체역학 분석 리포트**를 자동 생성하고 인터랙티브 웹 대시보드로 시각화해주는 풀스택 시스템입니다.

## 🌐 바로 접속 가능한 웹사이트
👉 **[https://ckmzx.github.io/pass-slj-analyzer/](https://ckmzx.github.io/pass-slj-analyzer/)**

---

## 🎯 주요 기능
- **영상 업로드 및 실시간 브라우저 AI 분석**: 별도 서버 설치 없이 웹 브라우저(TensorFlow.js MoveNet)에서 실제 영상의 관절 키포인트를 직접 추출·연산
- **5단계 생체역학 분석 (5 Phase Kinematics)**:
  1. **Step 01 Countermovement (예비동작)**: 무게중심(COM) 하강 높이, 하강 속도, 하지 관절 굴곡각, 백스윙 각속도
  2. **Step 02 Propulsion (추진동작)**: 하지 3대 관절(고관절/무릎/발목) 신전 각속도, 전방 암스윙 속도, 추진 소요시간
  3. **Step 03 Takeoff (도약)**: 도약 순간 COM 수직/수평 속도 벡터, 합성 속력 및 도약 각도
  4. **Step 04 Flight (비행/체공)**: 힙 각속도, 무릎 당겨올림 하지 굴곡각
  5. **Step 05 Landing (착지)**: 충격 흡수 거리, 둔부-발꿈치 착지 자세 정렬 간격
- **PASS 결과지 리포트 뷰어**: PASS 체대입시 연수송도센터 양식과 일치하는 인터랙티브 대시보드 UI 및 종합 요약 테이블
- **A4 PDF 원클릭 출력 지원**

---

## 🚀 로컬 실행 (Quick Start)

### 1. 백엔드 (FastAPI + YOLO Pose Engine)
```bash
cd backend
pip install -r requirements.txt
python main.py
```
백엔드 서버: `http://localhost:8000`

### 2. 프론트엔드 (Next.js / React Web UI)
```bash
cd frontend
npm install
npm run dev
```
웹 애플리케이션: `http://localhost:3000`
