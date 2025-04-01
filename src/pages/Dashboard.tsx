import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Calendar, PenSquare, GamepadIcon, Edit } from "lucide-react";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Dashboard = () => {
  const { user, updateProfile, loading, error } = useAuth();
  const [partnerName, setPartnerName] = useState(user?.partnerName || "");
  const [partnerBirthday, setPartnerBirthday] = useState(user?.partnerBirthday || "");
  const [anniversaryDate, setAnniversaryDate] = useState(user?.anniversaryDate || "");
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  
  const [daysUntilBirthday, setDaysUntilBirthday] = useState<number | null>(null);
  const [daysUntilAnniversary, setDaysUntilAnniversary] = useState<number | null>(null);

  useEffect(() => {
    if (user?.partnerName) setPartnerName(user.partnerName);
    if (user?.partnerBirthday) setPartnerBirthday(user.partnerBirthday);
    if (user?.anniversaryDate) setAnniversaryDate(user.anniversaryDate);
    
    calculateDaysUntilBirthday();
    calculateDaysUntilAnniversary();
  }, [user]);

  const calculateDaysUntilBirthday = () => {
    if (!user?.partnerBirthday) return;
    
    const today = new Date();
    const birthday = new Date(user.partnerBirthday);
    
    let nextBirthday = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());
    
    // If the birthday has already occurred this year, set it for next year
    if (today > nextBirthday) {
      nextBirthday = new Date(today.getFullYear() + 1, birthday.getMonth(), birthday.getDate());
    }
    
    const diffTime = nextBirthday.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    setDaysUntilBirthday(diffDays);
  };

  const calculateDaysUntilAnniversary = () => {
    if (!user?.anniversaryDate) return;
    
    const today = new Date();
    const anniversary = new Date(user.anniversaryDate);
    
    let nextAnniversary = new Date(today.getFullYear(), anniversary.getMonth(), anniversary.getDate());
    
    // If the anniversary has already occurred this year, set it for next year
    if (today > nextAnniversary) {
      nextAnniversary = new Date(today.getFullYear() + 1, anniversary.getMonth(), anniversary.getDate());
    }
    
    const diffTime = nextAnniversary.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    setDaysUntilAnniversary(diffDays);
  };

  const handleSaveProfile = async () => {
    await updateProfile({
      partnerName,
      partnerBirthday,
      anniversaryDate,
    });
    
    setIsProfileDialogOpen(false);
    calculateDaysUntilBirthday();
    calculateDaysUntilAnniversary();
    
    toast({
      title: "Profile Updated",
      description: "Your relationship details have been saved!",
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-medium text-gray-900 mb-4">Please sign in to view your dashboard</h1>
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
      
      <main className="flex-grow bg-gradient-to-b from-white to-purple-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-display font-bold text-gray-900">
              Welcome, {user.name}!
            </h1>
            <p className="text-gray-500 mt-2">
              {user.partnerName 
                ? `You and ${user.partnerName}'s private space`
                : "Set up your relationship profile to get started"}
            </p>
            <Button 
              variant="outline" 
              className="mt-4 border-love-200 text-love-700 hover:bg-love-200 hover:text-love-800"
              onClick={() => setIsProfileDialogOpen(true)}
            >
              Edit Profile
            </Button>
          </div>
          
          {!user.partnerName && (
            <Alert className="mb-8 max-w-2xl mx-auto">
              <AlertDescription>
                Add your partner's details to unlock all features
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex justify-end mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={() => setIsProfileDialogOpen(true)}
            >
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
            {/* Birthday Countdown Card */}
            <Card className="bg-gradient-to-br from-love-50 to-love-100 hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-love-600" />
                  Birthday Countdown
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                {user.partnerBirthday ? (
                  <>
                    <div className="text-3xl font-bold text-love-700">
                      {daysUntilBirthday} {daysUntilBirthday === 1 ? 'day' : 'days'}
                    </div>
                    <p className="text-sm text-love-600 mt-1">
                      until {user.partnerName}'s birthday
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-love-600">
                    Add your partner's birthday to see the countdown
                  </p>
                )}
              </CardContent>
              <CardFooter>
                <Link to="/birthday-countdown" className="w-full">
                  <Button variant="outline" size="sm" className="w-full border-love-200 text-love-700 hover:bg-love-200 hover:text-love-800">
                    Plan Birthday
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Love Letters Card */}
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <PenSquare className="h-5 w-5 mr-2 text-purple-600" />
                  Love Letters
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-purple-600">
                  Write a beautiful letter to express your feelings to {user.partnerName || "your partner"}
                </p>
              </CardContent>
              <CardFooter>
                <Link to="/love-letters" className="w-full">
                  <Button variant="outline" size="sm" className="w-full border-purple-200 text-purple-700 hover:bg-purple-200 hover:text-purple-800">
                    Write a Letter
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Game Card */}
            <Card className="bg-gradient-to-br from-peach-50 to-peach-100 hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <GamepadIcon className="h-5 w-5 mr-2 text-peach-600" />
                  Love Game
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-peach-600">
                  Try our cute annoying game designed to make your partner smile
                </p>
              </CardContent>
              <CardFooter>
                <Link to="/love-game" className="w-full">
                  <Button variant="outline" size="sm" className="w-full border-peach-200 text-peach-700 hover:bg-peach-200 hover:text-peach-800">
                    Play Game
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Miss You Card */}
            <Card className="bg-gradient-to-br from-pink-50 to-pink-100 hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-pink-600" />
                  Miss You
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-pink-600">
                  Let your partner know how much you miss them
                </p>
              </CardContent>
              <CardFooter>
                <Link to="/miss-you" className="w-full">
                  <Button variant="outline" size="sm" className="w-full border-pink-200 text-pink-700 hover:bg-pink-200 hover:text-pink-800">
                    Miss Them
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Mood Jar Card */}
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <span className="emoji text-xl mr-2">🫙</span>
                  Mood Jar
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-blue-600">
                  Share your mood with your partner
                </p>
              </CardContent>
              <CardFooter>
                <Link to="/mood-jar" className="w-full">
                  <Button variant="outline" size="sm" className="w-full border-blue-200 text-blue-700 hover:bg-blue-200 hover:text-blue-800">
                    Open Jar
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
          
          {/* Anniversary Section */}
          {user.anniversaryDate && (
            <div className="mb-8">
              <Card className="bg-gradient-to-r from-love-100 to-purple-100">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row items-center">
                    <div className="flex-1 text-center md:text-left mb-4 md:mb-0">
                      <h3 className="text-xl font-display font-bold text-gray-900">
                        Your Anniversary
                      </h3>
                      <p className="text-gray-600 mt-1">
                        {daysUntilAnniversary === 0 
                          ? "Today is your anniversary! 🎉" 
                          : `${daysUntilAnniversary} ${daysUntilAnniversary === 1 ? 'day' : 'days'} until your anniversary`}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Heart className="h-8 w-8 text-love-500 animate-heartbeat" />
                      <div className="text-4xl font-bold text-love-700">
                        {user.anniversaryDate && new Date().getFullYear() - new Date(user.anniversaryDate).getFullYear()}
                      </div>
                      <div className="text-gray-600">years</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Profile Dialog */}
          <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Relationship Details</DialogTitle>
                <DialogDescription>
                  Update information about you and your partner
                </DialogDescription>
              </DialogHeader>
              
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="partnerName">Partner's Name</Label>
                  <Input
                    id="partnerName"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    placeholder="Enter your partner's name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="partnerBirthday">Partner's Birthday</Label>
                  <Input
                    id="partnerBirthday"
                    type="date"
                    value={partnerBirthday}
                    onChange={(e) => setPartnerBirthday(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="anniversaryDate">Anniversary Date</Label>
                  <Input
                    id="anniversaryDate"
                    type="date"
                    value={anniversaryDate}
                    onChange={(e) => setAnniversaryDate(e.target.value)}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button onClick={handleSaveProfile} disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
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

export default Dashboard;
