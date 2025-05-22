"use client";
import { useRef, useEffect, MutableRefObject, ReactNode } from "react";

export default function SidePanelBackground({
  children,
}: {
  children: ReactNode;
}) {
  const spotlightRef = useRef<HTMLDivElement>();
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      var rect = document.getElementById("spotlight")!.getBoundingClientRect();
      var x = event.clientX - rect.left; //x position within the element.
      var y = event.clientY - rect.top; //y position within the element.

      spotlightRef.current!.style.background = `radial-gradient(
                  circle at ${x}px ${y}px,
                  rgba(132, 146, 166, 0) 10px,
                  rgba(249, 250, 252, 0.9) 125px
              )`;
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);
  return (
    <div className="h-full overflow-y-auto">
      <div
        id="spotlight"
        className="font-phantom-sans opacity-25 w-full min-h-screen bg-[length:40px_40px] bg-repeat fixed top-0 left-0 z-[-1] bg-[url('https://icons.hackclub.com/api/icons/0xF2A5B2/glyph:rep.svg')]"
      >
        <div
          ref={spotlightRef as MutableRefObject<HTMLDivElement>}
          className="absolute top-0 left-0 right-0 bottom-0 bg-[#ffffff] z-2"
        />
      </div>

      <div className="">{children}</div>
    </div>
  );
}
