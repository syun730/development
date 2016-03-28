# development

自分用開発環境

## 開発開始時

```
$ npm install
$ gulp
```

- http://localhost:8888 でローカルサーバーが起動。
- sassをコンパイル。html・js・画像はリロードのみ。
- 詳しくはgulpfile.jsを確認。

## 納品時

```
$ gulp build
```

- deployフォルダに納品ファイルが作成されます。