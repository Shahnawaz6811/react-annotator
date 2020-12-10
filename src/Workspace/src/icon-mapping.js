import React from 'react';
import BackIcon from "@material-ui/icons/KeyboardArrowLeft"
import NextIcon from "@material-ui/icons/KeyboardArrowRight"
import UndoIcon from "@material-ui/icons/Undo"
import RedoIcon from "@material-ui/icons/Redo"
import PlayIcon from "@material-ui/icons/PlayArrow"
import PauseIcon from "@material-ui/icons/Pause"
import SettingsIcon from "@material-ui/icons/Settings"
import HelpIcon from "@material-ui/icons/Help"
import FullscreenIcon from "@material-ui/icons/Fullscreen"
import ExitIcon from "@material-ui/icons/ExitToApp"
import QueuePlayNextIcon from "@material-ui/icons/QueuePlayNext"
import HotkeysIcon from "@material-ui/icons/Keyboard"



import { ReactComponent as Pan } from './icons/Pan.svg';
import { ReactComponent as ZoomIn } from './icons/Zoom_In.svg';
import { ReactComponent as ZoomOut } from './icons/Zoom_Out.svg';
import { ReactComponent as Invert } from './icons/Invert.svg';
import { ReactComponent as Polygon } from './icons/Polygon.svg';
import { ReactComponent as Draw } from './icons/Draw.svg';
import { ReactComponent as Brightness } from './icons/Brightness.svg';
import { ReactComponent as Contrast } from './icons/Contrast.svg';
import { ReactComponent as Next } from './icons/Next.svg';
import { ReactComponent as Previous } from './icons/Previous.svg';
import { ReactComponent as Redo } from './icons/Redo.svg';
import { ReactComponent as Undo } from './icons/Undo.svg';






export const iconMapping = {
  back: BackIcon,
  prev: BackIcon,
  undo: UndoIcon,
  redo: RedoIcon,
  previous: BackIcon,
  next: NextIcon,
  forward: NextIcon,
  play: PlayIcon,
  pause: PauseIcon,
  settings: SettingsIcon,
  options: SettingsIcon,
  help: HelpIcon,
  fullscreen: FullscreenIcon,
  exit: ExitIcon,
  quit: ExitIcon,
  save: ExitIcon,
  done: ExitIcon,
  clone: QueuePlayNextIcon,
  hotkeys: HotkeysIcon,
  shortcuts: HotkeysIcon,
  pan: Pan,
  'zoom-in': ZoomIn,
  'zoom-out': ZoomOut,
  inverse: Invert,
  polygon: Polygon,
  draw: Draw,
  brightness: Brightness,
  contrast: Contrast,
}

export default iconMapping


export const getIcon = (name, selected) => {
  switch (name) {
    case 'brightness':
      return <Brightness
        className={selected ? 'selected' : ''}
        alt="close bubble"
      />;
    case 'pan':
      return <Pan
        className={selected ? 'selected' : ''}
      />;
    case 'zoom-in':
      return <ZoomIn
        className={selected ? 'selected' : ''}
      />;
    case 'zoom-out':
      return <ZoomOut
        className={selected ? 'selected' : ''}
      />
    case 'contrast':
      return <Contrast
        className={selected ? 'selected' : ''}
      />;
    case 'inverse':
      return <Invert
        className={selected ? 'selected' : ''}
      />;
    case 'draw':
      return <Draw
        className={selected ? 'selected' : ''}
      />;
    case 'polygon':
      return <Polygon
        className={selected ? 'selected' : ''}
      />;
    case 'Undo':
      return <Undo
        className={selected ? 'selected' : ''} />;

    case 'Redo':
      return <Redo
        className={selected ? 'selected' : ''} />;

    case 'Prev':
      return <Previous
        className={selected ? 'selected' : ''} />;


    case 'Next':
      return <Next
        className={selected ? 'selected' : ''}
      />;
  }
}