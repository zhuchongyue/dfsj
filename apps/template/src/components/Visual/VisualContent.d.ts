
export declare type VisualContent = {
  id: number | string,
  label: string,
  image?: string,
  options?: Visual.PlayerOptions,
  player?: LayerPlayer
  provider?: LayerProvider,

  loading?: boolean,
  time?: string,
  times?: string[],
  origin?: any,
  buttons: {
    daily: boolean,
    range: boolean,
    statistic: boolean
  },
  datatype?: string
  injection?: {
    user: any,
    filter: any
  }
}

