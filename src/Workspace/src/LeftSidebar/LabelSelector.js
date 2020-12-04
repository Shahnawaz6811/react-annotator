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
  onSelectLabel,
  onChangeLabel,
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
        onSelectLabel(r)
      }}

      classification={<Chip text={r.cls || ""} color={r.color || "#ddd"} />}
      area=""
      
      lock={
        r.locked ? (
          <LockIcon
            onClick={() =>
                onChangeLabel({
                ...r,
                edit:true,
                  locked: false,
                
              })
            }
            className="icon2"
          />
        ) : (
          <UnlockIcon
            onClick={() => onChangeLabel({ ...r, locked: true })}
            className="icon2"
          />
        )
      }
      visible={
        r.visible || r.visible === undefined ? (
          <VisibleIcon
            onClick={() =>
              onChangeLabel({
                ...r,
                visible: false,
              })
            }
            className="icon2"
          />
        ) : (
          <VisibleOffIcon
            onClick={() => onChangeLabel({ ...r, visible: true })}
            className="icon2"
          />
        )
      }
    />
  )
}






const Container = styled("div")({
  width: 300,
  display: "flex",
  flexDirection: "column",
  height: '80%',
  padding:'0 20px',
  marginRight:'20px',
  boxShadow: '0 2px 2px 0 rgba(0,0,0,0.2)',
  transition: '0.3s',
  marginTop:'30px',
  "&.expanded": {
    width: 300,
  },
})


const InnerSliderContent = styled("div")({
  width: 300,
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


export const RightSidebar = ({ state,
    onSelectLabel,
    onChangeLabel,
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

          <div style={{height:'300px'}}>
              <h4 style={{color:'red',margin:'10px'}}>Labels</h4>
          {state.regionClsList.map((r, i) => {
              const label = state.images[state.selectedImage].label
              let selected;
              if (label && label.cls === r.cls) {
                  selected = true;
              }
              return (
                  <MemoRow
                      key={Math.random()}
                      {...r}
                      selected={selected}
                      region={r}
                      index={i}
                      onChangeLabel={onChangeLabel}
                      onSelectLabel={onSelectLabel}
                  />)
          })}
        </div>
  )
}

export default RightSidebar
