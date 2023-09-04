FROM node:14-alpine

RUN mkdir -p /home/frontend/moderator

WORKDIR /home/frontend/moderator

COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]