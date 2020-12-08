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



import pan from './icons/Pan.svg';
import zoomIn from './icons/Zoom_In.svg';
import zoomOut from './icons/Zoom_Out.svg';
import invert from './icons/Invert.svg';
import polygon from './icons/Polygon.svg';
import draw from './icons/Draw.svg';
import brightness from './icons/Brightness.svg';
import contrast from './icons/Contrast.svg';



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
  pan: pan,
    'zoom-in': zoomIn,
    'zoom-out':zoomOut,
    inverse:invert,
    polygon:polygon,
    draw:draw,
    brightness:brightness,
    contrast:contrast,
}

export default iconMapping
