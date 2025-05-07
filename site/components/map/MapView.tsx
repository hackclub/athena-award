"use client";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { useEffect, useState, useMemo, useCallback } from "react";
import useSWR from "swr";
import { fetcher } from "@/services/fetcher";
import { Error } from "@/components/screens/Modal";
import L from "leaflet";
import { motion } from "framer-motion";
import { useMap } from "react-leaflet";
import {
  ArrowTopRightOnSquareIcon,
  CodeBracketIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

const hcPrimaryIcon = new L.Icon({
  iconUrl:
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="48" viewBox="0 0 32 48"><path fill="%23e33750" stroke="white" stroke-width="2" d="M16 2C8.268 2 2 8.268 2 16c0 9.941 12.5 28 14 28s14-18.059 14-28C30 8.268 23.732 2 16 2z"/><circle fill="white" cx="16" cy="16" r="6"/></svg>',
  iconSize: [32, 48],
  iconAnchor: [16, 48],
  popupAnchor: [0, -48],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
  shadowAnchor: [13, 41],
});

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

function MapFocusHandler({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], 5, { animate: true });
    }
  }, [lat, lng, map]);
  return null;
}

export default function MapView() {
  const { data, error, isLoading } = useSWR("/api/projects", fetcher);

  if (error) return <Error error="Failed to load projects" />;

  const coordinates = useMemo(() => (data ? (data as any) : []), [data]);
  const center = useMemo(() => {
    if (coordinates.length > 0) {
      return [coordinates[0].lat, coordinates[0].long] as [number, number];
    }
    return [0, 0] as [number, number];
  }, [coordinates]);

  const fetchEmojiForProject = async (projectName: string) => {
    try {
      const res = await fetch("https://ai.hackclub.com/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Convert the project name "${projectName}" into a single emoji that best represents it. Only output the emoji, nothing else.`,
            },
          ],
        }),
      });
      const json = await res.json();
      let em = null;
      if (
        json.choices &&
        json.choices[0] &&
        json.choices[0].message &&
        json.choices[0].message.content
      ) {
        em = json.choices[0].message.content.trim();
      }
      return em;
    } catch {
      return null;
    }
  };

  const [selectedProjectIdx, setSelectedProjectIdx] = useState<number | null>(
    null,
  );
  const selectedProject =
    selectedProjectIdx !== null ? coordinates[selectedProjectIdx] : null;
  const [mosaicEmoji, setMosaicEmoji] = useState<string | null>(null);

  useEffect(() => {
    if (
      selectedProject &&
      selectedProject.label &&
      selectedProject.label[0]?.project_name
    ) {
      fetchEmojiForProject(selectedProject.label[0].project_name).then(
        (emoji) => {
          if (emoji) setMosaicEmoji(emoji);
        },
      );
    }
  }, [selectedProject]);

  const mosaicGrid = useMemo(() => {
    if (!mosaicEmoji) return [];
    const grid: { x: number; y: number; delay: number; emoji: string }[] = [];
    const rows = 5,
      cols = 6;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const delay = Math.random() * 6;
        grid.push({ x, y, delay, emoji: mosaicEmoji });
      }
    }
    return grid;
  }, [mosaicEmoji]);

  const mosaicEmojiStyle = useCallback(
    (x: number, y: number, delay: number): React.CSSProperties => ({
      position: "absolute",
      left: `calc(${(x + 0.5) * (100 / 6)}vw - 3rem)`,
      top: `calc(${(y + 0.5) * (100 / 5)}vh - 3rem)`,
      fontSize: "3rem",
      pointerEvents: "none",
      userSelect: "none",
      zIndex: 0,
      opacity: 0.18,
      animation: `mosaic-drift 16s linear infinite`,
      animationDelay: `${delay}s`,
      filter: "blur(0.5px) drop-shadow(0 2px 8px rgba(0,0,0,0.08))",
      transition: "opacity 0.5s",
    }),
    [],
  );

  return (
    <>
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        {mosaicGrid.map((cell, i) => (
          <span key={i} style={mosaicEmojiStyle(cell.x, cell.y, cell.delay)}>
            {cell.emoji}
          </span>
        ))}
        <style>{`
          @keyframes mosaic-drift {
            0% { transform: translateY(0) scale(1) rotate(-8deg); opacity: 0.18; }
            50% { transform: translateY(12vh) scale(1.08) rotate(8deg); opacity: 0.22; }
            100% { transform: translateY(0) scale(1) rotate(-8deg); opacity: 0.18; }
          }
        `}</style>
      </div>

      <div className="w-screen flex flex-col justify-between gap-4 overflow-y-scroll h-screen bg-hc-primary-dull bg-[url(/bg.svg)] p-12 sm:p-16 relative">
        <div className="self-start">
          <a
            className="text-xl sm:text-2xl uppercase text-white font-bold mb-2"
            href="/"
          >
            Athena Award
          </a>
          <h1 className="text-4xl sm:text-6xl uppercase italic text-white font-bold playfair-display">
            World Map
          </h1>
          <div className="text-white">
            Athena Award recipients - and Hack Clubbers - come from all over the
            world! Check out this map to see all the projects which have been
            approved so far.
          </div>
        </div>
        <div className="min-h-0 grow rounded-2xl z-0 shadow-lg w-full border-4 border-white/20 bg-white/10 flex flex-col md:flex-row">
          <div className="w-full h-full col-span-1">
            {isLoading ? (
              <div className="flex items-center justify-center text-white">
                Loading projects... 🌎
              </div>
            ) : (
              <MapContainer
                center={center}
                zoom={2}
                className="h-full w-full rounded-t-2xl md:rounded-r-none"
                scrollWheelZoom={true}
              >
                {selectedProject && (
                  <MapFocusHandler
                    lat={selectedProject.lat}
                    lng={selectedProject.long}
                  />
                )}
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {coordinates.map((coord: any, idx: number) => (
                  <Marker
                    key={idx}
                    position={[coord.lat, coord.long]}
                    icon={hcPrimaryIcon}
                  >
                    <Popup>
                      <div className="bg-hc-primary p-4 rounded-xl border border-white/20 shadow-xl flex flex-col gap-2">
                        {coord.label &&
                        Array.isArray(coord.label) &&
                        coord.label.length > 0 ? (
                          <>
                            <div className="playfair-display italic font-bold text-2xl text-white mb-1">
                              {coord.label[0].project_name_override ||
                                coord.label[0].project_name}
                            </div>
                            {coord.label[0].playable_url && (
                              <div>
                                <a
                                  href={coord.label[0].playable_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="underline !text-white !hover:text-hc-blue transition font-semibold uppercase flex items-center gap-2"
                                >
                                  <ArrowTopRightOnSquareIcon className="w-5 h-5 inline-block" />
                                  Try it out!
                                </a>
                              </div>
                            )}
                            {coord.label[0].code_url && (
                              <div>
                                <a
                                  href={coord.label[0].code_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="underline !text-white !hover:text-hc-blue transition font-semibold uppercase flex items-center gap-2"
                                >
                                  <CodeBracketIcon className="w-5 h-5 inline-block" />
                                  Code
                                </a>
                              </div>
                            )}
                          </>
                        ) : (
                          <span className="text-white/70 italic">No label</span>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            )}
          </div>
          <div className="w-full col-span-1 bg-white/10 border-l border-white/20  p-4 flex flex-col gap-4 overflow-y-scroll">
            <h2 className="text-2xl font-bold text-white">All Projects</h2>
            {isLoading ? (
              <div className="text-white">Loading projects...</div>
            ) : coordinates.length === 0 ? (
              <div className="text-white/70 italic">No projects found.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-scroll">
                {coordinates.map((coord: any, idx: number) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * idx }}
                    className="bg-white/20 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/20 flex flex-col gap-2 hover:scale-[1.03] hover:shadow-2xl transition-all duration-200 cursor-pointer h-full"
                    onClick={() => setSelectedProjectIdx(idx)}
                  >
                    <div className="font-bold text-xl text-white playfair-display italic truncate">
                      {coord.label?.[0]?.project_name_override ||
                        coord.label?.[0]?.project_name ||
                        "Untitled Project"}
                    </div>
                    {coord.label?.[0]?.country && (
                      <div className="text-white/80 text-sm italic mb-1">
                        {coord.label[0].country}
                      </div>
                    )}
                    <div className="flex flex-col gap-1 flex-1">
                      {coord.label?.[0]?.playable_url && (
                        <a
                          href={coord.label[0].playable_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="!text-white !hover:text-hc-blue underline font-semibold flex items-center gap-2"
                        >
                          <ArrowTopRightOnSquareIcon className="w-5 h-5 inline-block" />
                          Try it out
                        </a>
                      )}
                      {coord.label?.[0]?.code_url && (
                        <a
                          href={coord.label[0].code_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="!text-white !hover:text-hc-blue underline font-semibold flex items-center gap-2"
                        >
                          <CodeBracketIcon className="w-5 h-5 inline-block" />
                          Source Code
                        </a>
                      )}
                    </div>
                    {coord.label?.[0]?.slack_id && (
                      <div className="mt-auto pt-2 flex clamp-2">
                        <a
                          href={`https://hackclub.slack.com/team/${coord.label[0].slack_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs md:text-base w-full px-3 py-2 rounded-lg bg-hc-primary-dull text-white font-bold shadow border-2 no-underline border-hc-primary/80 transition-all duration-200 text-center flex items-center justify-center gap-2"
                          style={{ letterSpacing: "0.01em" }}
                        >
                          <ChatBubbleLeftRightIcon className="hidden w-5 h-5 md:inline-block" />
                          Message author
                        </a>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
