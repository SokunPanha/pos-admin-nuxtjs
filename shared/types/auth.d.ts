declare module "#auth-utils" {
  interface User {
    id: string;
    username: string;
    fullName: string;
    phone?: string;
    isActive: "Y" | "N";
    role: string;
    permissions: string[];
  }

  interface SecureSessionData {
    // Add your own fields
  }
}

export {};
