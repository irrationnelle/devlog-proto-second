---
title: Typecript 에서 Cannot use import statement outside a module 에러 해결
date: '2021-01-03T16:00:03.284Z'
template: "post"
draft: false
slug: "unavailable-import-on-typescript"
category: "typescript"
tags:
- "typescript"
- "module"
description: "Typecsript 를 사용하면서 transpile 을 하지 않고 `ts-node` 를 사용 하는 경우, `package.json` 에 `type: module` 을 추가했음에도 `Cannot use import statement outside a module` 에러가 발생하는 경우가 있다."
socialImage: ""
---

Typecsript 를 사용하면서 transpile 을 하지 않고 `ts-node` 를 사용 하는 경우, `package.json` 에 `type: module` 을 추가했음에도

`Cannot use import statement outside a module` 에러가 발생하는 경우가 있다.

이 때 `tsconfig.json` 에 다음과 같은 옵션을 추가한다.

```json
{
  "ts-node": {
    "compilerOptions": {
      "module": "commonjs"
    }
  }
}
```

이 옵션을 추가하면 `ts-node` 를 사용할 때는 `module` 로 import / export 하는 방식을 `commonjs` 방식으로 하도록 오버라이드 한다.
