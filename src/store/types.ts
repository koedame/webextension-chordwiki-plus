export interface RootState {
  version: string;
}

export interface ConfigState {
  chordDiagram: boolean;
  scrollGuide: boolean;
  styleBold: boolean;
}

export interface AutoScrollState {
  scrollSpeed: number;
  timer: any;
}
