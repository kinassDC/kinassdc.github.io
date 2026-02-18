---
title: "TypeScript 最佳实践：编写更安全的代码"
pubDate: 2025-03-10
description: "TypeScript 为 JavaScript 添加了类型系统，但仅仅使用 TypeScript 并不足以写出好代码。本文分享一些最佳实践。"
category: "技术"
tags: ["TypeScript", "JavaScript", "前端", "代码质量"]
---

## 前言

TypeScript 已经成为现代前端开发的标准。然而，很多开发者只是简单地把 `.js` 改成 `.ts`，没有充分利用 TypeScript 的类型系统。本文将分享一些实用的最佳实践。

## 1. 严格模式配置

在 `tsconfig.json` 中启用严格模式：

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

## 2. 避免 any

`any` 会破坏类型检查，应该尽量避免：

```typescript
// 不好
function process(data: any) {
  return data.name;
}

// 好
function process(data: { name: string }) {
  return data.name;
}

// 更好 - 使用接口
interface User {
  name: string;
}

function process(data: User) {
  return data.name;
}
```

## 3. 使用类型推断

TypeScript 可以自动推断类型，不需要显式声明所有类型：

```typescript
// 不好 - 类型冗余
const count: number = 0;
const name: string = "John";

// 好 - 类型推断
const count = 0;
const name = "John";
```

## 4. 优先使用 interface 而不是 type

对于对象类型，优先使用 `interface`：

```typescript
// 好 - 可以扩展和合并
interface User {
  name: string;
}

interface User {
  age: number;
}

// type 适用于联合类型
type Status = 'pending' | 'success' | 'error';
```

## 5. 使用字面量类型

字面量类型可以提供更精确的类型约束：

```typescript
// 不好
function setStatus(status: string) {
  // ...
}

// 好
function setStatus(status: 'pending' | 'success' | 'error') {
  // ...
}

// 更好 - 使用枚举或常量
const Status = {
  PENDING: 'pending',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

type StatusValue = typeof Status[keyof typeof Status];
```

## 6. 使用类型守卫

类型守卫可以缩小类型范围：

```typescript
interface Bird {
  fly(): void;
}

interface Fish {
  swim(): void;
}

function isFish(pet: Bird | Fish): pet is Fish {
  return 'swim' in pet;
}

function move(pet: Bird | Fish) {
  if (isFish(pet)) {
    pet.swim(); // TypeScript 知道这是 Fish
  } else {
    pet.fly(); // TypeScript 知道这是 Bird
  }
}
```

## 7. 使用实用类型

TypeScript 提供了很多实用类型：

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// Partial - 所有属性可选
type PartialUser = Partial<User>;

// Required - 所有属性必需
type RequiredUser = Required<User>;

// Pick - 选择部分属性
type PublicUser = Pick<User, 'id' | 'name' | 'email'>;

// Omit - 排除部分属性
type SafeUser = Omit<User, 'password'>;

// Readonly - 只读
type ReadonlyUser = Readonly<User>;
```

## 8. 使用泛型约束

泛型约束可以提供更精确的类型：

```typescript
// 不好
function getLength<T>(item: T): number {
  return item.length; // 错误：length 不存在
}

// 好
function getLength<T extends { length: number }>(item: T): number {
  return item.length;
}
```

## 9. 避免使用非空断言

非空断言 `!` 会跳过类型检查，应该谨慎使用：

```typescript
// 不好
const name = user.name!;

// 好
const name = user.name ?? 'Anonymous';

// 更好 - 使用可选链和空值合并
const name = user?.name ?? 'Anonymous';
```

## 10. 使用 as const

`as const` 可以创建更精确的字面量类型：

```typescript
const config = {
  mode: 'production',
  debug: false,
} as const;

// config.mode 的类型是 'production' 而不是 string
```

## 总结

TypeScript 是一个强大的工具，但要发挥它的最大价值，需要遵循最佳实践：

1. 启用严格模式
2. 避免 `any`
3. 充分利用类型推断
4. 使用类型守卫
5. 善用实用类型
6. 谨慎使用非空断言

遵循这些实践，你的 TypeScript 代码会更加安全和可维护。
