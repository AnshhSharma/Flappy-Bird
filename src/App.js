import './App.css';
import styled from 'styled-components'
import { useEffect, useState } from 'react';
function App() {
  const BIRD_SIZE = 20;
  const BIRD_LEFT = 250;
  const GAMECONTAINER_WIDTH = 500;
  const GAMECONTAINER_HEIGHT = 500;
  const GRAVITY = 5;
  const JUMP_HEIGHT = 70;
  const OBSTACLE_WIDTH = 40;
  const OBSTACLE_GAP = 200; //This is the gap between the top and bottom obstacle


  const [birdPosition, setBirdPosition] = useState(250)
  const [gameHasStarted, setGameHasStarted] = useState(false)
  const [obstacleheight, setObstacleHeight] = useState(100);
  const [obstacleLeft, setObstacleLeft] = useState(GAMECONTAINER_WIDTH-OBSTACLE_WIDTH)
  const [isObstaclePassed, setisObstaclePassed] = useState(false);
  const [score, setScore] = useState(0);

  const bottomObstacleHeight = GAMECONTAINER_HEIGHT - (OBSTACLE_GAP + obstacleheight);

  useEffect(()=>{
    const hasCollidedWithTopObstacle = birdPosition>0 && birdPosition <=obstacleheight;
    const hasCollidedWithBottomObstacle = birdPosition<=GAMECONTAINER_HEIGHT+8 && birdPosition >=GAMECONTAINER_HEIGHT-bottomObstacleHeight;

    if(obstacleLeft >= BIRD_LEFT-OBSTACLE_WIDTH && obstacleLeft<=BIRD_LEFT && (hasCollidedWithTopObstacle || hasCollidedWithBottomObstacle)){
      setGameHasStarted(false)
    }
  },[birdPosition, obstacleheight, bottomObstacleHeight, obstacleLeft])

  useEffect(()=>{
    let obstacleId;
    if(gameHasStarted && obstacleLeft>-OBSTACLE_WIDTH){
      obstacleId = setInterval(() => {
        setObstacleLeft((obstacleLeft)=>obstacleLeft-5)
      }, 24);
    }
    else{
      setObstacleLeft(GAMECONTAINER_WIDTH-OBSTACLE_WIDTH);
      setObstacleHeight(Math.floor(Math.random()*(GAMECONTAINER_HEIGHT-OBSTACLE_GAP)));
      setisObstaclePassed(false);
    }
    if(gameHasStarted && !isObstaclePassed && obstacleLeft<(BIRD_LEFT+OBSTACLE_WIDTH)){
      setScore(score=> score+1);
      setisObstaclePassed(true);
    }
    return(()=>{
      clearInterval(obstacleId);
    })    
  },[gameHasStarted,obstacleLeft,score,isObstaclePassed])

  useEffect(()=>{
    let timeId;
    if(birdPosition < GAMECONTAINER_HEIGHT-BIRD_SIZE+8 && gameHasStarted){
      timeId = setInterval(() => { //executing this block of code with certain amount of delay
        setBirdPosition(birdPosition => birdPosition + GRAVITY)
      },24);//This upper block of code will be executed afrer 24 ms
    }
    return ()=>{
      clearInterval(timeId)
    }
  }, [birdPosition, gameHasStarted]);

  const handleClick = () =>{
    if(!gameHasStarted){
      setGameHasStarted(true)
      setScore(0)
    }
      let newBirdPosition = birdPosition - JUMP_HEIGHT;
      if(newBirdPosition<8){
        newBirdPosition = 8;
      }
      setBirdPosition(newBirdPosition);
    }

  return (
    <div className="App">
      <Div onClick={handleClick}>
        <GameContainer height={GAMECONTAINER_HEIGHT} width={GAMECONTAINER_WIDTH}>
          <Obstacle
            width = {OBSTACLE_WIDTH}
            height = {obstacleheight}
            top = {0}
            left = {obstacleLeft}
            />
          <Obstacle
            width = {OBSTACLE_WIDTH}
            height = {bottomObstacleHeight}
            top = {OBSTACLE_GAP}
            left = {obstacleLeft} 
            />
          <Bird size={BIRD_SIZE} top={birdPosition} left = {GAMECONTAINER_WIDTH+BIRD_LEFT}/>
        </GameContainer>
        <span>{score}</span>
      </Div>
    </div>
  );
}

export default App;

const Bird = styled.div`
  position: absolute;
  background-color: red;
  height: ${(props) => props.size}px;
  width: ${(props) => props.size}px;
  top: ${(props) => props.top}px;
  left: ${(props)=> props.left}px;
  border-radius: 50%;
`;

const Div = styled.div`
  display: flex;
  width: 100%;
  height: 97.9vh;
  justify-content: center;
  & span{
    color: white;
    font-size: 24px;
    position: absolute;
    top: 20px;
    left: 750px
  }
`;

const GameContainer = styled.div`
  background-color: blue;
  height: ${(props)=> props.height}px;  
  width: ${(props)=> props.width}px;  
  overflow: hidden;

`;

const Obstacle = styled.div`
  position: relative;
  top: ${(props)=> props.top}px;
  width: ${(props)=> props.width}px;
  height: ${(props)=> props.height}px;
  background-color: green;
  left: ${(props)=> props.left}px;

`;