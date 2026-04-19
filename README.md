# 白山バッジクエスト (Hakusan Badge Quest)

石川県白山市の8つの旧市町村を巡りながら、フィジカルなバッジとデジタルバッジを集めるRPG風デジタルスタンプラリーアプリです。白山手取川ジオパークを舞台に、スマートフォン片手に観光スポットを冒険しよう！

## 概要

- **会員登録不要・アプリインストール不要** のPWA（プログレッシブウェブアプリ）
- 観光スポットに設置されたNFCタグやQRコードをスキャンして**デジタルバッジを獲得**
- 4種類のキャラクタークラス（勇者・魔法使い・戦士・ジェスター）でRPGバトルに挑戦
- バッジ収集数に応じてキャラクターが成長し、称号が変わる（ブロンズ → シルバー → ゴールド → LEGEND）
- ピクセルマップとリアルマップ（Leaflet）の2種類で白山市を表示

## 収集できるバッジ（8か所）

| エリア | スポット名 |
|--------|-----------|
| 白峰 | 白峰重要伝統的建造物群保存地区 |
| 尾口 | 手取川ダム |
| 吉野谷 | 綿ヶ滝 |
| 鳥越 | 鳥越城跡 |
| 河内 | 河内千丈温泉 |
| 鶴来 | パーク獅子吼 |
| 松任 | 松任海浜公園 |
| 美川 | 美川県民の森 |

## 技術スタック

- **フレームワーク**: [Next.js 15](https://nextjs.org/) (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS v4
- **アニメーション**: Framer Motion
- **マップ**: Leaflet / React Leaflet
- **フォント**: DotGothic16（ドット絵風日本語フォント）
- **ホスティング**: [Cloudflare Pages](https://pages.cloudflare.com/)
- **データベース**: Cloudflare D1（SQLite）
- **認証**: JWTベースのデバイス認証（`jose`）

## セットアップ

### 必要なもの

- Node.js 20以上
- npm / yarn / pnpm / bun
- Cloudflare アカウント（本番デプロイ時）

### ローカル開発

```bash
# 依存パッケージのインストール
npm install

# 開発サーバーの起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

### データベースのセットアップ（Cloudflare D1）

```bash
# D1 データベースの作成
npx wrangler d1 create hakusan-badge-quest

# スキーマの適用（ローカル）
npx wrangler d1 execute hakusan-badge-quest --local --file=./schema.sql

# スキーマの適用（本番）
npx wrangler d1 execute hakusan-badge-quest --file=./schema.sql
```

## デプロイ

Cloudflare Pages へのデプロイには `@cloudflare/next-on-pages` を使用します。

```bash
# Cloudflare Pages 向けにビルド
npm run pages:build

# Wrangler でデプロイ
npx wrangler pages deploy
```

## プロジェクト構成

```
app/
├── api/          # APIルート（認証・バッジ取得・プロフィール等）
├── claim/        # バッジ取得ページ（/claim/[badgeId]）
├── profile/      # プロフィール・マップ・バッジ一覧
└── page.tsx      # トップページ（冒険スタート画面）
components/       # UIコンポーネント（マップ・モーダル等）
lib/              # ユーティリティ・ゲームロジック
public/           # 静的アセット（バッジ画像・BGM・SE等）
schema.sql        # D1 データベーススキーマ
wrangler.toml     # Cloudflare 設定
```

## ライセンス

&copy; Hakusan Tedorigawa Geopark Badge Quest — 白山市観光・ジオパーク・デジタル推進
