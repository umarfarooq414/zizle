FROM node:14-alpine

RUN mkdir -p /home/frontend/admin

WORKDIR /home/frontend/admin

COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]