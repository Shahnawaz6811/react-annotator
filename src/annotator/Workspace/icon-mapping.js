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
import { ReactSVG } from 'react-svg'




import Pan  from './icons/Pan.svg';
import ZoomIn  from './icons/Zoom_In.svg';
import ZoomOut  from './icons/Zoom_Out.svg';
import Invert  from './icons/Invert.svg';
import Polygon  from './icons/Polygon.svg';
import Draw  from './icons/Draw.svg';
import Brightness  from './icons/Brightness.svg';
import Contrast  from './icons/Contrast.svg';
import Next  from './icons/Next.svg';
import Previous  from './icons/Previous.svg';
import Redo  from './icons/Redo.svg';
import Undo  from './icons/Undo.svg';






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
      return <ReactSVG src={Brightness}
        className={selected ? 'selected' : ''}
        alt="close bubble"
      />;
    case 'pan':
      return <ReactSVG src={Pan}
        className={selected ? 'selected' : ''}
      />;
    case 'zoom-in':
      return <ReactSVG src={ZoomIn}
        className={selected ? 'selected' : ''}
      />;
    case 'zoom-out':
      return <ReactSVG src={ZoomOut}
        className={selected ? 'selected' : ''}
      />
    case 'contrast':
      return <ReactSVG src={Contrast}
        className={selected ? 'selected' : ''}
      />;
    case 'inverse':
      return <ReactSVG src={Invert}
        className={selected ? 'selected' : ''}
      />;
    case 'draw':
      return <ReactSVG src={Draw}
        className={selected ? 'selected' : ''}
      />;
    case 'polygon':
      return <ReactSVG src={Polygon}
        className={selected ? 'selected' : ''}
      />;
    case 'Undo':
      return <ReactSVG src={Undo}
        style={selected ? {fill:'gray',cursor:'default'}: {}}
        className={selected ? 'disabled' : ''} />;

    case 'Redo':
      return <ReactSVG src={Redo}
        style={selected ? {fill:'gray',cursor:'default'}: {}}
        className={selected ? 'disabled' : ''} />;

    case 'Prev':
      return <ReactSVG src={Previous}
        style={selected ? {fill:'gray',cursor:'default'}: {}}
        className={selected ? 'disabled' : ''} />;


    case 'Next':
      return <ReactSVG src={Next}
        style={selected ? {fill:'gray',cursor:'default'}: {}}
        className={selected ? 'disabled' : ''}
      />;
  }
}
