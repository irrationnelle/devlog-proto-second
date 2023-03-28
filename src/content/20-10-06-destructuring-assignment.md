---
title: 비구조화 할당은 얕은 복사
date: '2020-10-06T01:01:03.284Z'
draft: false
slug: "destructuring-assignment"
category: "Dev"
description: "간단한 의문이지만 코드 리뷰 중 비구조화 할당을 사용해서 프로퍼티 변경하는 것을 보았다."
socialImage: ""
---

간단한 의문이지만 코드 리뷰 중 비구조화 할당을 사용해서 프로퍼티 변경하는 것을 보았다.

공간 복잡도 측면에서 상대적으로 메모리 사용이 널널해진 요즘은 immutable 한 변경, 아니 재할당을 곧잘 보는데 이런 식으로 오브젝트의 프로퍼티를 변경하는 것을 보니 원하는 것처럼 참조 변경이 이루어지는지 궁금해서 찾아보았다.

결론적으로 비구조화 할당을 이용하여 선언한 변수가 원시 타입이 아니면 얕은 복사가 이루어져서 메모리 참조를 공유한다.

```javascript
const { expect } = require('chai');

describe('비구조화 할당을 사용해서', ()=> {
    it('복사한 오브젝트의 오브젝트 타입 프로퍼티를 변경하면 원본의 프로퍼티도 변한다.', () => {
        const originalObj = {
            subObj: {
                value: 10
            }
        };
        const {subObj} = originalObj;
        subObj.value = 20;

        expect(originalObj.subObj.value).to.equal(20);
        expect(originalObj.subObj.value).not.to.equal(10);
    })

    it('복사한 오브젝트의 원시 타입 프로퍼티를 변경하면 원본의 프로퍼티는 변하지 않는다.', () => {
        const originalObj = {
            value: 10
        };
        let {value} = originalObj;
        value = 20;

        expect(originalObj.value).not.to.equal(20);
        expect(value).to.equal(20);
        expect(originalObj.value).to.equal(10);
    })
})
```

위 테스트를 수행하면 오브젝트 타입인 경우 얕은 복사가 이루어지는 것을 알 수 있다.
