import React, { createContext, useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { User, AuthContextType } from "@/types/auth";
import { hashPassword } from "@/utils/authUtils";
import PartnerLinkDialog from "@/components/auth/PartnerLinkDialog";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);

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

  const handlePartnerLinking = (partnerEmail: string) => {
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

    if (partner.id === user.id) {
      toast({
        title: "Invalid Partner",
        description: "You cannot link with yourself.",
        variant: "destructive",
      });
      return;
    }

    if (partner.partnerId) {
      toast({
        title: "Partner Already Linked",
        description: "This user is already linked with another partner.",
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
      
      <PartnerLinkDialog 
        isOpen={isLinkDialogOpen}
        onOpenChange={setIsLinkDialogOpen}
        user={user}
        onLinkPartner={handlePartnerLinking}
      />
    </AuthContext.Provider>
  );
};
