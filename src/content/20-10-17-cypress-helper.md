---
title: Typescript 환경에서 Cypress helper 함수 만들기
date: '2020-10-17T16:00:03.284Z'
template: "post"
draft: false
slug: "cypress-helper"
category: "e2e"
tags:
  - "cypress"
  - "e2e"
  - "test"
description: "테스트 코드 역시 중복을 제거하여 가독성을 살리고 유지보수를 용이하게 해주는 것이 중요하다."
socialImage: ""
---

테스트 코드 역시 중복을 제거하여 가독성을 살리고 유지보수를 용이하게 해주는 것이 중요하다. 

사실 테스트 코드는 작성하지 않아도 월급을 주지 않거나 잘리는 일은 없기 때문에 소홀히 하는 경향이 더 강하기 때문에 오히려 더더욱 접근성이 높여줄 필요가 있다.

Cypress 에서 자주 사용하는 selector 가 있거나 일반적으로 적용하는 timeout 옵션이 있다면 매번 일일히 작성하는 것보다 helper 함수로 추출하는 것이 좋다.

하지만 Cypress 메소드는 `cy` 네임스페이스가 적용되는 공간에서 사용할 수 있기 때문에 일반적인 방법으로 helper 함수를 만드는 것이 어렵다.

따라서 Cypress 가 제공하는 `Cypress.Commands.add()` 메소드를 사용할 필요가 있다. 이 메소드는 `root/Cypress/support/index.ts` 에 작성한다.

첫번째 인자로 helper 함수의 이름을 string 으로 전달하고, 두번째 인자로 helper 함수의 오퍼레이션 역할을 하는 함수를 callback 으로 전달한다.

```typescript
Cypress.Commands.add(‘getByTestId’, (testid: string, timeout = 10000) =>
  cy.get(`[data-testid=${testid}]`, { timeout })
);
```

위 helper 함수는 html element 에 선언한 `data-testid` attribute 로 해당 element 에 접근하는 역할을 한다. 사용자와의 상호작용이 많은 서비스의 경우 특정 액션 이후에 해당 element 가 나타날 수 있기 때문에 기본적으로 timeout 옵션값으로 `10000ms` 를 전달한다.

자바스크립트 환경에서는 여기서 끝이지만 타입스크립트에서는 타입 선언이 필요하다.

따라서 `root/Cypress/support/index.d.ts` 에 다음과 같이 타입을 지정한다.

```typescript
/// <reference types="cypress" />
declare namespace Cypress {
	interface Chainable<Subject> {
		getByTestId(testid: string, timeout?: number): Chainable<JQuery<HTMLElement>>;
  }
}
```

그리고 사소한 부분이라 빼먹기 쉬운데 이렇게 만든 helper 함수를 사용할 테스트 파일에 다음 `/// <reference types=“../support” />` 를 상단에 삽입한다. 예시처럼 삽입하면 될 것이다.

```typescript
/// <reference types=“cypress” />
/// <reference types=“../support” />
```

그럼 이제 테스트 코드(`root/Cypress/integration/example-test.spec.ts`)에서 다음처럼 사용이 가능하다.

```typescript
  cy.getByTestId('example-button').click();
  cy.getByTestId('exmaple-content').should('be.visible');
```
