import { AnimatePresence, motion } from 'motion/react';
import { useContext, useEffect } from 'react';
import { UXEventContext } from '@/components/context/UXStages';

export default function Modal({uxEventName, children, uxEvent, setUXEvent, className, customClear}: {uxEventName: string, children: React.ReactNode, uxEvent: string, setUXEvent: (value: any) => void, className?: string, customClear?: any}){
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
          <div className={`w-full h-[85vh] max-w-5xl max-md:overflow-auto transform bg-hc-primary-dull text-left align-middle shadow-xl transition-all p-8 gap-4 text-white ${className}`}>
          {children}
          </div>
          </motion.div>
          </motion.div>
            
        )
    }
    </AnimatePresence>
    )}