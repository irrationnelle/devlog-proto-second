---
title: 의자 바꾸기로 생각하는 인자 전달
date: '2019-11-29T01:01:03.284Z'
draft: false
slug: "python-transfer-argument"
category: "Python"
tags:
  - "python"
description: "개발자들 사이의 농담이 하나 있다. 개발자 두 명이 있을 때 서로 의자를 바꾸기 위해서는 의자가 3개가 필요하다는 것이다."
socialImage: ""
---

# 의자 바꾸기 문제

개발자들 사이의 농담이 하나 있다.

개발자 두 명이 있을 때 서로 의자를 바꾸기 위해서는 의자가 3개가 필요하다는 것이다.

이른바 변수의 값을 서로 바꾸는 `swap` 이라는 상황인데,

사람은 의자에서 일어나 규정되지 않은 공간 위에서 잠시 서있다가 다른 의자로 옮겨 갈 수 있지만

변수는 그게 안 된다. 변수 입장에서 규정되지 않은 공간이라는 건 존재하지 않으며

반드시 메모리 어디에 위치하고 있어야 하기 때문이다.

그래서 사람은 이게 되지만

```python
의자1 = 'Louie'
의자2 = 'Tylo'

의자1 = 의자2 # 의자2에 있던 값, 즉 의자2에 있는 Tylo를 의자1에다 옮긴다.
의자2 = 의자1 # 의자1에 있던 값, 즉 의자1에 있는 Louie를 의자2에다 옮긴다.
```

변수는 이게 안 된다. 사실 너무 당연하거라서 내가 지금 이상한 예를 만들어 억지를 부리는 게 아닌가 싶을 정도다.

```python
chair1 = 'Louie'
chair2 = 'Tylo'

chair1 = chair2
chair2 = chair1 

print(chair1)
print(chair2)
```

결과값:

```bash
Tylo
Tylo
```

chair2에 chair1의 값을 넣으려는 순간, 이미 chair1은 바로 윗줄에서 chair2의 값, 즉 'Tylo'가 되었기 때문에

chair2는 chair1이 가지고 있는 값인 'Tylo'의 값을 가지게 된다.

그래서 이 문제를 해결하려면 임시로 변수의 값을 보관하기 위한 변수가 필요하다.

보통 예제로 쓸 때 이 임시 변수의 이름을 `temp` 나 `tmp` 라고 많이 적는다.

```python
chair1 = 'Louie'
chair2 = 'Tylo'
tmp = None

tmp = chair1
chair1 = chair2
chair2 = tmp

print(chair1)
print(chair2)
```

이러면 임시변수 `tmp` 가 chair1 의 값을 보관해준다.

그래서 chair2에는 `tmp` 가 가지고 있는 과거의 chair1 값을 전달하는 것이 가능해진다.


# 반복적인 의자 바꾸기의 슬픈 사례

어느 날 선생님께서 조용히 말씀하신다.

> 내일부터는 자리 배치를 서로 맘에 드는 사람끼리 앉도록 하거라
> 대신 둘 중에 어느 한쪽이라도 맘에 들지 않는다면 즉시 자리를 바꾸도록 한다

Louie 는 전부터 함께 앉고 싶었던 Ines 의 옆자리에 앉았다.

Ines 는 자리를 바꾸기를 희망했고 그래서 Kike 랑 Louie 가 자리를 바꾸게 되었다.

그래서 Kike 와 자리를 바꿨더니 옆자리에는 착한 Bea 가 있다. Bea 가 미안한 표정으로 이야기 한다.

예전부터 Roberta 랑 같이 앉기로 해서 이번에는 자리를 좀 양보해줬으면 좋겠다고.

그래서 Roberta 랑 자리를 바꾸니 옆에는 Borja 가 있다. Borja 가 입을 여는 순간에 Louie 는 직감한다.

또 자리를 바꾸겠구나! 이걸 코드로 나타내면 대체 몇줄이나 작성해야 하는 거야?!

일단은 해보자

```python
tmp = None
chair1 = None
chair2 = 'Louie'
chair3 = 'Ines'
chair4 = 'Kike'
chair5 = 'Bea'
chair6 = 'Roberta'
chair7 = 'Borja'

# Ines 옆자리인 Chair1 에 'Louie'가 간다
chair1 = 'Louie'

# 곧 다시 Kike와 자리를 바꾼다
tmp = chair1
chair1 = chair4
chair4 = tmp

# 다시 또 Roberta 와 자리를 바꾼다
tmp = chair4
chair4 = chair6
chair4 = tmp

# 언제까지 이 자리 바꾸기를 반복하는 걸까? 
```

