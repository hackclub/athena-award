"use client";
import dynamic from "next/dynamic";
import Loading from "@/app/loading";

const LazyMap = dynamic(() => import("@/components/map/MapView"), {
  ssr: false,
  loading: () => <Loading />,
});
export default function Map() {
  return <LazyMap />;
}
