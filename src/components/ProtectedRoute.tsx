import { ReactNode } from "react";
import { useAuthContext } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const ProtectedRoute = ({ children, fallback }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4'></div>
        <p className='text-gray-600'>인증 상태 확인 중...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }

    // 기본적으로 로그인 페이지로 리다이렉트
    window.location.href = "/login";
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
