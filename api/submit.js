// api/submit.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const airtableToken = process.env.AIRTABLE_TOKEN;
  const airtableBase = process.env.AIRTABLE_BASE_ID; // e.g. 'appoFp9XDO22Wyi9g'
  const airtableTable = process.env.AIRTABLE_TABLE_NAME; // e.g. 'PIP'

  if (!airtableToken || !airtableBase || !airtableTable) {
    return res.status(500).json({ error: 'Missing Airtable configuration' });
  }

  const { fields } = req.body;

  if (!fields || typeof fields !== 'object') {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const airtableEndpoint = `https://api.airtable.com/v0/${airtableBase}/${airtableTable}`;

  try {
    const airtableRes = await fetch(airtableEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${airtableToken}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ records: [{ fields }], typecast: true })
    });

    if (!airtableRes.ok) {
      const errData = await airtableRes.json();
      return res.status(airtableRes.status).json({ error: errData });
    }

    const data = await airtableRes.json();
    return res.status(200).json({ success: true, data });

  } catch (error) {
    console.error('Submission failed:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
