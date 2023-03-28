---
title: AWS Lightsail에 flask + gunicorn + nginx 조합으로 간단한 서버 만들기
date: '2018-10-06T16:00:03.284Z'
template: "post"
draft: false
slug: "flask-gunicorn"
category: "Python"
tags:
  - "python"
  - "flask"
  - "gunicorn"
  - "nginx"
description: "flask 를 이용하여 아주 아주 간단한 API 만들기"
socialImage: ""
---

# AWS Lightsail

[AWS Lightsail](https://lightsail.aws.amazon.com)

과거에는 [digitalocean](https://www.digitalocean.com/)이나 [vultr](https://www.vultr.com) 같은 곳을 저렴한 비용으로 사용했지만, 한국에 리전까지 있고 월 $3.5 로 AWS 의 인프라를 경험할 수 있다는 점에서 Lightsail 을 사용하지 않을 이유가 없다. 막상 사용해보면 기존의 AWS 콘솔을 사용하지 않고 Lightsail 전용 대시보드가 나오기 때문에 AWS 인프라를 사용한다는 장점은 퇴색한 듯 싶지만, 어쨌든 전용 대시보드도 직관적이고 복잡한 설정 없이 딱 필요한 설정만 있어 오히려 더 낫다는 느낌이다. AWS Lambda + AWS Gateway API 같은 UI 에 비하면 정말 편하고 좋다는 느낌.

현 포스팅을 위한 lightsail 환경은 다음과 같다

- os: Amazon Linux (AMI) 2018.03
- spec: 512MB RAM, 1 vCPU, 20GB SSD
- region: ap-northeast-2a
- stack: 없음. 순정 운영체제

운영체제가 우분투가 아닌데다 특별히 스택 적용도 되지 않은 운영체제를 사용했기 때문에 작업을 진행하기 위해 먼저 설치해주어야 하는 것이 제법 된다. 과거에는 최신 Fedora 를 사용했고 요즘은 우분투를 쓰기 때문에 `yum`을 사용해야 한다거나 데몬 재시작 등 시스템 제어 관련 명령어를 찾는데 좀 헤멘 감이 있는데, 과거 AWS Lambda 를 사용하면서 모듈이나 라이브러리 의존성이 매우 짜증났기 때문에(Docker 로도 결국 해결을 못했다) 특별한 이유가 없으면 AMI 를 사용하기로 했다.

# Lightsail ssh 접속

```bash
$ ssh -i 'pem파일경로' '유저이름'@'고정아이피'
```

윈도우 사용자는 **putty** 를 사용하거나 **WSL** 을 사용해서 리눅스 터미널을 열어 ssh 를 사용하면 될 듯 싶다.

항상 터미널 명령어를 보며 나도 헤메지만, 저기서 `'pem파일경로'`에서 볼 수 있는 따옴표(`'`)들은 적어줄 필요가 없다.

유저이름은 AMI 라면 `ec2-user`이고 우분투라면 `ubuntu`일 것이다.

유저이름없이 고정아이피로만 접속을 시도하면 접속이 안되기 때문에 주의 요망

# Python3 설치

```bash
$ sudo yum update
$ sudo yum install python36 python36-devel python36-pip python36-setuptools python36-virtualenv
```

# venv 실행

```bash
$ mkdir python3
$ cd python3
$ python3 -m venv venv
$ . venv/bin/activate
```

python2 이하 버전은 `virtualenv`를 따로 설치해서 `virtualenv venv` 로 만들어준다.
`venv` 는 python 을 사용하기 위한 일종의 가상 환경인데, python 프로젝트마다 각각 다른 버전의 라이브러리 설치를 가능하게 해준다. `nodejs`의 `nvm`과 비슷하지만 조금은 다른 그런 것.

`$ python3 -m venv venv` 라고 하면 혼동이 올 수 있는데

`$ python3 -m venv hello-project` 등으로 이름을 지어줄 수도 있다.

`venv` 모듈 호출 뒤에 원하는 이름을 작성하면 된다.

# flask, gunicorn 설치

```bash
$ pip3 install flask gunicorn
```

앞서도 말했지만 해당 라이브러리는 `. venv/bin/activate`로 활성화된 `venv`에 설치하는 것이다. 따라서 다음에도 해당 `venv` 를 활성화해주지 않으면 나중에 호출할 때 해당 라이브러리는 존재하지 않는 것으로 응답한다.

# flask 코드 작성

```bash
$ vim hello.py
```

```python
from flask import Flask
# flask 공식 예제는 app 이라는 변수명으로 초기화 하는데 이 경우 WSGI 연동시 할일이 더 생긴다.
# 그러니 application 이라는 변수명으로 초기화 해주자.
application = Flask(__name__)

# 라우팅을 위한 데코레이터
@application.route('/user/<username>')
def show_user_profile(username):
    return 'Your user name is %s' % username

@application.route('/post/<int:post_id>')
def show_post(post_id):
    return 'Post Id is %d' % post_id

@application.route('/path/<path:subpath>')
def show_subpath(subpath):
    return 'Subpath is %s, but what is subpath?' % subpath

if __name__ == "__main__":
    application.run(host='0.0.0.0', port='5000')
```

참고로 이 포스트의 코드들은 [flask 공식 사이트](http://flask.pocoo.org/docs/1.0/quickstart/#a-minimal-application)에서 적당히 코드를 가져온 다음,

[Flask App with Gunicorn on Nginx Server upon AWS EC2 Linux](https://pyliaorachel.github.io/blog/tech/system/2017/07/07/flask-app-with-gunicorn-on-nginx-server-upon-aws-ec2-linux.html) 라는 글의 예제를 참조했다.

return 문의 문장은 내 맘대로 알아보기 쉽게 수정했다.

작성한 코드를 실행시켜보자.

```bash
$ python3 hello.py
 * Serving Flask app "hello" (lazy loading)
 * Environment: production
   WARNING: Do not use the development server in a production environment.
   Use a production WSGI server instead.
 * Debug mode: off
 * Running on http://0.0.0.0:5000/ (Press CTRL+C to quit)
```

나는 위와 같이 결과가 나왔는데, 이미 gunicorn 과 nginx 연동이 끝난 후 실행하는 것이라 결과가 다르게 나올 수도 있다.

production 환경에서 지금과 같은 개발 서버를 사용하지 말라고 경고를 하며 production WSGI 서버를 사용하라고 경고가 나오는데,

그 이유에 대해서는 다음 사이트를 참조하면 될 것이다.

[Why shouldn't one use Flask, Bottle, Django, etc. directly, and always use WSGI?](https://www.reddit.com/r/Python/comments/8bb102/why_shouldnt_one_use_flask_bottle_django_etc/)

대략 로드밸런싱과 성능 및 보안 문제인 것 같다. 요샌 AWS 인프라가 이런 로드밸런싱 업무를 대행하는 듯 해서 앞으로도 유효한 방법인지는 좀 더 지켜봐야 할 것 같다.

# gunicorn 으로 wsgi 연동

```bash
$ vim wsgi.py
```

```python
from hello import application

if __name__ == "__main__":
    application.run()
```

그 후 `gunicorn` 으로 실행한다.

```bash
$ gunicorn --bind 0.0.0.0:5000 wsgi
```

그럼 wsgi 연동 작업도 완료되었다. `uwsgi` 를 사용하면 좀 더 복잡한 과정이 있었던 거 같은데 `gunicorn`을 사용하니 정말 간단한 느낌.

이 작업을 실행하지 않으면 해당 폴더에 `hello.sock` 파일이 생기지 않을 것이다. 따라서 한 번은 반드시 실행해야 한다.

# 서버 재시작시 자동으로 재실행하는 스크립트 작성

```bash
$ sudo vim /etc/init/helloproject.conf
```

```bash
script
description "Gunicorn application server running myproject"

start on runlevel [2345]
stop on runlevel [!2345]

respawn

# python3 venv 위치로 지정한 곳을 작성.
env PATH=/home/ec2-user/works/python3/venv/bin
env PROGRAM_NAME="helloproject"
env USERNAME="ec2-user"

script
    echo "[`date -u +%Y-%m-%dT%T.%3NZ`] (sys) Ready to run..." >> /var/log/$PROGRAM_NAME.sys.log

    export HOME="/home/ec2-user"
    echo $$ > /var/run/$PROGRAM_NAME.pid

    # wsgi 파일이 위치하고 실행시키고자 하는 .sock 파일이 위치한 곳을 작성.
    cd /home/ec2-user/works/python3/flask-tutorial
    exec gunicorn --workers 3 --bind unix:hello.sock -m 000 wsgi >> /var/log/$PROGRAM_NAME.sys.log 2>&1
end script

# 디버깅을 위해 시작 전 실행하는 스크립트
pre-start script
    echo "[`date -u +%Y-%m-%dT%T.%3NZ`] (sys) Starting" >> /var/log/$PROGRAM_NAME.sys.log
end script

# 디버깅을 위해 종료 전 실행하는 스크립트
pre-stop script
    rm /var/run/$PROGRAM_NAME.pid/
    echo "[`date -u +%Y-%m-%dT%T.%3NZ`] (sys) Stopping" >> /var/log/$PROGRAM_NAME.sys.log
end script
```

```bash
$ sudo initctl reload-configuration
$ sudo initctl list
helloproject start/running, process 1234
$ sudo initctl start helloproject
initctl: Job is already running: helloproject #이미 나는 실행 중이어서 이런 문구가 출력
$ sudo initctl status helloproject
helloproject start/running, process 1234
```

# nginx 설치 및 설정

```bash
$ sudo yum install nginx
$ sudo vim /etc/nginx/nginx.conf
```

```bash
전략
...
server {
        listen       80 default_server;
        listen       [::]:80 default_server;
        server_name  helloproject; # 서버 이름 설정
        root         /usr/share/nginx/html;

        include /etc/nginx/default.d/*.conf;

        location / {
                # wsgi에서 설정한 .sock 파일이 있는 위치를 작성한다.
                proxy_pass http://unix:/home/ec2-user/works/python3/flask-tutorial/hello.sock;
        }
        ...중략
}
...
후략
```

그 후 nginx 설정을 제대로 했는지 확인하기 위해 다음 명령어를 입력한다.

```bash
$ sudo nginx -t
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

위와 다른 결과가 나온다면 뭔가가 잘못된 것이니 설정 파일을 작성하는데 오타나 실수가 없는지 확인한다.

그 후 nginx 를 재실행한다.

```bash
$ sudo service nginx restart
```

그리고 lightsail 의 고정 아이피에 포트를 80 으로 설정해서 들어가면... 아무 문제 없이 잘 되었으면 좋으련만 아마 에러가 발생할 것이다.

permission 문제 때문인데 이게 `uWSGI`를 사용할 때도 발생했던 문제이고 이걸 해결하는 게 조금 까다로워서 `gunicorn`을 사용했는데 상황은 비슷한듯 하다.

참조했던 사이트에서는 해당 문제를 아주 상큼하게 다음과 같이 해결한다.

```bash
$ chmod 711 /home/ec2-user # 사용자는 무엇이든 할 수 있고 그외 다른 접근자는 실행(execute)만 가능하도록 permission
$ sudo service nginx restart # 혹시 모르니 nginx 재시작
```

이제 브라우저 주소창에 `'고정아이피':'포트번호(80)'/user/rase` 라고 입력해보면

```
Your user name is rase
```

라고 나올 것이다.
