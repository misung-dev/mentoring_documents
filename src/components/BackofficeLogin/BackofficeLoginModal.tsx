import { useState, useEffect } from 'react';
import { Dialog, DialogTrigger } from 'src/components/ui/dialog';
import { Button } from 'src/components/ui/button';
import { STORAGE_KEYS } from 'src/lib/apiUtils';
import { fetchWithErrorHandling } from 'src/lib/apiUtils';
import { ModalPortal } from 'src/components/Modal/ModalPortal';

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

      <ModalPortal />
    </Dialog>
  );
}
