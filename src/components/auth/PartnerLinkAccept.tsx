import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const PartnerLinkAccept = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const partnerId = searchParams.get('id');
  const partnerName = searchParams.get('name');

  useEffect(() => {
    const acceptPartnerLink = async () => {
      if (!user || !partnerId || !partnerName) {
        setError('Invalid partner link');
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Update user's profile with partner information
        await updateProfile({
          partnerId,
          partnerName: decodeURIComponent(partnerName),
        });

        toast({
          title: "Partner Linked Successfully",
          description: `You are now connected with ${decodeURIComponent(partnerName)}!`,
        });

        // Redirect to dashboard after successful linking
        navigate('/dashboard');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to link with partner');
        toast({
          title: "Link Failed",
          description: err instanceof Error ? err.message : 'Failed to link with partner',
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    acceptPartnerLink();
  }, [user, partnerId, partnerName, updateProfile, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-love-500" />
          <p className="mt-4 text-gray-600">Linking with your partner...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Link Failed</CardTitle>
            <CardDescription>
              There was an error linking with your partner
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button 
              className="mt-4 w-full" 
              onClick={() => navigate('/dashboard')}
            >
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default PartnerLinkAccept; 