---
title: Promise 실행과 평가 시점에 대하여
date: '2021-02-03T16:00:03.284Z'
template: "post"
draft: false
slug: "promise-call"
category: "Dev"
tags:
- "promise"
description: "코드 리뷰를 하는 중에 다음과 같은 코드를 보았다."
socialImage: ""
---

# Promise 실행과 평가 시점에 대하여

코드 리뷰를 하는 중에 다음과 같은 코드를 보았다.

```typescript
const fetchSomething = (): Promise<unknown> => {
	if(hasResult) {
		return existingResult;
	}
	return internalPromise();
}

const someTask: Promise<unknown> = fetchSomething()

let result = null;
if(isFlag) {
	await otherTask();
	result = await someTask;
}

result = await someTask;
```

나는  `isFlag` 의 조건과 상관없이 `someTask` 를 실행하기 때문에 `await someTask` 를 조건문보다 위로 이동시키는 게 어떠느냐고 리뷰했다.

답변은 그렇게 하면 항상 `someTask` 가 끝난 뒤 `otherTask` 가 작동하기 때문에 시간적으로 손해라는 것이었다.

`await`  를 연이어서 두 번 사용하기 때문에 A+B 시간이나 B+A 시간이나 다를 게 없다고 생각한 나는 반론했다. 내 반론에 대하여  `fetchSomething` 을 호출한 시점에서 이미 Promise 내부의 operation 은 실행하고 있다는 뉘앙스의 답변을 받았다.

결국 나는 playground 를 만들어서 아주 간단하게 테스트를 해보았다.

```typescript
const somePromise = () => new Promise((resolve) => {
	console.log('start promise');
	setTimeout(() => {
		resolve('hello world!');
	}, 3 * 1000);
})

somePromise()
```

이번에 공부해서 정확하게 알게 된 것은, Promise 는 3가지 상태를 가진다는 것이다. [참고](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise).  그 중 pending 상태는 아직 평가를 내리지 않은 상태인데, 나는 이 pending 상태에서는 promise 내부에서 어떤 operation 도 실행하지 않는다고 생각했다.

하지만 위 예제에서 `somePromise()` 를 호출하고 나니 바로 `start promise` 라는 결과가 나왔다.
