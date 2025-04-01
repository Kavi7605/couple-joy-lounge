import React, { useState } from 'react';
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
import { User } from "@/types/auth";
import { generatePartnerLink, copyToClipboard, shareViaWhatsApp } from "@/utils/authUtils";

interface PartnerLinkDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onLinkPartner: (email: string) => void;
}

const PartnerLinkDialog: React.FC<PartnerLinkDialogProps> = ({ 
  isOpen, 
  onOpenChange, 
  user,
  onLinkPartner
}) => {
  const [partnerEmail, setPartnerEmail] = useState('');
  
  const handleCopyLink = () => {
    if (user) {
      copyToClipboard(generatePartnerLink(user));
    }
  };
  
  const handleShareWhatsApp = () => {
    if (user) {
      shareViaWhatsApp(generatePartnerLink(user));
    }
  };
  
  const handleLinkPartner = () => {
    onLinkPartner(partnerEmail);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
                value={generatePartnerLink(user)} 
                className="flex-1"
              />
              <Button 
                size="icon" 
                onClick={handleCopyLink}
                type="button"
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
              onClick={handleCopyLink}
              type="button"
            >
              <Clipboard className="h-4 w-4" />
              <span>Copy Link</span>
            </Button>
            
            <Button
              variant="outline"
              className="flex items-center space-x-2"
              onClick={handleShareWhatsApp}
              type="button"
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
                Or enter partner's code
              </span>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            <Label htmlFor="partnerEmail">Partner's Code</Label>
            <Input
              id="partnerEmail"
              value={partnerEmail}
              onChange={(e) => setPartnerEmail(e.target.value)}
              placeholder="Enter your partner's code"
            />
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            type="button"
          >
            Cancel
          </Button>
          <Button 
            type="button"
            onClick={handleLinkPartner}
            disabled={!partnerEmail}
          >
            Link Partner
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PartnerLinkDialog;
