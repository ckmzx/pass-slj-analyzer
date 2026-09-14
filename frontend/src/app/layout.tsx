export const metadata = {
  title: 'Performetrics AI - 제자리멀리뛰기 생체역학 분석 리포트',
  description: 'Standing Long Jump Biomechanics Video Analyzer Web Application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
