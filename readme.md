docker build -t mail-app .
docker run -d -p 8081:80 -v /root/spam-bot/api/db:/var/www/html/api/db --name mail-app mail-app