'use client';

import { useState } from 'react';

export default function ApiTestPage() {
  const [email, setEmail] = useState('admin@libsys.com');
  const [password, setPassword] = useState('hashed_admin_pass');
  const [userId, setUserId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [borrowResult, setBorrowResult] = useState<any>(null);
  const [result, setResult] = useState<any>(null);

  async function testLogin() {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    setResult(data);
    if (data?.user?.id) setUserId(data.user.id);
  }

  async function testMe() {
    const res = await fetch('/api/user/me', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    const data = await res.json();
    console.log("data", data);

    setResult(data);
  }

  async function testSearch() {
    if (!searchQuery.trim()) return;

    const res = await fetch('/api/items/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: searchQuery })
    });

    const data = await res.json();
    console.log('Search results:', data);
    setResults(data);
  }

  async function borrowBook() {
  const res = await fetch('/api/borrow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      itemCopyId: '64ae5f0fc76df8312c1f9a22'
    })
  });

  const data = await res.json();
  console.log(data);
}

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">🔬 API Testing Page</h1>

      {/* LOGIN */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">1️⃣ Test Login</h2>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email"
          className="border p-2 rounded w-full" />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password"
          className="border p-2 rounded w-full" />
        <button onClick={testLogin} className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
        <p className="text-sm text-gray-500">Logged in User ID: {userId}</p>
      </div>

      {/* ME */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">2️⃣ Test /user/me</h2>
        <button onClick={testMe} className="bg-green-600 text-white px-4 py-2 rounded">Get My Info</button>
      </div>

      {/* SEARCH */}
      <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Library Search</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search books, authors, publishers"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        />
        <button
          onClick={testSearch}
          className="bg-blue-600 text-white px-4 py-1 rounded"
        >
          Search
        </button>
      </div>

      <div>
        {results.length === 0 && <p>No results yet.</p>}
        {results.map((item: any) => (
          <div key={item.id} className="border p-2 mb-2 rounded">
            <h3 className="font-semibold">{item.title}</h3>
            <p>Author: {item.author}</p>
            <p>Publisher: {item.publisher}</p>
            <p>Available Copies: {item.copies?.length || 0}</p>
          </div>
        ))}
      </div>
    </div>

      {/* BORROW */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">4️⃣ Test /borrow</h2>
        <p className="text-sm text-gray-500">Make sure to replace itemCopyId inside the code</p>
        <button onClick={borrowBook} className="bg-purple-600 text-white px-4 py-2 rounded">Borrow Item</button>
      </div>

      {/* RESPONSE OUTPUT */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold">🧾 Result:</h3>
        <pre className="p-4 rounded whitespace-pre-wrap">{JSON.stringify(result || borrowResult, null, 2)}</pre>
      </div>
    </div>
  );
}
