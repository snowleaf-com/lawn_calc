# ガーデン計算ツール

お庭の芝生・農薬・ガーデニングの計算を簡単に行える Web アプリケーションです。

## 新機能

### 1. Blender ファイル（3D モデル）の読み込み機能

Blender で作成した 3D モデルを Web ページ上で表示できるようになりました。

#### 使用方法：

1. **Blender でモデルを作成**

   - Blender で 3D モデルを作成・編集

2. **GLB/glTF 形式でエクスポート**

   - Blender: File > Export > glTF 2.0 (.glb/.gltf)
   - 推奨: GLB 形式（1 つのファイルにまとまるため）

3. **ファイルをプロジェクトに配置**

   ```
   project/
   ├── models/
   │   └── sample.glb  # ←ここに配置
   ├── grass-3d.js
   └── index.html
   ```

4. **コードで読み込み**
   ```javascript
   // grass-3d.js のinit()メソッド内で
   this.loadBlenderModel('./models/sample.glb', { x: 5, y: 0, z: 5 }, 1)
     .then((model) => {
       console.log('Model loaded successfully')
     })
     .catch((error) => {
       console.error('Failed to load model:', error)
     })
   ```

#### パラメータ説明：

- `modelPath`: GLB/glTF ファイルのパス
- `position`: 配置位置 { x, y, z }
- `scale`: スケール（1.0 が元サイズ）

### 2. レイアウトの変更

従来の左右分割レイアウトから、ヘッダー上部 + 左右分割の新しいレイアウトに変更しました。

#### 新しい構造：

```
[    ヘッダー（全幅）    ]
[ 3Dビュー ][ メインコンテンツ ]
[         フッター         ]
```

#### レスポンシブ対応：

- **PC/タブレット（768px 以上）**: 左右分割レイアウト
- **モバイル（768px 未満）**: 縦積みレイアウト（3D ビューは上部に配置）

## 技術仕様

- **3D エンジン**: Three.js
- **モデル形式**: GLB/glTF 2.0
- **レスポンシブ**: CSS Grid & Flexbox
- **ブラウザ対応**: モダンブラウザ（WebGL 対応必須）

## 注意事項

- Blender ファイル（.blend）は直接読み込めません。必ず GLB/glTF 形式に変換してください
- 大きなモデルファイルは読み込み時間がかかる場合があります
- モバイルデバイスでは 3D 表示のパフォーマンスに制限がある場合があります
