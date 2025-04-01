
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Calendar, PenSquare, UserIcon, GamepadIcon } from "lucide-react";
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
                ? `You and ${user.partnerName}'s special place`
                : "Set up your relationship profile to get started"}
            </p>
          </div>
          
          {!user.partnerName && (
            <Alert className="mb-8 max-w-2xl mx-auto">
              <AlertDescription>
                Add your partner's details to unlock all features
              </AlertDescription>
            </Alert>
          )}
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {/* Profile Card */}
            <Card className="bg-white hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <UserIcon className="h-5 w-5 mr-2 text-purple-500" />
                  Relationship Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="text-gray-500">Your Name</dt>
                    <dd>{user.name}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Partner Name</dt>
                    <dd>{user.partnerName || "Not set"}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Partner's Birthday</dt>
                    <dd>{user.partnerBirthday 
                      ? new Date(user.partnerBirthday).toLocaleDateString() 
                      : "Not set"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Anniversary</dt>
                    <dd>{user.anniversaryDate 
                      ? new Date(user.anniversaryDate).toLocaleDateString() 
                      : "Not set"}
                    </dd>
                  </div>
                </dl>
              </CardContent>
              <CardFooter>
                <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full">
                      Edit Profile
                    </Button>
                  </DialogTrigger>
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
              </CardFooter>
            </Card>

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

            {/* Couples Game Card */}
            <Card className="bg-gradient-to-br from-peach-50 to-peach-100 hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <GamepadIcon className="h-5 w-5 mr-2 text-peach-600" />
                  Couples Game
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-peach-600">
                  Have fun with our special memory game designed for couples
                </p>
              </CardContent>
              <CardFooter>
                <Link to="/memory-game" className="w-full">
                  <Button variant="outline" size="sm" className="w-full border-peach-200 text-peach-700 hover:bg-peach-200 hover:text-peach-800">
                    Play Game
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
          
          {/* Quick Links Section */}
          <div className="text-center">
            <h2 className="text-2xl font-display font-medium text-gray-900 mb-4">
              Quick Links
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/birthday-countdown">
                <Button variant="outline" className="border-love-200 text-love-700 hover:bg-love-100">
                  <Calendar className="h-4 w-4 mr-2" />
                  Birthday Ideas
                </Button>
              </Link>
              <Link to="/love-letters">
                <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-100">
                  <PenSquare className="h-4 w-4 mr-2" />
                  Write Letter
                </Button>
              </Link>
              <Link to="/memory-game">
                <Button variant="outline" className="border-peach-200 text-peach-700 hover:bg-peach-100">
                  <GamepadIcon className="h-4 w-4 mr-2" />
                  Play Game
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
