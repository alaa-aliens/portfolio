import React from "react";
import svgPaths from "../../imports/svg-drsth3odo8";

/* Hand-drawn folder used for every project card. The coloured "card" peeks out of the folder on hover. */
// Reusable folder illustration
export function FolderIllustration({ color, logoContent, isHovered }: { color: string; logoContent: React.ReactNode; isHovered?: boolean }) {
  const filterId = React.useId().replace(/:/g, '');
  return (
    <div className="h-[130px] w-[175px] relative">
      {/* Folder back tab — sits behind everything */}
      <div
        className="absolute w-[137.9px] h-[112.7px]"
        style={{
          left: 'calc(50% - 6.44px)',
          top: 'calc(50% + 0.24px)',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <svg className="block size-full" fill="none" viewBox="0 0 137.9 112.7">
          <path d={svgPaths.p8308772} fill="#EDDCBF" />
          <path d={svgPaths.p986f000} fill="#FF604C" fillOpacity="0.988" />
        </svg>
      </div>

      {/* Logo card — peeks out above the folder front on hover */}
      <div
        className="absolute w-[120px] h-[70.5px] rounded flex items-center justify-center overflow-hidden transition-[top] duration-300 ease-in-out"
        style={{
          backgroundColor: color,
          left: 'calc(50% - 2px)',
          top: isHovered ? 'calc(50% - 30px)' : 'calc(50% - 13.5px)',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {logoContent}
      </div>

      {/* Folder front flap — scales down from bottom on hover */}
      <div
        className="absolute w-[147px] h-[93.1px] transition-transform duration-300 ease-in-out"
        style={{
          left: 'calc(50% + 0.98px)',
          top: 'calc(50% + 10.04px)',
          transform: `translate(-50%, -50%) scaleY(${isHovered ? 0.78 : 1})`,
          transformOrigin: 'center bottom',
        }}
      >
        <div className="absolute" style={{ inset: '-23.31% -9.52% -6.77% -9.52%' }}>
          <svg className="block size-full" fill="none" viewBox="0 0 175 121.1">
            <g filter={`url(#${filterId})`}>
              <path d={svgPaths.p1cc33f00} fill="#FDECD0" />
              <path d={svgPaths.pba08900} fill="#FE604F" />
            </g>
            <defs>
              <filter id={filterId} colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="121.1" width="175" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dy="-7.7" />
                <feGaussianBlur stdDeviation="7" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow" mode="normal" result="shape" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}

// Simple text logo
export function TextLogo({ text, bgColor, textColor = "white", fontSize = "14px", isHovered }: { text: string; bgColor: string; textColor?: string; fontSize?: string; isHovered?: boolean }) {
  return (
    <FolderIllustration
      color={bgColor}
      isHovered={isHovered}
      logoContent={
        <span className="font-['IBM_Plex_Serif'] font-bold" style={{ color: textColor, fontSize }}>
          {text}
        </span>
      }
    />
  );
}

// BravoBravo SVG logo
export function BravoBravoLogo({ isHovered }: { isHovered?: boolean }) {
  return (
    <FolderIllustration
      color="#54c8e8"
      isHovered={isHovered}
      logoContent={
        <svg className="w-[77px] h-[26px]" fill="none" viewBox="0 0 77 26">
          {/* Dark outlines group 1 */}
          <path d={svgPaths.p19c3b700} fill="#002A3A" />
          <path d={svgPaths.p1d5aba32} fill="#002A3A" />
          <path d={svgPaths.p697b700} fill="#002A3A" />
          <path d={svgPaths.p16d03a00} fill="#002A3A" />
          <path d={svgPaths.p3d4d4570} fill="#002A3A" />
          <path d={svgPaths.p17553600} fill="#002A3A" />
          <path d={svgPaths.p3128ce80} fill="#002A3A" />
          <path d={svgPaths.p3209dc00} fill="#002A3A" />
          <path d={svgPaths.p3084b400} fill="#002A3A" />
          {/* Stars */}
          <path d={svgPaths.p2bba7c0} fill="#FFAE3B" />
          <path d={svgPaths.p3e809f00} fill="#FFAE3B" />
          <path d={svgPaths.p15b18300} fill="#FFAE3B" />
          {/* Dark outlines group 2 */}
          <path d={svgPaths.p2fa9ba80} fill="#002A3A" />
          <path d={svgPaths.p9696d80} fill="#002A3A" />
          <path d={svgPaths.p1af08f00} fill="#002A3A" />
          <path d={svgPaths.p1f5a8500} fill="#002A3A" />
          <path d={svgPaths.p2a8f3c00} fill="#002A3A" />
          <path d={svgPaths.p1a24bf40} fill="#002A3A" />
          <path d={svgPaths.p3cd3a900} fill="#002A3A" />
          <path d={svgPaths.pb316880} fill="#002A3A" />
          <path d={svgPaths.pb320d70} fill="#002A3A" />
          <path d={svgPaths.p3f9a1200} fill="#002A3A" />
          <path d={svgPaths.p38998600} fill="#002A3A" />
          <path d={svgPaths.p3d909500} fill="#002A3A" />
          <path d={svgPaths.pb838000} fill="#002A3A" />
          <path d={svgPaths.p2b148700} fill="#002A3A" />
          <path d={svgPaths.p25ec88f0} fill="#002A3A" />
          <path d={svgPaths.p32092600} fill="#002A3A" />
          <path d={svgPaths.p3c46c070} fill="#002A3A" />
          <path d={svgPaths.p27cd100} fill="#002A3A" />
          <path d={svgPaths.p27469400} fill="#002A3A" />
          <path d={svgPaths.p19366000} fill="#002A3A" />
          <path d={svgPaths.p3f41c480} fill="#002A3A" />
          <path d={svgPaths.p16721b00} fill="#002A3A" />
          <path d={svgPaths.p3e1e5040} fill="#002A3A" />
          <path d={svgPaths.p3c201f80} fill="#002A3A" />
          <path d={svgPaths.p31292200} fill="#002A3A" />
          <path d={svgPaths.p30e38400} fill="#002A3A" />
          <path d={svgPaths.p3725a000} fill="#002A3A" />
          <path d={svgPaths.p77fb2c0} fill="#002A3A" />
          <path d={svgPaths.p16b37680} fill="#002A3A" />
          <path d={svgPaths.p11d63500} fill="#002A3A" />
          {/* White fills */}
          <path d={svgPaths.p21c68300} fill="white" />
          <path d={svgPaths.pdf92400} fill="white" />
          <path d={svgPaths.p3aaf1880} fill="white" />
          <path d={svgPaths.p1d86f580} fill="white" />
          <path d={svgPaths.p31961370} fill="white" />
          <path d={svgPaths.p310c87c0} fill="white" />
          <path d={svgPaths.p2db49900} fill="white" />
          <path d={svgPaths.p16311f00} fill="white" />
          <path d={svgPaths.p62ec880} fill="white" />
          <path d={svgPaths.pfb2c280} fill="white" />
        </svg>
      }
    />
  );
}

// Carseer SVG logo
export function CarseerLogo({ isHovered }: { isHovered?: boolean }) {
  return (
    <FolderIllustration
      color="#f93"
      isHovered={isHovered}
      logoContent={
        <svg className="w-[32px] h-[20px]" fill="none" viewBox="0 0 36.7787 23.0267">
          <g>
            <mask id="carseerMask" maskUnits="userSpaceOnUse" style={{ maskType: "luminance" as const }} x="8" y="0" width="29" height="15">
              <path clipRule="evenodd" d={svgPaths.p18847200} fill="white" fillRule="evenodd" />
            </mask>
            <g mask="url(#carseerMask)">
              <path clipRule="evenodd" d={svgPaths.p274cfc00} fill="black" fillRule="evenodd" />
            </g>
          </g>
          <path clipRule="evenodd" d={svgPaths.p1bbcf800} fill="white" fillRule="evenodd" />
        </svg>
      }
    />
  );
}

// Image logo
export function ImageLogo({ src, bgColor, imgClass = "w-16 h-6 object-contain", isHovered }: { src: string; bgColor: string; imgClass?: string; isHovered?: boolean }) {
  return (
    <FolderIllustration
      color={bgColor}
      isHovered={isHovered}
      logoContent={<img alt="" src={src} className={imgClass} />}
    />
  );
}

/* Brand marks on their own (used by the project cards). */
export function BravoBravoMark({ className = "w-[77px] h-[26px]" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 77 26">
      {/* Dark outlines group 1 */}
      <path d={svgPaths.p19c3b700} fill="#002A3A" />
      <path d={svgPaths.p1d5aba32} fill="#002A3A" />
      <path d={svgPaths.p697b700} fill="#002A3A" />
      <path d={svgPaths.p16d03a00} fill="#002A3A" />
      <path d={svgPaths.p3d4d4570} fill="#002A3A" />
      <path d={svgPaths.p17553600} fill="#002A3A" />
      <path d={svgPaths.p3128ce80} fill="#002A3A" />
      <path d={svgPaths.p3209dc00} fill="#002A3A" />
      <path d={svgPaths.p3084b400} fill="#002A3A" />
      {/* Stars */}
      <path d={svgPaths.p2bba7c0} fill="#FFAE3B" />
      <path d={svgPaths.p3e809f00} fill="#FFAE3B" />
      <path d={svgPaths.p15b18300} fill="#FFAE3B" />
      {/* Dark outlines group 2 */}
      <path d={svgPaths.p2fa9ba80} fill="#002A3A" />
      <path d={svgPaths.p9696d80} fill="#002A3A" />
      <path d={svgPaths.p1af08f00} fill="#002A3A" />
      <path d={svgPaths.p1f5a8500} fill="#002A3A" />
      <path d={svgPaths.p2a8f3c00} fill="#002A3A" />
      <path d={svgPaths.p1a24bf40} fill="#002A3A" />
      <path d={svgPaths.p3cd3a900} fill="#002A3A" />
      <path d={svgPaths.pb316880} fill="#002A3A" />
      <path d={svgPaths.pb320d70} fill="#002A3A" />
      <path d={svgPaths.p3f9a1200} fill="#002A3A" />
      <path d={svgPaths.p38998600} fill="#002A3A" />
      <path d={svgPaths.p3d909500} fill="#002A3A" />
      <path d={svgPaths.pb838000} fill="#002A3A" />
      <path d={svgPaths.p2b148700} fill="#002A3A" />
      <path d={svgPaths.p25ec88f0} fill="#002A3A" />
      <path d={svgPaths.p32092600} fill="#002A3A" />
      <path d={svgPaths.p3c46c070} fill="#002A3A" />
      <path d={svgPaths.p27cd100} fill="#002A3A" />
      <path d={svgPaths.p27469400} fill="#002A3A" />
      <path d={svgPaths.p19366000} fill="#002A3A" />
      <path d={svgPaths.p3f41c480} fill="#002A3A" />
      <path d={svgPaths.p16721b00} fill="#002A3A" />
      <path d={svgPaths.p3e1e5040} fill="#002A3A" />
      <path d={svgPaths.p3c201f80} fill="#002A3A" />
      <path d={svgPaths.p31292200} fill="#002A3A" />
      <path d={svgPaths.p30e38400} fill="#002A3A" />
      <path d={svgPaths.p3725a000} fill="#002A3A" />
      <path d={svgPaths.p77fb2c0} fill="#002A3A" />
      <path d={svgPaths.p16b37680} fill="#002A3A" />
      <path d={svgPaths.p11d63500} fill="#002A3A" />
      {/* White fills */}
      <path d={svgPaths.p21c68300} fill="white" />
      <path d={svgPaths.pdf92400} fill="white" />
      <path d={svgPaths.p3aaf1880} fill="white" />
      <path d={svgPaths.p1d86f580} fill="white" />
      <path d={svgPaths.p31961370} fill="white" />
      <path d={svgPaths.p310c87c0} fill="white" />
      <path d={svgPaths.p2db49900} fill="white" />
      <path d={svgPaths.p16311f00} fill="white" />
      <path d={svgPaths.p62ec880} fill="white" />
      <path d={svgPaths.pfb2c280} fill="white" />
    </svg>
  );
}

export function CarseerMark({ className = "w-[32px] h-[20px]" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 36.7787 23.0267">
      <g>
        <mask id="carseerMask" maskUnits="userSpaceOnUse" style={{ maskType: "luminance" as const }} x="8" y="0" width="29" height="15">
          <path clipRule="evenodd" d={svgPaths.p18847200} fill="white" fillRule="evenodd" />
        </mask>
        <g mask="url(#carseerMask)">
          <path clipRule="evenodd" d={svgPaths.p274cfc00} fill="black" fillRule="evenodd" />
        </g>
      </g>
      <path clipRule="evenodd" d={svgPaths.p1bbcf800} fill="white" fillRule="evenodd" />
    </svg>
  );
}
