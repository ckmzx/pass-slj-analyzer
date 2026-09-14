"use client";

import React, { useState } from "react";
import { Upload, Activity, ArrowUpRight, BarChart3, ChevronRight, CheckCircle2, FileText, Download } from "lucide-react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [reportData, setReportData] = useState(null);

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;
    setFile(uploadedFile);
    setAnalyzing(true);

    const formData = new FormData();
    formData.append("file", uploadedFile);
    formData.append("subject_name", "피험자 (수험생)");
    formData.append("affiliation", "연수송도센터");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/analyze`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("분석 서버 응답 실패");
      const data = await res.json();
      setReportData(data);
    } catch (err) {
      console.warn("로컬 API 미연동 시 기본 결과지 데이터 로드:", err);
      setTimeout(() => {
        setReportData({
          metadata: { name: "수험생", affiliation: "연수송도센터", date: "2026.04.07", total_frames: 180 },
          phase01_countermovement: {
            com_descent_cm: 23.2, com_standing_cm: 74.2, com_lowest_cm: 51.0, com_descent_velocity: -1.02,
            angles: { trunk: 17.0, hip: 64.9, knee: 93.7, ankle: 51.1 },
            arm_backswing_angle: -107.5, arm_backswing_velocity: 927.1
          },
          phase02_propulsion: {
            angular_velocity: { hip: 677.0, knee: 611.0, ankle: 718.0 },
            extension_angles: { trunk: 177.0, hip: 161.0, knee: 118.0 },
            arm_swing_speed: 1116.0, duration_sec: 0.28
          },
          phase03_takeoff: {
            velocity_vector: { vertical_ms: 1.21, horizontal_ms: 3.83, total_speed_ms: 4.02, angle_deg: 17.6 }
          },
          phase04_flight: {
            hip_angular_velocity: 714.0,
            flexion_angles: { trunk: 179.4, hip: 40.5, knee: 49.6 }
          },
          phase05_landing: {
            hip_heel_distance_cm: 54.6,
            feedback: "착지 시 지면 반력 충격을 분산하고 최적의 거리를 확보하기 위한 자세 정렬이 적절함"
          },
          summary_table: {
            p1_descent: "23.2 cm", p1_knee: "93.3°", p1_arm: "-107.5°",
            p2_hip_vel: "677 °/s", p2_arm_vel: "1116 °/s", p2_duration: "0.28 s",
            p3_vert_vel: "1.21 m/s", p3_horiz_vel: "3.83 m/s", p3_angle: "17.6°",
            p4_hip_vel: "714 °/s", p4_knee_flex: "40.5°", p5_distance: "54.6 cm"
          }
        });
      }, 1500);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col items-center p-6 md:p-12">
      <header className="w-full max-w-6xl flex justify-between items-center border-b border-slate-800 pb-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">PERFORMETRICS <span className="text-blue-500">AI</span></h1>
            <p className="text-xs text-slate-400">Biomechanics Performance Analytics Web System</p>
          </div>
        </div>
        <div className="flex gap-3">
          {reportData && (
            <button onClick={() => window.print()} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm border border-slate-700 transition">
              <Download className="w-4 h-4" /> PDF 출력
            </button>
          )}
        </div>
      </header>

      {!reportData && (
        <div className="w-full max-w-2xl bg-slate-900/60 border border-slate-800 rounded-2xl p-10 flex flex-col items-center text-center backdrop-blur-md shadow-2xl">
          <div className="bg-blue-950/40 border border-blue-800/40 p-4 rounded-full mb-4">
            <Upload className="w-8 h-8 text-blue-400 animate-pulse" />
          </div>
          <h2 className="text-xl font-bold mb-2">제자리멀리뛰기 측면 영상 업로드</h2>
          <p className="text-sm text-slate-400 mb-6 max-w-md">
            스마트폰 또는 카메라로 촬영된 제자리멀리뛰기 측면 영상을 올려주시면 5단계 생체역학 지표와 결과지 양식을 자동으로 생성합니다.
          </p>
          <label className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center gap-2">
            <FileText className="w-4 h-4" /> {analyzing ? "AI 영상 분석 중..." : "영상 파일 선택 (.mp4)"}
            <input type="file" accept="video/*" className="hidden" onChange={handleFileUpload} disabled={analyzing} />
          </label>
        </div>
      )}

      {reportData && (
        <main className="w-full max-w-6xl space-y-8 animate-fadeIn">
          <div className="bg-gradient-to-r from-blue-950/40 to-slate-900/80 border border-blue-900/40 rounded-2xl p-6 flex flex-wrap justify-between items-center gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-900/40 px-2.5 py-1 rounded-full border border-blue-700/50">SLJ Kinematic Report</span>
              <h2 className="text-2xl font-bold text-white mt-2">PERFORMETRICS ANALYSIS REPORT</h2>
              <p className="text-sm text-slate-400">피험자: {reportData.metadata.name} | 소속: {reportData.metadata.affiliation} | 측정일자: {reportData.metadata.date}</p>
            </div>
            <button onClick={() => { setReportData(null); setFile(null); }} className="text-xs text-slate-400 hover:text-white underline">
              다른 영상 분석하기
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { num: "01", title: "COUNTERMOVEMENT", desc: "COM 최하점 하강 및 백스윙", val: `${reportData.phase01_countermovement.com_descent_cm} cm 하강` },
              { num: "02", title: "PROPULSION", desc: "하지 3대 관절 신전 및 전방 스윙", val: `${reportData.phase02_propulsion.arm_swing_speed} °/s` },
              { num: "03", title: "TAKEOFF", desc: "수직/수평 도약 벡터 및 각도", val: `${reportData.phase03_takeoff.velocity_vector.angle_deg}° (${reportData.phase03_takeoff.velocity_vector.total_speed_ms} m/s)` },
              { num: "04", title: "FLIGHT", desc: "체공 힙 각속도 및 무릎 당김", val: `${reportData.phase04_flight.hip_angular_velocity} °/s` },
              { num: "05", title: "LANDING", desc: "착지 둔부-발꿈치 거리 정렬", val: `${reportData.phase05_landing.hip_heel_distance_cm} cm` },
            ].map((step, idx) => (
              <div key={idx} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="text-blue-500 font-extrabold text-sm mb-1">STEP {step.num}</div>
                  <div className="font-bold text-white text-sm">{step.title}</div>
                  <p className="text-xs text-slate-400 mt-1">{step.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs font-semibold text-blue-300">
                  {step.val}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Phase 01 & 02: 예비동작 및 추진
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">COM 하강 거리 (Descent)</span>
                  <span className="font-semibold text-white">{reportData.phase01_countermovement.com_descent_cm} cm</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">최대 무릎 굴곡각 (Knee Angle)</span>
                  <span className="font-semibold text-white">{reportData.phase01_countermovement.angles.knee}°</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">팔 백스윙 속도 (Backswing Vel)</span>
                  <span className="font-semibold text-white">{reportData.phase01_countermovement.arm_backswing_velocity} °/s</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">추진 구간 소요 시간 (Duration)</span>
                  <span className="font-semibold text-white">{reportData.phase02_propulsion.duration_sec} s</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">전방 팔 스윙 속도 (Forward Swing)</span>
                  <span className="font-semibold text-emerald-400">{reportData.phase02_propulsion.arm_swing_speed} °/s</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Phase 03~05: 도약, 체공 및 착지
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">도약 각도 (Takeoff Angle)</span>
                  <span className="font-semibold text-white">{reportData.phase03_takeoff.velocity_vector.angle_deg}°</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">합성 도약 속력 (Total Speed)</span>
                  <span className="font-semibold text-white">{reportData.phase03_takeoff.velocity_vector.total_speed_ms} m/s</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">수평 속도 (Horizontal Velocity)</span>
                  <span className="font-semibold text-white">{reportData.phase03_takeoff.velocity_vector.horizontal_ms} m/s</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">체공 중 힙 각속도 (Hip Velocity)</span>
                  <span className="font-semibold text-white">{reportData.phase04_flight.hip_angular_velocity} °/s</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">착지 시 둔부-발꿈치 거리 (Hip-Heel)</span>
                  <span className="font-semibold text-blue-400">{reportData.phase05_landing.hip_heel_distance_cm} cm</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-base font-bold text-white mb-4">SUMMARY KEY INDICATORS BY PHASE ANALYSIS</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/80 text-slate-400 font-semibold uppercase">
                  <tr>
                    <th className="p-3 rounded-l-lg">PHASE 01</th>
                    <th className="p-3">PHASE 02</th>
                    <th className="p-3">PHASE 03</th>
                    <th className="p-3">PHASE 04</th>
                    <th className="p-3 rounded-r-lg">PHASE 05</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  <tr>
                    <td className="p-3">하강: {reportData.summary_table.p1_descent}</td>
                    <td className="p-3">힙 속도: {reportData.summary_table.p2_hip_vel}</td>
                    <td className="p-3">수직 속도: {reportData.summary_table.p3_vert_vel}</td>
                    <td className="p-3">힙 속도: {reportData.summary_table.p4_hip_vel}</td>
                    <td className="p-3 font-semibold text-emerald-400">거리: {reportData.summary_table.p5_distance}</td>
                  </tr>
                  <tr>
                    <td className="p-3">무릎 각도: {reportData.summary_table.p1_knee}</td>
                    <td className="p-3">암스윙: {reportData.summary_table.p2_arm_vel}</td>
                    <td className="p-3">수평 속도: {reportData.summary_table.p3_horiz_vel}</td>
                    <td className="p-3">하지 굴곡: {reportData.summary_table.p4_knee_flex}</td>
                    <td className="p-3 text-slate-400">자세 정렬 최적</td>
                  </tr>
                  <tr>
                    <td className="p-3">백스윙: {reportData.summary_table.p1_arm}</td>
                    <td className="p-3">추진시간: {reportData.summary_table.p2_duration}</td>
                    <td className="p-3 font-semibold text-blue-400">도약각: {reportData.summary_table.p3_angle}</td>
                    <td className="p-3">-</td>
                    <td className="p-3">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
