// defunct
'use client';

import { useEffect, useRef, useState } from 'react';
import { Application } from '@splinetool/runtime';
import { AnimatePresence, motion } from 'motion/react';

const Background = ({ shouldAnimate = false, sourceScene }:{ shouldAnimate: boolean, sourceScene: string }) => {
  const appRef = useRef<Application | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(shouldAnimate);
  
  useEffect(() => {
    const canvas = document.getElementById('canvas3d') as HTMLCanvasElement
    if (!canvas || appRef.current) return;

    const app = new Application(canvas);
    appRef.current = app;
    setIsTransitioning(true);

    app.load(sourceScene).then(() => {
      if (!shouldAnimate) {
        setTimeout(() => app.stop(), 1000)
      }
    }).then(() => {
      setIsTransitioning(false);
    }).catch((e) => { console.error(e) });

    if (shouldAnimate) {
      app.play();
    }

    return () => {
      app?.dispose();
      appRef.current = null;
    }
  }, [sourceScene]);

  useEffect(() => {
    if (shouldAnimate) {
      appRef.current?.play();
    } else {
      appRef.current?.stop();
    }
  }, [shouldAnimate]);

  return <div className="w-screen h-screen overflow-hidden flex justify-center items-center fixed top-0 left-0 z-0 pointer-events-auto">
    <AnimatePresence>
      {isTransitioning && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5, ease: 'circInOut' }} className="fixed top-0 left-0 w-screen h-screen bg-black z-10" />}
    </AnimatePresence>
    <canvas id="canvas3d" className="!w-[112vw] !h-[112vh]"/>;
  </div>
};

export default Background;
