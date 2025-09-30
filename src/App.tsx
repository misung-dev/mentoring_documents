import { BackofficeLoginModal } from './components/BackofficeLogin/BackofficeLoginModal';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="container">
        <h1>멘토링 리팩토링 프로젝트</h1>
        <p>백오피스 로그인 모달 컴포넌트 리팩토링 연습</p>

        <div className="test-info">
          <h3>테스트 계정</h3>
          <p>
            이메일: <code>admin@test.com</code>
          </p>
          <p>
            비밀번호: <code>password123</code>
          </p>
        </div>

        <BackofficeLoginModal>
          <button className="login-trigger-btn">백오피스 로그인</button>
        </BackofficeLoginModal>
      </div>
    </div>
  );
}

export default App;
