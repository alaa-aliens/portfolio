import svgPaths from "./svg-13ftigngd4";

function Image16Vectorized() {
  return (
    <div className="h-[114px] relative shrink-0 w-[196px]" data-name="image 16 [Vectorized]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 196 114">
        <g id="image 16 [Vectorized]">
          <path d={svgPaths.p1111e00} fill="var(--fill-0, #FE6150)" id="Vector" />
          <path d={svgPaths.p29c0c400} fill="var(--fill-0, #FE6150)" id="Vector_2" />
          <path d={svgPaths.p197137c0} fill="var(--fill-0, #FE6150)" id="Vector_3" />
          <path d={svgPaths.p26562400} fill="var(--fill-0, #FE614F)" id="Vector_4" />
          <path d={svgPaths.pcc7aaa0} fill="var(--fill-0, #FE6150)" id="Vector_5" />
          <path d={svgPaths.p3783c3c0} fill="var(--fill-0, #FE6150)" id="Vector_6" />
        </g>
      </svg>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col h-[114.286px] items-center justify-center overflow-clip px-[28.571px] py-[6.429px] relative shrink-0 w-[200px]">
      <Image16Vectorized />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[14px] items-center relative shrink-0 w-[237px]">
      <Frame1 />
      <p className="font-['IBM_Plex_Serif:Regular',sans-serif] leading-[normal] min-w-full not-italic relative shrink-0 text-[22px] text-black text-center w-[min-content] whitespace-pre-wrap">Doodles Drawn (and Still Not Enough)</p>
    </div>
  );
}

function Frame8() {
  return (
    <div className="h-[94px] relative shrink-0 w-[116px]">
      <div className="absolute inset-[-0.37%_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 116 94.699">
          <g id="Frame 124">
            <path d={svgPaths.p1f0a7d00} fill="var(--fill-0, #FE614F)" id="Vector" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col h-[114.286px] items-center justify-center overflow-clip px-[28.571px] py-[6.429px] relative shrink-0 w-[200px]">
      <Frame8 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-col gap-[14px] items-center relative shrink-0 w-[237px]">
      <Frame2 />
      <p className="font-['IBM_Plex_Serif:Regular',sans-serif] leading-[normal] min-w-full not-italic relative shrink-0 text-[22px] text-black text-center w-[min-content] whitespace-pre-wrap">{`Daughters Who Think I "Just Draw"`}</p>
    </div>
  );
}

function Image15Vectorized() {
  return (
    <div className="h-[91.429px] relative shrink-0 w-[114.286px]" data-name="image 15 [Vectorized]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 114.286 91.4286">
        <g id="image 15 [Vectorized]">
          <path d={svgPaths.p200ef900} fill="var(--fill-0, #FE6150)" id="Vector" />
          <path d={svgPaths.p1f0b5d00} fill="var(--fill-0, #FE6150)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-col h-[114.286px] items-center justify-center overflow-clip px-[28.571px] py-[6.429px] relative shrink-0 w-[200px]">
      <Image15Vectorized />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-col gap-[14px] items-center relative shrink-0 w-[237px]">
      <Frame3 />
      <p className="font-['IBM_Plex_Serif:Regular',sans-serif] leading-[normal] min-w-full not-italic relative shrink-0 text-[22px] text-black text-center w-[min-content] whitespace-pre-wrap">PlayStation Generations Survived</p>
    </div>
  );
}

function Frame7() {
  return (
    <div className="h-[114.286px] relative shrink-0 w-[200px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 200 114.286">
        <g id="Frame 7">
          <path d={svgPaths.p34feaf00} fill="var(--fill-0, #FF614C)" fillOpacity="0.952941" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex flex-col gap-[14px] items-center relative shrink-0 w-[237px]">
      <Frame7 />
      <p className="font-['IBM_Plex_Serif:Regular',sans-serif] leading-[normal] min-w-full not-italic relative shrink-0 text-[22px] text-black text-center w-[min-content] whitespace-pre-wrap">Cups of Coffee to Stay Alive</p>
    </div>
  );
}

export default function Stats() {
  return (
    <div className="content-stretch flex gap-[90px] items-start justify-center relative size-full" data-name="Stats">
      <Frame />
      <Frame4 />
      <Frame5 />
      <Frame6 />
    </div>
  );
}