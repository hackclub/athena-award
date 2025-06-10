import { Variants } from "motion/react";

export const introResources = [
  {
    name: "Learn to make a website with Tribute 🗽",
    id: "tribute",
    link: "https://tribute.athena.hackclub.com",
  },
  {
    name: "Level up your website with Express 👾",
    id: "express",
    link: "https://express.athena.hackclub.com",
  },
  {
    name: "Make a video game with Sprig 🪴",
    id: "sprig",
    link: "https://sprig.hackclub.com",
  },
  {
    name: "Make sine wave art and music with Oscillart 🎶",
    id: "oscillart",
    link: "https://oscillart.athena.hackclub.com",
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
