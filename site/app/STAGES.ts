import IdeaGenerator from "../components/panels/add-ons/IdeaGenerator"

export interface UserStageData {
  name: string,
  id: string,
  complete: boolean,
};

export interface UserModuleData {
  moduleName: string
}

export interface BaseModule {
  moduleName: string,
  visuals: {
    name: string,
    artist: string,
    src: string // the background image
    scene: `https://prod.spline.design/${string}` // for the interactive worldly component
    accents: {
      primary: string,
      secondary: string,
    }
  },
  completionRewards: {
    name: string,
    id: string,
    description: string,
  }[]
}

export const STAGES = [
  {
    moduleName: 'Start hacking',
    description: "This is the first project you will be working on. It is a great way to get started with the Athena Award.\nDon't know where to start? Explore the painting for resources!",
    visuals: {
      name: 'Vista from a Grotto',
      artist: 'David Teniers the Younger',
      src: '/vista.jpg', // the background image
      // 
      scene: 'https://prod.spline.design/A3EcLirhCciwn3lU/scene.splinecode', // for the interactive worldly component
      accents: {
        primary: 'bg-rose-950',
        secondary: 'bg-red-900/30',
        tertiary: 'bg-red-900/40'
      }
    },
    actions: [
      {
        id: 'stage1-resources',
        name: 'Resources',
        x: 30,
        y: 35,
        component: null,
        resources: [
          { name: 'Hack Club Slack', description: 'Hack Club has a bustling online Slack community with tens of thousands of active teenagers coding, just like you!', link: 'https://hackclub.com/slack', image: "https://cloud-j0p07nviw-hack-club-bot.vercel.app/0image.png"},
          { name: 'Boba Drops', description: 'Boba Drops is a Hack Club YSWS (You-Ship, We-Ship) where you build a website, and get free boba for your hard work! Click the link to learn more.', link: 'https://boba.hackclub.com', image: "https://hc-cdn.hel1.your-objectstorage.com/s/v3/3175ad05f85a89c42e334cca3a038675bec6c631_image.png" },
          { name: 'Sprig', description: 'Sprig is another Hack Club YSWS where you build a game with Hack Club\'s open-source Sprig game engine, and get a free Sprig console you can play your game on!', link: 'https://sprig.hackclub.com', image: "https://hc-cdn.hel1.your-objectstorage.com/s/v3/f6e53117253b1f6e00d3c8d3e47baa2826f74aa8_image.png"},
          { name: 'OnBoard', description: 'If you\'re interested in hardware or looking to get started, design a circuit board and Hack Club will give you a $100 grant to build it!', link: 'https://hackclub.com/onboard', image: "https://hc-cdn.hel1.your-objectstorage.com/s/v3/73b41e38db39e5f6bd0321de836bccb0f6da2716_image.png" },
        ],
        icon: 'magnifying-glass',
      },
      {
        id: 'stage1-generator',
        name: 'Idea Generating',
        x: 60,
        y: 70,
        component: IdeaGenerator,
        resources: [],

        icon: 'lightbulb',
      },
    ],
    completionRewards: [{
      name: 'Lorem ipsum!',
      id: 'lorem-ipsum',
      description: 'This is a really cool pending reward! Go out there and change the world.',
    }],
  },
  {
    moduleName: 'Your second project',
    description: 'This is the second project you will be working on. Take things up a notch! Try something new, or become more advanced in something you made before.',
    visuals: {
      name: 'The Ponte Salario',
      artist: 'Hubert Robert',
      src: '/ponte-salario.jpg', // the background image
      scene: 'https://prod.spline.design/0vuYDA6geatVNNiC/scene.splinecode', // for the interactive worldly component
      accents: {
        primary: 'bg-sky-950',
        secondary: 'bg-sky-900/30',
        tertiary: 'bg-sky-950/40'
      }
    },
    actions: [
      {
        id: 'stage2-resources',
        name: 'Resources',
        x: 80,
        y: 60,
        component: null,
        resources: [
          { name: 'Hack Club YSWS', description: 'Hack Club runs several You-Ship-We-Ship (YSWS) programs that encourage you to build different kinds of projects (ex. websites, games, and hardware projects) in exchange for completely free stuff in return!', link: 'https://ysws.hackclub.com', image: "https://hc-cdn.hel1.your-objectstorage.com/s/v3/fb7308e47eb968083aa5902af086bcadc5fdd8cc_image.png" },
          { name: 'Jams', description: "Want to build something cool? Don't know how to do it? Check out Jams, a series of workshops that show you how to build new things.", link: 'https://jams.hackclub.com', image: "https://hc-cdn.hel1.your-objectstorage.com/s/v3/dbe38e8eae57fb80ea9d4269c6efba40e7585ed9_image.png"},
        ],
        icon: 'magnifying-glass'
      },
    ],
    completionRewards: [{
      name: 'Lorem ipsum!',
      id: 'lorem-ipsum',
      description: 'This is a really cool reward! Go out there and change the world.',
    }],
  }
] as const;