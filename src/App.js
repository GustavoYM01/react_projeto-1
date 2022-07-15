// CSS
import "./App.css";

// react
import { useCallback, useEffect, useState } from "react";

// data
import { wordsList } from "./data/words";

// components
import StartScreen from "./components/StartScreen";
import Game from "./components/Game";
import GameOver from "./components/GameOver";

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
];

const guessesQty = 3;

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setpickedCategory] = useState("");
  const [letters, setletters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setwrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setscore] = useState(0);

  const pickWordsAndCategory = useCallback(() => {
    // Regatando uma categoria aleatória
    const categories = Object.keys(words);
    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)];

    // Regatando uma palavra aleatória
    const word =
      words[category][Math.floor(Math.random() * words[category].length)];

    return { word, category };
  }, [words]);

  // Inicia o jogo secret word
  const startGame = useCallback(() => {
    // Limpando todas as letras
    clearLetterStates();

    // Resgatar palavra e categoria
    const { word, category } = pickWordsAndCategory();

    // Criando um array de letras
    let wordLetters = word.split("");
    wordLetters = wordLetters.map((letter) => letter.toLowerCase());

    // Preenchendo os estados
    setPickedWord(word);
    setpickedCategory(category);
    setletters(wordLetters);

    setGameStage(stages[1].name);
  }, [pickWordsAndCategory]);

  // Processamento de inserção de letras
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();

    // Validando se a letra já foi utilizada
    if (
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      return;
    }

    // Adicionar letra advinhada ou retirar uma chance
    if (letters.includes(normalizedLetter)) {
      // Letra correta
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter,
      ]);
    } else {
      // Letra incorreta
      setwrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]);

      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  };

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setwrongLetters([]);
  };

  useEffect(() => {
    if (guesses <= 0) {
      // Reiniciar todos os estados
      clearLetterStates();

      setGameStage(stages[2].name);
    }
  }, [guesses]);

  // Verificando a condição de vitória
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];

    // Condição de vitória
    if (guessedLetters.length === uniqueLetters.length) {
      // Adicionando score
      setscore((actualScore) => (actualScore += 10));

      // Reiniciando o jogo com uma nova palavra
      startGame();
    }
  }, [guessedLetters, letters, startGame]);

  // Reinicia o jogo
  const retry = () => {
    setscore(0);
    setGuesses(guessesQty);

    setGameStage(stages[0].name);
  };

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" && (
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === "end" && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;
