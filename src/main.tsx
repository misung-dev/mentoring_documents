import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

// 환경변수 기반 MSW 시작
async function enableMocking() {
  const enableMSW = import.meta.env.VITE_ENABLE_MSW !== 'false';

  if (!enableMSW) {
    console.log('🔄 MSW가 비활성화되었습니다. 실제 API를 사용합니다.');
    return;
  }

  const { worker } = await import('./mocks/browser');

  return worker
    .start({
      onUnhandledRequest: 'bypass',
    })
    .then(() => {
      console.log('🎭 MSW가 활성화되었습니다. 목 API를 사용합니다.');
    });
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
