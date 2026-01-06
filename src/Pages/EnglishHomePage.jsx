import NavBar from "../Components/NavBar";
import { Link } from "react-router-dom";
import './EnglishHomePage.css';
import '../Components/PoetCard.css';
import PoetCard from "../Components/PoetCard";
import Shakespeare from '../assets/Shakespeare.avif'; //change later from here
import Byron from '../assets/LordByron.jpg';
import Poe from '../assets/EdgarAllanPoe.jpeg';

function EnglishHomePage({ poems }){

    //poet image rotation array
    const poetImages = {
        "William Shakespeare": Shakespeare,
        "Lord Byron": Byron,
        "Edgar Allan Poe": Poe
    };

    //array of distinct poets by spreading Set into array
    const uniquePoets = [...new Set(poems.map(poem => poem.poet))];

    return ( 
        <div className = 'en-homepage'>
    
        <div className = "en-content">
    
            <div className = 'en-title-bar'>
                <h1 className = 'en-welcome-text'>
                    English Poetry </h1>
                <h1 className = 'en-quote'>
                    Hold infinity in the palm of your hand, and eternity in an hour~ </h1>
                <NavBar/>
            </div>
    
            <div className = 'en-imgBackground'></div>
    
            <div className = "collection">
    
                <h1> Famous Poets:</h1>
    
                <div className = "poet-wheel">
    
                    <div className = 'poet-wheel-data'>
    
                    {uniquePoets.map((poetName) => {
    
                    const image = poetImages[poetName]; //rotate images
    
                    return (
                        <Link key = {poetName} to = {`poet/${encodeURIComponent(poetName)}`}>
                            <PoetCard poetName = {poetName} image = {image} lang="en"/>
                        </Link>
                    )
                    })}
    
                    </div>
    
                    </div>
    
                    <h1 className="scroll-notification">Scrollable→</h1>
                </div>
            </div>
    
        </div>
        )
    
}

export default EnglishHomePage