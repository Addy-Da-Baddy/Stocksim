# Schema Definition

## Table: `users`
| Column          | Type          | Description                   |
| :-------------- | :------------ | :---------------------------- |
| `id`            | INTEGER (PK)  | Unique user ID                |
| `username`      | VARCHAR(50)   | Unique username               |
| `email`         | VARCHAR(100)  | Unique email                  |
| `password_hash` | VARCHAR(128)  | Hashed password               |
| `balance`       | FLOAT         | Simulated money balance       |
| `created_at`    | TIMESTAMP     | Account creation time         |

## Table: `portfolio`
| Column       | Type         | Description                         |
| :----------- | :----------- | :---------------------------------- |
| `id`         | INTEGER (PK) | Unique portfolio entry ID           |
| `user_id`    | INTEGER (FK) | References `users(id)`              |
| `symbol`     | VARCHAR(10)  | Stock ticker symbol                 |
| `shares`     | FLOAT        | Number of shares held               |
| `avg_price`  | FLOAT        | Average purchase price per share    |
| `updated_at` | TIMESTAMP    | Last updated timestamp              |

## Table: `transactions`
| Column      | Type         | Description                           |
| :---------- | :----------- | :------------------------------------ |
| `id`        | INTEGER (PK) | Unique transaction ID                 |
| `user_id`   | INTEGER (FK) | References `users(id)`                |
| `symbol`    | VARCHAR(10)  | Stock ticker symbol                   |
| `shares`    | FLOAT        | Number of shares bought/sold          |
| `price`     | FLOAT        | Price per share at transaction time   |
| `type`      | VARCHAR(4)   | 'BUY' or 'SELL'                       |
| `timestamp` | TIMESTAMP    | When the transaction occurred         |

## Table: `stock_cache` (Optional)
| Column        | Type         | Description                 |
| :------------ | :----------- | :-------------------------- |
| `id`          | INTEGER (PK) | ID                          |
| `symbol`      | VARCHAR(10)  | Stock ticker symbol         |
| `price`       | FLOAT        | Last fetched price          |
| `last_updated`| TIMESTAMP    | When the price was last updated |

## Relationships
- `users` has many `transactions`.
- `users` has many `portfolio` entries.
- `transactions` and `portfolio` entries are linked to `users`.
- Optionally, `stock_cache` is used to minimize API calls.