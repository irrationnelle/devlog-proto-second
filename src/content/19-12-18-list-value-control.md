---
title: list comprehension 과 map
date: '2019-12-18T01:01:03.284Z'
draft: false
template: "post"
slug: "python-list"
category: "Python"
tags:
  - "python"
description: "파이썬의 List comprehension 과 map 을 이해해보자"
socialImage: ""
---

사실 지난 번 메소드 이야기를 잠깐 한 것은 이번에 클래스에 대해서 이야기를 해보고 싶었기 때문인데, 막상 클래스에 대해 설명하려니 클래스와 인스턴스의 관계까지 다루어야 하고 이야기가 길어질 거 같아 이번에도 리스트 이야기를 해보겠다. 여담으로 나는 클래스를 이해하는데 1년이나 걸렸는데(...) 요즘은 이렇게 말하고 다닌다, 걍 함수까지 같이 넣어주는 구ㅈ...읍읍 당신들 누구야. **물론 농담이다**.

# 데스노트 작성하기

곧 크리스마스가 다가온다. 크리스마스 파티 준비로 바쁜 Louie 는 길을 가다가 데스노트를 발견한다. 평생 사람을 미워해본 적이 없는 Louie 는 이 쓸모없는 공책을 어떻게 사용할까 고민하다가 좋은 아이디어를 떠올린다. 그래서 당장 친구목록을 작성했다.

```python
friend_list = ['Tylo', 'Amy']
``` 

잠깐, 흥분하지 말자. 데스노트는 본명을 적어야만 죽는다. 규칙대로 하지 않으면 원하는 결과가 나오지 않는 것이 마치 프로그래밍 언어와 비슷하다.

친구목록이 조금 부족한 거 같다. 새로운 친구 목록을 추가하자.

```python
friend_list = ['Tylo', 'Amy']

another_friend_list = ['Claude', 'Ta-Gong']

print(friend_list)

friend_list.extend(another_friend_list)

print(friend_list)
```

그럼 이 친구들을 데스노트에 적어보자. 다음 문구와 함께

> will die full of years and honors

반복문을 사용해서 해보자.

```python
for friend in friend_list:
    text = friend + ' will die full of years and honors'
    print(text)
```

```bash
Tylo will die full of years and honors
Amy will die full of years and honors
Claude will die full of years and honors
Ta-Gong will die full of years and honors
```

그런데 `print()` 함수는 단순히 보여주기만 할 뿐, 공책에 적으려면 이 문구가 담긴 리스트를 재생성해야 할 것 같다.

```python
friend_list = ['Tylo', 'Amy']

another_friend_list = ['Claude', 'Ta-Gong']

friend_list.extend(another_friend_list)

note_text = []
for friend in friend_list:
    text = friend + ' will die full of years and honors'
    note_text.append(text)

print(note_text)
```

이제 노트 텍스트가 완성되었다. 그런데 이 방법은 그다지 pythonic 하지 못하다.

일단 note_text 라는 값이 비어있는 리스트가 필요하며, for 문을 사용해서 장황하게 비어있는 리스트에 값을 추가하는 작업을 진행한다.

# 람다 사용하기

람다에 대해서는 이전에 간략하게 이야기해보았다. 여기서는 람다 보다는 `map()` 이라는 이름의 내장함수가 더 중요하다.

```python
friend_list = ['Tylo', 'Amy']

another_friend_list = ['Claude', 'Ta-Gong']

friend_list.extend(another_friend_list)

# 여기에서 lambda 가 쓰인다.
note_text = list(map(lambda text: text+' will die full of years and honors', friend_list))

print(note_text)
```

앞서서 람다를 이야기할 때 파이썬은 함수를 인자로 전달하는 것이 가능하다고 했던 것이 기억나는가?

`map()` 내장함수가 바로 그런 경우로, 이 함수를 사용하기 위해서는 반드시 첫번째 인자에 함수를 전달하여야 한다.

# map() 내장함수

