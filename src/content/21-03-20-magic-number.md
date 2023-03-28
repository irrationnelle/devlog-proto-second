---
title: 매직 넘버를 지양해야 하는 이유
date: '2021-03-20T19:00:03.284Z'
template: "post"
draft: false
slug: "magicnumber"
category: "Dev"
tags:
- ""
description: "예전에 NEXT STEP 에서 진행하는 ATDD 수업을 들으면서 코드 리뷰를 받던 중, 매직 넘버의 사용을 최대한 줄여야 한다는 피드백을 받은 적이 있다."
socialImage: ""
---

예전에 NEXT STEP 에서 진행하는 ATDD 수업을 들으면서 코드 리뷰를 받던 중, 매직 넘버의 사용을 최대한 줄여야 한다는 피드백을 받은 적이 있다.

당시에는 변수명을 붙여주지 않고 상수를 그대로 사용하는 것이 가독성을 해치며, 이후에 수정이 생기면 값을 일일히 접근해서 수정하는 게 문제라 생각했다.

그러다가 오늘 리팩토링할 것이 떠오르면서 매직 넘버에 대해 다시 한 번 생각해봤다.

예시는 3:2 비율의 사각형을 그리는 작업이다.

## 변수 할당으로 이름 지어서 가독성 향상시키기
3 이나 2 라고 하는 것보다는 `WIDTH_RATIO` , `HEIGHT_RATIO` 라고 하는 쪽이 나중에 이해하기도 쉽다

## 수정 사항이 생기면 변수에 할당한 값만 수정한다
갑자기 비율이 3:2 에서 16:9 같은 걸로 바뀐다면 일일히 3을 16으로 바꿔주는 것보다 `WIDTH_RATIO` 를 16으로 바꿔주는 게 편하다.

## 함수 추출을 용이하게 하면서 추상화 단계를 높이는 데 도움을 준다
두번째 장점과 연계하는 요소이다. `WIDTH_RATIO`  를 사용하면서 중복을 함수로 추출하여 제거하는 과정들을 거치면 `WIDTH_RATIO` 는 꼭 필요한 위치에서 필요한 빈도로만 사용할 것이다. 그럼 이 때 `WIDTH_RATIO` 를 사용하는 operation 을 함수로 묶고 `WIDTH_RATIO` 를 `widthRatio` 라는 값의 매개변수로 교체할 수 있다.

이렇게 되면 3:2나 16:9만을 지원하는 작업에서 런타임에 주어진 값에 따라 동적으로 비율을 결정할 수 있는 함수를 만들 수 있는 것이다.
