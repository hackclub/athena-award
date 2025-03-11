// possibly defunct
import React, { MouseEventHandler, TouchEventHandler, useState } from 'react';

export default function DraggableMap() {
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: -125, y: -125 });
  const [startPosition, setStartPosition] = useState({ x: -125, y: -125 });

  const handleDragStart = (event:any) => {
    setDragging(true);
    setStartPosition({
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handleDrag = (event:any) => {
    if (!dragging) return;

    const offsetX = event.clientX - startPosition.x;
    const offsetY = event.clientY - startPosition.y;

    const newX = Math.min(Math.max(position.x + offsetX, -250), 0);
    const newY = Math.min(Math.max(position.y + offsetY, -250), 0);

    setPosition({ x: newX, y: newY });

    setStartPosition({
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handleDragEnd = () => {
    setDragging(false);
  };

  return (
    <img
      src="/map.png"
      alt="map"
      className="max-w-[200vw] w-screen h-auto scale-125 will-change-transform"
      onMouseDown={handleDragStart}
      onMouseMove={handleDrag}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={handleDragStart}
      onTouchMove={handleDrag}
      onTouchEnd={handleDragEnd}
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      draggable="false"
    />
  );
}