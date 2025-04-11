export function Tip({title, children}: {title: string, children: React.ReactNode}){
    return (
      <span className = "w-full inline-block my-2 p-3 border border-green-400/40 bg-green-400/40 rounded-lg">
        <span className = "flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 inline mr-2 text-white">
          <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
        </svg>
        <b className = "text-white underline underline-offset-4 decoration-wavy">{title}</b>
        </span>
        <span>{children}</span>
      </span>
    )
}

export function Warning({title, children}: {title: string, children: React.ReactNode}){
  return (
    <span className = "w-full inline-block my-2 p-3 border border-hc-primary bg-black/20 rounded-lg">
      <span className = "flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 inline mr-2 text-hc-primary">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
      </svg>
      <b className = "text-hc-primary underline underline-offset-4 decoration-wavy uppercase">{title}</b>
      </span>
      <span>{children}</span>
    </span>
  )
}


// side quest!
export function Action({title, children}: {title: string, children: React.ReactNode}){
  return (
    <span className = "w-full inline-block my-2 p-3 border border-yellow-400/40 bg-yellow-400/40 rounded-lg">
      <span className = "flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" viewBox="0 0 576 512" className="size-5 inline mr-2"><path d="M0 80l0 48c0 17.7 14.3 32 32 32l16 0 48 0 0-80c0-26.5-21.5-48-48-48S0 53.5 0 80zM112 32c10 13.4 16 30 16 48l0 304c0 35.3 28.7 64 64 64s64-28.7 64-64l0-5.3c0-32.4 26.3-58.7 58.7-58.7L480 320l0-192c0-53-43-96-96-96L112 32zM464 480c61.9 0 112-50.1 112-112c0-8.8-7.2-16-16-16l-245.3 0c-14.7 0-26.7 11.9-26.7 26.7l0 5.3c0 53-43 96-96 96l176 0 96 0z"/></svg>
        <b className = "text-white underline underline-offset-4 decoration-wavy">{title}</b>
      </span>
      <span>{children}</span>
    </span>
  )
}

