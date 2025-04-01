
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mood, moodTypes, saveMood, getUserMoods, getPartnerMoods, deleteMood } from "@/models/Mood";

const MoodJar = () => {
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState("");
  const [moodReason, setMoodReason] = useState("");
  const [userMoods, setUserMoods] = useState<Mood[]>([]);
  const [partnerMoods, setPartnerMoods] = useState<Mood[]>([]);
  const [activeTab, setActiveTab] = useState("my-jar");

  useEffect(() => {
    if (!user) return;
    
    const loadMoods = () => {
      setUserMoods(getUserMoods(user.id));
      
      if (user.partnerId) {
        setPartnerMoods(getPartnerMoods(user.partnerId));
      }
    };
    
    loadMoods();
    
    // Refresh data every minute
    const intervalId = setInterval(loadMoods, 60000);
    
    return () => clearInterval(intervalId);
  }, [user]);

  const handleAddMood = () => {
    if (!user) return;
    if (!selectedMood) {
      toast({
        title: "Error",
        description: "Please select a mood",
        variant: "destructive",
      });
      return;
    }
    
    if (!moodReason) {
      toast({
        title: "Error",
        description: "Please provide a reason for your mood",
        variant: "destructive",
      });
      return;
    }
    
    saveMood(user.id, selectedMood, moodReason);
    
    toast({
      title: "Mood Added",
      description: "Your mood has been added to your jar",
    });
    
    // Refresh moods
    setUserMoods(getUserMoods(user.id));
    setSelectedMood("");
    setMoodReason("");
  };

  const handleDeleteMood = (moodId: string) => {
    deleteMood(moodId);
    setUserMoods(getUserMoods(user.id));
    
    toast({
      title: "Mood Deleted",
      description: "Your mood has been removed from your jar",
    });
  };

  const getMoodEmoji = (moodValue: string) => {
    const mood = moodTypes.find(m => m.value === moodValue);
    return mood ? mood.emoji : "❓";
  };

  const getMoodLabel = (moodValue: string) => {
    const mood = moodTypes.find(m => m.value === moodValue);
    return mood ? mood.label : "Unknown";
  };

  const getMoodColor = (moodValue: string) => {
    const mood = moodTypes.find(m => m.value === moodValue);
    return mood ? mood.color : "bg-gray-100";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="flex-grow flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
              <p className="text-lg text-gray-800">Please sign in to use the Mood Jar</p>
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
      <main className="flex-grow bg-gradient-to-b from-blue-50 to-indigo-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold text-gray-900">
              Mood Jar
            </h1>
            <p className="text-gray-600 mt-2">
              Share your feelings with {user.partnerName || "your partner"}
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="my-jar" onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="my-jar">My Mood Jar</TabsTrigger>
                <TabsTrigger value="partner-jar" disabled={!user.partnerId}>
                  {user.partnerName ? `${user.partnerName}'s Jar` : "Partner's Jar"}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="my-jar" className="space-y-6">
                <Card className="bg-white shadow-md">
                  <CardHeader>
                    <CardTitle>How are you feeling today?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="mood">Select Your Mood</Label>
                      <Select value={selectedMood} onValueChange={setSelectedMood}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a mood" />
                        </SelectTrigger>
                        <SelectContent>
                          {moodTypes.map(mood => (
                            <SelectItem key={mood.value} value={mood.value} className="flex items-center">
                              <span className="mr-2">{mood.emoji}</span> {mood.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="reason">Why do you feel this way?</Label>
                      <Textarea
                        id="reason"
                        value={moodReason}
                        onChange={(e) => setMoodReason(e.target.value)}
                        placeholder="Share what's making you feel this way..."
                        className="min-h-[100px]"
                      />
                    </div>
                    
                    <Button 
                      className="w-full bg-blue-500 hover:bg-blue-600" 
                      onClick={handleAddMood}
                    >
                      Add to Jar
                    </Button>
                  </CardContent>
                </Card>
                
                <div className="space-y-4">
                  <h3 className="text-xl font-medium text-gray-900">Your Recent Moods</h3>
                  
                  {userMoods.length === 0 ? (
                    <Card>
                      <CardContent className="p-6 text-center text-gray-500">
                        Your jar is empty. Add your first mood!
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {userMoods.map(mood => (
                        <Card key={mood.id} className={`${getMoodColor(mood.mood)} border border-gray-200`}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center">
                                <span className="text-2xl mr-2">{getMoodEmoji(mood.mood)}</span>
                                <div>
                                  <h4 className="font-medium">{getMoodLabel(mood.mood)}</h4>
                                  <p className="text-xs text-gray-500">{formatDate(mood.timestamp)}</p>
                                </div>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-gray-400"
                                onClick={() => handleDeleteMood(mood.id)}
                              >
                                ×
                              </Button>
                            </div>
                            <p className="mt-2 text-gray-700">{mood.reason}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="partner-jar" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-medium text-gray-900">
                    {user.partnerName ? `${user.partnerName}'s Moods` : "Partner's Moods"}
                  </h3>
                  
                  {!user.partnerId ? (
                    <Card>
                      <CardContent className="p-6 text-center text-gray-500">
                        Link with your partner to see their moods
                      </CardContent>
                    </Card>
                  ) : partnerMoods.length === 0 ? (
                    <Card>
                      <CardContent className="p-6 text-center text-gray-500">
                        {user.partnerName ? `${user.partnerName} hasn't` : "Your partner hasn't"} added any moods yet
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {partnerMoods.map(mood => (
                        <Card key={mood.id} className={`${getMoodColor(mood.mood)} border border-gray-200`}>
                          <CardContent className="p-4">
                            <div className="flex items-center">
                              <span className="text-2xl mr-2">{getMoodEmoji(mood.mood)}</span>
                              <div>
                                <h4 className="font-medium">{getMoodLabel(mood.mood)}</h4>
                                <p className="text-xs text-gray-500">{formatDate(mood.timestamp)}</p>
                              </div>
                            </div>
                            <p className="mt-2 text-gray-700">{mood.reason}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
            
            <Card className="mt-8 bg-white/80 shadow-md backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-xl font-medium text-gray-900 mb-4">About Mood Jar</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Share your emotions and what's causing them</li>
                  <li>See your partner's feelings and understand them better</li>
                  <li>Foster emotional connection even when apart</li>
                  <li>Build empathy by knowing how your partner feels</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MoodJar;
