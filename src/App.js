import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import {motion} from "framer-motion"

function App() {
  const [showResults, setShowResults] = useState(false);
  const [dealerCards, setDealerCards] = useState([]);
  const [playerCards, setPlayerCards] = useState([]);
  const [deckId, setDeckId] = useState("");
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);
  const [ingame, setIngame] = useState(false);
  const [win, setWin] = useState(true);

  useEffect(() => {
    axios
      .get("https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6")
      .then(function (res) {
        setDeckId(res.data.deck_id);
      });
  }, []);

  const handlePlay = async (e) => {
    e.preventDefault();
    setIngame(true);
    if (!ingame) return;

    const { data } = await axios(
      "https://www.deckofcardsapi.com/api/deck/" + deckId + "/draw/?count=4"
    );
    setDealerCards(data.cards.slice(0, 2));
    setPlayerCards(data.cards.slice(2, 4));
  };

  const handleHit = async (e) => {
    e.preventDefault();
    if (!ingame) return;

    const { data } = await axios(
      "https://www.deckofcardsapi.com/api/deck/" + deckId + "/draw/?count=1"
    );
    setPlayerCards([...playerCards, data.cards[0]]);
  };

  const handleStand = async (e) => {
    e.preventDefault();
    if (!ingame) return;

    for (let i = 0; i < playerCards.length; i++) {
      if (
        playerCards[i].value === "KING" ||
        playerCards[i].value === "QUEEN" ||
        playerCards[i].value === "JACK"
      ) {
        setPlayerScore((playerScore) => playerScore + 10);
      } else if (playerCards[i].value === "ACE") {
        setPlayerScore((playerScore) => playerScore + 11);
      } else {
        setPlayerScore(
          (playerScore) => playerScore + parseInt(playerCards[i].value)
        );
      }
    }

    for (let i = 0; i < dealerCards.length; i++) {
      if (
        dealerCards[i].value === "KING" ||
        dealerCards[i].value === "QUEEN" ||
        dealerCards[i].value === "JACK"
      ) {
        setDealerScore((dealerScore) => dealerScore + 10);
      } else if (dealerCards[i].value === "ACE") {
        setDealerScore((dealerScore) => dealerScore + 11);
      } else {
        setDealerScore(
          (dealerScore) => dealerScore + parseInt(dealerCards[i].value)
        );
      }
    }
    if (playerScore > 21) {
      setWin(false);
    } else if (playerScore < dealerScore) {
      setWin(false);
    }
    setShowResults(true);
  };
  return (
    <div className="w-screen">
      <div id="navbar" className="w-full flex justify-center pt-5">
        <div className="flex flex-col items-center gap-2">
          <motion.h1 initial={{opacity: 0, y : 30}} animate={{opacity: 1, y : 0}} transition={{duration: 0.7}} className="text-4xl font-semibold text-white">Cards Castle</motion.h1>
          <motion.button
            initial={{opacity: 0, y : 30}}
            animate={{opacity: 1, y : 0}}
            transition={{y : {duration: 0.7, delay: 0.2}}}
            whileHover={{scale: 1.1}}
            onClick={handlePlay}
            className="bg-white px-2 py-2 mt-3 rounded-xl text-2xl"
          >
            Click to Play Blackjack
          </motion.button>
        </div>
      </div>

      {ingame && (
        <div className="absolute right-10 mt-5 flex gap-3">
          <h1 className="text-2xl text-white">Dealer's Cards</h1>
          <div className="w-24 h-36 bg-gradient-to-tr from-red-600 to-red-500 rounded-lg"></div>
          <div className="w-24 h-36 bg-gradient-to-tr from-red-600 to-red-500 rounded-lg"></div>
        </div>
      )}

      {showResults && (
        <div className="absolute pb-20 w-full">
          <div className="mx-20 bg-black/70 backdrop-filter backdrop-blur rounded-lg pb-20 flex flex-col mt-2  items-center">
            <div>
              <h1 className="text-white text-4xl font-semibold mt-5 animate-bounce">
                {" "}
                {(playerScore < 21 && playerScore > dealerScore) ? "Congrats you won!" : "Sorry You lost!"}{" "}
              </h1>
            </div>

            <div>
              <h1 className="text-xl font-semibold mt-5 text-white">
                Your Score : {playerScore}
              </h1>
            </div>
            <div>
              <h1 className="text-xl font-semibold mt-5 text-white">
                Dealer's Score : {dealerScore}
              </h1>
            </div>

            <div className="flex flex-wrap gap-2">
              {dealerCards.map((card, index) => {
                return (
                  <div key={index} className="">
                    <img className="h-28 w-auto" src={card.image} alt="" />
                  </div>
                );
              })}
            </div>

            <button onClick={() => window.location.reload()} className="bg-orange-500 py-1 px-2 mt-5 text-white/80 rounded-sm hover:bg-orange-600 font-normal">Click to play again</button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 px-20 absolute mt-[30%] ">
        {playerCards.map((card, index) => {
          return (
            <motion.div initial={{opacity: 0, x : -10}} animate={{opacity: 1, x : 0}} transition={{delay: index * 0.1}} key={index} className="">
              <img className="h-28 w-auto" src={card.image} alt="" />
            </motion.div>
          );
        })}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl text-white">Your Cards</h1>
        </div>
      </div>

      <div className="flex gap-2 px-20">
        <motion.button
        transition={{duration: 0.2}}
         whileHover={{scale: 1.1}}
          onClick={handleHit}
          className="bg-orange-500 text-white text-xl px-2 py-1 rounded-sm"
        >
          Hit
        </motion.button>
        <motion.button
        transition={{duration: 0.2}}
         whileHover={{scale: 1.1}}
          onClick={handleStand}
          className="bg-yellow-500 text-white text-xl px-2 py-1 rounded-sm"
        >
          Stand
        </motion.button>

        <div className="absolute top-56 flex flex-col gap-2 bg-black/20 rounded p-4">
          <h1 className="text-white text-sm">Use hit to draw one card</h1>
          <h1 className="text-white text-sm">Use stand to show results</h1>
          <h1 className="text-white text-sm">Closer to the 21 value of total cards wins</h1>
          <h1 className="text-white text-sm">If the value is greater than 21, then automatically player loses</h1>
        </div>
      </div>
    </div>
  );
}

export default App;
