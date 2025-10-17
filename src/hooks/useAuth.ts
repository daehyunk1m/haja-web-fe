import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { supabase, type AuthUser, type AuthError } from "../lib/supabase";

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  const navigate = useNavigate();

  // 현재 사용자 상태 확인
  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          setError({ message: error.message });
        } else if (user) {
          setUser({
            id: user.id,
            email: user.email,
            user_metadata: user.user_metadata,
          });
        }
      } catch (err) {
        setError({ message: "사용자 정보를 가져오는데 실패했습니다." });
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // 인증 상태 변경 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          user_metadata: session.user.user_metadata,
        });
        setError(null);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setError(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 구글 로그인
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      // https://hjswkmffcljblalkbowl.supabase.co/auth/v1/callback

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          // redirectTo: `${window.location.origin}/auth/callback`,
          // redirectTo: `${window.location.origin}/auth/google/callback`,
          redirectTo: `${import.meta.env.VITE_SUPABASE_URL}/auth/v1/callback`,

          // redirectTo: `${window.location.origin}`,
        },
      });

      if (error) {
        setError({ message: error.message });
      }

      return { data, error };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "로그인에 실패했습니다.";
      setError({ message: errorMessage });
      return { data: null, error: { message: errorMessage } };
    } finally {
      setLoading(false);
    }
  };

  // 로그아웃
  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();

      if (error) {
        setError({ message: error.message });
      } else {
        setUser(null);
        navigate("/login");
      }
    } catch (err) {
      setError({ message: "로그아웃에 실패했습니다." });
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    signInWithGoogle,
    signOut,
    isAuthenticated: !!user,
  };
};
