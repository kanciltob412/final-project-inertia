<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <title>Categories - Index</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    .list { margin-top: 12px; }
    .item { margin-bottom: 8px; }
    a { color: #2c3e50; text-decoration: none; }
  </style>
</head>
<body>
  <h1>Daftar Kategori</h1>

  <p><a href="{{ route('categories.create') }}">Buat Kategori Baru</a></p>

  <div class="list">
    @foreach ($categories as $cat)
      <div class="item">
        <strong>{{ $cat['name'] }}</strong>
        &nbsp;(<a href="{{ route('categories.show', $cat['id']) }}">lihat</a>)
      </div>
    @endforeach
  </div>
</body>
</html>