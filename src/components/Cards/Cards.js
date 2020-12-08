import React from 'react'
import { Card } from "./Card/Card"

export const Cards = props => {

    return(
        <React.Fragment>
            {props.cards ? props.cards.map(card => {
                return (
                    <Card
                        disableFlip={props.isShuffling}
                        center={{x: props.currentContainer.width / 2, y: props.currentContainer.height / 2, top: props.currentContainer.y}} 
                        key={card.id} 
                        card={card} 
                        flip={props.flip}
                    />)
            }): null}
        </React.Fragment>
    )
}