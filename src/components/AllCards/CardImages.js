import React from "react";
import Butterfly from "../../imagesComponents/butterfly.svg";
import FootballBall from "../../imagesComponents/football-ball.svg";
import Rocket from "../../imagesComponents/shuttle.svg";
import Balloon from "../../imagesComponents/balloon.svg";
import Fish from "../../imagesComponents/clown-fish.svg";
import Dog from "../../imagesComponents/dog.svg";
import Cat from "../../imagesComponents/cat.svg";
import Car from "../../imagesComponents/pickup-car.svg";
import Apple from "../../imagesComponents/apple.svg";
import Banana from "../../imagesComponents/banana.svg";
import Plane from "../../imagesComponents/travelling.svg";
import TennisBall from "../../imagesComponents/ball.svg";

export const CardImage = (props) => {

    let image = ''

    switch(props.name) {
        case "butterfly":
            image = <img src={Butterfly} style={props.style} alt="Butterfly" />
            break;
        case "ball":
            image = <img src={FootballBall} style={props.style} alt="Football Ball"/>
            break;
        case "rocket":
            image = <img src={Rocket} style={props.style} alt="Rocket"/>
            break;
        case "fish":
            image = <img src={Fish} style={props.style} alt="Fish"/>
            break;
        case "balloon":
            image = <img src={Balloon} style={props.style} alt="Balloon"/>
            break;
        case "dog":
            image = <img src={Dog} style={props.style} alt="Dog"/>
            break;
        case "cat":
            image = <img src={Cat} style={props.style} alt="Cat"/>
            break;
        case "car":
            image = <img src={Car} style={props.style} alt="Car"/>
            break;
        case "apple":
            image = <img src={Apple} style={props.style} alt="Apple"/>
            break;
        case "banana":
            image = <img src={Banana} style={props.style} alt="Banana"/>
            break;
        case "plane":
            image = <img src={Plane} style={props.style} alt="Plane"/>
            break;
        case "tennis ball":
            image = <img src={TennisBall} style={props.style} alt="Tennis Ball"/>
            break;
        default:
            image = props.name
            break;
    }

    return (
        <React.Fragment>
            {image}
        </React.Fragment>
    )
}