---
title: 서버 사이드 렌더링에 대해
date: '2021-11-17T19:37:00.000Z'
template: "post"
draft: false
slug: "server-side-rendering"
category: "dev"
tags:
- "nextjs"
- "SSR"
- "server-side-rendering"
description: "서버 사이드 렌더링은 말 그대로 서버에서 HTML 마크업을 생성한 후 생성한 HTML 파일을 클라이언트에 전달하는 것을 의미한다."
socialImage: ""
---

## server side rendering (SSR)

Single Page App 이 유행하는 최근에는 오히려 접하기 힘든 개념이 되었다.

과거에는 사용자가 웹페이지와 상호작용하기 위해서 서버 사이드 렌더링을 사용했다.

서버 사이드 렌더링을 간략히 설명하자면 다음과 같다.

> 사용자가 웹페이지에서 요청을 보내면, 서버가 요청에 적합한 연산을 마친 뒤 결과를 토대로 적절한 HTML 파일을 생성해서 다시 사용자에게 전달한다.

예를 들어 express 서버에서 요청을 처리하고, 연산 결과를 토대로 ejs 로 HTML 페이지를 생성할 수 있다.

다른 예시로, jsp 와 tomcat 을 이용해서 HTML 페이지를 생성해서 사용자에게 HTML 페이지를 전달할 수도 있다.

작성하면서 문득 느낀 것이 있다. ejs 와 jsp 는 사용 언어(각각 자바스크립트와 자바)가 다르지만 그 용례가 상당히 유사하다.

어쨌든 이렇게 사용자가 HTML 페이지를 다시 전달받으면 브라우저는 새로고침을 해서 새로 받은 HTML 을 표시한다.

## 새로고침에 대해

문득 새로고침을 브라우저가 자동으로 하는지, 의도적으로 사용자가 새로고침을 해야하는 상황을 만드는지 궁금했다.

사용자가 새로고침을 해야하는 상황을 만든다는 것은 다음과 같다.

- 자바스크립트로 명시적으로 `window.location.reload()` 를 호출한다. 
- a 태그에 href attribute 를 추가해서 명시적으로 다른 페이지로 이동한다. 

즉 명시적으로 새로고침을 하거나, 페이지 이동을 해서 새로운 페이지를 읽어와야지 서버로부터 받은 HTML 을 갱신하는지 궁금했다.

SPA 가 유행한 이유를 생각하면 당연히 새로고침을 해주어야지 값이 갱신되겠지만,

당연히 그렇겠지 라고 생각하는 게 마음에 걸려서 실험을 해보았다.

express 로 간단히 로컬 서버를 만들었다.

그리고 브라우저로 `http://localhost:3000` 에 접속하면 미리 준비한 public 디렉터리의 index.html 을 불러온다.

이 index.html 내부에 script 를 작성해서 버튼을 클릭하면 `http://localhost:3000/sample` 로 요청을 보내기로 했고,

서버에서는 `http://localhost:3000/sample` 로 요청이 오면 새로운 html 을 생성해서 보내준다.

이렇게 준비를 한 뒤 버튼을 클릭하면 브라우저는 새로운 html 을 받는다. 네트워크 탭에서도 확인 가능하고 소스 탭에서도 확인 가능하다.

하지만 아무 일도 일어나지 않고, 소스 탭에서 직접 그 HTMl 을 열어주거나, 브라우저 주소를 `http://localhost:3000/sample` 로 이동하면

서버가 보내준 HTML 을 확인할 수 있다.

즉, 서버가 서버 사이드 렌더링을 통해 동적 데이터가 담긴 HTML 을 사용자에게 전달해도

사용자가 새로고침을 하지 않으면 그 HTML 은 의미가 없는 것이 된다.

## form 태그

[Why does submit refresh page](https://stackoverflow.com/questions/60090465/why-does-submit-refresh-page) 에서는 `type="submit"` 인 버튼을 클릭하면 새로고침이 되는 것에 대해 이야기한다.

MDN 의 [HTML 폼 구성 방법](https://developer.mozilla.org/ko/docs/Learn/Forms/How_to_structure_a_web_form) 을 읽어보면 

form 이 보낸 요청에 대해 응답을 받을 때 `target` attribute 를 설정할 수 있다고 명시한다.

이 `target` 에 대해 설명을 읽어보면 target attribute 에서 설정한 브라우징 컨텍스트로 `응답을 불러온다` 라고 설명한다.

이 대목이 form 태그 내부에서 submit 가 발생했을 때 브라우저를 새로고침하는 이유를 추측케 한다. 

좀 더 자세한 건 [여기](https://html.spec.whatwg.org/multipage/browsers.html#browsers) 를 정독해야 할 거 같다.

## 브라우저의 기본 동작과 새로고침

어쨌든 form 태그가 서버에게 요청하는 목적으로 만들어졌다는 것을 알 수 있고,

요청 후 변화를 반영하기 위해 브라우저 차원에서 새로고침을 진행하는 것을 보면

브라우저는 서버로부터 받은 데이터를 최신화 하기 위해 새로고침을 수행하는 것이 기본 동작이라는 것을 짐작할 수 있다.

## 이어서 이야기 해볼 것

사실 react 의 SSR 에 대해 알아보면서 [next.js](https://nextjs.org) 를 가지고 이것저것 실험해본 것들을 기록하기 위한 것이 이번 포스팅의 목적이었다.

그런데 SSR 에 대해서 간단히 서술하다보니, SSR 의 단점으로 자주 꼽히는 `새로고침` 이 실제로 왜 그렇게 작동하는지 궁금해졌고

나름대로 파고들다 보니 이야기가 길어져버렸다.

next.js 에 대한 이야기는 다음 번에 이어서 하는 것으로.
