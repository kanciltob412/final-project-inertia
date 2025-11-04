<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <title>Categories - Show</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    .meta { margin-top: 12px; }
  </style>
</head>
<body>
  <h1>Detail Kategori</h1>

  <div class="meta">
    <p><strong>ID:</strong> {{ $category['id'] }}</p>
    <p><strong>Nama:</strong> {{ $category['name'] }}</p>
    <p><strong>Deskripsi:</strong> {{ $category['description'] }}</p>
  </div>

  <p><a href="{{ route('categories.index') }}">Kembali ke Daftar</a></p>
</body>
</html>