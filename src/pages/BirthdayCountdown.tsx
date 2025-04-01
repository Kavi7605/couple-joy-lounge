
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Gift, Heart, CalendarDays } from "lucide-react";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";

interface CountdownData {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

const BirthdayCountdown = () => {
  const { user } = useAuth();
  const [countdown, setCountdown] = useState<CountdownData>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });
  const [giftIdeas, setGiftIdeas] = useState<string[]>([]);
  const [newGiftIdea, setNewGiftIdea] = useState("");

  useEffect(() => {
    // Load gift ideas from localStorage
    const savedGiftIdeas = localStorage.getItem(`giftIdeas-${user?.id}`);
    if (savedGiftIdeas) {
      setGiftIdeas(JSON.parse(savedGiftIdeas));
    }

    // Start countdown if partner birthday is set
    if (user?.partnerBirthday) {
      const intervalId = setInterval(updateCountdown, 1000);
      updateCountdown();
      
      return () => clearInterval(intervalId);
    }
  }, [user]);

  const updateCountdown = () => {
    if (!user?.partnerBirthday) return;
    
    const now = new Date();
    const birthday = new Date(user.partnerBirthday);
    
    // Set the birthday for this year
    const currentYearBirthday = new Date(
      now.getFullYear(),
      birthday.getMonth(),
      birthday.getDate()
    );
    
    // If the birthday has already passed this year, set it for next year
    if (now > currentYearBirthday) {
      currentYearBirthday.setFullYear(now.getFullYear() + 1);
    }
    
    const diff = currentYearBirthday.getTime() - now.getTime();
    
    if (diff <= 0) {
      setCountdown({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isPast: true,
      });
      return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    setCountdown({
      days,
      hours,
      minutes,
      seconds,
      isPast: false,
    });
  };

  const handleAddGiftIdea = () => {
    if (newGiftIdea.trim() === "" || !user) return;
    
    const updatedGiftIdeas = [...giftIdeas, newGiftIdea];
    setGiftIdeas(updatedGiftIdeas);
    setNewGiftIdea("");
    
    // Save to localStorage
    localStorage.setItem(`giftIdeas-${user.id}`, JSON.stringify(updatedGiftIdeas));
  };

  const handleRemoveGiftIdea = (index: number) => {
    if (!user) return;
    
    const updatedGiftIdeas = giftIdeas.filter((_, i) => i !== index);
    setGiftIdeas(updatedGiftIdeas);
    
    // Save to localStorage
    localStorage.setItem(`giftIdeas-${user.id}`, JSON.stringify(updatedGiftIdeas));
  };

  const formatBirthday = () => {
    if (!user?.partnerBirthday) return "";
    
    const birthday = new Date(user.partnerBirthday);
    return birthday.toLocaleDateString(undefined, { 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const calculateAge = () => {
    if (!user?.partnerBirthday) return 0;
    
    const birthday = new Date(user.partnerBirthday);
    const now = new Date();
    
    let age = now.getFullYear() - birthday.getFullYear();
    
    // Adjust age if birthday hasn't occurred yet this year
    const currentYearBirthday = new Date(
      now.getFullYear(),
      birthday.getMonth(),
      birthday.getDate()
    );
    
    if (now < currentYearBirthday) {
      age--;
    }
    
    return age + 1; // Next birthday age
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-medium text-gray-900 mb-4">Please sign in to view birthday countdown</h1>
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
      
      <main className="flex-grow bg-gradient-to-b from-white to-love-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-display font-bold text-gray-900">
              {user.partnerName 
                ? `${user.partnerName}'s Birthday Countdown` 
                : "Birthday Countdown"}
            </h1>
            {user.partnerBirthday ? (
              <p className="text-gray-500 mt-2">
                {formatBirthday()} — Turning {calculateAge()} years old
              </p>
            ) : (
              <p className="text-gray-500 mt-2">
                Add your partner's details to see the countdown
              </p>
            )}
          </div>
          
          {!user.partnerBirthday ? (
            <div className="max-w-md mx-auto text-center">
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-4">
                    <CalendarDays className="h-12 w-12 mx-auto text-love-500 mb-4" />
                    <p className="text-gray-600">
                      You haven't set your partner's birthday yet. Add it in your profile to see the birthday countdown.
                    </p>
                  </div>
                  <Link to="/dashboard">
                    <Button>
                      Update Profile
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {/* Countdown Section */}
              <div>
                <Card className="bg-white shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-love-500 to-purple-500 py-4 px-6 text-white">
                    <div className="flex items-center">
                      <Calendar className="h-6 w-6 mr-2" />
                      <h2 className="text-xl font-semibold">
                        Time Remaining
                      </h2>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    {countdown.isPast ? (
                      <div className="text-center py-8">
                        <Heart className="h-16 w-16 mx-auto text-love-500 mb-4 animate-heartbeat" />
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          It's {user.partnerName}'s Birthday Today!
                        </h3>
                        <p className="text-gray-600">
                          Don't forget to make it special!
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-4 gap-4 text-center">
                        <div className="bg-love-50 p-4 rounded-lg">
                          <div className="text-3xl sm:text-4xl font-bold text-love-600">
                            {countdown.days}
                          </div>
                          <div className="text-sm text-gray-500">Days</div>
                        </div>
                        <div className="bg-love-50 p-4 rounded-lg">
                          <div className="text-3xl sm:text-4xl font-bold text-love-600">
                            {countdown.hours}
                          </div>
                          <div className="text-sm text-gray-500">Hours</div>
                        </div>
                        <div className="bg-love-50 p-4 rounded-lg">
                          <div className="text-3xl sm:text-4xl font-bold text-love-600">
                            {countdown.minutes}
                          </div>
                          <div className="text-sm text-gray-500">Minutes</div>
                        </div>
                        <div className="bg-love-50 p-4 rounded-lg">
                          <div className="text-3xl sm:text-4xl font-bold text-love-600">
                            {countdown.seconds}
                          </div>
                          <div className="text-sm text-gray-500">Seconds</div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              {/* Birthday Planning Section */}
              <div>
                <Tabs defaultValue="gift-ideas">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="gift-ideas" className="text-sm">
                      <Gift className="h-4 w-4 mr-2" />
                      Gift Ideas
                    </TabsTrigger>
                    <TabsTrigger value="celebration-ideas" className="text-sm">
                      <Heart className="h-4 w-4 mr-2" />
                      Celebration Ideas
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="gift-ideas" className="mt-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="flex space-x-2">
                            <Input
                              placeholder="Add a gift idea..."
                              value={newGiftIdea}
                              onChange={(e) => setNewGiftIdea(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleAddGiftIdea();
                                }
                              }}
                            />
                            <Button onClick={handleAddGiftIdea}>Add</Button>
                          </div>
                          
                          <div className="max-h-80 overflow-y-auto">
                            {giftIdeas.length > 0 ? (
                              <ul className="space-y-2">
                                {giftIdeas.map((idea, index) => (
                                  <li key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                                    <span>{idea}</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleRemoveGiftIdea(index)}
                                      className="text-gray-400 hover:text-red-500"
                                    >
                                      ×
                                    </Button>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <div className="text-center py-8 text-gray-500">
                                <Gift className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                                <p>No gift ideas yet. Add some!</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="celebration-ideas" className="mt-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Celebration Ideas for {user.partnerName}</h3>
                          
                          <div className="grid gap-4">
                            <div className="bg-purple-50 p-4 rounded-lg">
                              <h4 className="font-medium text-purple-700 mb-2">Romantic Dinner</h4>
                              <p className="text-gray-600 text-sm">
                                Cook their favorite meal or reserve a table at their favorite restaurant.
                              </p>
                            </div>
                            
                            <div className="bg-love-50 p-4 rounded-lg">
                              <h4 className="font-medium text-love-700 mb-2">Surprise Party</h4>
                              <p className="text-gray-600 text-sm">
                                Invite close friends and family for a surprise gathering.
                              </p>
                            </div>
                            
                            <div className="bg-peach-50 p-4 rounded-lg">
                              <h4 className="font-medium text-peach-700 mb-2">Adventure Date</h4>
                              <p className="text-gray-600 text-sm">
                                Plan an exciting activity they've always wanted to try.
                              </p>
                            </div>
                            
                            <div className="bg-purple-50 p-4 rounded-lg">
                              <h4 className="font-medium text-purple-700 mb-2">Memory Scrapbook</h4>
                              <p className="text-gray-600 text-sm">
                                Create a personalized photo album of your relationship milestones.
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BirthdayCountdown;
