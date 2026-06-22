import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import { AuthProvider, useAuthContext } from "./AuthContext";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router";

vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
      onAuthStateChange: vi.fn(),
      signInWithOAuth: vi.fn(),
      signOut: vi.fn(),
    },
  },
}));

vi.mock("react-router", () => ({
  useNavigate: vi.fn(),
}));

const mockNavigate = vi.fn();
const mockUnsubscribe = vi.fn();

beforeEach(() => {
  mockNavigate.mockReset();
  mockUnsubscribe.mockReset();

  vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  vi.mocked(supabase.auth.getUser).mockResolvedValue({
    data: { user: null },
    error: null,
  } as never);
  vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
    data: { subscription: { unsubscribe: mockUnsubscribe } },
  } as never);
  vi.mocked(supabase.auth.signInWithOAuth).mockResolvedValue({
    data: {},
    error: null,
  } as never);
  vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: null } as never);
});

// 테스트용 소비자 컴포넌트
const TestConsumer = () => {
  const auth = useAuthContext();
  return (
    <div>
      <span data-testid='loading'>{String(auth.loading)}</span>
      <span data-testid='user'>{auth.user?.email ?? "null"}</span>
      <span data-testid='authenticated'>{String(auth.isAuthenticated)}</span>
      <button onClick={() => auth.signInWithGoogle()}>로그인</button>
      <button onClick={() => auth.signOut()}>로그아웃</button>
    </div>
  );
};

// -------------------------------------------------------------------------
describe("AuthProvider", () => {
  it("children을 렌더링한다", async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <div data-testid='child'>자식</div>
        </AuthProvider>
      );
    });
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("초기 loading 상태는 true이다", () => {
    // getUser가 resolve되기 전 초기 상태를 검증하기 위해 promise를 pending 상태로 유지
    vi.mocked(supabase.auth.getUser).mockReturnValue(new Promise(() => {}) as never);
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );
    expect(screen.getByTestId("loading")).toHaveTextContent("true");
  });

  it("getUser 완료 후 loading이 false가 된다", async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );
    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });
  });

  it("인증된 사용자가 있으면 user와 isAuthenticated가 업데이트된다", async () => {
    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: {
        user: { id: "user-1", email: "test@example.com", user_metadata: {} },
      },
      error: null,
    } as never);

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("authenticated")).toHaveTextContent("true");
    });
    expect(screen.getByTestId("user")).toHaveTextContent("test@example.com");
  });

  it("마운트 해제 시 onAuthStateChange subscription이 unsubscribe된다", () => {
    const { unmount } = render(
      <AuthProvider>
        <div />
      </AuthProvider>
    );
    unmount();
    expect(mockUnsubscribe).toHaveBeenCalledOnce();
  });
});

// -------------------------------------------------------------------------
describe("signInWithGoogle", () => {
  it("supabase.auth.signInWithOAuth를 google provider로 호출한다", async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );
    await waitFor(() =>
      expect(screen.getByTestId("loading")).toHaveTextContent("false")
    );

    fireEvent.click(screen.getByText("로그인"));

    await waitFor(() => {
      expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith(
        expect.objectContaining({ provider: "google" })
      );
    });
  });
});

// -------------------------------------------------------------------------
describe("signOut", () => {
  it("supabase.auth.signOut을 호출한다", async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );
    await waitFor(() =>
      expect(screen.getByTestId("loading")).toHaveTextContent("false")
    );

    fireEvent.click(screen.getByText("로그아웃"));

    await waitFor(() => {
      expect(supabase.auth.signOut).toHaveBeenCalledOnce();
    });
  });

  it("로그아웃 성공 시 /login으로 navigate한다", async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );
    await waitFor(() =>
      expect(screen.getByTestId("loading")).toHaveTextContent("false")
    );

    fireEvent.click(screen.getByText("로그아웃"));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });
});

// -------------------------------------------------------------------------
describe("useAuthContext", () => {
  it("AuthProvider 외부에서 사용 시 에러를 던진다", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow(
      "useAuthContext must be used within an AuthProvider"
    );
    consoleSpy.mockRestore();
  });
});
