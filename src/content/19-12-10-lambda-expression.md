---
title: lambda expression
date: '2019-12-10T01:01:03.284Z'
draft: false
slug: "python-lambda-expression"
category: "Python"
tags:
  - "python"
description: "개발을 공부하다보면 '문(statement)'이라는 말을 많이 사용한다. 조건문 또는 if문, 반복문 또는 for문 이렇게"
socialImage: ""
---

개발을 공부하다보면 '문(statement)'이라는 말을 많이 사용한다. 조건문 또는 if문, 반복문 또는 for문 이렇게. 

그런데 가끔씩 '식(expression)' 이라는 표현을 쓸 때도 있다. 람다식(lambda expression)이 그 중 하나이다.

# statement 와 expression

식과 문을 비교하는 좋은 글들이 많이 있기 때문에 여기서는 간단하게 이야기한다.

식은 결과값이 나올 때 식이라고 한다. 3 이라는 단일 리터럴 변수는 정수 타입의 3 이라는 결과값이 있다. 3+5 는 정수 타입의 8이라는 결과값이 나온다.

반면 문은 코드 실행을 하는데 의미를 가진 최소 단위이다. `if tyloIsHandsome: wakeUp()` 는 어떤 조건이 있고 그 조건을 만족하면 다음 함수를 실행시키겠다는 의미를 가지고 있지만 어떤 결과값이 나오진 않는다. 오해할 수 있는 것이 할당*문* 처럼 `num = 10` 이라고 되어있는 것도 num 이라는 변수에 10을 할당하겠다는 의미이지, `num = 10` 자체가 결과값은 아니다.

한 가지 더, 다음 코드를 보자

```python
def to_be_four():
    return 4
```

위의 함수 정의에서 `return 4` 역시 `statement` 이지 4라는 결과값을 가지는 `expression`이 아니다. 하지만 다음처럼 함수를 호출하는 건 `expression` 이다. 함수 호출의 결과로 4가 나오기 때문에.

```python
to_be_four() # 이 함수를 호출하면 4 가 나오고, 호출 결과는 리터럴값인 4와 동일한 의미를 가진다.
```

그리고 이 포스팅의 메인 게스트인 `lambda` 는 `expression` 이다. 그래서 *람다식*이라고 부르기도 한다.

참고로 젯브래인 사에서 만든 코틀린이라는 언어에서는 `if expression` 이라는 게 존재한다. 관심가면 알아보자.

# lambda expression

다음은 공식 문서에서 람다함수를 설명하는 글이다.

>Small anonymous functions can be created with the lambda keyword. This function returns the sum of its two arguments: `lambda a, b: a+b`. Lambda functions can be used wherever function objects are required. They are syntactically restricted to a single expression. Semantically, they are just **syntactic sugar** for a normal function definition. Like nested function definitions, lambda functions can **reference variables from the containing scope**

공식 문서에 한글 버전도 있지만 번역이 교과서적으로 밋밋하게 되어 있어 원문을 가져왔다.

람다식은 결국 일반적인 함수 정의의 *문법적 설탕(syntactic sugar)* 이라는 표현이 있는데, 문법적 설탕이라는 건 굳이 이 문법을 쓰지 않아도 괜찮지만 이 문법을 쓴다면 좀 더 편하게 코드 작성을 할 수 있다는 것을 의미한다.

파이썬에서는 변수에 온갖 것들을 담을 수 있다. 함수도 그 중 하나인데, 즉 이런 게 가능하다.

```python
def add_numbers(a,b):
    return a+b

fun_var = add_numbers # 이건 변수에다 '함수 자체'를 할당한다.
fun_value = add_numbers(1,2) # 이건 변수에다 '함수가 반환하는 값'을 할당한다.

result = fun_var(3,4) # fun_var 는 함수 자체를 담았기 때문에 그 함수처럼 사용이 가능하다.

print(fun_value)
print(result)
```

변수에 함수를 담을 수 있다는 것은 매개변수에도 함수를 담을 수 있다는 거고, 따라서 함수의 인자로 함수를 전달하는 것도 가능하다.

```python
def just_print(other_fun, *args):
    print(other_fun(*args))
    
def add_numbers(a, b):
    return a+b

just_print(add_numbers, 1, 2)
```
 
이런 일들이 가능하기 때문에 람다식이 문법적 설탕으로 불리우는 것이다. 람다식이라는 건 [람다대수](https://ko.wikipedia.org/wiki/%EB%9E%8C%EB%8B%A4_%EB%8C%80%EC%88%98) 라는 개념에서 온 것인데, 자바같은 언어에서는 변수에다가 함수를 담는 것도 안 되고, 함수의 인자로 함수를 보내는 것이 안 된다. 이게 별거 아닌 거 같지만 굉장히 짜증스럽고 코드를 복잡하게 늘어놔야 하는 일들이 많기 때문에 굉장히 불편했는데 자바8부터 람다식을 지원해줘서 조금 숨통이 트이게 되었다.

여기까지 이야기했다면 람다식이 무엇인지 대충 감이 올 수도 있다. 위의 예시 코드들을 다시 람다식을 이용해서 바꿔보자

```python
fun_var = lambda x, y: x+y 

result = fun_var(3,4)

print(result)
```

```python
from functools import reduce

def just_print(*args):
    print(reduce(lambda x, y: x+y, args))
    
just_print(1, 2)
just_print(1, 2, 3)
just_print(1, 2, 4, 5)
```

막상 코드를 작성하니까 `reduce` 같은 키워드도 나와버렸다. 아직은 생소한 `reduce` 까지 사용하면서 바꾼 코드로 보여주고 싶었던 점은

> 람다식은 익명 함수이다. 즉 함수명이 없다.

앞서서 사용했던 예시에는 `def` 키워드를 이용하여 함수들에게 이름을 지정해주었다. 하지만 람다식에는 함수 이름이 없다. `fun_var = lambda x, y: x+y`를 보고 `fun_var` 가 이 람다식의 이름이 아니냐고 생각할 수 있지만, 어디까지나 `fun_var` 라는 변수에 람다식을 할당한 것이지 람다식의 이름을 지어준 것이 아니다.

이렇게 람다식을 사용하면 함수를 구태여 정의하지 않고 좀 더 직관적인 방법으로 함수를 변수에 담거나 다른 함수의 인자로 사용할 수 있다. 당장 위의 예시에서 람다식은 `reduce` 함수의 첫번째 인자로 사용된 것을 알 수 있다.

뭐 익명함수이기 때문에 함수 사용이 끝나고 나면 heap 영역을 점유하고 있던 메모리를 가비지 컬렉터가 수거해가고 어쩌고 같은 이야기도 있지만 아직은 크게 신경쓰지 않아도 좋다.

# 마치며

람다식, 또는 함수를 인자로 보내는 개념은 리스트를 다룰 때, [list comprehension](https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions) 와 map, filter 를 사용할 때 좀 더 와닿는다. 또한 map 을 사용할 때는 `지연 평가(lazy evaluation)` 와 `제네레이터` 라는 개념을 접할 수 있는데, 아주 흥미로운 부분이다. 이 방법들은 파이썬을 사용하는 사람들간의 의견 차이가 있는 편인데 그 또한 굉장히 흥미로우니 관심있는 사람은 아래의 글을 읽어보도록 하자.

[List comprehension vs map](https://stackoverflow.com/questions/1247486/list-comprehension-vs-map)
