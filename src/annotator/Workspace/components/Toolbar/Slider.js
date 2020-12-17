import React from 'react'
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles((theme) => ({
    
  }));

const FilterSlider = (props) => {
    const filter = props.activeImage.filter;

    const classes = useStyles();

    const getDefaultValue = (label) => {
        if (label == 'brightness') {
            return 100;
        }
        if (label == 'contrast') {
            return 1;
        }
    }
    const getMaxValue = (label) => {
        if (label == 'brightness') {
            return 200;
        }
        if (label == 'contrast') {
            return 10;
        }
    }
    const getMinValue = (label) => {
        if (label == 'brightness') {
            return 10;
        }
        if (label == 'contrast') {
            return 1;
        }
    }

    return (
        <div className={classes.root}>
            
            <input type="range" step={0} min={getMinValue(props.id)} max={getMaxValue(props.id)}
                value={filter ? filter[props.id] : getDefaultValue(props.id)} aria-label={props.id} id={props.id} onChange={props.onChange} defaultValue={getDefaultValue(props.id)} />
            {/* <span>{filter ? filter[props.id] : getDefaultValue(props.id) }</span>            */}
        </div>
    )
}

export default FilterSlider
