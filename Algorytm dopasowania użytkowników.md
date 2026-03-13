# Algorytm dopasowania użytkowników

Kluczowa funkcja aplikacji.

Algorytm bierze pod uwagę:

- lokalizacja
- preferencje
- aktywność
- popularność
- zgodność zainteresowań

## Score użytkownika

System liczy score dopasowania.

Przykład:

```text
MATCH_SCORE =
(LOCATION_WEIGHT * distance)
+
(PREFERENCE_WEIGHT * compatibility)
+
(ACTIVITY_WEIGHT * activity_score)
+
(POPULARITY_WEIGHT * followers)
```

## Dopasowanie randkowe

Jeśli:

User A likes User B
AND
User B likes User A

-> MATCH

1. Algorytm feedu

Feed działa podobnie do TikToka.

Posty są sortowane przez:

- engagement
- czas publikacji
- lokalizację
- zainteresowania

## Score posta

```text
POST_SCORE =
(likes * 2)
+
(comments * 3)
+
(shares * 5)
+
(recency_factor)
```

1. Algorytm streamów

Streamy sortowane według:

- viewer_count
- tip_activity
- recency
- followed_streamers
