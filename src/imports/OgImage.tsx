function Frame1() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full whitespace-pre-wrap">
      <p className="font-['3626_Hilt:Regular','Noto_Sans:Regular',sans-serif] leading-[normal] min-w-full not-italic relative shrink-0 text-[#ff614c] text-[82px] w-[min-content]">Hey, My name is Ala’a Ali</p>
      <p className="font-['IBM_Plex_Serif:Regular',sans-serif] leading-[normal] min-w-full not-italic relative shrink-0 text-[42px] text-black w-[min-content]">UX/UI Designer • Illustrator • Facilitator</p>
      <p className="font-['IBM_Plex_Serif:Light_Italic',sans-serif] italic leading-[32px] relative shrink-0 text-[24px] text-black w-[586.622px]">{`"I design apps, platforms, and dashboards that people don't need a manual to use. That's the whole job, really."`}</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[672.854px]">
      <Frame1 />
    </div>
  );
}

export default function OgImage() {
  return (
    <div className="bg-[#fdecd0] content-stretch flex items-center overflow-clip px-[83px] py-[76px] relative rounded-[60px] size-full" data-name="OG image">
      <Frame />
    </div>
  );
}