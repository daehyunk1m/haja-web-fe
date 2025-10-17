import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../lib/supabase";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          setError(error.message);
          setTimeout(() => navigate("/login"), 3000);
          return;
        }

        if (data.session) {
          // 로그인 성공 시 메인 페이지로 리다이렉트
          navigate("/");
        } else {
          // 세션이 없으면 로그인 페이지로 리다이렉트
          navigate("/login");
        }
      } catch (err) {
        setError("인증 처리 중 오류가 발생했습니다.");
        setTimeout(() => navigate("/login"), 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className='flex flex-col items-center justify-center h-screen'>
        <div className='text-red-600 text-lg mb-4'>인증 오류</div>
        <div className='text-gray-600 mb-4'>{error}</div>
        <div className='text-sm text-gray-500'>로그인 페이지로 이동합니다...</div>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4'></div>
      <p className='text-gray-600'>인증 처리 중...</p>
    </div>
  );
};

export default AuthCallback;
