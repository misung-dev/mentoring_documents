import React, { useState, useEffect } from 'react';

let todoId = 0;

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const SimpleTodoBad: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    console.log('할일이 변경되었습니다:', todos);
  }, [todos]);

  useEffect(() => {
    document.title = `할일 ${todos.length}개`;
  }, [todos]);

  const generateId = () => {
    todoId += 1;
    return todoId;
  };

  const addTodo = () => {
    if (inputValue.trim()) {
      const newTodo = {
        id: generateId(),
        text: inputValue,
        completed: false,
      };

      todos.push(newTodo);
      setTodos(todos);
      setInputValue('');
    }
  };

  const toggleTodo = (todo: Todo) => {
    todo.completed = !todo.completed;
    setTodos([...todos]);
  };

  const deleteTodo = (id: number) => {
    const index = todos.findIndex((todo) => todo.id === id);
    todos.splice(index, 1);
    setTodos([...todos]);
  };

  const getFilteredTodos = () => {
    if (filter === 'completed') {
      return todos.filter((todo) => todo.completed);
    }
    if (filter === 'pending') {
      return todos.filter((todo) => !todo.completed);
    }
    return todos;
  };

  const filteredTodos = getFilteredTodos();

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h1>간단한 할일 목록 (안티패턴 버전)</h1>

      {/* 할일 입력 */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="할일을 입력하세요"
          style={{
            padding: '8px',
            marginRight: '10px',
            width: '300px',
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              addTodo();
            }
          }}
        />
        <button onClick={addTodo} style={{ padding: '8px 16px' }}>
          추가
        </button>
      </div>

      {/* 필터 버튼들 */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            marginRight: '10px',
            backgroundColor: filter === 'all' ? '#007bff' : '#f8f9fa',
            color: filter === 'all' ? 'white' : 'black',
            padding: '5px 10px',
            border: '1px solid #ddd',
          }}
        >
          전체
        </button>
        <button
          onClick={() => setFilter('pending')}
          style={{
            marginRight: '10px',
            backgroundColor: filter === 'pending' ? '#007bff' : '#f8f9fa',
            color: filter === 'pending' ? 'white' : 'black',
            padding: '5px 10px',
            border: '1px solid #ddd',
          }}
        >
          미완료
        </button>
        <button
          onClick={() => setFilter('completed')}
          style={{
            backgroundColor: filter === 'completed' ? '#007bff' : '#f8f9fa',
            color: filter === 'completed' ? 'white' : 'black',
            padding: '5px 10px',
            border: '1px solid #ddd',
          }}
        >
          완료
        </button>
      </div>

      {/* 할일 목록 */}
      <div>
        {filteredTodos.length === 0 ? (
          <p style={{ color: '#666' }}>할일이 없습니다.</p>
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
                border: '1px solid #ddd',
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
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                style={{
                  marginLeft: '10px',
                  padding: '5px 10px',
                  backgroundColor: '#dc3545',
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
          backgroundColor: '#f8f9fa',
          fontSize: '12px',
          borderRadius: '4px',
        }}
      >
        <strong>디버그 정보:</strong>
        <br />
        현재 ID: {todoId}
        <br />
        전체 할일: {todos.length}개<br />
        현재 필터: {filter}
      </div>
    </div>
  );
};

export default SimpleTodoBad;
