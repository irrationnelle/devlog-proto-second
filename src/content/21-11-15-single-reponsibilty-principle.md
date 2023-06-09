---
title: 단일 책임 원칙에 대해
date: '2021-11-15T19:37:00.000Z'
template: "post"
draft: false
slug: "single-responsibility-principle"
category: "dev"
tags:
- "SOLID"
description: "단일 원칙 책임은 오해하기 쉬운 용어이다."
socialImage: ""
---

## 들어가기 전

언어 차원에서 인터페이스라는 개념이 존재하지 않는 자바스크립트에서 어떻게 DI 를 적용하는지 알아보기 위해, 먼저 DI 가 무엇인지 다시 공부할 필요를 느꼈다.

DI 에 대해 그 필요성과 방법에 대해 토비의 스프링만큼 자세히 설명한 책이 없지만, 자바라는 정적 컴파일 언어 기반으로 설명을 하기 때문에 다음을 기약하기로 했다.

로버트 마틴의 클린 아키텍쳐도 강한 응집력과 낮은 결합성을 이야기하며 DI 를 언급했던 기억이 났다. 이 또한 자바 친화적인 책이지만 책 주제로 봤을 때 언어 의존성이 그나마 낮은 편이다.

그렇게 책을 보다가 단일 책임 원칙에 대해 다시 읽었는데, 상당히 오해하고 있던 개념이라 글로 남긴다.


## SOLID

로버트 마틴의 클린 아키텍쳐에서는 SOLID 원칙을 좋은 아키텍쳐를 정의하는 원칙이라 하며 다음과 같이 이야기한다.

> SOLID 원칙의 목적은 중간 수준의 소프트웨어 구조가 아래와 같도록 만드는 데 있다.
> - 변경에 유연하다.
> - 이해하기 쉽다.
> - 많은 소프트웨어 시스템에 사용될 수 있는 컴포넌트의 기반이 된디
 
여기서 중간 수준의 소프트웨어란 모듈 단위이다. 모듈로 가져다가 쓸 정도의 규모가 아니면 SOLID 원칙의 대상이 아니라고 볼 수 있다.

## 단일 책임 원칙

> 아마도 현저히 부적절한 이름 때문이기도 할 것이다. 
> 프로그래머가 이 원칙의 이름을 듣는다면 모든 모듈이 단 하나의 일만 해야 한다는 의미로 받아들이기 쉽다.

로버트 마틴이 언급한 것처럼 나 또한 모듈이 하나의 일만 한다는 의미라고 생각했다.

하나의 일만 한다는 것을 예로 들어보자.

- pdf 업로드를 관리하는 클래스는 pdf 업로드만 관여한다.
- 만약 pdf 를 이미지 등 다른 형태로 변경한다면 pdf 를 변경하는 클래스는 따로 생성한다.

이렇게 하나의 action 에만 집중하는 것을 `하나의 일만 한다` 로 보통 인식한다.

하지만 클린 아키텍쳐에서는 단일 책임 원칙에 대해서 다음과 같이 이야기한다.

> 하나의 모듈은 하나의, 오직 하나의 사용자 또는 이해관계자에 대해서만 책임져야 한다.
 
## 하나의 사용자 또는 이해관계자

만약 pdf 업로드를 관리하는 클래스가 현재 사용하는 유저의 요금제 정보를 알고 있다고 하자.

그래서 요금제 등급에 따라 pdf 변환 여부를 결정하는 스펙을 수익 모델과 관련한 기획팀에서 결정했다.

한편 사용자 편의 증대와 관련한 기획팀에서 pdf 를 이미지 뿐만 아니라 doc 와 같은 문서로도 저장하는 스펙을 결정한다.

이 경우 pdf 변환 클래스는 수익 모델 기획팀과 사용자 편의 증대 기획팀이라는 두 이해관계자에 의해 변한다.

이 경우 하나의 이해관계자만이 pdf 변환 클래스를 책임지지 않기 때문에 단일 책임 원칙을 어긴 것이 된다.

## 마치며

단일 책임 원칙은 좋은 아키텍쳐를 결정하는 원칙임과 동시에 비즈니스 모델과도 관련이 있음을 알 수 있다.

결국 개발자는 왜 개발을 하는가? 라는 부분에서 비즈니스 모델을 결코 분리할 수 없다는 것을 시사한다.