Louie 는 결심한다. 자리 바꾸기가 반복된다면 함수로 만들어서 쉽게 쉽게 자리를 바꾸자고.

그래서 다음과 같은 함수를 만들었다.

```python
def swap_chair(one_chair, another_chair):
   temporary_chair = one_chair
   one_chair = another_chair
   aonther_chair = temporary_chair 
```

이제 의자 바꿀 일이 생기면 이 함수를 사용해서 쉽게 쉽게 자리를 바꿀 수 있다!

```python
# 의자 변수 목록 생략

chair1 = chair2
swap_chair(chair1, chair4)
swap_chair(chair4, chair6)
```

와 정말 간결하다! 

하지만 실제로 이 함수를 이용하고 나면

Ines 가 옆자리에서 어리둥절한 얼굴로 보고 있을 거다.

자리 바꾸기가 전혀 이루어지지 않았기 때문이다.

왜 자리 바꾸기 함수를 호출했는데도 자리가 그대로 남아있게 된걸까?

# 인자로 immutable 한 변수 보내기와 mutable 한 변수 보내기

변수 중에는 immutable 한 것이 있고 mutable 한 것이 있다고 했다.

immutable 한 변수는 상태를 바꾸는 것 뿐만 아니라 값을 전달할 때도 `값 자체` 를 전달한다.

그래서 함수의 매개변수가 받는 immutable 한 인자는 함수 내부에서는 사실 별개의 변수라고 보면 된다.

결국 함수 내부에서 *인자와 같은 값을 가졌을 뿐인 별개의* 변수들끼리 자리를 바꿔봤자 함수 외부에는 영향을 미치지 않는다.

그럼 mutable 한 변수는 어떨까? 과거에는 mutable 한 변수로 `list` 를 이용했는데 이번에는 `dictionary` 를 이용해보자.

```python
def swap_dict_chair(dict, chair1, chair2):
    tmp = dict[chair1]
    dict[chair1] = dict[chair2]
    dict[chair2] = tmp 

chair_dict = {
    'chair1' : None,
    'chair2' : 'Louie',
    'chair3' : 'Ines',
    'chair4' : 'Kike',
    'chair5' : 'Bea',
    'chair6' : 'Roberta',
    'chair7' : 'Borja'
}

print(chair_dict)

swap_dict_chair(chair_dict, 'chair2', 'chair4')

print(chair_dict)
    
swap_dict_chair(chair_dict, 'chair4', 'chair6')

print(chair_dict)
```

그럼 결과가 다음과 같이 나온다

```bash
{'chair1': None, 'chair2': 'Louie', 'chair3': 'Ines', 'chair4': 'Kike', 'chair5': 'Bea', 'chair6': 'Roberta', 'chair7': 'Borja'}
{'chair1': None, 'chair2': 'Kike', 'chair3': 'Ines', 'chair4': 'Louie', 'chair5': 'Bea', 'chair6': 'Roberta', 'chair7': 'Borja'}
{'chair1': None, 'chair2': 'Kike', 'chair3': 'Ines', 'chair4': 'Roberta', 'chair5': 'Bea', 'chair6': 'Louie', 'chair7': 'Borja'}
```

`mutable` 한 성격을 가지고 있는 `dictionary` 타입의 `chair_dict` 의 값이 변한 것을 알 수 있다.

# 참조(reference)

이처럼 `mutable` 한 속성을 가진 타입의 변수를 함수의 인자로 전달하는 경우,

함수 내부에서는 인자의 *값을 복사하지 않는다*.

대신 `mutable` 한 인자를 받는 경우 함수는 인자가 *가리키는 주소를 알게 되는데*,

보통 개발 용어로 이걸 `참조(reference)` 라고 한다.

약간 이상한 예를 들자면,

`immutable` 한 값을 인자로 받는 함수는 *다른 공간에다가 학생들을 복제하여* 복제한 학생들로 자리를 바꾸는 거고

`mutable` 한 값을 인자로 받는 함수는 *학생들이 있는 반으로 찾아가서* 기존에 바꾸려고 의도했던 반에 있는 학생들로 자리를 바꾸는 것이다. 

그래서 함수가 `값에 의해 호출(call by value)` 하는지, `참조에 의해 호출(call by reference)` 하는지 확실히 알고 있지 않으면 함수를 의도대로 제어할 수 없으며

파이썬의 경우 인자가 immutable 이냐 mutable 이냐에 따라서 호출 방식을 결정하는 `call by assignment` 라고 한다.

# 마치며

위의 의자 바꾸기 코드들 중 몇 개에는 버그까지는 아니지만 

*상식적인 상황이라고 가정하면* 이상한 결과를 만들어내는 것이 있다.

그것이 무엇일까? 힌트는 영화 매트릭스이다.
