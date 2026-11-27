
import { useContext } from "react";

import { AuthContext } from "../context/AuthContext";

// ========================================
// CUSTOM AUTHENTICATION HOOK
// ========================================

const useAuth = () => {
  const context = useContext(AuthContext);

  // Ensure the hook is used inside AuthProvider
  if (context === null || context === undefined) {
    throw new Error(
      "useAuth must be used within an AuthProvider."
    );
  }

  return context;
};

// Named export
export { useAuth };

// Default export
export default useAuth;
