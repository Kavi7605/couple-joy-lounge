
export interface User {
  id: string;
  name: string;
  email: string;
  partnerId?: string;
  partnerName?: string;
  partnerBirthday?: string;
  anniversaryDate?: string;
  passwordHash?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  linkPartner: () => void;
}
