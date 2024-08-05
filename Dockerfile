FROM php:8.1-apache

# Set working directory
WORKDIR /var/www/html

# Install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    zip \
    unzip \
    git \
    cron \
    iputils-ping \
    nano \
    libcurl4-openssl-dev \
    libonig-dev \
    default-mysql-client

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install extensions
RUN docker-php-ext-install mbstring curl

# Install composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Add user
RUN groupadd -g 1000 www
RUN useradd -u 1000 -ms /bin/bash -g www www

# Copy existing application directory contents
COPY . /var/www/html

# Copy existing application directory permissions
COPY --chown=www:www . /var/www/html

# Install Composer dependencies
RUN composer install --no-interaction --optimize-autoloader --no-dev

# Set ServerName to suppress error message
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Add tasks to crontab
RUN echo "*/1 * * * * cd /var/www/html/api/cron && /usr/local/bin/php scheduler.php >> /var/log/cron.log 2>&1" > /etc/cron.d/scheduler
RUN chmod 0644 /etc/cron.d/scheduler && crontab /etc/cron.d/scheduler

# Ensure permissions
RUN chown -R www-data:www-data /var/www/html
RUN chmod -R 755 /var/www/html

# Create log file for cron
RUN touch /var/log/cron.log
RUN chmod 0666 /var/log/cron.log

# Start Apache and cron
CMD ["sh", "-c", "cron && apache2-foreground"]
