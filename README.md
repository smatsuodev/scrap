## 環境構築

1. `cp .env.sample .env`
2. 中身を適宜書き換え
3. `bun migrate:remote`を実行して、マイグレーションが成功することを確認

## Cloudflare Pages へのデプロイ

- `bun run deploy`
- ソースのビルド、デプロイ、マイグレーションが実行されます

## マイグレーションのやり方

- ローカル: `bun migrate`
- 本番環境: `bun migrate:remote`
