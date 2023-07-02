# Important note. 
If you build a router with Elroid, add these so that when https://copy.reactmvc.ir/about is refreshed, you will not get a 404 error.
<br>

For Apache
```
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^(.*)$ index.html [L,QSA]
```
For Nginx
```
location / {
    try_files $uri $uri/ /index.html;
}
 ```
Apache in the .htaccess file and Nginx in the nginx.conf file 
