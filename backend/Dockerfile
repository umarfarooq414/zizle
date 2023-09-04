FROM node:14-alpine

RUN npm i -g @nestjs/cli && \
    mkdir -p /home/backend

WORKDIR /home/backend

COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENV PATH=/home/bin:${PATH}

ENTRYPOINT [ "/entrypoint.sh" ]
