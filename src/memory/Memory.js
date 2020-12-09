import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom'
import { Cards } from '../components/Cards/Cards';
import { defaultCards } from "../components/AllCards/AllCards"
import classes from './Memory.module.css'
import { Modes } from './Modes/Modes';

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

    useEffect(() => {
        if (pairsMatched === pairsToWin && pairsToWin !== 0){
            setGameOver(true)
        }
    }, [pairsMatched, pairsToWin])

    const changeMode = newMode => {
        let size = 0;
        switch (newMode) {
            case "Easy":
                size = 6;
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
        setPairsToWin(cards.length / 2)
        // switch(mode) {
        //     case "Easy":
        //         setPairsToWin(2)
        //         break;
        //     case "Medium":
        //         setPairsToWin(6)
        //         break;
        //     case "Hard":
        //         setPairsToWin(12)
        //         break;
        //     default:
        //         break;
        // }
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
                {modeAccepted && !isShuffling ? 
                    <div 
                        className={classes.RestartContainer}
                    >
                        <div onClick={restart} className={[classes.Button].join(" ")}>Restart</div>
                    </div>
                    : null
                }
                <div style={{display: modeAccepted && !isShuffling ? 'none': 'block'}} className={[classes.TitleContainer].join(' ')}>
                    <div className={[classes.Title, modeAccepted ? classes.TitleHide : ''].join(' ')}>
                        <div style={{'--i': 0}}>M</div>
                        <div style={{'--i': 1}}>e</div>
                        <div style={{'--i': 2}}>m</div>
                        <div style={{'--i': 3}}>o</div>
                        <div style={{'--i': 4}}>r</div>
                        <div style={{'--i': 5}}>y</div>
                        <div style={{'--i': 6}}>{'\u00A0'}</div>
                        <div style={{'--i': 7}}>G</div>
                        <div style={{'--i': 8}}>a</div>
                        <div style={{'--i': 9}}>m</div>
                        <div style={{'--i': 10}}>e</div>
                    </div>
                </div>
                {modeAccepted ?
                    <React.Fragment>
                        <div className={classes.ModeContainer}>
                            <span className={classes.LeftToRight}>Difficulty</span><span className={classes.RightToLeft}>{mode.toUpperCase()}</span>
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
                    : null}
                <div 
                    style={{paddingTop: cards.length > 0 ? "122px" : 0,
                            display: !isShuffling && modeAccepted ? "none" : "block",
                            backgroundColor: cards.length > 0 && mode !== "" ? 'rgba(151, 151, 151, 0.4)' : "transparent"
                        }}
                    className={classes.SelectMode}>
                        <div
                            className={[classes.PickContent, modeAccepted ? classes.PickHide : ''].join(' ')}
                        >
                            <Modes {...{startGame, mode, changeMode}}/>
                            {/* This is the start button */}
                            <div 
                                onClick={mode !== '' ? startGame : null} 
                                className={[classes.ButtonContainer, classes.Button].join(' ')}>
                                    Play
                            </div>
                        </div>
                    </div>         
                {isShuffling ? <div className={classes.Cover}>Shuffling Cards</div> : null}
                {gameOver ? 
                    <div className={classes.GameOver}>
                        <div className={classes.RestartGame} onClick={restart}>Restart</div>
                        <div>You won!</div>
                    </div> 
                : null}
            </div>
            <div className={classes.IconTribute}><span style={{display: "block", fontSize: "25px"}}>Page made by Wisam Mozalbat.</span> Card images made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a></div>
        </div>
    )
}

export default Memory;