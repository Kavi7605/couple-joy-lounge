import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

const LoveGame = () => {
  const { user } = useAuth();
  const [gameStarted, setGameStarted] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [clickCount, setClickCount] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [difficulty, setDifficulty] = useState('easy');
  const [gameMessages, setGameMessages] = useState<string[]>([]);
  const [countdown, setCountdown] = useState(30);

  const annoying_messages = [
    "Almost got me!",
    "Too slow!",
    "Oops! Missed again!",
    "Catch me if you can!",
    "Try again, love!",
    "Nope, not here!",
    "You're cute when you're frustrated!",
    "Close one!",
    "Keep trying!",
    "Getting warmer...",
  ];

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    
    if (gameStarted && !gameWon) {
      // Move button randomly
      intervalId = setInterval(() => {
        moveButtonRandomly();
      }, difficulty === 'easy' ? 1500 : difficulty === 'medium' ? 1000 : 700);
      
      // Start countdown
      const countdownId = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setGameStarted(false);
            clearInterval(intervalId!);
            toast({
              title: "Time's up!",
              description: "You ran out of time! Try again?",
            });
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => {
        if (intervalId) clearInterval(intervalId);
        clearInterval(countdownId);
      };
    }
  }, [gameStarted, difficulty, gameWon]);

  const startGame = (level: string) => {
    setDifficulty(level);
    setGameStarted(true);
    setGameWon(false);
    setClickCount(0);
    setGameMessages([]);
    setCountdown(30);
    setIsButtonVisible(true);
    moveButtonRandomly();
  };

  const moveButtonRandomly = () => {
    const maxX = window.innerWidth - 150;
    const maxY = window.innerHeight - 150;
    
    const newX = Math.max(20, Math.floor(Math.random() * maxX));
    const newY = Math.max(80, Math.floor(Math.random() * maxY));
    
    setButtonPosition({ x: newX, y: newY });
    
    // Add a random message
    if (gameMessages.length < 5) {
      const randomMessage = annoying_messages[Math.floor(Math.random() * annoying_messages.length)];
      setGameMessages(prev => [...prev, randomMessage]);
    } else {
      // Keep only the last 5 messages
      setGameMessages(prev => [...prev.slice(1), annoying_messages[Math.floor(Math.random() * annoying_messages.length)]]);
    }
  };

  const handleButtonClick = () => {
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);
    
    if (newClickCount >= 3) {
      setIsButtonVisible(false);
      setGameWon(true);
      setGameStarted(false);
      toast({
        title: "You won!",
        description: "You finally caught the button! Love wins!",
      });
    } else {
      moveButtonRandomly();
      toast({
        title: "Almost there!",
        description: `Caught it ${newClickCount}/3 times!`,
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="flex-grow flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
              <p className="text-lg text-gray-800">Please sign in to play the Love Game</p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow bg-gradient-to-b from-peach-50 to-pink-50 py-12 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold text-gray-900">
              The "Annoying Love" Game
            </h1>
            <p className="text-gray-600 mt-2">
              Can you catch the elusive love button?
            </p>
          </div>
          
          {!gameStarted && !gameWon && (
            <div className="max-w-md mx-auto space-y-8">
              <Card className="bg-white shadow-md">
                <CardHeader>
                  <CardTitle>Choose Difficulty</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col gap-3">
                    <Button 
                      onClick={() => startGame('easy')}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      Easy - For Beginners
                    </Button>
                    <Button 
                      onClick={() => startGame('medium')}
                      className="bg-amber-500 hover:bg-amber-600"
                    >
                      Medium - Getting Annoying
                    </Button>
                    <Button 
                      onClick={() => startGame('hard')}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Hard - Super Annoying!
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 shadow-md backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-medium text-gray-900 mb-4">How to Play</h3>
                  <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                    <li>Click "Start Game" to begin</li>
                    <li>Try to catch the moving love button</li>
                    <li>You need to catch it 3 times to win</li>
                    <li>You have 30 seconds to complete the challenge</li>
                    <li>The button gets more annoying as difficulty increases!</li>
                  </ol>
                </CardContent>
              </Card>
            </div>
          )}
          
          {gameStarted && (
            <div className="relative h-[calc(100vh-300px)] min-h-[400px] bg-white/30 backdrop-blur-sm rounded-lg shadow-md border border-white/50 overflow-hidden">
              <div className="absolute top-2 right-4 z-10 flex items-center">
                <span className="bg-peach-200 text-peach-800 font-medium px-3 py-1 rounded-full">
                  Time: {countdown}s
                </span>
              </div>
              
              <div className="absolute top-2 left-4 z-10 flex items-center">
                <span className="bg-peach-200 text-peach-800 font-medium px-3 py-1 rounded-full">
                  Caught: {clickCount}/3
                </span>
              </div>
              
              {isButtonVisible && (
                <Button
                  className="absolute bg-love-500 hover:bg-love-600 z-20 transition-all duration-300 flex items-center"
                  style={{
                    left: `${buttonPosition.x}px`,
                    top: `${buttonPosition.y}px`,
                  }}
                  onClick={handleButtonClick}
                >
                  <Heart className="mr-2 h-4 w-4" /> Catch Me!
                </Button>
              )}
              
              {/* Speech bubbles */}
              {gameMessages.map((message, index) => (
                <div
                  key={index}
                  className="absolute bg-white rounded-xl p-3 shadow-md animate-fade-out"
                  style={{
                    left: `${Math.random() * 70 + 15}%`,
                    top: `${Math.random() * 70 + 15}%`,
                    opacity: 1 - index * 0.2,
                    transform: `scale(${1 - index * 0.1})`,
                  }}
                >
                  {message}
                </div>
              ))}
            </div>
          )}
          
          {gameWon && (
            <div className="max-w-md mx-auto">
              <Card className="bg-gradient-to-br from-pink-100 to-peach-200">
                <CardContent className="p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <Heart className="h-16 w-16 text-love-500 animate-heartbeat" fill="currentColor" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    You Won!
                  </h2>
                  <p className="text-gray-700 mb-6">
                    You successfully caught the elusive love button. 
                    {user.partnerName ? ` ${user.partnerName} would be proud!` : ' Your partner would be proud!'}
                  </p>
                  <Button
                    onClick={() => startGame(difficulty)}
                    className="bg-love-500 hover:bg-love-600"
                  >
                    Play Again?
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoveGame;
