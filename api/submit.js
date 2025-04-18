// api/submit.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const payload = req.body;

  try {
    const airtableRes = await fetch('https://api.airtable.com/v0/appoFp9XDO22Wyi9g/PIP', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer patKJcYQeZebXXB9p.4088f1221a2c9fc1d710d65b2ba113937b918464cae0d470f10d2101e3582dca',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await airtableRes.json();

    if (!airtableRes.ok) {
      console.error('Airtable Error:', data);
      return res.status(airtableRes.status).json(data);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}
