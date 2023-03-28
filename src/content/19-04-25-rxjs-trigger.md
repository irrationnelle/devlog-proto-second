---
title: RxJs를 이용하여 비동기 이벤트가 발생하면 버튼으로 제어하기
date: "2019-04-25T10:00:03.284Z"
template: "post"
draft: false
slug: "rxjs-async"
category: "RxJs"
tags:
  - "rxjs"
  - "async"
description: "개발을 하던 중에 모달 이벤트를 처리해야 하는 경우가 있다."
socialImage: ""
cover: ./Rx_Logo_S.png
---

# 왜 나는 이런 고민을 하게 되었나

 개발을 하던 중에 모달 이벤트를 처리해야 하는 경우가 있다.
 
 블로그에서 글을 삭제한다고 하자. 이 때 삭제 버튼을 누르자마자 바로 삭제를 수행하는 것은 조금 위험하다. 그러니 정말 삭제할 것인지 물어보는 모달을 띄운다. 해당 모달에서 삭제한다고 했을 때, 비로소 정말 삭제를 수행한다. 간단한 이벤트 처리이다.
 
# 모달을 범용적으로 사용하기
 
 흔한 상황이지만, RxJs만으로 만든다고 하면 난해할 수 있다. 일단 모달을 띄우는 플래그인 `shouldShowModal`을 Observable로 제어하고, 모달 내부의 버튼을 통해 어플리케이션의 상태를 변경해야 한다. 모달을 범용적으로 사용하기 위해서는 모달에서 yes를 클릭하면, 모달을 사용하는 쪽에서도 yes에 준하는, truthy한 값을 가지는 것이 좋다. 이 경우에 truthy한 값이 의미하는 것은 '삭제'이다.
 
 만약 모달의 yes 버튼이 truthy한 값을 가지는 것이 아니고 삭제를 수행하는 특정 함수를 호출한다고 하면 해당 모달은 삭제 모달로만 사용이 가능하다. 그러면 나중에 탈퇴 모달을 만든다고 할 때, yes 버튼에 탈퇴를 수행하는 함수를 또 정의해야한다. 그런 귀찮은 일은 모달을 사용하는 쪽에서 정의하도록 하자. 모달이 truthy한 값을 주면 모달을 사용하는 곳에서 삭제를 수행하거나 탈퇴를 수행하는 함수를 호출한다.
 
 따라서 모달의 yes는 truthy 이고 no는 falsy하게 작동하는 것이 범용적이고 직관적이다.
 
 # 모달 실행을 Observable로 관리하기
 
 그러면 모달에서 버튼을 누를 때 Observer에게 boolean 값을 전달하는 플래그가 필요하다. 이름은 `shouldApplyAction` 으로 설정한다.
 
 일단 모달을 띄우기 위해서는 `shouldShowModal`이 false 에서 true 값으로 변해야 한다. 모달을 제어하는 함수의 이름을 `toggleModal`이라고 짓고 boolean 값을 Observer에게 전달하는 Observable을 제어해보자.
 
 ```typescript
 // 모달이 off 된 상태여야 하기 때문에 BehaviorSubject로 초기값을 false로 지정한다.
const shouldShowModal$ : Observable<boolean> = new BehaviorSubject<boolean>(false);
 
toggleModal() {
  shouldShowModal$.next(true);
}
```

이제 모달을 띄웠다. 그런데 모달의 액션을 제어해야한다. 마찬가지 방법으로 제어할 수 있다. 

 ```typescript
const shouldApplyAction$ : Observable<boolean> = new BehaviorSubject<boolean>(false);
 
applyAction(modalButtonValue: boolean) {
  shouldApplyAction$.next(modalButtonValue);
}
```

이제 끝났는가? 아니다. 모달을 가져다가 쓰는 쪽에서 모달이 truthy 값을 주는지 falsy 값을 주는지 알아야 한다. 그런데 서로 다른 Observable은 서로 연관성을 가지고 있다. 모달을 띄워야만 apply가 가능하니까. 하지만 최종적으로 true 인지 false 인지 알기 위해서는 shouldApplyAction$이 주는 값을 알아야한다. 여기서는 `withLatestFrom` 을 이용해서 두 Observable을 연결한다.

```typescript
shouldApplyAction$.pipe(
  withLatestFrom(shouldShowModal$)  
).subscribe(
  ([shouldApplyAction, shouldShowmodal]) => {
    if(shouldApplyAction) {
      // 함수 실행
    }
  }
)
```

위의 코드는 `shouldApplyAction$`을 시작 Observable로 한다. shouldShowModal$이 시작이면 모달을 띄우자마자 subscribe를 수행하기 때문이다. 하지만 shouldShowModal$의 값이 toggleModal 함수 호출로 결정이 나도, applyAction을 호출하지 않으면 Observable은 구독을 하지 않고 따라서 구독 내부의 콜백 함수까지는 도달하지 않는다. 
