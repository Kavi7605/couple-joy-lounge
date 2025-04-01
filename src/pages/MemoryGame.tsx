import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Heart, Trophy, RefreshCw } from "lucide-react";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

// Card types for the memory game
interface MemoryCard {
  id: number;
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
}

// List of romantic emoji pairs
const emojiPairs = ["❤️", "💕", "💘", "💖", "💗", "💓", "💞", "💝", "💑", "👩‍❤️‍👨", "💏", "🌹", "🥂", "🍫", "🎁", "💍"];

const MemoryGame = () => {
  const { user } = useAuth();
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [bestScore, setBestScore] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      const savedBestScore = localStorage.getItem(`memoryGame-bestScore-${user.id}`);
      if (savedBestScore) {
        setBestScore(parseInt(savedBestScore));
      }
    }
  }, [user]);

  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  const initializeGame = () => {
    // Create a deck of cards with pairs of emojis
    const shuffledEmojis = [...emojiPairs, ...emojiPairs]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        content: emoji,
        isFlipped: false,
        isMatched: false,
      }));
    
    setCards(shuffledEmojis);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setTimer(0);
    setGameStarted(false);
    setGameCompleted(false);
    
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const startGame = () => {
    setGameStarted(true);
    
    // Start the timer
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);
    
    setTimerInterval(interval);
  };

  const handleCardClick = (id: number) => {
    // Don't allow clicking if:
    // 1. The card is already flipped or matched
    // 2. Two cards are already flipped and being checked
    // 3. Game is not started
    // 4. Game is completed
    if (
      cards[id].isFlipped ||
      cards[id].isMatched ||
      flippedCards.length >= 2 ||
      !gameStarted ||
      gameCompleted
    ) {
      return;
    }
    
    // Start the game on first card click if not started
    if (!gameStarted) {
      startGame();
    }
    
    // Flip the card
    const updatedCards = [...cards];
    updatedCards[id].isFlipped = true;
    setCards(updatedCards);
    
    // Add card to flipped cards
    const updatedFlippedCards = [...flippedCards, id];
    setFlippedCards(updatedFlippedCards);
    
    // If two cards are flipped, check for a match
    if (updatedFlippedCards.length === 2) {
      setMoves((prevMoves) => prevMoves + 1);
      
      const [firstCard, secondCard] = updatedFlippedCards;
      
      if (cards[firstCard].content === cards[secondCard].content) {
        // Match found
        const matchedCards = [...cards];
        matchedCards[firstCard].isMatched = true;
        matchedCards[secondCard].isMatched = true;
        setCards(matchedCards);
        setFlippedCards([]);
        setMatchedPairs((prevMatches) => prevMatches + 1);
        
        // Check if all pairs are matched
        if (matchedPairs + 1 === emojiPairs.length) {
          // Game completed
          if (timerInterval) {
            clearInterval(timerInterval);
          }
          setGameCompleted(true);
          
          // Update best score
          if (user) {
            const currentScore = moves + 1; // +1 because we're calculating before the state update
            const savedBestScore = localStorage.getItem(`memoryGame-bestScore-${user.id}`);
            const previousBestScore = savedBestScore ? parseInt(savedBestScore) : null;
            
            if (!previousBestScore || currentScore < previousBestScore) {
              localStorage.setItem(`memoryGame-bestScore-${user.id}`, currentScore.toString());
              setBestScore(currentScore);
              toast({
                title: "New Best Score!",
                description: `You've achieved a new personal best: ${currentScore} moves!`,
              });
            }
          }
        }
      } else {
        // No match, flip cards back after a delay
        setTimeout(() => {
          const unflippedCards = [...cards];
          unflippedCards[firstCard].isFlipped = false;
          unflippedCards[secondCard].isFlipped = false;
          setCards(unflippedCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-medium text-gray-900 mb-4">Please sign in to play the Memory Game</h1>
            <Link to="/login">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow bg-gradient-to-b from-white to-peach-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-display font-bold text-gray-900">
              Couples Memory Game
            </h1>
            <p className="text-gray-500 mt-2">
              Test your memory and have fun together
            </p>
          </div>
          
          <div className="mb-8 flex justify-center">
            <Card className="w-full max-w-md">
              <CardContent className="pt-6 text-center">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-peach-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Moves</p>
                    <p className="text-2xl font-bold text-peach-600">{moves}</p>
                  </div>
                  <div className="bg-peach-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="text-2xl font-bold text-peach-600">{formatTime(timer)}</p>
                  </div>
                </div>
                
                <div className="flex justify-center space-x-4">
                  {!gameStarted ? (
                    <Button onClick={startGame} className="bg-peach-500 hover:bg-peach-600">
                      Start Game
                    </Button>
                  ) : (
                    <Button onClick={initializeGame} variant="outline">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Restart
                    </Button>
                  )}
                </div>
                
                {bestScore && (
                  <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
                    <Trophy className="h-4 w-4 mr-1 text-yellow-500" />
                    Best Score: {bestScore} moves
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2 sm:gap-4 max-w-4xl mx-auto">
            {cards.map((card) => (
              <div
                key={card.id}
                className={`aspect-square rounded-lg cursor-pointer transition-all duration-300 transform ${
                  card.isFlipped ? 'rotate-y-180' : ''
                } ${gameStarted ? '' : 'hover:scale-105'}`}
                onClick={() => handleCardClick(card.id)}
              >
                <div
                  className={`w-full h-full flex items-center justify-center rounded-lg text-2xl sm:text-4xl ${
                    card.isFlipped || card.isMatched
                      ? 'bg-white border-2 border-peach-200'
                      : 'bg-gradient-to-br from-peach-400 to-peach-600'
                  }`}
                >
                  {card.isFlipped || card.isMatched ? (
                    card.content
                  ) : (
                    <Heart className="h-6 w-6 text-white" />
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Game Complete Dialog */}
          <Dialog open={gameCompleted} onOpenChange={setGameCompleted}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-center text-2xl">
                  <div className="flex items-center justify-center">
                    <Trophy className="h-6 w-6 mr-2 text-yellow-500" />
                    Congratulations!
                  </div>
                </DialogTitle>
                <DialogDescription className="text-center">
                  You've matched all the cards!
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-peach-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-500">Total Moves</p>
                    <p className="text-2xl font-bold text-peach-600">{moves}</p>
                  </div>
                  <div className="bg-peach-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-500">Time Taken</p>
                    <p className="text-2xl font-bold text-peach-600">{formatTime(timer)}</p>
                  </div>
                </div>
                
                {bestScore === moves && (
                  <div className="mb-4 text-center">
                    <div className="inline-block bg-yellow-100 px-4 py-2 rounded-full">
                      <p className="text-yellow-800 flex items-center">
                        <Trophy className="h-4 w-4 mr-1" />
                        New Best Score!
                      </p>
                    </div>
                  </div>
                )}
                
                <p className="text-center text-gray-600">
                  Share this game with {user.partnerName || "your partner"} and challenge them to beat your score!
                </p>
              </div>
              
              <DialogFooter>
                <Button onClick={initializeGame} className="w-full bg-peach-500 hover:bg-peach-600">
                  Play Again
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MemoryGame;
