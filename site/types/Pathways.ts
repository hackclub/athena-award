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