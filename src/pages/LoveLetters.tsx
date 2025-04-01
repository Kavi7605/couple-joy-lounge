
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PenSquare, Heart, MailOpen, Trash2 } from "lucide-react";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { LoveLetter, saveLoveLetter, getUserLetters, deleteLetter } from "../models/LoveLetter";
import { toast } from "@/components/ui/use-toast";

const LoveLetters = () => {
  const { user } = useAuth();
  const [letters, setLetters] = useState<LoveLetter[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<LoveLetter | null>(null);
  const [isReadDialogOpen, setIsReadDialogOpen] = useState(false);
  
  // New letter form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#FFF5F5");
  const [fontStyle, setFontStyle] = useState("font-sans");

  useEffect(() => {
    if (user) {
      const userLetters = getUserLetters(user.id);
      setLetters(userLetters);
    }
  }, [user]);

  const handleCreateLetter = () => {
    if (!user) return;
    
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Please fill out all fields",
        variant: "destructive",
      });
      return;
    }
    
    const newLetter = saveLoveLetter({
      from: user.id,
      to: user.partnerName || "Your Love",
      title,
      content,
      backgroundColor,
      fontStyle,
    });
    
    setLetters([...letters, newLetter]);
    
    toast({
      title: "Love Letter Created",
      description: "Your letter has been saved successfully!",
    });
    
    // Reset form
    setTitle("");
    setContent("");
    setBackgroundColor("#FFF5F5");
    setFontStyle("font-sans");
    setIsCreateDialogOpen(false);
  };

  const handleReadLetter = (letter: LoveLetter) => {
    setSelectedLetter(letter);
    setIsReadDialogOpen(true);
  };

  const handleDeleteLetter = (letterId: string) => {
    deleteLetter(letterId);
    setLetters(letters.filter((letter) => letter.id !== letterId));
    setIsReadDialogOpen(false);
    
    toast({
      title: "Letter Deleted",
      description: "The letter has been deleted successfully.",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-medium text-gray-900 mb-4">Please sign in to view love letters</h1>
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
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-center">
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900">
                Love Letters
              </h1>
              <p className="text-gray-500 mt-2">
                Express your feelings in beautiful written notes
              </p>
            </div>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="mt-4 sm:mt-0 bg-purple-500 hover:bg-purple-600">
                  <PenSquare className="h-4 w-4 mr-2" />
                  Write a Letter
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Write a Love Letter</DialogTitle>
                  <DialogDescription>
                    Express your feelings to {user.partnerName || "your partner"}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Give your letter a title"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="content">Your Message</Label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Write your love letter here..."
                      className="min-h-[200px]"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="background">Background Color</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="color"
                          id="background"
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="w-12 h-8 p-0"
                        />
                        <div 
                          className="flex-1 h-8 rounded-md border"
                          style={{ backgroundColor }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="fontStyle">Font Style</Label>
                      <select
                        id="fontStyle"
                        value={fontStyle}
                        onChange={(e) => setFontStyle(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="font-sans">Default</option>
                        <option value="font-display">Elegant</option>
                        <option value="font-mono">Typewriter</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-sm font-medium mb-2">Preview</h3>
                    <div 
                      className={`border rounded-md p-4 ${fontStyle}`}
                      style={{ backgroundColor }}
                    >
                      <h4 className="text-lg font-bold">{title || "Your Letter Title"}</h4>
                      <p className="mt-2 whitespace-pre-line">
                        {content || "Your love letter content will appear here..."}
                      </p>
                      <div className="mt-4 text-right">
                        <p className="text-sm italic">With love, {user.name}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button onClick={handleCreateLetter}>
                    Save Letter
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <Tabs defaultValue="my-letters">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="my-letters" className="text-sm">
                <PenSquare className="h-4 w-4 mr-2" />
                My Letters
              </TabsTrigger>
              <TabsTrigger value="received-letters" className="text-sm">
                <MailOpen className="h-4 w-4 mr-2" />
                Received Letters
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="my-letters">
              {letters.filter(letter => letter.from === user.id).length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {letters
                    .filter(letter => letter.from === user.id)
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((letter) => (
                      <Card key={letter.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <div className="h-2 bg-purple-500"></div>
                        <CardHeader className="pb-2">
                          <CardTitle>{letter.title}</CardTitle>
                          <CardDescription>
                            {formatDate(letter.createdAt)}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-gray-600 line-clamp-3">
                            {letter.content}
                          </p>
                        </CardContent>
                        <CardFooter>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => handleReadLetter(letter)}
                          >
                            Read Letter
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  }
                </div>
              ) : (
                <div className="text-center py-12">
                  <PenSquare className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    No Letters Yet
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-6">
                    You haven't written any love letters yet. Click the button below to create your first one!
                  </p>
                  <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="bg-purple-500 hover:bg-purple-600"
                  >
                    <PenSquare className="h-4 w-4 mr-2" />
                    Write a Letter
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="received-letters">
              <div className="text-center py-12">
                <MailOpen className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Coming Soon
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  In the future, you'll be able to receive letters from your partner here.
                </p>
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Read Letter Dialog */}
          <Dialog open={isReadDialogOpen} onOpenChange={setIsReadDialogOpen}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              {selectedLetter && (
                <>
                  <DialogHeader>
                    <DialogTitle>{selectedLetter.title}</DialogTitle>
                    <DialogDescription>
                      {formatDate(selectedLetter.createdAt)}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div 
                    className={`my-4 p-6 rounded-md ${selectedLetter.fontStyle || 'font-sans'}`}
                    style={{ backgroundColor: selectedLetter.backgroundColor || '#FFF5F5' }}
                  >
                    <div className="whitespace-pre-line">
                      {selectedLetter.content}
                    </div>
                    <div className="mt-6 text-right">
                      <p className="text-sm italic">With love, {user.name}</p>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => handleDeleteLetter(selectedLetter.id)}
                      className="mr-auto text-red-500"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                    <Button onClick={() => setIsReadDialogOpen(false)}>
                      Close
                    </Button>
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LoveLetters;
