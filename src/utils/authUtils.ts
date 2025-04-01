
import { User } from "@/types/auth";
import { toast } from "@/components/ui/use-toast";

// Simple hash function for passwords (in a real app, use bcrypt or similar)
export const hashPassword = (password: string): string => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString();
};

export const generatePartnerLink = (user: User | null): string => {
  if (!user) return '';
  // In a real app, this would be a unique, secure link
  return `${window.location.origin}/link-partner?id=${user.id}&name=${encodeURIComponent(user.name)}`;
};

export const copyToClipboard = (text: string) => {
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

export const shareViaWhatsApp = (text: string) => {
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`Join me on Our Private Space! ${text}`)}`;
  window.open(whatsappUrl, '_blank');
};
