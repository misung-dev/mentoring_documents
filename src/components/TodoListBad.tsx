import React, { useState, useEffect, useRef } from 'react';

let todoIdCounter = 0;
let lastSavedTodos: Todo[] = [];

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  createdAt: Date;
}

const TodoListBad: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.borderColor = inputValue.length > 0 ? 'green' : 'red';
    }
  }, [inputValue]);

  useEffect(() => {
    const total = todos.length;
    const completed = todos.filter((todo) => todo.completed).length;
    const pending = total - completed;
    setStats({ total, completed, pending });
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
    lastSavedTodos = todos;
  }, [todos]);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const savedTodos = localStorage.getItem('todos');
      if (savedTodos) {
        setTodos(JSON.parse(savedTodos));
      }
      setIsLoading(false);
    }, 1000);
  }, []);

  const generateTodoId = () => {
    todoIdCounter += 1;
    return todoIdCounter;
  };

  const addTodo = () => {
    if (!inputValue.trim()) {
      setError('할일을 입력해주세요!');
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.style.backgroundColor = '#ffebee';
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.style.backgroundColor = '';
          }
        }, 2000);
      }
      return;
    }

    if (inputValue.length > 100) {
      setError('할일은 100자 이하로 입력해주세요!');
      return;
    }

    setError('');

    const newTodo: Todo = {
      id: generateTodoId(),
      text: inputValue,
      completed: false,
      priority: inputValue.includes('!') ? 'high' : inputValue.includes('?') ? 'medium' : 'low',
      createdAt: new Date(),
    };

    todos.push(newTodo);
    setTodos(todos);
    setInputValue('');

    alert(`새로운 할일이 추가되었습니다: ${newTodo.text}`);
  };

  const toggleTodo = (todo: Todo) => {
    todo.completed = !todo.completed;
    setTodos([...todos]);
  };

  const deleteTodo = (id: number) => {
    const todoToDelete = todos.find((todo) => todo.id === id);
    if (todoToDelete && todoToDelete.completed) {
      if (confirm('완료된 할일을 삭제하시겠습니까?')) {
        const index = todos.findIndex((todo) => todo.id === id);
        todos.splice(index, 1);
        setTodos(todos);
        alert('할일이 삭제되었습니다!');
      }
    } else {
      const index = todos.findIndex((todo) => todo.id === id);
      todos.splice(index, 1);
      setTodos(todos);
    }
  };

  const getFilteredTodos = () => {
    let filtered = todos;

    if (filter === 'completed') {
      filtered = todos.filter((todo) => todo.completed);
    } else if (filter === 'pending') {
      filtered = todos.filter((todo) => !todo.completed);
    }

    return filtered.sort((a, b) => {
      if (a.priority === 'high' && b.priority !== 'high') return -1;
      if (a.priority !== 'high' && b.priority === 'high') return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  const filteredTodos = getFilteredTodos();

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>할일 목록 (안티패턴 버전)</h1>

      <div
        style={{
          marginBottom: '20px',
          padding: '10px',
          backgroundColor: error ? '#ffebee' : '#f5f5f5',
          border: error ? '2px solid red' : '1px solid #ddd',
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (e.target.value.length > 50) {
              console.warn('긴 할일입니다!');
            }
          }}
          onKeyPress={handleKeyPress}
          placeholder="할일을 입력하세요 (! = 높은 우선순위, ? = 중간 우선순위)"
          style={{
            width: '70%',
            padding: '8px',
            marginRight: '10px',
          }}
        />
        <button
          onClick={addTodo}
          style={{
            padding: '8px 16px',
            backgroundColor: inputValue.trim() ? '#4caf50' : '#ccc',
            color: 'white',
            border: 'none',
            cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
          }}
        >
          추가
        </button>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      <div style={{ marginBottom: '20px' }}>
        {['all', 'pending', 'completed'].map((filterType) => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            style={{
              marginRight: '10px',
              padding: '5px 10px',
              backgroundColor: filter === filterType ? '#2196f3' : '#f0f0f0',
              color: filter === filterType ? 'white' : 'black',
              border: '1px solid #ddd',
            }}
          >
            {filterType === 'all' ? '전체' : filterType === 'pending' ? '미완료' : '완료'}
          </button>
        ))}
      </div>

      <div
        style={{
          marginBottom: '20px',
          padding: '10px',
          backgroundColor: '#e3f2fd',
          borderRadius: '4px',
        }}
      >
        <strong>통계:</strong> 전체 {stats.total}개, 완료 {stats.completed}개, 미완료{' '}
        {stats.pending}개
      </div>

      <div>
        {filteredTodos.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666' }}>
            {filter === 'all'
              ? '할일이 없습니다.'
              : filter === 'pending'
                ? '미완료 할일이 없습니다.'
                : '완료된 할일이 없습니다.'}
          </p>
        ) : (
          filteredTodos.map((todo) => (
            <div
              key={todo.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px',
                marginBottom: '5px',
                backgroundColor: todo.completed ? '#f0f8f0' : '#fff',
                border: `2px solid ${
                  todo.priority === 'high'
                    ? '#f44336'
                    : todo.priority === 'medium'
                      ? '#ff9800'
                      : '#4caf50'
                }`,
                borderRadius: '4px',
              }}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo)}
                style={{ marginRight: '10px' }}
              />
              <span
                style={{
                  flex: 1,
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  color: todo.completed ? '#666' : '#000',
                }}
              >
                {todo.text}
                <small
                  style={{
                    marginLeft: '10px',
                    color: '#999',
                    fontSize: '12px',
                  }}
                >
                  ({todo.priority} 우선순위, {todo.createdAt.toLocaleString()})
                </small>
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                style={{
                  marginLeft: '10px',
                  padding: '5px 10px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                }}
              >
                삭제
              </button>
            </div>
          ))
        )}
      </div>

      <div
        style={{
          marginTop: '20px',
          padding: '10px',
          backgroundColor: '#fff3e0',
          fontSize: '12px',
          borderRadius: '4px',
        }}
      >
        <strong>디버그 정보:</strong>
        <br />
        현재 ID 카운터: {todoIdCounter}
        <br />
        마지막 저장된 할일 수: {lastSavedTodos.length}
        <br />
        현재 필터: {filter}
        <br />
        입력값 길이: {inputValue.length}
      </div>
    </div>
  );
};

export default TodoListBad;
