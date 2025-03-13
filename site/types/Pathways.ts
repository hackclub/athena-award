// TODO: make it so you can switch between the landscape with all of the interactive content + the map menu

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
    moduleName: 'Your first project',
    visuals: {
      name: 'Vista from a Grotto',
      artist: 'David Teniers the Younger',
      src: '/vista.jpg', // the background image
      scene: 'https://prod.spline.design/0vuYDA6geatVNNiC/scene.splinecode', // for the interactive worldly component
      accents: {
        primary: 'bg-rose-950',
        secondary: 'bg-red-900/30',
      }
    },
    completionRewards: [{
      name: 'Lorem ipsum!',
      id: 'lorem-ipsum',
      description: 'This is a really cool reward! Go out there and change the world.',
    }],
  },
  {
    moduleName: 'Your second project',
    visuals: {
      name: 'The Ponte Salario',
      artist: 'Hubert Robert',
      src: '/ponte-salario.jpg', // the background image
      scene: 'https://prod.spline.design/A3EcLirhCciwn3lU/scene.splinecode', // for the interactive worldly component
      accents: {
        primary: 'bg-sky-950',
        secondary: 'bg-sky-900/30',
      }
    },
    completionRewards: [{
      name: 'Lorem ipsum!',
      id: 'lorem-ipsum',
      description: 'This is a really cool reward! Go out there and change the world.',
    }],
  }
] as const;