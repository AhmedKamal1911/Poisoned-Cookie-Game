import {
  ArrowBigDown,
  ArrowBigLeft,
  ArrowBigRight,
  ArrowBigUp,
  ChevronDown,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useMediaQuery } from "./hooks/useMediaQuery";

const playersList = [
  {
    name: "mohamed",
    src: "../src/assets/boy.png",
  },
  {
    name: "ali",
    src: "../src/assets/man.png",
  },
  {
    name: "nour",
    src: "../src/assets/hijab-girl.png",
  },
  {
    name: "shimma",
    src: "../src/assets/woman.png",
  },
];

function App() {
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [play, setPlay] = useState(false);
  const [character, setCharacter] = useState({
    player1: null,
    player2: null,
  });
  const [lastMove, setLastMove] = useState(0);
  const [cakes, setCakes] = useState(5);
  const [winner, setWinner] = useState(null);

  const isReady = Boolean(character.player1 && character.player2);
  const charactersList = useMemo(
    () =>
      playersList.filter(
        (player) =>
          player.name !== character.player1?.name &&
          player.name !== character.player2?.name
      ),
    [character.player1?.name, character.player2?.name]
  );

  function setPlayerCharacter(character, playerOrder) {
    if (playerOrder === 1) {
      setCharacter((prevCharacters) => ({
        ...prevCharacters,
        player1: character,
      }));
    } else {
      setCharacter((prevCharacters) => ({
        ...prevCharacters,
        player2: character,
      }));
    }
  }
  function onSetCookies(number) {
    setCakes(number);
  }

  useEffect(() => {
    if (play && isReady) {
      const timeout = setTimeout(() => {
        const randomPlayer = Math.random() < 0.5 ? "player1" : "player2";
        setCurrentPlayer(randomPlayer);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isReady, play]);

  function resetGame() {
    setPlay(false);
    setWinner(null);
    setCakes(5);
    setLastMove(0);
    setCurrentPlayer(null);
    setCharacter({ player1: null, player2: null });
  }

  return (
    <main className="min-h-screen p-2 bg-white flex flex-col  items-center justify-center gap-5 bg-[url('../src/assets/bg.jpg')] bg-no-repeat bg-cover">
      <Instructions onSetCookies={onSetCookies} isPlaying={play} />
      <div className="w-[600px] max-w-full  flex flex-col gap-2 min-[370px]:gap-5 justify-between">
        <div className="flex justify-between gap-2 max-[370px]:flex-col">
          <PlayerCard
            playerNumber={1}
            playerInfo={character.player1}
            handleSetCharacter={setPlayerCharacter}
            isDisabled={play}
            charactersList={charactersList}
          />
          <PlayerCard
            playerNumber={2}
            playerInfo={character.player2}
            handleSetCharacter={setPlayerCharacter}
            isDisabled={play}
            charactersList={charactersList}
          />
        </div>
        {!isReady && (
          <p className="bg-red-600 p-2 rounded-md text-2xl capitalize font-bold text-center mt-2 text-white">
            please choose your character 🙋‍♂️
          </p>
        )}

        <CakesBox cakes={cakes} />

        <div className="flex max-[370px]:flex-col max-[370px]:items-center justify-between gap-2">
          <CharacterButtons
            lastMove={lastMove}
            setLastMove={setLastMove}
            setCurrentPlayer={setCurrentPlayer}
            setCakes={setCakes}
            characterName={character.player1?.name}
            currentPlayer={currentPlayer}
            setWinner={setWinner}
            cakesCount={cakes}
            isActive={currentPlayer === "player1"}
          />

          <CurrentPlayerArrow currentPlayer={currentPlayer} />

          <CharacterButtons
            lastMove={lastMove}
            setLastMove={setLastMove}
            setCurrentPlayer={setCurrentPlayer}
            setCakes={setCakes}
            characterName={character.player2?.name}
            currentPlayer={currentPlayer}
            setWinner={setWinner}
            cakesCount={cakes}
            isActive={currentPlayer === "player2"}
          />
        </div>

        <button
          disabled={play || !isReady}
          onClick={() => setPlay(true)}
          className={`px-5 py-3 bg-cyan-500 text-white rounded-md capitalize font-bold text-xl ${
            play && "hidden"
          } ${
            play || !isReady ? "hover:bg-cyan-700 bg-cyan-700" : ""
          }  max-[370px]:text-sm max-[370px]:p-1.5 transition-colors`}
        >
          play
        </button>
        {winner && (
          <div className="flex flex-col items-center gap-2">
            <p className="bg-green-600 p-2 rounded-md text-2xl capitalize font-bold text-center mt-2 text-white">
              {character[winner]?.name || "Player"} wins 🎉
            </p>
            <button
              onClick={resetGame}
              className="px-5 py-2 bg-purple-600 text-white rounded-md font-bold hover:bg-purple-800 transition-colors"
            >
              Reset Game
            </button>
          </div>
        )}

        {!winner && currentPlayer && (
          <p className="bg-red-600 p-2 rounded-md text-2xl capitalize font-bold text-center mt-2 text-white">
            {character[currentPlayer].name}'s turn 🎲
          </p>
        )}
      </div>
    </main>
  );
}

function CurrentPlayerArrow({ currentPlayer }) {
  const isMobile = useMediaQuery("(max-width:370px)");
  const baseClass =
    "size-12 bg-white text-red-500 rounded-sm border-2 border-gray-300";

  if (currentPlayer === "player1") {
    return isMobile ? (
      <ArrowBigUp className={baseClass} />
    ) : (
      <ArrowBigLeft className={baseClass} />
    );
  }

  return isMobile ? (
    <ArrowBigDown className={baseClass} />
  ) : (
    <ArrowBigRight className={baseClass} />
  );
}
function Instructions({ onSetCookies, isPlaying }) {
  const [cookiesCount, setCookiesCount] = useState(5);

  const handleChange = (e) => {
    const value = Number(e.target.value);
    setCookiesCount(value);
    onSetCookies(value); // ده هيبعته للـ Game component
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm shadow-md rounded-xl p-4 sm:p-6 mb-4 text-gray-800">
      {/* 🎮 عنوان اللعبة */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-6 text-rose-600 drop-shadow-sm">
        Poisoned Cookies Game 🍪💀
      </h1>
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 text-purple-700">
        How to Play 🎮
      </h2>

      {/* ✅ اختيار عدد الكوكيز */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <label className="font-semibold text-gray-700">Cookies 🍪:</label>
        <input
          disabled={isPlaying}
          type="number"
          min="3"
          max="50"
          value={cookiesCount}
          onChange={handleChange}
          className="w-20 border rounded-md p-1 text-center font-bold text-purple-700"
        />
      </div>

      <ul className="flex flex-col gap-3 text-base sm:text-lg font-medium">
        <li className="flex gap-2 items-center">
          <span className="text-lg sm:text-xl">🍪</span>
          <span>
            There are <span className="font-bold">{cookiesCount} cookies</span>{" "}
            on the table.
          </span>
        </li>
        <li className="flex gap-2 items-center">
          <span className="text-lg sm:text-xl">🙋‍♂️</span>
          <span>
            Players take turns to eat{" "}
            <span className="font-bold">1, 2, or 3 cookies</span>.
          </span>
        </li>
        <li className="flex gap-2 items-center">
          <span className="text-lg sm:text-xl">🚫</span>
          <span>
            You <span className="font-bold">cannot repeat</span> the last move
            made by your opponent.
          </span>
        </li>
        <li className="flex gap-2 items-center">
          <span className="text-lg sm:text-xl">💀</span>
          <span>
            The player who eats the{" "}
            <span className="font-bold">last poisoned cookie</span> loses.
          </span>
        </li>
        <li className="flex gap-2 items-center">
          <span className="text-lg sm:text-xl">🎉</span>
          <span>The other player is the winner!</span>
        </li>
      </ul>
    </div>
  );
}

function CharacterButtons({
  characterName,
  isActive,
  lastMove,
  setLastMove,
  setCurrentPlayer,
  setCakes,
  setWinner,
  currentPlayer,
  cakesCount,
}) {
  function handleEat(cakes) {
    setLastMove(cakes);
    setCakes((prev) => {
      const newCakes = Math.max(prev - cakes, 0);

      if (newCakes === 0) {
        const winningPlayer =
          currentPlayer === "player1" ? "player2" : "player1";
        setWinner(winningPlayer);
      } else {
        setCurrentPlayer((prevPlayer) =>
          prevPlayer === "player1" ? "player2" : "player1"
        );
      }

      return newCakes;
    });
  }
  return (
    <div className="flex flex-col gap-2 max-[370px]:w-full">
      <span className="bg-white p-1 rounded-md font-semibold capitalize">
        {characterName} buttons
      </span>
      <div className="flex gap-1">
        <div className="flex gap-1">
          {[1, 2, 3]
            .filter((num) => {
              if (cakesCount === 1) return num === 1;
              if (cakesCount === 2) return num <= 2;
              return lastMove === 0 || num !== lastMove;
            })
            .map((num) => (
              <button
                key={num}
                disabled={!isActive}
                onClick={() => handleEat(num)}
                className={`${
                  !isActive
                    ? "bg-rose-800 cursor-not-allowed"
                    : "hover:bg-rose-700 "
                } p-3 h-fit bg-rose-600 text-white rounded-md capitalize font-bold text-xl max-[450px]:text-[18px] transition-colors`}
              >
                eat {num}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}

function PlayerCard({
  playerInfo,
  handleSetCharacter,
  playerNumber,
  isDisabled,
  charactersList,
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-center">
      <div className="size-[120px] bg-gray-100 p-1 pb-0 rounded-md rounded-b-none">
        <img
          src={playerInfo?.src ?? "../src/assets/anonymous-man.png"}
          alt="player avatar"
        />
      </div>

      <div
        className={`relative w-[160px] max-w-[250px] bg-white rounded-md ${
          open && "rounded-b-none"
        } transition-all duration-[400ms] `}
      >
        <button
          disabled={isDisabled}
          onClick={() => setOpen((prev) => !prev)}
          className={`flex justify-between items-center w-full text-center capitalize font-bold text-xl p-1 rounded-md ${
            isDisabled && "bg-slate-300 cursor-not-allowed"
          } `}
        >
          {playerInfo?.name || "Choose"}
          <ChevronDown className="size-6" />
        </button>

        <ul
          className={`${
            open ? "scale-100" : "scale-0"
          } transition-transform absolute bg-white p-1 left-0 top-full w-full flex flex-col gap-1 origin-top`}
        >
          {charactersList.map((player, index) => (
            <li
              onClick={() => {
                handleSetCharacter(player, playerNumber);
                setOpen(false);
              }}
              key={`${player.name}-${index}`}
              className="cursor-pointer flex-1 flex items-center gap-1 p-1 py-0.5  justify-between bg-teal-600  rounded-sm"
            >
              <img src={player.src} alt={player.name} className="size-10" />
              <span className="text-[19px] font-semibold capitalize text-white text-ellipsis overflow-hidden">
                {player.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
function CakesBox({ cakes }) {
  return (
    <div className="flex flex-wrap gap-1 justify-center bg-blue-500 p-2 rounded-md ">
      {Array.from({ length: cakes }).map((_, i, arr) => (
        <Cookie
          key={i}
          src={
            i === arr.length - 1
              ? "../src/assets/web-cookies.png"
              : "../src/assets/cookie.png"
          }
        />
      ))}
    </div>
  );
}
function Cookie({ src }) {
  return (
    <div className="size-10">
      <img src={src} alt="cookie" />
    </div>
  );
}

export default App;
