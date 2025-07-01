FROM mysql:8.0
ENV MYSQL_ROOT_PASSWORD=rootpassword
ENV MYSQL_USER=simstock_dev
ENV MYSQL_PASSWORD=1234
ENV MYSQL_DATABASE=simutrade
COPY simutrade_dump.sql /docker-entrypoint-initdb.d/
