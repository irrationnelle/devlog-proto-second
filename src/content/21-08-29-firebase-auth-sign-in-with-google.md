---
title: firebase auth 이용하여 google 로그인 구현
date: '2021-08-29T19:37:00.000Z'
template: "post"
draft: false
slug: "firebase-auth-google-sign-in"
category: "firebase"
tags:
- ""
description: "firebase 로 back-end 구성을 해서 로그인 구현하는 중에 구글 로그인을 추가하기로 했다."
socialImage: ""
---

# firebase

서버리스하면 다들 aws lambda 를 떠올리는 것 같지만, 나는 firebase 를 먼저 손에 꼽는다.

일단 나는 공식 문서의 불친절함과 직관성이 전혀 없는 대시보드 등으로 aws 서비스를 우호적으로 생각하지 않는다.

그래서 개인 프로젝트는 gcp 나 azure 를 시도해보려고 하는데, firebase 는 이중에서도 가장 접근성이 좋다.

back-end 의 스펙에 대해 어느 정도 익숙하고 sdk 라는 걸 다뤄본 적이 있다면 소규모 프로젝트나 프로젝트의 와이어 프레임 구현으로는 아주 적격이다.

난 웹앱 환경에서만 사용했지만, android 와 ios 환경도 지원하기 때문에 정말 이만한 서비스가 없다.

# firebase auth

firebase 를 이용해서 로그인 구현 및 인증처리하는 방법은 간단한데, 이메일 주소와 비밀번호를 사용하는 경우 다음처럼 처리한다.

예제는 [여기](https://github.com/firebase/snippets-web/blob/eee411f0580eb061e4c6eeabf9b4fd8aac9b49ab/auth/email.js#L28-L38)에서 가져왔다.


```typescript
import firebase from "firebase/app";
import "firebase/auth";

const signUpWithEmailPassword = async () => {
  const email = "test@example.com";
  const password = "hunter2";

  try {
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
  } catch(error) {
    const errorCode = error.code;
    const errorMessage = error.message;
  };
}
```

예제에서 반환한 userCredential 에서는 이메일 인증을 완료했는지 확인하는 property 까지 가지고 있다.

단점이 있다면, 사용자에 custom property 같은 걸 추가하고 싶다면 별도로 realtime database 나 firestore database 에서 사용자를 다루는 테이블을 만들어야 한다.

하지만 단순히 클라이언트 사용자의 유효성을 판단하기 위해서라면 이걸로 끝이다. 토큰도 알아서 firebase sdk 가 관리한다.


# Google 로그인

firebase 는 구글에서 제공하는 서비스이니, 구글 로그인도 쉽다.

```typescript
import firebase from "firebase/app";
import "firebase/auth";

const signInWithGoogle= async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

  // ref: https://developers.google.com/identity/protocols/oauth2/openid-connect#authenticationuriparameters
  provider.setCustomParameters({
    'prompt': 'select_account'
  });

  try {
    const result = await firebase.auth().signInWithPopup();
    const credential = result.credential;

    // This gives you a Google Access Token. You can use it to access the Google API.
    const token = credential.accessToken;
    const user = result.user;
  } catch(error) {
    const errorCode = error.code;
    const errorMessage = error.message;
  };
}
```

`provider.setCustomParameters` 의 인자로 전달하는 옵션값은 주석의 링크를 참고하자.


# 그런데 Google 로그인이 안된다.

여러가지를 고려할 수 있다.

- gcp 의 `API 및 서비스` 메뉴의 `사용자 인증 정보` 에서 api 키의 권한을 조정하고 api 를 요청하는 도메인 권한을 설정해주어야 할 수 있다.
- firebase 의 authentication 메뉴를 선택하고, Sign-in method 탭에서 승인된 도메인을 설정해야 할 수 있다.

그런데 내 경우, 둘 다 아니었고 이것저것 많이 시도해보다 아주 근본적이고 기초적인 부분의 문제였다는 것을 알 수 있었다.

# firebase.initializeApp() 을 신중히

firebase 앱을 사용하기 위해선, 모든 sdk 가 그렇듯 초기화 과정이 필요하다.

이때 정말 많은 옵션들을 인자로 전달하는데, 그 옵션 중에 `authDomain` 라는 것이 있다.

보통`PROJECT_ID.firebaseapp.com` 같은 형태인데, 나는 로컬호스트에서 테스트한다고 여기에 `localhost` 라는 값을 넣은 것이 문제였다.

그럼 인증을 하기 위해서 `localhost/something-auth-url` 같은 곳에다 요청을 하는데 당연히 뭐가 될리가 없다.

그래서 `localhost:3000` 으로 변경했더니, firebase sdk 가 예외를 던진다.

혼란스러운 와중 스택 트레이스를 차분히 따라가보니 port number 같은 게 authDomain 에 존재하면 던지는 예외였다.

결국 기존의`PROJECT_ID.firebaseapp.com` 로 `authDomain` 을 바꿔주니 모든 것이 정상적으로 작동했다.

생각해보니 당연한 것이, 구글 인증 과정을 내 로컬에서 처리하려고 했다는 것인데 내가 firebase sdk 를 완전히 뜯어고쳐서 로컬에서 가능하게 한 것이 아닌 이상,

구글이 제공하는 authDomain 을 사용하는 것이 맞는 거였다. 내가 localhost 에서 테스트를 하든 staging 서버에서 테스트를 하든, prod 단계까지 가든 authDomain 은 구글이 제공한 곳에서 이루어지는 게 당연한 것 아닌가.

# 결론

local 환경이라고 안일하게 설정하면 안 된다는 사실을 깨달았고, sdk 를 사용하는 것이 무엇을 의미하는지 새삼스레 깨달을 수 있는 계기였다.
