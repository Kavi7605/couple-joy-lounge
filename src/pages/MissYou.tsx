import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

interface MissYouData {
  userId: string;
  count: number;
  lastUpdated: string;
}

const MissYou = () => {
  const { user } = useAuth();
  const [missYouCount, setMissYouCount] = useState(0);
  const [partnerMissYouCount, setPartnerMissYouCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    // Load miss you data
    const missYouData = JSON.parse(localStorage.getItem('missYouData') || '[]');
    const userMissYou = missYouData.find((data: MissYouData) => data.userId === user.id);
    
    if (userMissYou) {
      setMissYouCount(userMissYou.count);
    }
    
    // If there's a partner, get their miss you count
    if (user.partnerId) {
      const partnerMissYou = missYouData.find((data: MissYouData) => data.userId === user.partnerId);
      if (partnerMissYou) {
        setPartnerMissYouCount(partnerMissYou.count);
      }
    }
  }, [user]);

  const handleMissYouClick = () => {
    if (!user) return;
    
    setIsAnimating(true);
    
    // Load existing data
    const missYouData = JSON.parse(localStorage.getItem('missYouData') || '[]');
    const userIndex = missYouData.findIndex((data: MissYouData) => data.userId === user.id);
    
    const newCount = missYouCount + 1;
    setMissYouCount(newCount);
    
    // Update or add user's miss you data
    if (userIndex >= 0) {
      missYouData[userIndex].count = newCount;
      missYouData[userIndex].lastUpdated = new Date().toISOString();
    } else {
      missYouData.push({
        userId: user.id,
        count: newCount,
        lastUpdated: new Date().toISOString()
      });
    }
    
    localStorage.setItem('missYouData', JSON.stringify(missYouData));
    
    toast({
      title: "Miss You Sent",
      description: user.partnerName ? `${user.partnerName} will know you're missing them` : "Your partner will know you're missing them",
    });
    
    // Reset animation after 1 second
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="flex-grow flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
              <p className="text-lg text-gray-800">Please sign in to use the Miss You feature</p>
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
      
      <main className="flex-grow bg-gradient-to-b from-pink-50 to-red-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-display font-bold text-gray-900">
              Miss You
            </h1>
            <p className="text-gray-600 mt-2">
              Let {user.partnerName || "your partner"} know how much you miss them
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* You miss your partner */}
              <div className="flex flex-col items-center">
                <h3 className="text-xl font-medium text-gray-900 mb-4">
                  You miss {user.partnerName || "your partner"}
                </h3>
                <div
                  className={`relative cursor-pointer transition-all duration-300 ${
                    isAnimating ? 'scale-150' : 'scale-100 hover:scale-110'
                  }`}
                  onClick={handleMissYouClick}
                >
                  <Heart
                    className={`h-32 w-32 ${
                      isAnimating
                        ? 'text-red-500 animate-ping'
                        : 'text-red-400 hover:text-red-500'
                    }`}
                    fill={isAnimating ? "currentColor" : "none"}
                    strokeWidth={1.5}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-2xl">
                    {missYouCount}
                  </div>
                </div>
                <p className="mt-4 text-center text-gray-700">
                  You've clicked "Miss You" {missYouCount} times
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4 border-pink-200 text-pink-700 hover:bg-pink-100"
                  onClick={handleMissYouClick}
                >
                  I miss you!
                </Button>
              </div>
              
              {/* Partner misses you */}
              <div className="flex flex-col items-center">
                <h3 className="text-xl font-medium text-gray-900 mb-4">
                  {user.partnerName || "Your partner"} misses you
                </h3>
                <div className="relative">
                  <Heart
                    className="h-32 w-32 text-red-400"
                    fill="currentColor"
                    strokeWidth={1.5}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-2xl">
                    {partnerMissYouCount}
                  </div>
                </div>
                <p className="mt-4 text-center text-gray-700">
                  {user.partnerName || "Your partner"} has clicked "Miss You" {partnerMissYouCount} times
                </p>
                <div className="h-10 mt-4">
                  {/* Spacer to align with the other column */}
                </div>
              </div>
            </div>
            
            <Card className="bg-white/80 shadow-md backdrop-blur-sm mb-8">
              <CardContent className="p-6">
                <h3 className="text-xl font-medium text-gray-900 mb-4">How it works</h3>
                <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                  <li>Click the heart whenever you miss your partner</li>
                  <li>Your partner will see the counter increase</li>
                  <li>It's a simple way to let them know you're thinking of them</li>
                </ol>
              </CardContent>
            </Card>
            
            {user.partnerId ? (
              <Card className="bg-gradient-to-br from-pink-100 to-red-100">
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    Your Miss You Ratio
                  </h3>
                  <div className="flex justify-center items-center space-x-2">
                    <div className="text-center">
                      <span className="text-2xl font-bold text-red-600">{missYouCount}</span>
                      <p className="text-sm text-gray-600">You</p>
                    </div>
                    <span className="text-xl">:</span>
                    <div className="text-center">
                      <span className="text-2xl font-bold text-red-600">{partnerMissYouCount}</span>
                      <p className="text-sm text-gray-600">{user.partnerName}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-700 text-sm">
                    {missYouCount > partnerMissYouCount 
                      ? `You miss ${user.partnerName} more!` 
                      : missYouCount < partnerMissYouCount 
                        ? `${user.partnerName} misses you more!` 
                        : "You miss each other equally!"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-700">
                    Link with your partner to see how much they miss you!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MissYou;
