import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom'
import { Cards } from '../components/Cards/Cards';
import { defaultCards } from "../components/AllCards/AllCards"
import classes from './Memory.module.css'
import { Modes } from './Modes/Modes';

import { VscDebugRestart } from 'react-icons/vsc';
import { BsCheck } from 'react-icons/bs'


const Memory = props => {
    const [mode, setMode] = useState('');
    const [modeAccepted, setModeAccepted] = useState(false)
    const [isShuffling, setIsShuffling] = useState(false)
    const cardsContainer = useRef();
    const [domNode, setDomNode] = useState(null);
    const [animationTime, setAnimationTime] = useState()
    const [cards, setCards] = useState([])
    const [matchCheck, setMatchCheck] = useState([
        {},
        {},
        0
    ])
    const [pairsMatched, setPairsMatched] = useState(0)
    const [pairsToWin, setPairsToWin] = useState(0)
    const [pickVisible, setPickVisible] = useState(false)
    const [gameOver, setGameOver] = useState(false)
    
    useEffect(() => {
        setDomNode(ReactDOM.findDOMNode(cardsContainer.current));
    }, [])

    useEffect(() => {
        setAnimationTime(cards.length*0.2 + 0.5)
    }, [cards.length])
    
    useEffect(() => {
        if(!mode) {
            setModeAccepted(false)
        }
    }, [mode])

    const changeMode = newMode => {
        let size = 0;
        switch (newMode) {
            case "Easy":
                size = 4;
                break;
            case "Medium":
                size = 12;
                break;
            case "Hard":
                size = 24;
                break;
            default:
                size = 0;
                break;
        }
        setMode(newMode);

        let randomArr = []

        if (size !== 0) {
            let copyArray = [...defaultCards.map(card => {
                return {...card, isFlipped: true, isShuffling: false, matched: false}
            })]

            let counter = 0

            while (counter < size) {
                let index = Math.floor(Math.random()*(copyArray.length/2))
                randomArr.push({...copyArray[index*2]})
                randomArr.push({...copyArray[index*2+1]})
                copyArray.splice(index*2, 2);
                counter += 2;
            }
        }

        setCards([
            ...randomArr.map((card, index) => {
                return {...card, isFlipped: true, isShuffling: false, matched: false}
            })
        ])
    }

    const resetFlip = (card1, card2) => {
        setTimeout(()=>{
            setCards(cards => [...cards.map(card => {
                return {...card, isFlipped: card.id === card1.id || card.id === card2.id ? false : card.isFlipped}
            })])
        }, 1500)
    }

    const flip = (obj) => {
        if (matchCheck[2] < 2) {
            setCards(cards => [...cards.map(card => {
                return {...card, isFlipped: card.id === obj.id ? !card.isFlipped : card.isFlipped}
            })])
        }
        let newMatch = [...matchCheck];
        newMatch[newMatch[2]] = obj;
        newMatch[2] = newMatch[2] + 1;
        setMatchCheck(newMatch)
    }
            
    const checkIfMatch = () => {
        if (matchCheck[0].name === matchCheck[1].name) {
            setPairsMatched(prevNum => prevNum + 1)
            setTimeout(() => {
                setCards(cards => [...cards.map(card => {
                    return {
                        ...card, 
                        matched: card.id === matchCheck[0].id || card.id === matchCheck[1].id ? true : card.matched,
                        isFlipped: card.id === matchCheck[0].id || card.id === matchCheck[1].id ? true : card.isFlipped
                    }
                })])
            }, 500)
            setMatchCheck([{}, {}, 0])
        } else {
            resetFlip(matchCheck[0], matchCheck[1])
            setMatchCheck([{}, {}, 0])
        }
    }

    useEffect(() => {
        if (pairsMatched === pairsToWin && pairsToWin !== 0){
            setGameOver(true)
        }
    }, [pairsMatched, pairsToWin])
    
    if (matchCheck[2] > 1) {
        checkIfMatch();
    }
    
    const mix = () => {
        setCards(cards => {
            let cardsCopy = [...cards];
            for (let i = cardsCopy.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                let temp = cardsCopy[i];
                cardsCopy[i] = cardsCopy[j];
                cardsCopy[j] = temp;
            }
            return cardsCopy;
        });
    }
    
    const shuffle = () => {
        toggleShuffle()
        setTimeout(()=>{
            toggleShuffle();
        }, animationTime*1000)
        setTimeout(() => {
            mix()
            setIsShuffling(false)
        }, animationTime*2*1000)
    }
    
    const toggleShuffle = () => {
        setCards(cards => [...cards.map((card, index) => {
            return {...card, isShuffling: !card.isShuffling, index: index}
        })]);
    }

    const startGame = () => {
        setModeAccepted(true)
        setIsShuffling(true)
        setCards(cards => [...cards.map(card => {
            return {...card, isFlipped: false}
        })]);
        setTimeout(() => {
            shuffle();
        }, 1000)
        switch(mode) {
            case "Easy":
                setPairsToWin(2)
                break;
            case "Medium":
                setPairsToWin(4)
                break;
            case "Hard":
                setPairsToWin(12)
                break;
            default:
                break;
        }
    }

    const restart = () => {
        setPairsMatched(0)
        setPairsToWin(0)
        setIsShuffling(false)
        setAnimationTime(0)
        setModeAccepted(false)
        setGameOver(false)
        setMode("")
        setCards([])
    }

    return (
        <div className={classes.Body}>
            <div className={classes.Header}>
                <div className={classes.ModesContainer}>
                    <div className={[classes.PickText, pickVisible ? classes.PickTextNotVisible : ""].join(' ')} onClick={() => setPickVisible(true)}>pick difficulty</div>
                    <div className={[classes.PickContent, pickVisible ? classes.PickVisible : "", modeAccepted ? classes.PickHide : ''].join(' ')}>
                        <Modes {...{startGame, mode, changeMode}}/>
                    </div>
                </div>
                {pickVisible ? 
                    <div 
                        className={[
                            classes.CheckContainer,
                            pickVisible ? classes.CheckContainerVisible : "",
                            modeAccepted ? classes.CheckHide : "",
                            mode !== "" ? '' : classes.Disable
                        ].join(" ")} 
                    >
                            <div className={classes.ButtonContainer}>
                                <BsCheck 
                                    onClick={startGame}
                                    className={[
                                        classes.Check, 
                                        pickVisible ? classes.CheckVisible : ""
                                    ].join(" ")}
                                />
                                <div className={mode !== "" ? classes.CheckAbled : classes.Disabled}></div>
                            </div>
                    </div>
                    : null
                }
                {modeAccepted ?
                    <React.Fragment>
                        <div className={classes.ModeContainer}>
                            <span className={classes.LeftToRight}>Difficulty</span><span className={classes.RightToLeft}>{mode.toUpperCase()}</span>
                        </div>
                        <div 
                            className={[
                                classes.Restart, 
                                isShuffling ? classes.Disable : ''
                            ].join(" ")} 
                        >
                            <div className={classes.ButtonContainer}>
                                <VscDebugRestart
                                    onClick={restart}
                                    className={[
                                        classes.Icon
                                    ].join(" ")}/>
                                <div className={!isShuffling ? classes.RestartAbled : classes.Disabled}></div>
                            </div>
                        </div>
                    </React.Fragment>
                : null }
            </div>
            <div className={classes.CardsContainer} ref={cardsContainer}>
                {cards.length > 0 ? 
                    <div className={[classes.CardsContent, classes[mode]].join(' ')}>
                        <Cards
                            mode={mode}
                            isShuffling={isShuffling}
                            cards={cards} 
                            flip={flip} 
                            currentContainer={domNode.getBoundingClientRect()}
                        />
                    </div> 
                    : <div className={classes.DefaultMsg}>Please select a difficulty</div>}
                {isShuffling ? <div className={classes.Cover}>Shuffling Cards</div> : null}
                {gameOver ? <div className={classes.GameOver}>You won!</div> : null}
            </div>
            <div className={classes.IconTribute}>Card images made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a></div>
        </div>
    )
}

export default Memory;