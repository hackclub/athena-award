"use client";
import "./styles.css";
import { ReactNode } from "react";

export default function MDXStyleProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="mdx-prose prose lg:prose-xl min-w-full">{children}</div>
  );
}
