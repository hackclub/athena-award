"use client"
import { shineEffect } from "./Header"
export default function Painting({image, description}: {image: string, description: string}){
    return (
        <div className={`h-72 flex flex-col items-center justify-center`}> {/* maybe add small random rotations? */}
            <svg width="100%" height="100%" viewBox="0 0 341 235" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="30" y="20" width="85%" height="80%" fill="white"/>
                <image x="30" y="20" width="85%" height="80%" preserveAspectRatio="none" xlinkHref={image}></image>
                <path fillRule="evenodd" clipRule="evenodd" d="M25.1938 36.9067L12.2657 15.6968L37.6625 0.627096L95.7192 10.1556L273.356 15.0973L314.603 5.64044L335.639 32.0011L322.459 53.9923L322.105 194.194L340.415 214.898L322.346 231.956L294.724 220.198L46.7835 219.45L34.8987 234.253L9.8416 232.369L0.747362 215.15L17.7963 203.06L25.1938 36.9067ZM55.925 27.5461L41.6805 41.3812L39.9304 174.648L46.4993 191.51L293.864 198.002L304.999 182.34L307.604 44.7156L295.714 32.9659L55.925 27.5461Z" fill="url(#paint0_radial_296_193)"/>
                <defs>
                <radialGradient id="paint0_radial_296_193" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(174.435 122.319) rotate(105.184) scale(287.25 354.802)">
                <stop offset="0.345" stopColor="#F4BF4F"/>
                <stop offset="1" stopColor="#EC3750"/>
                </radialGradient>
                </defs>
            </svg>
            <span className = {`hidden sm:inline mx-auto w-max max-w-full px-5 my-4 py-2 ${shineEffect("bg-[#F4BF4F] border-[#F4BF4F]/80 rounded-sm text-gray-600")}`}>
                <span className="-pl-2 pr-2"> • </span>
                {description}
                <span className="pl-2 -pr-2"> • </span>
                </span>
        </div>

    )
}