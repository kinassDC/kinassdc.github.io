---
title: "React Hooks 完全指南：掌握现代 React 开发"
pubDate: 2025-03-05
description: "React Hooks 改变了我们编写组件的方式。本文深入讲解常用 Hooks 的使用场景和最佳实践。"
category: "技术"
tags: ["React", "前端", "JavaScript", "Hooks"]
---

## 为什么需要 Hooks？

在 Hooks 出现之前，React 组件的逻辑复用和状态管理存在一些问题：

- 类组件之间的逻辑难以复用
- 复杂组件变得难以理解
- 类组件的 `this` 指向问题

Hooks 解决了这些问题，让你：

1. **无需修改组件结构即可复用状态逻辑**
2. **将相关逻辑组织在一起，而非分散在生命周期中**
3. **在函数组件中使用状态和其他 React 特性**

## 基础 Hooks

### useState - 状态管理

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}

// 函数式更新
function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(prev => prev + 1);
  };

  return <button onClick={increment}>+1</button>;
}

// 对象状态
function UserForm() {
  const [user, setUser] = useState({ name: '', age: 0 });

  const updateName = (name) => {
    setUser(prev => ({ ...prev, name }));
  };

  return <input onChange={e => updateName(e.target.value)} />;
}
```

### useEffect - 副作用处理

```jsx
import { useEffect, useState } from 'react';

// 每次渲染后执行
function Example() {
  useEffect(() => {
    console.log('Component rendered');
  });
}

// 仅在挂载时执行（类似 componentDidMount）
function Example() {
  useEffect(() => {
    console.log('Mounted');
    return () => console.log('Unmounted');
  }, []);
}

// 依赖变化时执行
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]); // userId 变化时重新获取

  return user ? <div>{user.name}</div> : <div>Loading...</div>;
}

// 清理副作用
function Timer() {
  useEffect(() => {
    const timer = setInterval(() => {
      console.log('Tick');
    }, 1000);

    return () => clearInterval(timer); // 清理
  }, []);
}
```

### useContext - 跨组件状态共享

```jsx
import { createContext, useContext, useState } from 'react';

// 创建 Context
const ThemeContext = createContext();

function App() {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Page />
    </ThemeContext.Provider>
  );
}

// 消费 Context
function Page() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <div className={theme}>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </button>
    </div>
  );
}
```

## 额外的 Hooks

### useReducer - 复杂状态管理

```jsx
import { useReducer } from 'react';

const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return initialState;
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+1</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-1</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </>
  );
}
```

### useRef - 可变引用

```jsx
import { useRef, useEffect } from 'react';

// 访问 DOM 元素
function InputFocus() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return <input ref={inputRef} />;
}

// 存储可变值（不触发重新渲染）
function Timer() {
  const timerRef = useRef(null);

  const start = () => {
    timerRef.current = setInterval(() => {
      console.log('Tick');
    }, 1000);
  };

  const stop = () => {
    clearInterval(timerRef.current);
  };

  return (
    <>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </>
  );
}
```

### useMemo - 性能优化

```jsx
import { useMemo, useState } from 'react';

function ExpensiveComponent({ items }) {
  const [filter, setFilter] = useState('');

  // 仅在 items 变化时重新计算
  const filteredItems = useMemo(() => {
    console.log('Filtering...');
    return items.filter(item => item.includes(filter));
  }, [items, filter]);

  return <div>{filteredItems.map(item => <div key={item}>{item}</div>)}</div>;
}
```

### useCallback - 函数缓存

```jsx
import { useCallback, useState } from 'react';

function Parent() {
  const [count, setCount] = useState(0);

  // useCallback 防止子组件不必要的重新渲染
  const handleClick = useCallback(() => {
    console.log('Clicked');
  }, []); // 依赖为空时，函数永远不会改变

  return (
    <>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <Child onClick={handleClick} />
    </>
  );
}

const Child = React.memo(function Child({ onClick }) {
  console.log('Child rendered');
  return <button onClick={onClick}>Child</button>;
});
```

## 自定义 Hooks

自定义 Hooks 是复用逻辑的强大方式：

```jsx
// useLocalStorage - 本地存储同步
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  const setValue = (value) => {
    setStoredValue(value);
    window.localStorage.setItem(key, JSON.stringify(value));
  };

  return [storedValue, setValue];
}

// 使用
function App() {
  const [name, setName] = useLocalStorage('name', '');

  return <input value={name} onChange={e => setName(e.target.value)} />;
}

// useFetch - 数据获取
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}

// 使用
function UserList() {
  const { data: users, loading, error } = useFetch('/api/users');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <ul>{users.map(user => <li key={user.id}>{user.name}</li>)}</ul>;
}
```

## Hooks 规则

使用 Hooks 时必须遵循两条规则：

1. **只在顶层调用 Hooks**：不要在循环、条件或嵌套函数中调用
2. **只在 React 函数中调用 Hooks**：在 React 函数组件或自定义 Hooks 中调用

```jsx
// ❌ 错误
function BadComponent({ condition }) {
  if (condition) {
    const [state, setState] = useState(0); // 不要在条件中调用
  }
}

// ✅ 正确
function GoodComponent({ condition }) {
  const [state, setState] = useState(0);

  if (condition) {
    // 使用 state
  }
}
```

## 最佳实践

1. **按功能组织 Hooks**：将相关的状态和副作用放在一起
2. **使用自定义 Hooks 复用逻辑**：避免重复代码
3. **合理使用 useEffect**：只添加必要的依赖
4. **性能优化要适度**：useMemo 和 useCallback 不是万能的
5. **善用 ESLint**：使用 `eslint-plugin-react-hooks` 检查规则

## 总结

React Hooks 让函数组件拥有了类组件的所有能力，同时提供了更好的逻辑复用方式。掌握常用 Hooks 和自定义 Hooks，将大大提升你的 React 开发效率。
