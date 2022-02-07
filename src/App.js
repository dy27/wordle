import React, { useState, useEffect, useRef } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import wordAnswers from './wordAnswers'
import wordGuesses from './wordGuesses'
import Keyboard from './Keyboard';
import './App.css';

const wordAnswerList = wordAnswers;
const wordGuessList = wordGuesses;
const wordList = wordAnswerList.concat(wordGuessList);
const wordSet = new Set(wordList);

// console.log('list', wordAnswerList);
console.log('set', wordSet);

const LetterState = {
  BLANK: 0,
  GREY: 1,
  YELLOW: 2,
  GREEN: 3,
}

const letterToIndex = letter => letter.toLowerCase().charCodeAt() - 'a'.charCodeAt();

const setGuessStates = (guess, answer) => {
  
  // let answerLettersRemaining = new Set(answer); // RIP: duplicate letters not allowed in set
  let letterCounts = Array(26).fill(0);
  for (let c of answer) {
    let index = letterToIndex(c);
    console.log(index);
    letterCounts[index]++;
  }
  console.log(letterCounts);
  for (let i = 0; i < guess.length; i++) {
    const letter = guess[i][0].toLowerCase();
    console.log("matching", letter, answer[i]);
    if (letter === answer[i]) {
      guess[i][1] = LetterState.GREEN;
      let index = letter.charCodeAt() - 'a'.charCodeAt();
      letterCounts[index]--;
    }
  }
  console.log(letterCounts);
  for (let i = 0; i < guess.length; i++) {
    const letter = guess[i][0].toLowerCase();
    let index = letter.charCodeAt() - 'a'.charCodeAt();
    console.log("matching", letter, answer[i]);
    if (letter === answer[i]) {
      continue;
    } else if (answer.includes(letter) && letterCounts[index] > 0) {
      guess[i][1] = LetterState.YELLOW;
      letterCounts[index]--;
      console.log(letter, answer[i], 'yellow');
    } else {
      guess[i][1] = LetterState.GREY;
      console.log(letter, answer[i], 'grey');
    }
    console.log('hi');
  }
}

const wordSize = 5;

const Game = (props) => {
  
  // const word = props.word;
  // const word = "hello";
  // const word = wordAnswerList[Math.floor(Math.random() * wordAnswerList.length)];

  // const [word, setWord] = useState(() => wordAnswerList[Math.floor(Math.random() * wordAnswerList.length)]);
  const [word, setWord] = useState("grand");
  const [guess, setGuess] = useState([]);
  const [guessHistory, setGuessHistory] = useState([]);
  const [letterStates, setLetterStates] = useState(Array(26).fill(LetterState.BLANK));

  const submitGuessCallback = useRef();

  useEffect(() => {
    submitGuessCallback.current = submitGuess;
  });

  const handleKeyDown = (event) => {
    console.log('A key was pressed', event.keyCode);
    let letter = String.fromCharCode(event.keyCode);
    letterInput(letter);
  };

  const letterInput = (letter) => {
    if (letter.length === 1 && letter.match(/[a-zA-Z]/)) {
      addGuessLetter(letter);
    } else if (letter === '\b') {
      removeGuessLetter();
    } else if (letter === '\r') {
      submitGuessCallback.current();
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    // cleanup this component
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // const isGuessCorrect = () => (guess.join("") === word);

  const guessAsString = (g) => {
    console.log(g.map(([c, _]) => c).join(''));
    return g.map(([c, _]) => c).join('').toLowerCase();
  }

  const isValidGuess = (g) => (
    g.length === wordSize && wordSet.has(guessAsString(g))
  );

  const submitGuess = () => {
    console.log("submitting:", guess);
    if (isValidGuess(guess)) {
      setGuessStates(guess, word);
      console.log(letterStates)
      const letterStatesCopy = letterStates.slice();
      for (let i = 0; i < guess.length; i++) {
        const [letter, state] = guess[i];
        const index = letterToIndex(letter);
        console.log(letter, letterStatesCopy[index], state);
        letterStatesCopy[index] = Math.max(letterStatesCopy[index], state);
      }
      setLetterStates(letterStatesCopy);
      
      setGuessHistory(gh => [...gh, guess]);
      setGuess([]);
      console.log('submitted');
    }
  };

  const addGuessLetter = (letter) => {
    setGuess(prevGuess => (prevGuess.length < wordSize ? [...prevGuess, [letter, LetterState.BLANK]] : prevGuess));
  }

  const removeGuessLetter = () => {
    setGuess(prevGuess => prevGuess.length > 0 ? prevGuess.slice(0, -1) : prevGuess);
  }

  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Board
        wordSize={wordSize}
        guess={guess}
        guessHistory={guessHistory}
      />
      <Keyboard
        onClick={letterInput}
        letterStates={letterStates}
      />
    </div>
  )
}

const Board = (props) => {

  const renderGuess = (guess) => {
    let guessCopy = guess.slice();
    console.log('gc', guessCopy);
    while (guessCopy.length < props.wordSize) {
      guessCopy.push([' ', LetterState.BLANK]);
    }
    return (
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={1}
      >
        {guessCopy.map(renderLetterSquare)}
      </Stack>
    );
  }

  const renderLetterSquare = ([letter, state]) => {
    return (
      <Box
        component="span"
        sx={{
          display: 'flex',
          width: 50,
          height: 50,
          border: '3px solid #e3e3e3',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: () => {
            if (state === LetterState.GREY) { return "#3d3d3d" }
            else if (state === LetterState.YELLOW) { return "orange" }
            else if (state === LetterState.GREEN) { return "green" }
            else { return null }
          },
        }}
      >
        <Typography
          style={{ fontFamily: 'DM Sans', color: '#e3e3e3', fontSize: 25 }}
        >
          {letter}
        </Typography>
      </Box>
    );
  }

  const renderBoard = () => {
    return (
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={1}
      >
        {[...props.guessHistory, props.guess].map(renderGuess)}
      </Stack>
    );
  }

  return (
    <div>
      {renderBoard()}
    </div>
  );
}

const Header = () => (
  <div>
    <Typography
      style={{ fontFamily: 'DM Sans', color: '#e3e3e3', fontSize: 25 }}
    >
      WORDLE 2
    </Typography>
  </div>
  
);

function App() {
  return (
    <div 
      style={{
        paddingTop: 50,
        display: 'flex',
        flexDirection: 'column',
        // alignItems: 'flex-start',
        justifyContent: 'center',
        backgroundColor: "#121212",
      }}
    >
      {/* <Header/> */}
      <Game />
    </div>
  );
}

export default App;
