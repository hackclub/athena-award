'use client';

import { useEffect, useRef, useState } from 'react';
import { Application } from '@splinetool/runtime';

const ThreeJSScene = ({ shouldAnimate = false, scene }: { shouldAnimate?: boolean, scene: `https://prod.spline.design/${string}`}) => {
  const mountRef = useRef<HTMLDivElement>(null!);
  const [app, setApp] = useState<Application | null>(null);
  
  useEffect(() => {
    const canvas = document.getElementById('#canvas3d') as HTMLCanvasElement

    if (canvas) {
      const app = new Application(canvas);
      app.load(scene).then(() => {
        if (!shouldAnimate) {
          app.stop();
        }
      });

      setApp(app);
    }

    return () => {
      app?.dispose();
    }
  }, [shouldAnimate]);

  return <div className="w-screen h-screen overflow-hidden flex justify-center items-center fixed top-0 left-0 z-0">
    <canvas id="#canvas3d" className="w-screen h-screen"/>;
  </div>
};

export default ThreeJSScene;
