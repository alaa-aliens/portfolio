import svgPaths from "./svg-bd3hwetzwh";
import imgImage54 from "figma:asset/2a859171033dd07ade1eb5527484f0697aadb6e3.png";

function Elements() {
  return (
    <div className="absolute inset-[20.83%]" data-name="elements">
      <div className="absolute inset-[-5.36%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.5 15.5">
          <g>
            <path d={svgPaths.pdbb6fe0} id="Vector" stroke="var(--stroke-0, #141B34)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Cancel() {
  return (
    <button className="block cursor-pointer relative shrink-0 size-[24px]" data-name="cancel-01">
      <Elements />
    </button>
  );
}

function Frame4() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center justify-end size-full">
        <div className="content-stretch flex items-center justify-end p-[30px] relative w-full">
          <Cancel />
        </div>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start leading-[normal] relative shrink-0 w-full whitespace-pre-wrap">
      <p className="font-['Playfair_Display:Bold',sans-serif] font-bold relative shrink-0 text-[#ff614c] text-[62px] w-full">WELL, THIS IS AWKWARD</p>
      <p className="font-['Adelle_Sans:Regular',sans-serif] not-italic relative shrink-0 text-[28px] text-black w-full">{`You caught me — this case study isn't ready yet. But the project is 100% real and I'd love to walk you through it.`}</p>
    </div>
  );
}

function Buttons() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center p-[10px] relative shrink-0" data-name="Buttons">
      <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none shadow-[4px_4px_0px_0px_black]" />
      <p className="font-['DM_Serif_Display:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[19px] text-black">Get in Touch</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[21px] items-start relative shrink-0 w-[455.102px]">
      <p className="font-['Adelle_Sans:Regular',sans-serif] leading-[normal] min-w-full not-italic relative shrink-0 text-[18px] text-black w-[min-content] whitespace-pre-wrap">{`Let's connect and I will show you`}</p>
      <Buttons />
    </div>
  );
}

function Frame3() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[57px] items-start px-[110px] relative w-full">
        <Frame1 />
        <Frame />
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="bg-[#f2e3cb] content-stretch flex gap-[24px] h-[117px] items-center justify-center relative shrink-0 w-full">
      <div className="h-[81.819px] relative shrink-0 w-[88.033px]" data-name="image 54">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[255.77%] left-[-34.18%] max-w-none top-[-63.08%] w-[178.2%]" src={imgImage54} />
        </div>
      </div>
      <p className="font-['Adelle_Sans:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[18px] text-black w-[455.102px] whitespace-pre-wrap">{`Meanwhile, I'm working on it... hopefully it will be uploaded before we land a man on Mars.`}</p>
    </div>
  );
}

export default function PopUp() {
  return (
    <div className="bg-[#fdecd0] content-stretch flex flex-col gap-[50px] items-center justify-center overflow-clip relative rounded-[20px] size-full" data-name="Pop Up">
      <Frame4 />
      <Frame3 />
      <Frame2 />
    </div>
  );
}