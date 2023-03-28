---
title: React 에서 Context API 와 상태관리
date: '2021-10-07T20:37:00.000Z'
template: "post"
draft: false
slug: "context-and-state-management"
category: "react"
tags:
  - "react"
  - "context"
description: "react 에서 context api 와 상태관리에 대해 종종 혼동하는 모습을 볼 수 있다."
socialImage: ""
---

## Context API 단점

context api 에서 상태값을 변경하면, provider 로 감싼 모든 자식 컴포넌트들이 리렌더링한다. 그래서 context api 를 상태관리 도구로 사용하면 각 자식 컴포넌트들이 리렌더링하지 않도록 방어할 필요가 있다. 결론적으로 context api 는 상태관리 도구로 사용하면 props drilling 을 회피한다는 장점보다 잃는 것이 더 많다.

## 그런데 왜 상태관리 도구로 쓰나?

redux 는 보일러플레이트 코드가 많다. recoil 은 아직 개발 단계이다. mobx 는 써본 적이 없어서 이야기하지 않겠다.

위의 전역 상태 관리 도구를 사용하지 않으면, props drilling 으로 각 컴포넌트들의 상태를 관리해야 한다.

그런데 간혹 상태값이 필요한 컴포넌트와 부모 컴포넌트 사이에 낀 중간 컴포넌트가 존재할 때가 있다. 그 중간 컴포넌트는 부모와 자식의 상태를 매개하기 위해서만 props 를 받는다. 이런 중간 컴포넌트가 많아지면 redux 의 보일러플레이트 만큼 코드량이 많아진다.

context api 를 쓰면 그런 중간 컴포넌트를 건너뛰고 바로 대상으로 하는 컴포넌트로 전달할 수 있다.

props 가 필요한 컴포넌트 입장에서는 context api 가 전달해주는 props 든 전역 상태 관리가 전달하는 props 이든 구분할 이유가 없다. 그래서 사용하는 개발자도 props 를 전달하는 목적을 달성할 수 있다는 이유만으로 구분하지 않는다. 그래서 context api 를 상태 관리 도구처럼 착각한다.

## redux provider

`react-redux` 는 `Provider` 를 제공한다. 이걸 context api 라고 생각할 수 있다. props 로 store 를 받는 것조차 동일하다.

이에 대해서 다음 글 두개를 참고하자.

- [React-Redux Roadmap: v6, Context, Subscriptions, and Hooks · Issue #1177 · reduxjs/react-redux · GitHub](https://github.com/reduxjs/react-redux/issues/1177))

- [Release v7.0.1 · reduxjs/react-redux · GitHub](https://github.com/reduxjs/react-redux/releases/tag/v7.0.1)

결론적으로 `react-redux` 도 context api 를 사용했다가 다시 각 컴포넌트가 store 를 직접 구독하는 방식으로 변경한 것을 알 수 있다.

## 그럼 언제 context api 를 사용하는가?

context api 는 props drilling 대신 사용하는데 유용하다. 즉 provider 내부에서 상태 변경이 거의 일어나지 않는다면, 해당 상태를 provider 하위의 다른 컴포넌트에 전달하는 용도로 쓰는데 적합하다.

그 예시로 주로 locale 이나 theme 정보 등을 언급한다.

햐지만 거의 상태변경이 일어나지 않으면서 전역적으로 사용이 필요한 개체를 초기화하는 위치로도 적합하다.

이렇게 context api 를 사용해서 개체를 초기화 하는 경우, 몇가지 장점이 있다.

- 테스트 코드를 작성할 때 provider 를 감싸주는 것으로 mocking 을 대신할 수 있다. 물론 이 경우 초기화하는 개체에 테스트가 의존성을 가지기 때문에 유닛 테스트 대신 통합 테스트에 어울린다.

- context 의 provider 가 인터페이스 역할을 하면서 컴포넌트 간의 결합성이 낮아지고, provider 를 교체하는 것만으로 훗날 명세 변경에 대응할 수 있다.

## 결론

- context api 는 상태 관리에는 어울리지 않는다.
- 정적인 값에 가까운 값을 props drilling 대신할 때 적절하다.
