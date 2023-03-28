---
title: vanilla javascript 로 키입력마다 input 이벤트 발생시키기 그리고 테스트
date: '2021-11-09T19:37:00.000Z'
template: "post"
draft: false
slug: "vanilla-javascript-input-and-test"
category: "dev"
tags:
- "vanilla-javascript"
description: "바닐라 자바스크립트에서는 input element 의 키입력을 매 키입력마다 인식하지 않는다."
socialImage: ""
---

## input element 에서 키입력값을 받아오는 방법

```javascript
const input = document.createElement('input');
input.onchange = function(event) {
    console.log(event);
}

const inputSecond = document.createElement('input');
inputSecond.addEventListener('change', function(event) {
    console.log(event);
})
```

위의 방법으로는 키입력을 할 때마다 이벤트가 발생하지 않는다.

키입력마다 이벤트를 발생시키고 싶을 때는 아래처럼 `input` 이벤트에 이벤트 리스너를 설정한다.

```javascript
const input = document.createElement('input');
input.oninput = function(event) {
    console.log(event);
}

const inputSecond = document.createElement('input');
inputSecond.addEventListener('input', function(event) {
    console.log(event);
})
```

위와 같이 이벤트 리스너를 설정한 뒤, 철자 하나 하나 입력이 아닌 지금까지 입력한 input 값을 사용하고 싶을 때는 `input.value` 를 사용한다.

# input 이벤트 리스너 테스트 방법

`@testing-library/dom` 으로 테스트를 할 때 `fireEvent` 함수를 다음과 같이 사용해서 input 입력을 테스트 할 것이다.

```javascript
import { getByLabelText, fireEvent } from "@testing-library/dom";

test("input test", () => {
    const container = getContainer();
    const inputEl = getByLabelText(container, "example-input");
    fireEvent.change(inputEl, { target: { value: 'something to write' } })
})
```

그런데 이런 식으로 테스트를 하면 input 이벤트 리스너로 등록한 콜백 함수는 호출하지 않는다.

`fireEvent` 가 아니라 `@testing-library/user-event` 의 `type` 메서드를 사용해도 마찬가지이다.

이 때에는 직접 input event 를 dispatch 해주는 방식으로 키입력을 대신할 수 있다.

```javascript
import { getByLabelText } from "@testing-library/dom";

test("input test", () => {
    const container = getContainer();
    const inputEl = getByLabelText(container, "example-input");
    
    const event = new Event("input", {
        bubbles: true,
        cancelable: true,
    });
    inputEl.value = "something to write";
    inputEl.dispatchEvent(event);
})
```

위와 같이 input event 를 dispatch 하면 input 이벤트 리스너로 등록한 콜백 함수를 호출하는 것을 확인할 수 있다.
