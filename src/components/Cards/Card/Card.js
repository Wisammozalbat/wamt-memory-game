import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import classes from "./Card.module.css"
import {CardImage} from "../../AllCards/CardImages"

export const Card = props => {

    const cardEl = useRef();
    const [domNode, setDomNode] = useState(null);

    // const image = props.card.name === "butterfly" ?  : props.card.name
    // const image = props.card.name === "butterfly" ? <img src={ButterFly} alt="Butterfly"/> : props.card.name

    useEffect(() => {
        setDomNode(ReactDOM.findDOMNode(cardEl.current));
    }, [])
    
    // if(domNode) console.log(domNode.getBoundingClientRect().width)

    return(
        <React.Fragment>
            <div ref={cardEl}
                className={[
                    classes.CardContainer,
                    props.card.matched ? classes.Matched : ''
                ].join(' ')}
                style={{
                    transition: `all ${props.card.index*0.2 + 0.5}s cubic-bezier(.68,-0.55,.55,1.38)`,
                    marginLeft: props.card.isShuffling ? 
                        (domNode.getBoundingClientRect().x)*-1 + props.center.x - (domNode.getBoundingClientRect().width / 2)
                        : 0,
                    marginTop: props.card.isShuffling ? 
                        (domNode.getBoundingClientRect().y)*-1 + props.center.y - (domNode.getBoundingClientRect().height / 2) + props.center.top
                        // (domNode.getBoundingClientRect().y)*-1 + domNode.getBoundingClientRect().height
                        : 0
                }}
            >
                <div 
                    className={[
                        classes.Card, 
                        props.card.isFlipped ? classes.IsFlipped : ''
                    ].join(' ')} 
                    onClick={!props.disableFlip && !props.card.isFlipped ? () => props.flip(props.card) : null}>
                    <div 
                        style={{boxShadow: props.card.isShuffling ? '0 0 2px 0px rgba(0, 0, 0, 0.2)' : '0 3px 10px 3px rgba(0, 0, 0, 0.2)'}}
                        className={[classes.CardFace, classes.Front].join(' ')}></div>
                    <div 
                        className={[classes.CardFace, classes.Back].join(' ')}>
                        <div className={classes.Image}>
                            <CardImage style={{width: '90%', height: '90%'}} name={props.card.name}/>
                        </div>
                        <div className={classes.ImageName}>{props.card.name}</div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}