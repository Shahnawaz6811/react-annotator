import React, { useReducer, useEffect,useState, useMemo,memo } from "react"
import ButtonBase from "@material-ui/core/ButtonBase"
import ExpandIcon from "@material-ui/icons/KeyboardArrowLeft"
import ContractIcon from "@material-ui/icons/KeyboardArrowRight"
import { grey } from "@material-ui/core/colors"
import { makeStyles, styled } from "@material-ui/core/styles"
import RegionIcon from "@material-ui/icons/PictureInPicture"
import Grid from "@material-ui/core/Grid"
import ReorderIcon from "@material-ui/icons/SwapVert"
import PieChartIcon from "@material-ui/icons/PieChart"
import TrashIcon from "@material-ui/icons/Delete"
import LockIcon from "@material-ui/icons/Lock"
import UnlockIcon from "@material-ui/icons/LockOpen"
import VisibleIcon from "@material-ui/icons/Visibility"
import VisibleOffIcon from "@material-ui/icons/VisibilityOff"
import styles from "./styles"
import LabelSelector from './LabelSelector';
import ObjectSelector from './ObjectSelector';

import classnames from "classnames"
const useStyles = makeStyles(styles)
const colors = ['red','green','blue','pink','violet','indigo','black']

const Chip = ({ color, text }) => {
  const classes = useStyles()
  return (
    <span className={classes.chip}>
      <div className="color" style={{ backgroundColor: color }} />
      <div className="text">{text}</div>
    </span>
  )
}



const RowLayout = ({
  header,
  highlighted,
  order,
  classification,
  area,
  tags,
  lock,
  visible,
  onClick,
}) => {
  const classes = useStyles()

  const [mouseOver, changeMouseOver] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => changeMouseOver(true)}
      onMouseLeave={() => changeMouseOver(false)}
      className={classnames(classes.row, { header, highlighted })}
    >
      <Grid container alignItems="center">
        <Grid item xs={5}>
          {classification}
        </Grid>
        <Grid item xs={5}>
          <div style={{ textAlign: "right", paddingRight: 6 }}>{area}</div>
        </Grid>
        <Grid item sm={1}>
          {visible}
        </Grid>
        <Grid item xs={1}>
          {lock}
        </Grid>
       
      </Grid>
    </div>
  )
}

const RowHeader = () => {
  return (
    <RowLayout
      header
      highlighted={false}
      order={<ReorderIcon className="icon" />}
      classification={<div style={{ paddingLeft: 10 }}>Label</div>}
      lock={<LockIcon className="icon" />}
      visible={<VisibleIcon className="icon" />}
    />
  )
}

const MemoRowHeader = memo(RowHeader)



const Row = ({
  region: r,
  highlighted,
  onSelectRegion,
  onDeleteRegion,
  onChangeRegion,
  visible,
  selected,
  locked,
  color,
  cls,
  index,
}) => {

  return (
    <RowLayout
      header={true}
      key={Math.random()}
      highlighted={selected}
      onClick={() => {
        onSelectRegion(r)
      }}

      classification={<Chip text={r.cls || ""} color={r.color || "#ddd"} />}
      area=""
      
      lock={
        r.locked ? (
          <LockIcon
            onClick={() =>
              onChangeRegion({
                ...r,
                edit:true,
                locked: r.shouldHideDeleteIcon
                  ? r.createdByUser
                    ? false
                    : true
                  : false,
              })
            }
            className="icon2"
          />
        ) : (
          <UnlockIcon
            onClick={() => onChangeRegion({ ...r, locked: true })}
            className="icon2"
          />
        )
      }
      visible={
        r.visible || r.visible === undefined ? (
          <VisibleIcon
            // onClick={() =>
            //   onChangeRegion({
            //     ...r,
            //     visible: false,
            //   })
            // }
            className="icon2"
          />
        ) : (
          <VisibleOffIcon
            // onClick={() => onChangeRegion({ ...r, visible: true })}
            className="icon2"
          />
        )
      }
    />
  )
}






const Container = styled("div")({

  display: "flex",
  flexDirection: "column",
  padding:'0 10px',
  borderLeft: '2px solid #C4C4C4',
  borderRight: '2px solid #C4C4C4',
  transition: '0.3s',
  "&.expanded": {
    width: 300,
  },
})


const InnerSliderContent = styled("div")({
  width: 300,
  height:'100%',
})

const getInitialExpandedState = () => {
  return Boolean(window.__REACT_WORKSPACE_LAYOUT_EXPANDED_STATE)
}


const MemoRow = memo(
  Row,
  (prevProps, nextProps) =>
    prevProps.highlighted === nextProps.highlighted &&
    prevProps.visible === nextProps.visible &&
    prevProps.locked === nextProps.locked &&
    prevProps.id === nextProps.id &&
    prevProps.index === nextProps.index &&
    prevProps.cls === nextProps.cls &&
    prevProps.color === nextProps.color &&
    prevProps.isNew === nextProps.isNew &&
    prevProps.selected === nextProps.selected

)


export const LeftSidebar = ({ state,children, onDeleteObject,
  onChangeLabel,
  onSelectLabel,
  onChangeObject,
  onSelectObject,
  expandedByDefault,
   initialExpandedState, height }) => {
  const [expanded, toggleExpanded] = useReducer(
    (state) => !state,
    initialExpandedState === undefined
      ? getInitialExpandedState()
      : initialExpandedState
  )

  useEffect(() => {
    if (initialExpandedState !== undefined) {
      window.__REACT_WORKSPACE_LAYOUT_EXPANDED_STATE = expanded
    }
  }, [initialExpandedState, expanded])

  const containerStyle = useMemo(() => ({ height: height || "100%" }), [height])

  return (
    <Container className="dpfLabelcol">
      <InnerSliderContent >
        {/* Lables */}
         <LabelSelector state={state} onChangeLabel={onChangeLabel}
          onSelectLabel={onSelectLabel} />
        <ObjectSelector state={state}  onSelectObject={onSelectObject}
                onDeleteObject={onDeleteObject}
                onChangeObject={onChangeObject}/>
      
        </InnerSliderContent>      
    </Container>
  )
}

export default LeftSidebar
