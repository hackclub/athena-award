import { STAGES } from "@/app/STAGES";

interface NavigationProps {
  module: string;
  progress: { moduleName: string }[];
  compositeUserModuleData: { moduleName: string }[];
  prevModule: string;
  nextModule: string;
  setModule: (moduleName: (typeof STAGES)[number]["moduleName"]) => void;
  setSelectedProject: (project: string) => void;
  setProjectRetrievalComplete: (status: boolean) => void;
  setPrizeScroller: (value: number) => void;
}

export default function Navigation({
  module,
  progress,
  compositeUserModuleData,
  prevModule,
  nextModule,
  setModule,
  setSelectedProject,
  setProjectRetrievalComplete,
  setPrizeScroller,
}: NavigationProps) {
  let currModuleIdx = STAGES.find((m) => m.moduleName === module)
    ? progress.findIndex((p) => p.moduleName === module)
    : 0;

  return (
    <div className="flex flex-row w-full gap-20">
      <div className="flex gap-2 items-center self-center text-white">
        <button
          onClick={() => {
            currModuleIdx
              ? setModule(prevModule as (typeof STAGES)[number]["moduleName"])
              : setModule(
                  compositeUserModuleData[compositeUserModuleData.length - 1][
                    "moduleName"
                  ] as (typeof STAGES)[number]["moduleName"]
                );
            setSelectedProject("_select#");
            setProjectRetrievalComplete(false);
            setPrizeScroller(0);
          }}
          className="playfair-display italic text-2xl"
        >
          <span className="sr-only">Previous</span>
          <svg
            fillRule="evenodd"
            clipRule="evenodd"
            strokeLinejoin="round"
            strokeMiterlimit="1.414"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="view-back"
            viewBox="0 0 32 32"
            preserveAspectRatio="xMidYMid meet"
            fill="currentColor"
            width="48"
            height="48"
          >
            <g>
              <path d="M19.768,23.89c0.354,-0.424 0.296,-1.055 -0.128,-1.408c-1.645,-1.377 -5.465,-4.762 -6.774,-6.482c1.331,-1.749 5.1,-5.085 6.774,-6.482c0.424,-0.353 0.482,-0.984 0.128,-1.408c-0.353,-0.425 -0.984,-0.482 -1.409,-0.128c-1.839,1.532 -5.799,4.993 -7.2,6.964c-0.219,0.312 -0.409,0.664 -0.409,1.054c0,0.39 0.19,0.742 0.409,1.053c1.373,1.932 5.399,5.462 7.2,6.964l0.001,0.001c0.424,0.354 1.055,0.296 1.408,-0.128Z"></path>
            </g>
          </svg>
        </button>
        <span
          key={`${module}-section-status`}
          className="italic text-lg md:text-2xl"
        >
          {currModuleIdx ? (
            <span>
              Project {currModuleIdx} / {progress.length - 1}
            </span>
          ) : (
            <span>{module}</span>
          )}
        </span>
        <button
          onClick={() => {
            currModuleIdx
              ? setModule(nextModule as (typeof STAGES)[number]["moduleName"])
              : setModule(compositeUserModuleData[1]["moduleName"] as (typeof STAGES)[number]["moduleName"]);
            setSelectedProject("_select#");
            setProjectRetrievalComplete(false);
            setPrizeScroller(0);
          }}
          className="playfair-display italic text-2xl"
        >
          <span className="sr-only">Next</span>
          <svg
            fillRule="evenodd"
            clipRule="evenodd"
            strokeLinejoin="round"
            strokeMiterlimit="1.414"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="view-forward"
            viewBox="0 0 32 32"
            preserveAspectRatio="xMidYMid meet"
            fill="currentColor"
            width="48"
            height="48"
          >
            <g>
              <path d="M12.982,23.89c-0.354,-0.424 -0.296,-1.055 0.128,-1.408c1.645,-1.377 5.465,-4.762 6.774,-6.482c-1.331,-1.749 -5.1,-5.085 -6.774,-6.482c-0.424,-0.353 -0.482,-0.984 -0.128,-1.408c0.353,-0.425 0.984,-0.482 1.409,-0.128c1.839,1.532 5.799,4.993 7.2,6.964c0.219,0.312 0.409,0.664 0.409,1.054c0,0.39 -0.19,0.742 -0.409,1.053c-1.373,1.932 -5.399,5.462 -7.2,6.964l-0.001,0.001c-0.424,0.354 -1.055,0.296 -1.408,-0.128Z"></path>
            </g>
          </svg>
        </button>
        <span className="text-white uppercase text-sm">
          Next: {nextModule}
        </span>
      </div>
    </div>
  );
}