"use client"

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"

const FALLBACK_IMAGES = [
    "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/ed7b1c40-3332-43d8-a9eb-4615ef341b00/w=800",
    "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/bd541261-75be-469c-7dc0-dae0ce81c400/w=800",
    "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/7d4d2641-d6a8-4fef-e85c-b12ed100d500/w=800",
    "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/933a7615-f4b6-4eae-8ed1-705fa0e24400/w=800",
    "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/31afae9c-5ba3-4ec3-2534-ed8198ed1100/w=800",
    "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/859c75ea-953e-489e-be61-91a03a35d700/w=800",
    "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/e60dd7f7-a44f-40a7-df62-095b19cd8700/w=800",
    "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/eec164e9-23f8-4f87-b48a-a208fa806100/w=800",
]

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 * @framerIntrinsicWidth 1200
 * @framerIntrinsicHeight 620
 */
export default function SpinImage(props: any) {
    props = { ...COMPONENT_DEFAULTS, ...props }
    const {
        images,
        imageWidth,
        imageHeight,
        direction,
        path,
        xCurve,
        yCurve,
        speed,
        rounded,
        orbitUnit,
        orbitWidthPx,
        orbitWidthPct,
        placeholder,
    } = props

    const items = useMemo(() => {
        const extractUrl = (it: any): string | null => {
            if (!it) return null
            if (typeof it === "string") return it.trim() || null
            const url =
                it.src ||
                it.url ||
                (typeof it.srcSet === "string" ? it.srcSet.split(" ")[0] : null)
            return typeof url === "string" ? url.trim() || null : null
        }
        const userUrls = Array.isArray(images)
            ? (images as any[]).map(extractUrl).filter(Boolean)
            : []
        const urls = userUrls.length > 0 ? userUrls : FALLBACK_IMAGES
        return (urls as string[]).slice(0, 30)
    }, [images])

    const n = items.length

    const containerRef = useRef<HTMLDivElement | null>(null)
    const orbitRef = useRef<HTMLDivElement | null>(null)
    const itemRefs = useRef<Array<HTMLDivElement | null>>([])
    const [dims, setDims] = useState({ W: 0, H: 0 })

    useEffect(() => {
        const el = containerRef.current
        if (!el) return
        const ro = new ResizeObserver((entries) => {
            const r = entries[0]?.contentRect
            if (!r) return
            const W = Math.round(r.width)
            const H = Math.round(r.height)
            if (!W || !H) return
            setDims({ W, H })
        })
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    const W = dims.W
    const H = dims.H

    // Each image container = exact imageWidth × imageHeight in px.
    const imgW = Math.max(1, imageWidth ?? 150)
    const imgH = Math.max(1, imageHeight ?? 150)

    // 0 = square … 20 = fully rounded (half the short side → circle if square).
    const r = Math.max(0, Math.min(20, rounded ?? 3))
    const radius = (r / 20) * (Math.min(imgW, imgH) / 2)

    // Ellipse major-axis half-length `a` = totalWidth / 2.
    // Custom off → fixed 100% canvas width. Custom on → user value.
    const totalW =
        orbitUnit === "px"
            ? Math.max(0, orbitWidthPx)
            : (Math.max(0, Math.min(100, orbitWidthPct)) / 100) * W
    const a = totalW / 2
    const b = a * 0.35 // fixed ellipse minor/major ratio

    // Initial tilt: major axis along TL→BR diagonal.
    const theta0 = Math.atan2(H, W)
    const dir = direction === "anticlockwise" ? -1 : 1

    // Speed 0 → static, 20 → ~1 rev/sec (very fast). Linear between.
    const revsPerSec = Math.max(0, Math.min(20, speed ?? 5)) * 0.05

    // Orbit phase lives in a ref and is painted straight to the DOM via
    // transform (GPU-only) — no React state per frame, so the rAF loop
    // never re-renders the component tree.
    const orbitPhiRef = useRef(0)
    const rafRef = useRef<number | null>(null)

    const cosT = Math.cos(theta0)
    const sinT = Math.sin(theta0)

    const paint = (phi: number) => {
        const orbit = orbitRef.current
        if (!orbit) return
        const cx = W / 2
        const cy = H / 2
        for (let i = 0; i < n; i++) {
            const el = itemRefs.current[i]
            if (!el) continue
            const p = (i / n) * Math.PI * 2 + phi
            const ex = a * Math.cos(p)
            const ey = b * Math.sin(p)
            // Static tilt rotation of the ellipse.
            const x = ex * cosT - ey * sinT
            const y = ex * sinT + ey * cosT
            const left = cx + x - imgW / 2
            const top = cy + y - imgH / 2
            // Curved path: size by major-axis depth. Straight: uniform.
            const depth = (Math.cos(p) + 1) / 2 // 0 back … 1 front
            const sf = path === "curved" ? 0.6 + 0.8 * depth : 1
            // Stack follows the motion: lower (nearer) on screen = more
            // "front" → higher z. Back-arc images stay behind, rising to
            // the top only as they swing to the front.
            const zIndex = Math.round(y)
            el.style.left = `${left}px`
            el.style.top = `${top}px`
            el.style.transform = `rotateX(${yCurve ?? 0}deg) rotateY(${-(xCurve ?? 0)}deg) scale(${sf})`
            el.style.zIndex = `${zIndex}`
        }
    }

    // The rAF loop always calls the freshest paint closure (props can change
    // without a resize event).
    const paintRef = useRef(paint)
    useLayoutEffect(() => {
        paintRef.current = paint
    })

    // Position once per layout (resize, prop change) before paint.
    useLayoutEffect(() => {
        paint(orbitPhiRef.current)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [W, H, a, b, cosT, sinT, imgW, imgH, n, path, xCurve, yCurve])

    useEffect(() => {
        if (!W || !H || revsPerSec <= 0) return
        // Decorative ambient motion: respect prefers-reduced-motion.
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
        const start = performance.now()
        const startPhi = orbitPhiRef.current
        // Ellipse orientation stays static; images travel along the orbit path
        // at a constant speed set by `speed`.
        const tick = (now: number) => {
            const elapsed = (now - start) / 1000
            orbitPhiRef.current = startPhi + dir * 2 * Math.PI * revsPerSec * elapsed
            paintRef.current(orbitPhiRef.current)
            rafRef.current = requestAnimationFrame(tick)
        }
        rafRef.current = requestAnimationFrame(tick)
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [W, H, revsPerSec, dir])

    return (
        <div
            ref={containerRef}
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
                overflow: "hidden",
                // 3D viewing distance for the orbit tilt.
                perspective: 1200,
            }}
        >
            {/* Whole orbit rotates in 3D by the curve values. +90 X → left
                forward; +90 Y → top forward. Browser depth-sorts, all images
                stay rendered, and image size is untouched. */}
            <div
                ref={orbitRef}
                style={{
                    position: "absolute",
                    inset: 0,
                    transformStyle: "preserve-3d",
                    transform: `rotateY(${xCurve ?? 0}deg) rotateX(${-(yCurve ?? 0)}deg)`,
                }}
            >
                {n > 0 &&
                    items.map((src: string, i: number) => (
                        <div
                            key={i}
                            ref={(el) => {
                                itemRefs.current[i] = el
                            }}
                            style={{
                                position: "absolute",
                                // Initial position; the rAF loop takes over via
                                // direct style writes (no React re-renders).
                                left: 0,
                                top: 0,
                                width: imgW,
                                height: imgH,
                                // Counter-rotate (inverse of the orbit wrapper)
                                // so only the orbit shape curves — images keep
                                // facing the viewer.
                                transform: `rotateX(${yCurve ?? 0}deg) rotateY(${-(xCurve ?? 0)}deg) scale(1)`,
                                borderRadius: radius,
                                overflow: "hidden",
                                backgroundImage: placeholder ? "none" : `url(${src})`,
                                backgroundColor: placeholder ? (i % 2 === 0 ? "#f2762e" : "#d6d2c9") : undefined,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                                boxShadow:
                                    "0 8px 24px rgba(0,0,0,0.25), 0 2px 6px rgba(0,0,0,0.15)",
                                willChange: "transform",
                                pointerEvents: "none",
                                display: placeholder ? "flex" : undefined,
                                alignItems: placeholder ? "center" : undefined,
                                justifyContent: placeholder ? "center" : undefined,
                                color: placeholder && i % 2 === 0 ? "rgba(255,255,255,.86)" : "#78756f",
                                fontFamily: placeholder ? "'Manrope', Inter, sans-serif" : undefined,
                                fontSize: placeholder ? 24 : undefined,
                                fontWeight: placeholder ? 800 : undefined,
                                letterSpacing: placeholder ? "-.08em" : undefined,
                            }}
                        >
                            {placeholder && src}
                        </div>
                    ))}
            </div>
        </div>
    )
}

const COMPONENT_DEFAULTS = {
    images: [
        {
            src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/ed7b1c40-3332-43d8-a9eb-4615ef341b00/w=800",
        },
        {
            src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/bd541261-75be-469c-7dc0-dae0ce81c400/w=800",
        },
        {
            src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/7d4d2641-d6a8-4fef-e85c-b12ed100d500/w=800",
        },
        {
            src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/933a7615-f4b6-4eae-8ed1-705fa0e24400/w=800",
        },
        {
            src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/31afae9c-5ba3-4ec3-2534-ed8198ed1100/w=800",
        },
        {
            src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/859c75ea-953e-489e-be61-91a03a35d700/w=800",
        },
        {
            src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/e60dd7f7-a44f-40a7-df62-095b19cd8700/w=800",
        },
        {
            src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/eec164e9-23f8-4f87-b48a-a208fa806100/w=800",
        },
    ],
    imageWidth: 150,
    imageHeight: 150,
    direction: "anticlockwise",
    path: "curved",
    xCurve: -90,
    yCurve: -90,
    speed: 3,
    rounded: 3,
    orbitUnit: "%",
    orbitWidthPx: 600,
    orbitWidthPct: 60,
}
