import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from 'src/components/ui/dialog';
import { Button } from 'src/components/ui/button';
import { Input } from 'src/components/ui/input';
import { Label } from 'src/components/ui/label';
import { STORAGE_KEYS } from 'src/lib/apiUtils';
import { fetchWithErrorHandling } from 'src/lib/apiUtils';

type BackOfficeUserType = {
  id: number;
  username: string;
  real_name: string;
  email: string;
  name: string;
  roles: string[];
};

type LoginData = {
  user: BackOfficeUserType;
  access_token: string;
};

const getBackofficeEndpoint = () => {
  // 프로덕션 환경
  if (import.meta.env.PROD) {
    return 'https://hodong-erp.com/backoffice';
  }

  // MSW가 명시적으로 비활성화된 경우에만 실제 API 사용
  if (import.meta.env.VITE_ENABLE_MSW === 'false') {
    return (
      import.meta.env.VITE_API_BASE_URL + '/backoffice' || 'https://test.hodong-erp.com/backoffice'
    );
  }

  // 기본값: MSW 사용
  return '/api/backoffice';
};

const BACKOFFICE_ENDPOINT = getBackofficeEndpoint();

export function BackofficeLoginModal({ children }: { children: React.ReactNode }) {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<BackOfficeUserType | undefined>(undefined);

  useEffect(() => {
    // NOTE: 앱 시작 시 localStorage에서 사용자 정보 복원 및 토큰 유효성 검증
    const savedUserData = localStorage.getItem(STORAGE_KEYS.BACKOFFICE_USER_DATA);
    if (savedUserData) {
      try {
        const userData = JSON.parse(savedUserData) as LoginData;

        const validateToken = async (retryCount = 0) => {
          try {
            await fetchWithErrorHandling(`${BACKOFFICE_ENDPOINT}/me`, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${userData.access_token}`,
              },
            });

            setUser(userData.user);
            console.log('자동 로그인 성공:', userData.user.real_name || userData.user.name);
          } catch (error) {
            console.error('토큰 검증 실패:', error);
            if (retryCount < 1) {
              console.log(`토큰 검증 실패, 재시도 중... (${retryCount + 1}/2)`);
              setTimeout(() => validateToken(retryCount + 1), 1000);
            } else {
              localStorage.removeItem(STORAGE_KEYS.BACKOFFICE_USER_DATA);
              console.log('토큰 검증 2회 실패로 로그아웃되었습니다.');
            }
          }
        };

        validateToken();
      } catch (error) {
        console.error('저장된 사용자 정보 파싱 실패:', error);
        localStorage.removeItem(STORAGE_KEYS.BACKOFFICE_USER_DATA);
      }
    }
  }, []);

  const handleLogin = async () => {
    if (!username || !password) {
      alert('백오피스 ID와 비밀번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const { user, access_token } = await fetchWithErrorHandling<LoginData>(
        `${BACKOFFICE_ENDPOINT}/login`,
        {
          method: 'POST',
          skipAuth: true,
          body: JSON.stringify({
            username: username,
            password,
          }),
        },
      );

      const loginData: LoginData = { user, access_token };
      localStorage.setItem(STORAGE_KEYS.BACKOFFICE_USER_DATA, JSON.stringify(loginData));
      setUser(user);

      setUserName('');
      setPassword('');
      setIsOpen(false);

      window.location.reload();
    } catch (error) {
      console.error('로그인 실패:', error);
      alert('로그인에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    const confirmed = window.confirm('로그아웃 하시겠습니까?');
    if (confirmed) {
      localStorage.removeItem(STORAGE_KEYS.BACKOFFICE_USER_DATA);
      setUser(undefined);
      window.location.reload();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      {user ? (
        <Button
          variant="outline"
          className="bg-white text-cyan-600 hover:bg-gray-100 border-white"
          onClick={handleLogout}
        >
          {user.name} (로그아웃)
        </Button>
      ) : (
        <DialogTrigger asChild>{children}</DialogTrigger>
      )}

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">백오피스 로그인</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="space-y-4 py-4"
        >
          <div className="space-y-2">
            <Label htmlFor="backoffice-id">백오피스 ID</Label>

            <Input
              id="backoffice-id"
              type="text"
              placeholder="백오피스 ID를 입력하세요"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>

            <Input
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="flex-1" disabled={isLoading}>
                취소
              </Button>
            </DialogClose>

            <Button
              type="submit"
              className="flex-1 bg-cyan-600 hover:bg-cyan-700"
              disabled={isLoading}
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
