<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <title>Buat Kategori</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    form { max-width: 480px; }
    label { display:block; margin-top:8px; }
    input[type="text"], textarea { width:100%; padding:8px; box-sizing:border-box; }
    button { margin-top:12px; padding:8px 12px; }
    .error { color: red; }
  </style>
</head>
<body>
  <h1>Buat Kategori</h1>

  @if ($errors->any())
    <div class="error">
      <ul>
        @foreach ($errors->all() as $err)
          <li>{{ $err }}</li>
        @endforeach
      </ul>
    </div>
  @endif

  <!-- PENTING: action harus ke route('categories.store') (URI: /categories), bukan /categories/create -->
  <form method="post" action="{{ route('categories.store') }}">
    @csrf

    <label>Nama Kategori
      <input type="text" name="name" value="{{ old('name') }}" placeholder="Masukkan nama kategori" required>
    </label>

    <label>Deskripsi
      <textarea name="description" rows="4" placeholder="Deskripsi kategori">{{ old('description') }}</textarea>
    </label>

    <button type="submit">Simpan</button>
  </form>

  <p><a href="{{ route('categories.index') }}">Kembali ke Daftar</a></p>
</body>
</html>