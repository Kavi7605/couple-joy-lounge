
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Share, Copy, Clipboard } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  partnerId?: string;
  partnerName?: string;
  partnerBirthday?: string;
  anniversaryDate?: string;
  passwordHash?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  linkPartner: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Simple hash function for passwords (in a real app, use bcrypt or similar)
const hashPassword = (password: string): string => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString();
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [partnerEmail, setPartnerEmail] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Get users from backend (localStorage in this case)
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const passwordHash = hashPassword(password);
      
      const foundUser = users.find((u: any) => 
        u.email === email && u.passwordHash === passwordHash
      );
      
      if (foundUser) {
        const { passwordHash, ...userData } = foundUser;
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
      } else if (email === 'demo@example.com' && password === 'password') {
        // Demo account
        const userData: User = {
          id: '1',
          name: 'Demo User',
          email: 'demo@example.com',
          partnerName: 'Partner',
          partnerBirthday: '1990-06-15',
          anniversaryDate: '2020-02-14',
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast({
        title: "Login Failed",
        description: err instanceof Error ? err.message : 'An error occurred',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Get users from backend (localStorage in this case)
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if email exists
      if (users.some((u: any) => u.email === email)) {
        throw new Error('Email already registered');
      }
      
      const passwordHash = hashPassword(password);
      
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        passwordHash,
      };
      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Auto login after registration
      const { passwordHash: _, ...userData } = newUser;
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      toast({
        title: "Registration Successful",
        description: "Welcome to Our Private Space!",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast({
        title: "Registration Failed",
        description: err instanceof Error ? err.message : 'An error occurred',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user) throw new Error('Not logged in');
      
      const updatedUser = { ...user, ...data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update user in users array too
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map((u: any) => {
        if (u.id === user.id) {
          return { ...u, ...data, passwordHash: u.passwordHash };
        }
        return u;
      });
      
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      setUser(updatedUser);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast({
        title: "Update Failed",
        description: err instanceof Error ? err.message : 'An error occurred',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generatePartnerLink = () => {
    if (!user) return '';
    // In a real app, this would be a unique, secure link
    return `${window.location.origin}/link-partner?id=${user.id}&name=${encodeURIComponent(user.name)}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Link Copied",
        description: "Partner link copied to clipboard!",
      });
    }).catch(() => {
      toast({
        title: "Copy Failed",
        description: "Failed to copy link. Please try again.",
        variant: "destructive",
      });
    });
  };

  const shareViaWhatsApp = (text: string) => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`Join me on Our Private Space! ${text}`)}`;
    window.open(whatsappUrl, '_blank');
  };

  const linkPartner = () => {
    if (!user) {
      toast({
        title: "Not Logged In",
        description: "Please log in to link with your partner.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLinkDialogOpen(true);
  };

  const handlePartnerLinking = () => {
    // In a real app, this would send an invitation to the partner's email
    // For this demo, we'll just simulate the linking
    if (!user || !partnerEmail) return;
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const partner = users.find((u: any) => u.email === partnerEmail);
    
    if (!partner) {
      toast({
        title: "Partner Not Found",
        description: "No user with that email address was found.",
        variant: "destructive",
      });
      return;
    }
    
    // Update both users to be partners
    const updatedUsers = users.map((u: any) => {
      if (u.id === user.id) {
        return { 
          ...u, 
          partnerId: partner.id,
          partnerName: partner.name
        };
      }
      if (u.id === partner.id) {
        return { 
          ...u, 
          partnerId: user.id,
          partnerName: user.name
        };
      }
      return u;
    });
    
    // Update in localStorage
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // Update current user
    const updatedUser = { 
      ...user, 
      partnerId: partner.id,
      partnerName: partner.name
    };
    
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    
    toast({
      title: "Partner Linked",
      description: `You are now linked with ${partner.name}!`,
    });
    
    setIsLinkDialogOpen(false);
    setPartnerEmail('');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        linkPartner,
      }}
    >
      {children}
      
      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Link with your partner</DialogTitle>
            <DialogDescription>
              Share this link with your partner or enter their email to connect
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col space-y-4 py-4">
            <div className="flex flex-col space-y-2">
              <Label>Share this unique link with your partner</Label>
              <div className="flex items-center space-x-2">
                <Input 
                  readOnly 
                  value={generatePartnerLink()} 
                  className="flex-1"
                />
                <Button 
                  size="icon" 
                  onClick={() => copyToClipboard(generatePartnerLink())}
                  className="flex-shrink-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                className="flex items-center space-x-2"
                onClick={() => copyToClipboard(generatePartnerLink())}
              >
                <Clipboard className="h-4 w-4" />
                <span>Copy Link</span>
              </Button>
              
              <Button
                variant="outline"
                className="flex items-center space-x-2"
                onClick={() => shareViaWhatsApp(generatePartnerLink())}
              >
                <Share className="h-4 w-4" />
                <span>Share via WhatsApp</span>
              </Button>
            </div>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background px-2 text-muted-foreground">
                  Or enter partner's email
                </span>
              </div>
            </div>
            
            <div className="flex flex-col space-y-2">
              <Label htmlFor="partnerEmail">Partner's Email</Label>
              <Input
                id="partnerEmail"
                value={partnerEmail}
                onChange={(e) => setPartnerEmail(e.target.value)}
                placeholder="Enter your partner's email"
              />
            </div>
          </div>
          
          <DialogFooter className="sm:justify-between">
            <Button
              variant="ghost"
              onClick={() => setIsLinkDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              onClick={handlePartnerLinking}
              disabled={!partnerEmail}
            >
              Link Partner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthContext.Provider>
  );
};
