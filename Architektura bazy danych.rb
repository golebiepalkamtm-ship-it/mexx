Architektura bazy danych

Platforma powinna używać relacyjnej bazy danych (np. PostgreSQL) + Redis do danych realtime.

Główne tabele
USERS

Podstawowa tabela użytkowników.

users
------
id
email
password_hash
username
gender
orientation
birth_date
location
bio
profile_photo
verified
created_at
last_login
status
USER_MEDIA

Przechowuje zdjęcia i filmy użytkownika.

user_media
---------
id
user_id
type (photo/video)
url
visibility (public/private)
created_at
USER_FOLLOW

Relacje społecznościowe.

user_follow
----------
id
follower_id
following_id
created_at
MESSAGES

System wiadomości.

messages
--------
id
sender_id
receiver_id
message_text
media_url
created_at
read_status
STREAMS

Transmisje live.

streams
-------
id
streamer_id
title
category
status (live/offline)
viewer_count
started_at
ended_at
STREAM_TIPS

Napiwki podczas streamu.

stream_tips
-----------
id
stream_id
sender_id
token_amount
message
created_at
PRIVATE_SHOW

Prywatne transmisje.

private_show
-----------
id
streamer_id
viewer_id
price_tokens
started_at
ended_at
POSTS

Posty w feedzie społecznościowym.

posts
-----
id
user_id
content
media_url
created_at
likes_count
comments_count
COMMENTS

Komentarze.

comments
--------
id
post_id
user_id
text
created_at
TOKENS_WALLET

Portfel tokenów użytkownika.

tokens_wallet
-------------
user_id
balance
updated_at
TOKEN_TRANSACTIONS

Historia tokenów.

token_transactions
------------------
id
user_id
type (purchase/tip/private_show/unlock)
amount
reference_id
created_at
SERVICES (ogłoszenia)

Marketplace usług.

services
--------
id
user_id
title
description
price
location
category
created_at
status
SERVICE_MEDIA

Zdjęcia ogłoszeń.

service_media
-------------
id
service_id
url
created_at
SERVICE_REVIEWS

Opinie klientów.

service_reviews
---------------
id
service_id
user_id
rating
comment
created_at