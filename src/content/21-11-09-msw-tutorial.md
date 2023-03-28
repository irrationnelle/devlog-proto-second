---
title: MSW 를 사용해서 실제 API 가 작동하는 것처럼 mocking 하기
date: '2021-11-10T20:37:00.000Z'
template: "post"
draft: false
slug: "msw-tutorial"
category: "dev"
tags:
- "test"
- "jest"
- "msw"
description: "최근에 API 요청에 test double 을 사용해서 테스트를 해야하는 경우가 생겼다."
socialImage: ""
---

## 수정(21.11.18): act 로 감싼 fireEvent 에 대해

예제 코드에서 `fireEvent` 를 `act` 로 감쌌는데,

`fireEvent` 는 내부에서 이미 `act` 를 호출한다고 한다.

[Documentation mismatch: fireEvent wrapped in act()](https://github.com/testing-library/react-testing-library/issues/887)

그래서 지금(21.11.18) 예시에 있던 `act` 호출을 모두 삭제한다.

## API 요청에 test double 사용하기

일반적으로 API 를 요청해서 서버로에서 값을 가져오는 경우, e2e 테스트가 아니라면 API 요청에 test double 을 사용한다.

예를 들어 영화 제목 목록을 가져오는 API 를 `readMovies` 라고 할 때, 다음과 같이 테스트를 한다.

테스트 스펙은 movies 라는 버튼을 클릭한 경우, 영화 제목 목록이 나타나는 것이다.

```javascript
import * as api from '../api';

test("영화 목록을 받아온다.", async () => {
    jest.spyOn(api, 'readMovies').mockReturnValue([{title: 'Inception'}, {title: 'The Dark Knight'}]);
    
    render(<App />);

    const button = screen.getByText(/movies/i);
    fireEvent.click(button);

    const title = await screen.findByText(/inception/i);
    expect(title).toBeInTheDocument();
});
```

서버에서 직접 값을 받아오는 대신에 `readMovies` 요청을 test double 을 사용해서 가짜값을 전달한다.

그럼 테스트 대상은 API 가 값을 전달해주었다고 생각하고 테스트 스펙대로 작동한다. 이 과정에서 테스트 코드는 테스트 대상이 값을 어떻게 다루는지 검증한다.

## API 응답에 대한 test double 의 한계

상황에 어울리게 mocking 결과를 다르게 해주어야 하는 경우가 있을 때는 굉장히 번거롭다. 서버가 에러를 던진다거나 하는 상황이 그렇다.

또 서버가 응답이 느려서 그동안 loading 화면을 보여주기로 하는 스펙이 있을 땐, 테스트가 한층 복잡해진다.

```javascript
import * as api from '../api';

test("책 목록을 받아온다.", async () => {
  jest.spyOn(api, "readBooks").mockImplementation(() => {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve([{ title: "Thus Spoke Zarathustra" }]);
      }, 3000)
    );
  });
  render(<App />);

  const button = screen.getByText(/books/i);
  fireEvent.click(button);

  const loading = await screen.findByText(/loading/i);
  expect(loading).toBeInTheDocument();

  const title = await screen.findByText(
    /Thus Spoke Zarathustra/i,
    {},
    { timeout: 4000 }
  );
  expect(title).toBeInTheDocument();
});
```

이처럼 test double 이 단순히 가짜값을 전달해주는 것이 아니라 내부적으로 비동기적인 시간 지체까지 구현해주어야 한다.

## MSW (Mock Service Worker)

서비스 워커라는 이름 때문에 상당히 어려운 개념이라고 생각하고 있었다.

이벤트 루프라는 개념을 익히고 나니, 자바스크립트가 기본적으로 작동하는 메인 스레드와 다른 스레드에서 작동하는 스크립트라고 이해할 수 있었다.

그래서 이 별개의 스레드에서 작동하는 스크립트가 하는 일은 바로 네트워크 요청을 중간애 가로채는 것이다.

어쨌든 이름부터가 서비스 워커이고, [서비스 워커](https://developers.google.com/web/fundamentals/primers/service-workers) 는 브라우저에서 제공하는 API 이다.

node.js 환경에서는 그래서 [@mswjs/interceptors](https://github.com/mswjs/interceptors) 라는 걸 사용해서 http 모듈을 [monkey-patch](https://en.wikipedia.org/wiki/Monkey_patch) 해서 네트워크 요청을 가로챈다.

리포에 가서 코드를 잠깐 보면 `window.fetch =  async() => {...}` 같은 코드를 볼 수 있다.

## MSW 사용해서 테스트 코드 작성하기

### handler

```javascript
import { rest } from "msw";

export const handlers = [
  rest.get("http://example.com/movies", (req, res, ctx) => {
    return res(ctx.status(500), ctx.json({ message: "internal error" }));
  }),
  rest.get("http://example.com/books", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          title: "Thus Spoke Zarathustra",
        },
        {
          title: "The Responsibility of Intellectuals",
        },
      ])
    );
  }),
];
```

일부러 movies 를 요청할 때는 에러를 띄우게 했다.


### server

```javascript
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

// This configures a request mocking server with the given request handlers.
export const server = setupServer(...handlers);
```

server 인 이유는 jest 를 node.js 환경에서 실행시키기 때문이다. 브라우저 환경에서 테스트한다면 서비스 워커를 등록하는 과정을 거친다.

### setupTests

```javascript
import "@testing-library/jest-dom";

import { server } from "./mocks/server.js";

// 테스트 전 mock 서버 활성화
beforeAll(() => server.listen());

// mock 핸들러가 다른 테스트에 영향을 미치지 않도록 각 테스트 종료 후 핸들러를 초기화한다.
afterEach(() => server.resetHandlers());

// 모든 테스트를 종료하면 mock 서버도 종료한다.
afterAll(() => server.close());
```

setupTests 파일은 보통 CRA 로 생성한 react 프로젝트에서 볼 수 있는 테스트 환경 설정 파일이다.

여기서 설정하면 setupTests 의 설정에 영향을 받는 모든 테스트가 msw 의 mock 서버에도 영향을 받는다.

그것이 싫다면 위 jest hook 의 메서드들의 callback 에서 호출했던 server 메서드들을 개별 테스트에서 호출하도록 한다.

## 테스트 코드 작성

```javascript
import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";

import { server } from "./mocks/server";
import { rest } from "msw";

import App from "./App";

test("딜레이 테스트", async () => {
  server.use(
    rest.get("http://example.com/movies", (req, res, ctx) => {
      return res(
        ctx.delay(3000),
        ctx.status(200),
        ctx.json([
          {
            title: "The Dark Knight",
          },
          {
            title: "Inception",
          },
        ])
      );
    })
  );

  render(<App />);

  const button = screen.getByText(/movies/i);

  const loading = screen.queryByText(/loading/i);
  expect(loading).not.toBeInTheDocument();

  act(() => {
    fireEvent.click(button);
  });

  const loadingAfterClick = await screen.findByText(
    /loading/i,
    {},
    { timeout: 1000 }
  );
  expect(loadingAfterClick).toBeInTheDocument();

  const titleWaitingApiResult = screen.queryByText(/inception/i);
  expect(titleWaitingApiResult).not.toBeInTheDocument();

  const title = await screen.findByText(/inception/i, {}, { timeout: 4000 });
  expect(title).toBeInTheDocument();

  const loadingAfterRequestComplete = screen.queryByText(/loading/i);
  expect(loadingAfterRequestComplete).not.toBeInTheDocument();
});

test("에러 테스트", async () => {
  render(<App />);

  const button = screen.getByText(/movies/i);
  act(() => {
    fireEvent.click(button);
  });

  const error = await screen.findByText(/error/i);
  expect(error).toBeInTheDocument();
});

test("책 목록 받아오기 테스트", async () => {
  render(<App />);

  const button = screen.getByText(/books/i);
  fireEvent.click(button);

  const loading = await screen.findByText(/loading/i);
  expect(loading).toBeInTheDocument();

  const title = await screen.findByText(
    /Thus Spoke Zarathustra/i,
    {},
    { timeout: 4000 }
  );
  expect(title).toBeInTheDocument();
});
```

개별 테스트에서 `server.use()` 를 사용해서 `setupSever` 에 전달했던 handler 와는 다른 결과를 기대하는 테스트를 볼 수 있다. 

delay 를 3초 간 주었기 때문에 `findByText` 를 사용해서 비동기적으로 테스트를 검증할 수 있었다. loading 화면이 나타났다가 결과가 나오는 것을 테스트에서 확인 가능하다.

참고로 이번 포스팅을 작성하면서 알게 된 것이지만 `@testing-library/react` 에서 제공하는 `queryBy~` 함수는 비동기 함수가 아니었다. 

비동기적인 상황을 관리하고 싶을 땐 반드시 `findBy~` 를 사용하도록 하자

## 마치며

무엇보다 편한 것은 특정 api 에서 고정된 값을 전달하도록 mocking 할 때는 단 한 번의 handler 작성으로 더 이상 mocking 할 필요가 없다는 점이다.

그리고 test double 보다 개념 이해하기도 사실 굉장히 쉽다. 나는 test double 과 mock 이라는 개념을 ATDD 수업을 듣기 전까지는 왜 필요한지도 몰랐으니깐.
