FROM node:14-alpine

RUN mkdir -p /home/frontend/client

WORKDIR /home/frontend/client

COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]