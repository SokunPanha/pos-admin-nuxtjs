declare module "#auth-utils" {
  interface User {
    id: string;
    username: string;
    fullName: string;
    phone?: string;
    isActive: "Y" | "N";
    role: {
      name: string;
      description: Record<string, string>;
    };
  }

  interface SecureSessionData {
    // Add your own fields
  }
}

export {};