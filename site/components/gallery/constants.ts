import { Variants } from "motion/react";

export const introResources = [
  {
    name: "Learn to make a website with Tribute 🗽",
    id: "tribute",
    link: "https://tribute.athena.hackclub.com",
  },
  {
    name: "Create a video game with Sprig 🎮",
    id: "sprig",
    link: "https://sprig.hackclub.com",
  },
  {
    name: "Design a PCB with Onboard ⚡",
    id: "onboard",
    link: "https://onboard.hackclub.com",
  },
];

export const slidingUpVariant: Variants = {
  hidden: {
    y: 10,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export const slidingParentVariant: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren", //use this instead of delay
      staggerChildren: 0.2, //apply stagger on the parent tag
    },
  },
}; 