"use client";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

export function ResourceCard({
  image,
  name,
  description,
  link,
  options,
}: {
  image: string;
  name: string;
  description: string;
  link: string;
  options?: {
    backgroundColor: string;
  };
}) {
  const router = useRouter();
  const handleClick = () => {
    router.push(link);
  };
  return (
    <div
      className="not-prose basis-1/3 grow group w-full lg:flex hover:scale-105 transition shadow-md relative cursor-pointer rounded-lg"
      style={{
        backgroundColor: options?.backgroundColor || "#FFF",
      }}
      title={`Programming Resource at ${link}`}
      onClick={handleClick}
    >
      {image ? (
        <div
          className="h-auto w-32 flex-none bg-cover rounded-l-lg text-center overflow-hidden shrink-0"
          style={{ backgroundImage: `url(${image})` }}
        />
      ) : null}
      <div className="rounded-r-lg p-4 flex flex-col justify-between leading-normal w-full">
        <div className="absolute top-0 right-0 p-4">
          <span className="transition group-hover:translate-x-6 group-hover:translate-y-6">
            <img
              src="https://icons.hackclub.com/api/icons/hackclub-red/external"
              className="size-[32px]"
              alt=""
            />
          </span>
        </div>
        <div>
          <div className="text-gray-900 font-bold text-xl">{name}</div>
          <p className="text-gray-700 text-base">{description}</p>
        </div>
      </div>
    </div>
  );
}

export function ResourceSection({ children }: { children: ReactNode }) {
  return (
    <div>
      <div className="text-2xl text-hc-primary font-bold mb-2 mt-6">
        Resources
      </div>
      <div className="flex flex-col flex-wrap sm:flex-row gap-4 w-full">
        {children}
      </div>
    </div>
  );
}
