import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsAuth(!!data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuth(!!session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (isAuth === null) return null; // waiting session check

  return isAuth ? children : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;
