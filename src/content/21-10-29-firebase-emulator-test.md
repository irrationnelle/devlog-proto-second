---
title: firebase 에뮬레이터로 테스트 코드 작성하기 
date: '2021-10-29T19:37:00.000Z'
template: "post"
draft: false
slug: "firebase-emulator-test"
category: "dev"
tags:
  - "firebase"
description: "firebase 로 테스트 코드를 하는 것은 통합테스트와 유닛 테스트의 경계를 애매하게 만든다."
socialImage: ""
---

tdd 로 react 앱을 만들다가 firebase 구현 단계까지 왔다.

로그인 버튼을 클릭했을 때 signIn 함수를 호출하는 것까지 테스트하고 있으나

signIn 함수 내부를 테스트 하는 것에 대하여 고민이 좀 있었다.

signIn 내부 함수를 유닛 테스트로 다루는 것이 맞는지,

아니면 signIn 함수 내부를 내부 구현 단계로 보고 인터페이스 역할을 하는 signIn 함수까지만 통합 테스트에서 다룰 것인지

api 호출을 mocking 하거나 msw 같은 걸 이용해서 가짜 응답을 주는 것으로 signIn 정도 단위의 operation 도 테스트하는 것을 어렵잖게 볼 수 있어서 일단은 유닛 테스트를 작성해보기로 했다.

사실 이미 작성한 통합 테스트에서는 signIn 함수 호출 여부만 확인하고 있어서, 함수 호출 성공 상황이나 실패 상황에서 그려내야 하는 스토리에 따라 자연스럽게 api 호출을 mocking 할 수도 있겠지만

일단은 유닛 테스트로 작성해본다. 통합 테스트 단계에서 많이 겹치면 그때가서 합치자.

## firebase emulator
firebase 는 이런 유닛 테스트나 실제 운용하는 파이어베이스에 영향을 주지 않고도 자신들의 서비스가 어떻게 작동하는지 확인할 수 있도록 에뮬레이터를 제공한다.

나는 이 포스팅에서 auth 에뮬레이터만 사용할 예정이지만, firestore 등도 에뮬레이터가 있다. 사실 auth 보다 이쪽이 더 실용성이 높을 듯.

```typescript
import { signIn } from "./auth";
import { firebaseConfig } from "../constant/firebase-config";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  connectAuthEmulator,
  UserCredential
} from "firebase/auth";

const app = initializeApp(firebaseConfig);
const auth = getAuth();
connectAuthEmulator(auth, "http://localhost:9099");

test("Example test case", async () => {
  try {
    const cred: UserCredential = await signInWithEmailAndPassword(
      auth,
      "foo@bar.de",
      "bla2377"
    );
    expect(cred).toBeTruthy();
    expect(cred.user).toBeTruthy();
  } catch (e) {
    console.log(e);
    throw e;
  }
});
```

위 코드만 보면 별거 아니지만 firebase 가 워낙 alias 가 많아서 위 코드와 완전히 동일한 예제를 만들기는 조금 힘들었다.

위 테스트 코드는 두 가지 이유로 실패한다.

1. 에뮬레이터를 실행하지 않았다.
2. 예시로 든 계정은 존재하지 않는다.

먼저 에뮬레이터를 실행하자.

# firebase 에뮬레이터 실행
먼저 `firebase-tools` 를 전역으로 설치한다.

```shell
$ npm i -g firebase-tools
```

이제 다음 명령어로 에뮬레이터를 실행하자.

```shell
$ firebase emulators:start
```

정말 간단한 방법이라고 생각했는데 실행이 안 된다. 다음과 같은 에러가 발생한다.

```shell
Error: Not in a Firebase app directory (could not locate firebase.json)
```

firebase.json 을 가장 쉽게 생성하는 방법은 `firebase init` 을 실행하는 것이다.

그리고 Emulators 를 선택하고 에뮬레이터를 돌릴 프로젝트를 선택한 뒤, 원하는 emulator 를 선택한다.

그럼 에뮬레이터를 실행할 수 있다.

# 유닛 테스트와 에뮬레이터를 동시 실행
일반적인 환경에서는 shell 을 여러 개 띄우는 것이 어렵지 않기 때문에 에뮬레이터를 띄운 뒤 다른 shell 에서 테스트를 실행할 수 있다.

하지만 나처럼 아이패드 환경에서 외부 서버에 있는 ubuntu 에 연결하는 경우에는 shell 을 여러개 띄우기가 어렵다. 완전히 방법은 없는 건 아니지만 그래도 shell 하나로 해결하고 싶을 때 요긴하게 사용할 수 있는 명령어가 있다.

```shell
$ firebase emulators:exec ‘npm run test’
```

이러면 에뮬레이터를 실행하고 그 후 이어서 유닛테스트를 실행하기 때문에 유닛 테스트를 에뮬레이터 위에서 돌려볼 수 있다.

# 존재하지 않는 계정 에러
하지만 여전히 위의 테스트는 실행하면 실패한다.

`signInWithEmailAndPassword` 는 로그인 때 사용하는 함수인데, 인자로 전달한 이메일이 존재하지 않기 때문이다.

그래서 회원가입이 선행되어야 한다. 회원가입은 firebase 의 `createUserWithEmailAndPassword` 함수 호출로 가능하지만, 이걸 매번 호출하면 이번에는 존재하는 아이디로 가입을 시도한다고 또 테스트가 실패한다.

그래서 테스트 코드임에도 불구하고 예외처리 과정을 추가해야 한다. beforeAll 에 선언해서 test suite 에서 단 1회만 실행하도록 할 수는 있지만, `—watch` 옵션으로 코드 변경 때마다 테스트의 피드백을 받고 싶은 경우에는 어쩔 수 없이 예외처리를 해줄 수 밖에 없다.

아니면 방법이 하나 더 있는데, 가입 때 사용하는 이메일 계정을 random 하게 생성한 뒤, 두 테스트에서 이 이메일 계정을 사용하는 것이다. 이 경우 항상 random 한 이메일 계정으로 생성과 로그인을 반복하기 때문에 예외처리가 필요없다.

이 대안에도 아쉬운 점은 존재한다.  `only` 나 `skip`  키워드로 특정 테스트만 실행할 수 없다는 점이다. 반면 예외처리를 진행한 경우에는 이 키워드를 여전히 사용할 수 있다.
