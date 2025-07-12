import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import createContextHook from "@nkzw/create-context-hook";
import { useEffect, useState } from "react";

export type UserRole = "caregiver" | "hew" | "admin" | null;

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
  phone?: string;
  region?: string;
  district?: string;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

// Mock users for demonstration
const mockUsers = {
  caregiver: {
    id: "c1",
    name: "Abeba Tadesse",
    role: "caregiver" as UserRole,
    email: "abeba@example.com",
    phone: "+251912345678",
    region: "Addis Ababa",
    district: "Bole",
    profileImage: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
  },
  hew: {
    id: "h1",
    name: "Dawit Bekele",
    role: "hew" as UserRole,
    email: "dawit@example.com",
    phone: "+251923456789",
    region: "Oromia",
    district: "Adama",
    profileImage: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80",
  },
  admin: {
    id: "a1",
    name: "Dr. Tigist Haile",
    role: "admin" as UserRole,
    email: "tigist@example.com",
    phone: "+251934567890",
    region: "National",
    district: "All",
    profileImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
  },
};

export const [AuthProvider, useAuth] = createContextHook<AuthContextType>(() => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkLoginStatus = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace(`/(${user.role})`);
      } else {
        router.replace("/(auth)");
      }
    }
  }, [user, isLoading]);

  const login = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll use mock users
      const mockUser = mockUsers[role as keyof typeof mockUsers];
      
      if (!mockUser) {
        throw new Error("Invalid credentials");
      }
      
      setUser(mockUser);
      await AsyncStorage.setItem("user", JSON.stringify(mockUser));
      router.replace(`/(${role})`);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem("user");
      setUser(null);
      router.replace("/(auth)");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  };
});