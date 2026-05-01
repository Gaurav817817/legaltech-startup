import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

const tarazuSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="g" x1="20%" y1="0%" x2="80%" y2="100%">
      <stop offset="0%" stop-color="#FCD34D"/>
      <stop offset="55%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#B45309"/>
    </linearGradient>
  </defs>
  <rect x="31" y="6" width="2" height="4.5" rx="1" fill="url(#g)"/>
  <rect x="10" y="14.4" width="44" height="3.6" rx="1.8" fill="url(#g)"/>
  <circle cx="11" cy="16.2" r="2.2" fill="url(#g)"/>
  <circle cx="53" cy="16.2" r="2.2" fill="url(#g)"/>
  <rect x="30.6" y="9.5" width="2.8" height="45" rx="1.4" fill="url(#g)"/>
  <rect x="22" y="52.6" width="20" height="3" rx="1.5" fill="url(#g)"/>
  <rect x="10.3" y="18.4" width="1.4" height="10.6" rx="0.7" fill="url(#g)"/>
  <rect x="52.3" y="18.4" width="1.4" height="10.6" rx="0.7" fill="url(#g)"/>
  <path d="M 2 29 Q 11 42 20 29" fill="none" stroke="url(#g)" stroke-width="3" stroke-linecap="round"/>
  <path d="M 44 29 Q 53 42 62 29" fill="none" stroke="url(#g)" stroke-width="3" stroke-linecap="round"/>
</svg>`

export default function AppleIcon() {
  const tarazuDataUri = `data:image/svg+xml;base64,${Buffer.from(tarazuSvg).toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #4338ca 100%)',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={tarazuDataUri} width={130} height={130} alt="" />
      </div>
    ),
    { ...size },
  )
}
