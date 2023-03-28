---
title: Custom hook 을 이용해서 intersection observer 재사용하기
date: '2021-12-12T19:37:00.000Z'
template: "post"
draft: false
slug: "intersection-observer"
category: "dev"
tags:
- "intersection-observer"
description: "intersection observer 를 사용하면 뷰포트에 대상으로 지정한 element 가 나타날 때의 이벤트를 지정할 수 있다."
socialImage: ""
---

## intersection observer api

[공식문서](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) 를 참조하면 일반적으로

- 페이지 스크롤로 이미지나 다른 요소를 지연 평가로 불러오고 싶은 경우
- 무한 스크롤 페이지를 구현하고 싶은 경우

이런 경우들을 다루기 위해 사용한다고 한다.

intersection observer api 를 사용할 때, 

브라우저 뷰포트나 대상 element 를 일컫어 root 혹은 root element 라고 부른다. 

이 root 에 `observer.observe()` 메서드의 인자로 전달하는 element 가 나타나면(intersect)

`IntersectionObserver` 의 생성자의 첫번째 인자로 전달한 callback 을 실행시킨다.

## 코드 예제

```typescript
const fun = () => {
    console.log('hello world');
}

const intersectionobserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        fun();
      }
    });
  }
);

const el = document.querySelector("#target");

intersectionobserver.observe(el);
```

첫번째 인자로 callback 함수를 전달하고, 두번째 인자인 option 은 전달하지 않는다.

따라서 root 역시 기본값인 브라우저의 뷰포트이다.

callback 의 첫번째 인자인 entries 는 `IntersectionObserverEntry` 의 배열이다.

`IntersectionObserverEntry` 는 root 와 `observer.observe()` 메서드의 인자로 전달하는 element 간 intersect 상황에 따라 새로운 프로퍼티 값을 가진다.

단일 인스턴스가 아니라 배열인 이유는

```typescript
const el = document.querySelector("#target");
const secondEl = document.querySelector("#second-target");

intersectionobserver.observe(el);
intersectionobserver.observe(secondEl);
```

이처럼 `observer.observe()` 을 여러번 호출해서 다수의 element 를 주시하는 경우 각 주시하는 element 에 대응하는 인스턴스를 배열 요소로 담기 때문이다.

## 무한 스크롤

SPA 에서 무한 스크롤을 구현하는 경우 스크롤 이벤트에 페이지네이션 operation 을 추가하거나

이 intersection observer 를 사용해서 마지막 element 가 뷰포트에 드러났을 때 페이지네이션 operation 을 실행시킬 수 있다.

스크롤 이벤트로 다루는 경우, debounce 작업이 필요하고 마지막 페이지에 도달한 경우에는 또 조건문을 추가해서 api 요청 등을 하지 않도록 해야하는 번거로움이 존재한다.

그래서 대부분의 경우 intersection observer 로 무한 스크롤을 구현하는 것이 깔끔하다.

하지만 가끔은 각 item 들의 크기가 균등하지 않은 grid 레이아웃의 경우에는 마지막 row 가 뷰포트에 intersect 하는 것이 애매할 수 있어서, 이 경우에는 스크롤 이벤트에 무한 스크롤과 관련한 operation 을 추가하는 것이 더 나을 것이다. 

## react custom hook 으로 무한 스크롤에 사용하는 intersection observer 재사용

```typescript
import { useEffect, useRef } from "react";

const useDetectElement = <Dependencies extends any[]>(
  callback: () => void,
  deps: Dependencies
) => {
  const displayElement = useRef<HTMLElement>(null);
  useEffect(() => {
    if (displayElement && displayElement.current) {
      const intersectionobserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              observer.unobserve(entry.target);
              callback();
            }
          });
        }
      );
      intersectionobserver.observe(displayElement.current);
      return () => intersectionobserver.disconnect();
    }
  }, [displayElement, ...deps]);

  return displayElement;
};

export default useDetectElement;
```

위와 같은 hook 을 생성한 뒤, `const el = useDetectElement(callback, [deps])` 로 MutableRefObject 을 초기화한다.
 
이후 `el` 이라 이름붙인 MutableRefObject 를 대상 react component 의 `ref` props 에 전달하면

대상 react component 가 뷰포트에 드러날 때 callback 함수를 호출한다.

무한 스크롤 용도로 제작한 custom hook 이기 때문에(정확히는 마지막 element 에만 특정 callback 을 실행시키기 위한 것이기 때문에) 

`observer.unobserve(entry.target);` 을 callback 호출 전에 호출한다.

내 경우, 대상 react component 에 `ref` props 를 전달하는 것을, 조건에 따라 대상 react component 를 변경해주었기 때문에

`observer.unobserve(entry.target);` 을 따로 호출하지 않아도 뷰포트에 대상 컴포넌트가 드러난 이후에는 더 이상 observer 가 대상 컴포넌트를 주시하지 않도록 했다.

여기서 좀 더 custom hook 을 일반화하고 싶은 경우에는, custom hook 의 매개변수를 하나 더 추가해서, option 매개변수에다가 root element 를 설정할 수 있을 것이다.
