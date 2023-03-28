---
title: Typecript 의 Record 타입
date: '2020-10-18T16:00:03.284Z'
template: "post"
draft: false
slug: "record-type"
category: "typescript"
tags:
  - "typescript"
description: "배열을 받아서 `reduce` 메소드를 이용해서 동적 key 값을 가지는 오브젝트로 변환하려고 하면 타입 에러가 곧잘 뜬다."
socialImage: ""
---

배열을 받아서 `reduce` 메소드를 이용해서 동적 key 값을 가지는 오브젝트로 변환하려고 하면 타입 에러가 곧잘 뜬다. `reduce` 메소드의 accumulator 뿐만 아니라 빈 오브젝트를 선언하고 반복문 내부에서 동적 key 를 부여할 때도 마찬가지.

결국 `any` 타입을 쓰거나 `@ts-ignore` 어노테이션을 쓰거나 해야하는데 둘 다 찝찝하다면 `Record` 타입을 사용하자.

```typescript
const createCounterObj = (targetArr: string[]): Record<string, number> =>
  targetArr.reduce((acc: Record<string, number>, curr: number) => {
    if (acc[curr]) {
      acc[curr] += 1;
      return acc;
    }
    acc[curr] = 1;
    return acc;
  }, {});
```

hackkerrank 문제를 풀면서 실제로 사용했던 코드를 예제로 가져왔다.

`Record<K, V>` 에서 K는 key 의 타입이고, V는 value 의 타입이다. 즉 위 예제에서는 key 는 동적인 string 값을 가지고 value 는 number 타입이 된다.

