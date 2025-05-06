import { AnimatePresence, motion } from 'motion/react';
import { useContext, useEffect } from 'react';
import { UXEventContext } from '@/components/context/UXStages';
import { FaXmark } from 'react-icons/fa6';

interface customHeader {
  icon: string,
  heading: string,
}


export default function Modal({uxEventName, customHeader, children, uxEvent, setUXEvent, className, customClear}: {uxEventName: string, customHeader?: customHeader, children: React.ReactNode, uxEvent: string, setUXEvent: (value: any) => void, className?: string, customClear?: any}){
    const clear = () => {
        customClear();
        setUXEvent("map");
    }
    const modalIsOpen = uxEvent === uxEventName
    useEffect(() => { 
    if (modalIsOpen) {
        document.body.classList.add("overflow-y-hidden")
    } else {
        document.body.classList.remove("overflow-y-hidden")
    }}
    ,[modalIsOpen])
          
    return (
    <AnimatePresence>
    {modalIsOpen && (
      <motion.div
        className="fixed inset-0 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="fixed inset-0 bg-black/35"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={clear}
        />

        {/* Modal Panel */}
        <motion.div
          className="fixed inset-0 flex items-center justify-center p-4 text-center"
          initial={{ opacity: 0, scale: 0.95, y: "50vh" }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: "50vh" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className={`w-full h-[85vh] ${customHeader ? "flex flex-col" : "max-md:overflow-auto"} max-w-5xl transform bg-hc-primary-dull text-left align-middle shadow-xl transition-all p-8 gap-4 text-white ${className}`}>
            { customHeader ?
            <>
              <div className="self-start *:align-middle flex gap-3 w-full align-middle md:sticky">
                <div className="*:align-middle w-full h-fit bg-black/25 p-2 rounded flex gap-4">
                  <img src={`https://icons.hackclub.com/api/icons/hackclub-red/${customHeader.icon}`} className="size-[32px] self-center align-middle" alt="Profile" />
                  <div className="self-center align-middle text-xl sm:text-3xl playfair-display font-bold italic">{customHeader.heading}</div>
                </div>
                <button className="shrink-0" onClick={() => setUXEvent('map')}>
                  <FaXmark className="size-8 md:size-14 text-white" />
                </button>
              </div>
                          <div className = {`overflow-y-scroll`}>
                          {children}
                        </div>
              </>
            
            : <>{children}</>}


          </div>
          </motion.div>
          </motion.div>
            
        )
    }
    </AnimatePresence>
    )}