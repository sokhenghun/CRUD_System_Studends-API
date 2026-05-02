import { useId } from 'react'

export default function RetroErrorWindow({
  titleBar,
  line1,
  line2,
  sub,
  cta,
  className = '',
  warnOutline = false,
  line2Variant = 'gradient',
  ariaLive = 'polite',
}) {
  const warnFillGradId = `nf-warn-fill-${useId().replace(/:/g, '')}`

  const line2Content =
    line2Variant === 'glitch' ? (
      <span className="nf-glitch-text" data-text={line2}>
        {line2}
      </span>
    ) : (
      <span className="nf-headline-gradient">{line2}</span>
    )

  return (
    <div className={`nf-window ${className}`.trim()} role="alert" aria-live={ariaLive}>
      <div className="nf-window-titlebar">
        <span className="nf-window-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className="nf-window-title">{titleBar}</span>
      </div>

      <div className="nf-window-body">
        <div className="nf-window-main">
          <div className="nf-warn-wrap" aria-hidden="true">
            {warnOutline ? (
              <svg className="nf-warn-icon nf-warn-icon--outline" viewBox="0 0 64 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M32 6L58 50H6L32 6Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                <path d="M32 22v14M32 40v2" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            ) : (
              <svg className="nf-warn-icon" viewBox="0 0 64 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id={warnFillGradId} x1="6" y1="50" x2="58" y2="6" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#34d399" />
                    <stop offset="1" stopColor="#0f766e" />
                  </linearGradient>
                </defs>
                <path
                  d="M32 6L58 50H6L32 6Z"
                  fill={`url(#${warnFillGradId})`}
                  stroke="#065f46"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                <path d="M32 22v14M32 40v2" stroke="#ecfdf5" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            )}
          </div>

          <div className="nf-window-text">
            <p className="nf-window-line1">{line1}</p>
            <p className="nf-window-line2">{line2Content}</p>
            <p className="nf-window-sub">{sub}</p>
          </div>
        </div>

        <div className="nf-progress" aria-hidden="true">
          <div className="nf-progress-fill" />
        </div>

        <div className="nf-window-bottom" aria-hidden="true">
          <span className="nf-corner-box" />
          <span className="nf-corner-box" />
        </div>

        {cta}
      </div>
    </div>
  )
}
