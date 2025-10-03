import { useState } from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogClose } from 'src/components/ui/dialog';
import { Input } from 'src/components/ui/input';
import { Label } from 'src/components/ui/label';
import { Button } from 'src/components/ui/button';
import { STORAGE_KEYS, fetchWithErrorHandling } from 'src/lib/apiUtils';

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

export const ModalPortal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<BackOfficeUserType | undefined>(undefined);
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const getBackofficeEndpoint = () => {
      // 프로덕션 환경
      if (import.meta.env.PROD) {
        return 'https://hodong-erp.com/backoffice';
      }

      // MSW가 명시적으로 비활성화된 경우에만 실제 API 사용
      if (import.meta.env.VITE_ENABLE_MSW === 'false') {
        return (
          import.meta.env.VITE_API_BASE_URL + '/backoffice' ||
          'https://test.hodong-erp.com/backoffice'
        );
      }

      // 기본값: MSW 사용
      return '/api/backoffice';
    };

    const BACKOFFICE_ENDPOINT = getBackofficeEndpoint();

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

  return (
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
  );
};
