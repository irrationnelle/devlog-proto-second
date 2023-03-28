---
title: event loop 와 requestAnimationFrame
date: '2021-10-19T19:37:00.000Z'
template: "post"
draft: false
slug: "event-loop-raf"
category: "dev"
tags:
  - "eventloop"
description: "rAF에 대해 정리를 해야지 잠이 올 것 같다."
socialImage: ""
---

## 이벤트 루프

자바스크립트는 기본적으로 싱글스레드에서 작동한다.

그래서 콜스택에 처리할 연산 목록을 쌓아두어 차례차례 실행한다.

콜스택에 연산 목록과 별개로 브라우저 API 요청이 있으면,

우선순위 queue 에다가 보관해놓고

콜스택을 비운 뒤 각 queue 에서 이벤트 루프가 연산들을 가져간다.

이 queue 에는 task queue, microtask queue, animation frame 등이 있다.

## requestAnimationFrame

setInterval 보다 성능이 좋다고 한다.

이유는 setInterval 자체가 그리 정확하게 작동하지 않는 것도 있고

두번째 인자로 전달하는 interval 값이 사용자가 느끼기엔 어색한 빈도일 수 있기 때문.

하지만 requestAnimationFrame 은 브라우저가 현재 디스플레이 환경에 맞춰

최적의 빈도로 실행을 한다.

디스플레이 환경에 맞춘다는 것은, 모니터가 초당 60프레임으로 움직임을 보여준다면 requestAnimationFrame 도 초당 60프레임으로 작동한다는 것이다.

## queue 우선 순위

일반적으로 이벤트 루프가 콜스택에 무엇을 채워넣을지 결정할 때, microtask 를 가장 먼저 처리한다고 한다.

microtask 로는 promise 등이 속한다. setTimeout 같은 건 그냥 task.

그 후에는 animation frame 에 속하는 연산을 처리하는데, 이게 바로 rAF 의 첫번재 인자로 전달하는 콜백이다.

근데 때로는 task queue 에 있는 작업을 먼저 수행하기도 한다고 하는데

이거 때문에 누구 말이 맞나 꽤 혼란스러웠다.

결론은 우선순위는 animation frame 이 먼저이지만,

앞서 예시를 든 환경이라면 초당 60프레임으로 보여주는 상황을 잘 충족하고 있다면

우선순위를 task queue 에게 양보하기도 한다는 것.

## requestAnimationFrame 추가

브라우저가 작동할 때 reflow 후에 repaint 를 하는데

rAF 는 reflow 가 아니라 repaint 에 관여를 한다.

프로그레스바 같은 것이 채워지는 것도 width 나 height 가 길어진다고 생각해서

reflow 라고 생각할 수 있지만, repaint 임을 명심하자.

## 나중에 공부하려고 남기는 레퍼런스 링크

https://www.w3.org/TR/animation-timing/#dom-windowanimationtiming-requestanimationframe

이 포스팅에서 정리한 것들은 이 레퍼런스 글이 아니라 여기저기서 지식을 주워담은 것을 정리한 것이다.