`map()` 함수는 간단히 말해서, 두번째 인자로 받는 `iterable` 한 속성의 값들을 각각 하나씩 뽑아서 첫번째 인자에 있는 함수에게 인자로 전달한 뒤, 그 함수가 반환하는 값들을 모아서 새로운 `iterator` 값을 준다. 이런 전혀 간단하지 않군

예를 들어 `y = x+1` 이다 라는 함수가 있다고 하자. 그리고 정의역으로 `{1, 2, 3}` 이 있다고 할 때, 이 함수의 치역은 `{2, 3, 4}`가 된다.

이 때, 정의역인 `{1, 2, 3}` 은 `map()` 함수의 두번째 인자로 전달하는 `iterable`한 속성의 값이 된다. 그리고 `y=x+1` 이라는 함수는 첫번째 인자로 전달하는 함수이다.

따라서 파이썬 코드로 나타내면 다음과 같다.

```python
map(lambda x: x+1, [1, 2, 3])
```

하지만 여기서 `map()` 함수가 반환하는 것은 `[2, 3, 4]` 라는 리스트가 아니라 `iterator` 이다. `iterator` 는 `next()` 내장함수를 통해 값을 차례대로 꺼낼 수 있는 타입을 이야기한다.

그래서 우리에게 익숙한 리스트 형태의 값을 받기 위해서는, `list()` 함수를 사용해서 인자로 저 `iterator`를 전달해야 한다.

```python
num_iterator = map(lambda x: x+1, [1, 2, 3])
num_list = list(num_iterator)
print(num_list) # [2, 3, 4] 의 값을 가진다.
```

```bash
[2, 3, 4]
```

여기까지 이해가 되었는가? 뭔가 굉장히 수학적인 느낌으로 코딩을 했다는 느낌이 들 수 있다. 내장함수 `map()` 은 함수형 프로그래밍에서 개념을 착안한 함수이기 때문이다. 

파이썬의 함수형 프로그래밍에 대한 자세한 이야기는 다음 [공식 문서](https://docs.python.org/3/howto/functional.html) 를 참조하도록 하자.

또한 `map()` 을 사용해서 리스트를 다룬 경우 *지연 평가(lazy evaluation)* 의 효과를 얻을 수 있다. 앞서 말한 것처럼 `iterator` 를 반환하기 때문이며, `iterator` 는 `차례대로 값을 꺼낼 수 있다` 는 점과 `값을 꺼내달라고 요청하지 않으면, 즉 next() 내장 함수를 사용하지 않으면 값을 주지 않는다` 는 점이 매우 중요하다.

이 개념에 대해 숙지하고 있어야 추후에 등장하는 제네레이터(Generator) 를 이해하는데 수월해진다.

# 리스트 컴프리헨션

하지만 `map()`을 사용하여 지연 평가의 효과를 얻는다고 하더라도 어지간한 작업에서는 미미한 효과만 얻을 것이다.

이 경우 pythonic 한 접근법은 보다 간결하고 가독성이 높은 코드로 작성하는 것이다. 물론 map 과 lambda 를 조합하는 쪽이 더 가독성이 높다고 생각하는 부류도 있다. 이 때에는 개발에 착수하기 전 개발팀들끼리 상의하는 것이 필요하다.

```python
note_text = [name + ' will die full of years and honors' for name in friend_list]
print(note_text)
```

위의 방법은 리스트 컴프리헨션이라고 하는데, 리스트의 값을 for 문처럼 사용하되 for 문 앞에 위치한 값들이 리스트를 채워나갈 일종의 *형식* 이라는 것을 짐작케 해준다. 따라서 가독성이 올라가는 것을 알 수 있다.

# 마치며

이번에는 어려운 개념들이 많이 나왔다. 특히 `iterable` 과 `iterator` 가 매우 중요한 개념이다. *지연 평가*의 경우 당장은 중요한 개념이 아니며, *제네레이터* 역시 `iterable` 과 `iterator` 개념이 선행되어야 한다. 다음번에는 이것들을 다뤄보도록 하자.
