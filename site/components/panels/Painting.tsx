"use client";
import { Tooltip } from "react-tooltip";
import { shineEffect } from "./Header";
export default function Painting({
  image,
  index,
  tooltip,
  description,
  descriptionBottom,
  link,
  className,
  showCaptionOnSmall = false,
}: {
  image: string;
  index?: string;
  description: string;
  descriptionBottom?: string;
  link?: string;
  className?: string;
  tooltip?: string;
  showCaptionOnSmall?: boolean;
}) {
  return (
    <>
      <Tooltip id={index} place="top" className="max-w-96 z-70" />
      <div
        data-tooltip-id={index}
        data-tooltip-content={tooltip}
        className={`h-42 sm:h-80 flex flex-col items-center justify-center ${className}`}
      >
        {" "}
        {/* maybe add small random rotations? */}
        <a target="_blank" className="text-black no-underline">
          <span
            className={`${showCaptionOnSmall ? "inline" : "hidden sm:inline"} text-sm sm:text-base mx-auto w-max max-w-full px-5 my-4 py-2 ${shineEffect("bg-[#F4BF4F] border-[#F4BF4F]/80 rounded-sm text-gray-600")}`}
          >
            <span className="hidden lg:inline -pl-2 pr-2"> • </span>
            {description}
            <span className="hidden lg:inline pl-2 -pr-2"> • </span>
          </span>
        </a>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 202 167"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="10" y="10" width="85%" height="85%" fill="white" />
          <image
            x="10"
            y="10"
            width="85%"
            height="85%"
            xlinkHref={image}
          ></image>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M179.544 164.648L196.305 158.93L201.89 135.674L190.944 128.071L190.944 39.5193L195.847 24.7221L189.345 10.5846L173.664 7.05647L156.662 9.10768L39.0272 9.10768L23.9131 0.000131933L5.09624 7.05647L-1.30231e-06 27.0495L8.6244 39.5193L8.6244 128.071L-1.30231e-06 137.207L5.09624 158.93L24.6972 167L42.8363 158.93L165.624 158.93L179.544 164.648ZM16.8446 135.674L29.1683 147.973L165.624 147.973L177.948 135.674L177.948 31.2456L165.624 18.9467L29.1683 18.9467L16.8446 31.2456L16.8446 135.674Z"
            fill="#F4BF4F"
          />
        </svg>
        {descriptionBottom && (
          <a target="_blank" className="text-black no-underline" href={link}>
            <span
              className={`${showCaptionOnSmall ? "inline" : "hidden sm:inline"} text-sm sm:text-base mx-auto w-max max-w-full px-5 my-4 py-2 ${shineEffect("bg-[#F4BF4F] border-[#F4BF4F]/80 rounded-sm text-gray-600")}`}
            >
              <span className="hidden lg:inline -pl-2 pr-2"> • </span>
              {descriptionBottom}
              <span className="hidden lg:inline pl-2 -pr-2"> • </span>
            </span>
          </a>
        )}
      </div>
    </>
  );
}
