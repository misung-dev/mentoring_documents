import { http, HttpResponse } from 'msw';

const mockUsers = [
  {
    id: 1,
    email: 'admin@test.com',
    name: '관리자',
    roles: ['admin', 'user'],
  },
  {
    id: 2,
    email: 'manager@test.com',
    name: '매니저',
    roles: ['manager', 'user'],
  },
  {
    id: 3,
    email: 'user@test.com',
    name: '일반사용자',
    roles: ['user'],
  },
];

export const handlers = [
  http.post('/api/backoffice/login', async ({ request }) => {
    const { username, password } = (await request.json()) as { username: string; password: string };

    const user = mockUsers.find((u) => u.email === username);

    if (!user) {
      return HttpResponse.json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 });
    }

    if (password !== 'password123') {
      return HttpResponse.json({ error: '비밀번호가 올바르지 않습니다.' }, { status: 401 });
    }

    return HttpResponse.json({
      user,
      access_token: `mock_token_${user.id}_${Date.now()}`,
    });
  }),

  http.get('/api/backoffice/me', ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: '인증 토큰이 필요합니다.' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');

    const userId = token.includes('mock_token_1')
      ? 1
      : token.includes('mock_token_2')
        ? 2
        : token.includes('mock_token_3')
          ? 3
          : null;

    if (!userId) {
      return HttpResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 401 });
    }

    const user = mockUsers.find((u) => u.id === userId);

    if (!user) {
      return HttpResponse.json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 });
    }

    return HttpResponse.json({ user });
  }),
];
