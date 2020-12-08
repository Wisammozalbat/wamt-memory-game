import React, {useState, useEffect} from 'react'
import classes from './Modes.module.css'

export const Modes = props => {
    const [modeSetted, setModeSetted] = useState(false);
    const [defaultStyleClasses] = useState({
        easy: [classes.ModeItem],
        medium: [classes.ModeItem],
        hard: [classes.ModeItem]
    })
    const [styleClasses, setStyleClasses] = useState({
        ...defaultStyleClasses
    })

    useEffect(() => {
        if (props.mode === '') setModeSetted(false)
        else setModeSetted(true)
    }, [props.mode])

    useEffect(() => {
        if (modeSetted) {
            let newStyleClasses = {...styleClasses}
            for (let dif in newStyleClasses) {
                if (dif === props.mode.toLowerCase()) {
                    newStyleClasses[dif] = [...newStyleClasses[props.mode.toLowerCase()], classes.ModeItemSelected]
                } else {
                    newStyleClasses[dif] = [defaultStyleClasses[dif]]
                }
            }
            setStyleClasses({...newStyleClasses})
        }
    }, [modeSetted, defaultStyleClasses, props.mode])

    return (
        <React.Fragment>
            <div className={classes.Modes}>
                <div className={[...styleClasses.easy].join(' ')} onClick={() => props.changeMode("Easy")}>Easy</div>
                <div className={[...styleClasses.medium].join(' ')} onClick={() => props.changeMode("Medium")}>Medium</div>
                <div className={[...styleClasses.hard].join(' ')} onClick={() => props.changeMode("Hard")}>Hard</div>
            </div>
        </React.Fragment>
    )
}