---
title: CRA 앱 Dockerize 하기
date: '2020-04-22T01:01:03.284Z'
draft: false
slug: "cra-dockerize"
category: "Devops"
tags:
  - "react"
  - "docker"
description: "토이 프로젝트에 CI/CD 를 붙이다가 Docker 를 오랜만에 다시 만지게 되었다."
socialImage: ""
---

# Hello Docker

토이 프로젝트에 CI/CD 를 붙이다가 Docker 를 오랜만에 다시 만지게 되었다.

평소 [TIL](https://github.com/irrationnelle/TIL) 리포에만 글을 남기다가 오랜만에 블로그를 작성하는데 형식이나 친절도는 TIL 와 거의 비슷할 것 같다.

# CRA 로 간단한 react 앱 만들기

```bash
$ npx create-react-app example
$ cd example # 생성한 프로젝트의 디렉토리의 root 폴더에서 이어지는 작업을 한다.
```

# Dockerize

프로젝트를 Docker 컨테이너에 담는 작업을 dockerize 라고들 하는 것 같다.

먼저 프로젝트의 루트 디렉토리에서 `Dockerfile` 을 생성한다.

```bash
$ vim Dockerfile
```

내용은 다음과 같이 채워넣었다.

```
FROM mhart/alpine-node:latest
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . ./
EXPOSE 3000

CMD ["npm", "start"]  
```

여기서 혼동했던 것 중 하나는 `WORKDIR` 부분인데, 이건 생성하려는 docker 컨테이너 내부의 위치를 이야기 한다.

즉 위와 같은 설정값으로 docker image 를 빌드하면 나중에 docker 컨테이너 내부에서 `~/app` 내부에 우리가 작업한 프로젝트들이 담겨있는 것을 확인할 수 있다.

```bash
vim .dockerignore
```

컨테이너에 담지 않을 내용도 추가해준다.

```
node_modules
```

참고사항으로 `mhart/alpine-node:latest` 는 다운로드 수는 많은 docker 이미지이지만 docker hub 로부터 인증받은 repo는 아니다. 나는 오늘(20. 04. 22) 기준으로 나온 `node 14.0.0` 을 사용하기 위해 이 이미지 기반으로 컨테이너를 만들었다.

그럼 이제 docker 컨테이너 이미지를 빌드한다.

```bash
$ docker build -t alpine_node:dev . # 여기서 :dev 는 태그값이다
```

# docker 컨테이너 실행

`$ docker run -it -v ${PWD}:/app -p 3002:3000 --rm -d --name alpine_node_test alpine_node`

- `-it` : 컨테이너의 입출력을 interactive 하게 하는 옵션과 TTY 터미널을 애뮬레이션 해주는 옵션([출처: 개발자가 처음 Docker 접할때 오는 멘붕 몇가지](https://www.popit.kr/개발자가-처음-docker-접할때-오는-멘붕-몇가지/)). 이 옵션이 없으면 CRA 앱이 실행이 안 되는데 출처의 해당 블로그에서 그 이유를 알 수 있었다.


- `-v ${PWD}:/app` : 현재 프로젝트를 docker 컨테이너의 `/app` 디렉토리에서 마운트하는 옵션인데, 이 옵션이 있으면 docker 컨테이너 외부의 실제 코드 작성과 수정들이 docker 컨테이너 내부와 연동한다. 기껏 docker 로 환경 구성을 했는데 실제 개발은 컨테이너 외부에서 진행하면 의미가 없다는 측면에서 코드 개발은 docker 컨테이너 내부에서 이루어져야 한다고 생각했는데, 이 방법으로 그것을 가능케 하는 것 같다.

- `-p 3002:3000` : docker 컨테이너 내부에서는 `3000` 포트에 응하는 것을 docker 컨테이너 외부에서는 `3002` 포트에 응하도록 한다. 카카오맵 API 사용시 `http://localhost:3002` 를 플랫폼에 추가해줘야 sdk 를 정상적으로 호출할 수 있다.

- `--rm` : docker 컨테이너 종료시 자동으로 컨테이너 삭제

- `-d` : docker 컨테이너의 백그라운드에서 프로젝트 실행

대략적인 옵션 설명은 여기까지 하면 될 것 같다.

이렇게 한 뒤 브라우저를 작동시켜서 `http://localhost:3002` 로 접속하면 CRA 앱 실행을 확인할 수 있다.

docker 컨테이너를 종료하고 싶을 땐

`docker ps` 로 컨테이너 id 를 확인하고

```bash
$ docker stop [container_id] # [] 는 안 넣어줘도 된다.
```

로 종료한다.

# 이외의 참고할 것들

생성한 docker 컨테이너 내부에 접속하고 싶을 때는 다음 명령어를 사용한다.

```bash
$ docker run -it -p 3002:3000 --rm -d --name alpine_node_test alpine_node /bin/sh
$ docker exec -it alpine_node_test /bin/sh # alpine linux 에는 bash 가 기본설치 되어있지 않아서 /bin/sh 를 이용한다
```

위 명령어를 실행하면 docker 내부 컨테이너의 쉘 실행을 확인할 수 있다.
