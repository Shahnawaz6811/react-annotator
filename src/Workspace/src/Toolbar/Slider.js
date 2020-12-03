import React from 'react'
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
const PrettoSlider = withStyles({
    root: {
        color: '#52af77',
        height: 8,
    },
    thumb: {
        height: 24,
        width: 24,
        backgroundColor: '#fff',
        border: '2px solid currentColor',
        marginTop: -8,
        marginLeft: -12,
        '&:focus, &:hover, &$active': {
            boxShadow: 'inherit',
        },
    },
    active: {},
    valueLabel: {
        left: 'calc(-50% + 4px)',
    },
    track: {
        height: 8,
        borderRadius: 4,
    },
    rail: {
        height: 8,
        borderRadius: 4,
    }
})(Slider)
const FilterSlider = (props) => {
    const filter = props.activeImage.filter;
    return (
        <div>
            <input type="range" step="1" min="0" max="200" aria-label={props.id} id={props.id} onChange={props.onChange} defaultValue={0}  />
            {/* <PrettoSlider valueLabelDisplay="auto" min="0" max="200" id={props.id} name={props.id} aria-label={props.id} defaultValue={0} onChange={props.onChange} /> */}
        </div>
    )
}

export default FilterSlider
