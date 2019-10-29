FROM alpine:3.10

ARG OPENSTL_USERNAME
ARG OPENSTL_PASSWORD

COPY ./server/ /server
COPY ./requirements.txt /requirements.txt
COPY ./settings.txt /settings.txt

# This hack is widely applied to avoid python printing issues in docker containers.
# See: https://github.com/Docker-Hub-frolvlad/docker-alpine-python3/pull/13
ENV PYTHONUNBUFFERED=1

RUN echo "**** install Python ****" && \
    apk update && \
    apk add --no-cache python3 && \
    if [ ! -e /usr/bin/python ]; then ln -sf python3 /usr/bin/python ; fi && \
    \
    echo "**** install pip ****" && \
    python3 -m ensurepip && \
    rm -r /usr/lib/python*/ensurepip && \
    pip3 install --no-cache --upgrade pip setuptools wheel && \
    if [ ! -e /usr/bin/pip ]; then ln -s pip3 /usr/bin/pip ; fi && \
    \
    echo "**** install Python requirements ****" && \
    pip3 install -r requirements.txt && \
    \
    echo "**** Configure OpenSTL Database username and password ****" && \
    sed -i "s|username:|username:${OPENSTL_USERNAME}|g" /settings.txt && \
    sed -i "s|password:|password:${OPENSTL_PASSWORD}|g" /settings.txt

EXPOSE 5000

ENTRYPOINT ["python3", "/server/vacancy.py"]