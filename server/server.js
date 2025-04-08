const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const axios = require('axios');
const PDFDocument = require('pdfkit');
const stripe = require('stripe')('sk_test_51QgNCaAczWlEKo31v7Q2rZUPl2bMGBBPHn0quRwe23kd5l7IhtqclkU2XC9nkaO4Vm6U9HjANwxn9DVQPWfGr2l900OjoBhtDc')
const twilio = require('twilio');
const { format } = require('date-fns');

dotenv.config();

const app = express();
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.use(cors());
app.use(express.json());


const TWILIO_ACCOUNT_SID = 'AC5f87de08726346312fb6a242fb0e5b38';
const TWILIO_AUTH_TOKEN = '4e074ff87bbeeaf4332fd0c571edbf09';
const TWILIO_WHATSAPP_NUMBER = 'whatsapp:+14155238886';
const USER_PHONE_NUMBER = 'whatsapp:+919321694382';

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

app.post('/api/send-reminder', async (req, res) => {
  try {
    const { appointments } = req.body;
    
    if (!appointments || appointments.length === 0) {
      return res.status(400).json({ error: 'No appointments provided' });
    }

    const message = appointments.map(apt => {
      const date = format(new Date(apt.date), 'MMMM d, yyyy');
      return `📅 ${date} at ${apt.time}\n📍 ${apt.courtName}\n📌 Case: ${apt.caseTitle}\n#️⃣ ${apt.caseNumber}\n`;
    }).join('\n');

    const twilioMessage = await client.messages.create({
      body: `🏛 Your upcoming court appointments:\n\n${message}`,
      from: TWILIO_WHATSAPP_NUMBER,
      to: USER_PHONE_NUMBER
    });

    res.json({ success: true, messageId: twilioMessage.sid });
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    res.status(500).json({ error: 'Failed to send WhatsApp message' });
  }
});

// New API endpoint to fetch lawyer experience and city based on ID
app.get('/api/caraousel/:id', async (req, res) => {
  
  try {
    const { id } = req.params;
    const query = `
      SELECT experience_years, location_city,case_solved
      FROM lawyers 
      WHERE id = $1;
    `;
    
    const { rows } = await pool.query(query, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Lawyer not found' });
    }
    
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching lawyer details:', err.message);
    res.status(500).send('Server Error');
  }
});

// Basic route to test server
app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

// Document Generation Endpoints remain unchanged
app.post('/generate-content', async (req, res) => {
  const { documentType, name, partiesInvolved, additionalDetails } = req.body;

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GOOGLE_API_KEY}`;

    const geminiApiResponse = await axios({
      url: endpoint,
      method: 'post',
      data: {
        contents: [
          {
            parts: [
              {
                text: `Generate a ${documentType} according to Indian law. Include the following details: Name: ${name}, Parties Involved: ${partiesInvolved}, Additional Details: ${additionalDetails}.`,
              },
            ],
          },
        ],
      },
    });

    const generatedContent = geminiApiResponse.data.candidates[0].content.parts[0].text;
    res.json({ content: generatedContent });
  } catch (error) {
    console.error('Error generating document content:', error.response ? error.response.data : error.message);
    res.status(500).send(`Error generating content: ${error.message}`);
  }
});

app.post('/generate-pdf', (req, res) => {
  const { documentType, name, partiesInvolved, additionalDetails, content } = req.body;

  try {
    const doc = new PDFDocument();
    const filename = `${documentType}.pdf`;

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/pdf');

    doc.pipe(res);

    doc.fontSize(18).text(`Document Type: ${documentType}`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12);
    doc.text(`Name: ${name}`);
    doc.moveDown();
    doc.text(`Parties Involved: ${partiesInvolved}`);
    doc.moveDown();
    doc.text(`Additional Details: ${additionalDetails}`);
    doc.moveDown();

    applyFormattedText(doc, content);

    doc.end();
  } catch (error) {
    console.error('Error generating PDF:', error.message);
    res.status(500).send(`Error generating PDF: ${error.message}`);
  }
});

function applyFormattedText(doc, text) {
  const parts = text.split(/\*\*/);

  parts.forEach((part, index) => {
    if (index % 2 === 1) {
      doc.font('Helvetica-Bold').text(part, { continued: true });
    } else {
      doc.font('Helvetica').text(part, { continued: true });
    }
  });

  doc.text('');
}

// Modified Lawyer Data Management Endpoints with contact number encryption

app.get('/api/lawyers/locations', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT location_city FROM Lawyers');
    res.json(result.rows.map((row) => row.location_city));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.get('/api/lawyers/specializations', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT specialization_name FROM Specializations');
    res.json(result.rows.map((row) => row.specialization_name));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Modified route for fetching lawyer data with encrypted contact numbers
app.get('/api/lawyers', async (req, res) => {
  try {
    const { city, specialization } = req.query;
    const secretKey = process.env.ENCRYPTION_KEY;

    let query = `
      SELECT 
          l.id, 
          l.name, 
          l.short_introduction, 
          l.long_introduction,
          l.location_full_address, 
          l.location_city, 
          l.experience_years, 
          pgp_sym_encrypt(l.email::text, '${secretKey}')::text as email, 
          l.social_media_links,
          l.image_url,
          l.map_url,
          array_agg(DISTINCT lang.language_name) AS languages,
          array_agg(DISTINCT spec.specialization_name) AS specializations,
          array_agg(DISTINCT pgp_sym_encrypt(cn.contact_number::text, '${secretKey}')::text) AS contact_numbers
      FROM 
          Lawyers l
      LEFT JOIN 
          Lawyer_Languages ll ON l.id = ll.lawyer_id
      LEFT JOIN 
          Languages lang ON ll.language_id = lang.id
      LEFT JOIN 
          Lawyer_Specializations ls ON l.id = ls.lawyer_id
      LEFT JOIN 
          Specializations spec ON ls.specialization_id = spec.id
      LEFT JOIN 
          Contact_Numbers cn ON l.id = cn.lawyer_id
      WHERE 
          l.location_city = $1`;

    if (specialization) {
      query += ` AND spec.specialization_name = $2`;
    }

    query += ` GROUP BY l.id;`;

    const params = specialization ? [city, specialization] : [city];
    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Modified route for fetching lawyer details by ID with encrypted contact numbers
app.get('/api/lawyers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const secretKey = process.env.ENCRYPTION_KEY;

    const query = `
      SELECT 
        l.id, 
        l.name, 
        l.long_introduction, 
        l.location_full_address, 
        l.location_city, 
        l.experience_years, 
        l.image_url,
        l.map_url,
        pgp_sym_encrypt(l.email::text, '${secretKey}')::text as email, 
        l.social_media_links,
        array_agg(DISTINCT lang.language_name) AS languages,
        array_agg(DISTINCT spec.specialization_name) AS specializations,
        array_agg(DISTINCT pgp_sym_encrypt(cn.contact_number::text, '${secretKey}')::text) AS contact_numbers,
        array_agg(DISTINCT r.review_text) AS reviews,
        array_agg(DISTINCT r.reviewer_name) AS reviewer_names,
        l.court_type
      FROM 
          Lawyers l
      LEFT JOIN 
          Lawyer_Languages ll ON l.id = ll.lawyer_id
      LEFT JOIN 
          Languages lang ON ll.language_id = lang.id
      LEFT JOIN 
          Lawyer_Specializations ls ON l.id = ls.lawyer_id
      LEFT JOIN 
          Specializations spec ON ls.specialization_id = spec.id
      LEFT JOIN 
          Contact_Numbers cn ON l.id = cn.lawyer_id
      LEFT JOIN 
          Reviews r ON l.id = r.lawyer_id
      WHERE 
          l.id = $1
      GROUP BY 
          l.id;
    `;

    const { rows } = await pool.query(query, [id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Modified endpoint for inserting a new lawyer with encrypted email and contact numbers
app.post('/api/lawyers', async (req, res) => {
  const secretKey = process.env.ENCRYPTION_KEY;
  const { 
    name, 
    email, 
    location_city, 
    experience_years, 
    social_media_links, 
    court_type,
    contact_numbers,
    ...otherDetails 
  } = req.body;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Insert lawyer details
    const lawyerQuery = `
      INSERT INTO Lawyers (name, email, location_city, experience_years, social_media_links, court_type)
      VALUES ($1, pgp_sym_encrypt($2, $3), $4, $5, $6, $7)
      RETURNING id;
    `;

    const lawyerValues = [
      name,
      email,
      secretKey,
      location_city,
      experience_years,
      social_media_links,
      court_type
    ];

    const { rows } = await client.query(lawyerQuery, lawyerValues);
    const lawyerId = rows[0].id;

    // Insert encrypted contact numbers
    if (contact_numbers && contact_numbers.length > 0) {
      const contactNumberQuery = `
        INSERT INTO Contact_Numbers (lawyer_id, contact_number)
        VALUES ($1, pgp_sym_encrypt($2, $3));
      `;

      for (const number of contact_numbers) {
        await client.query(contactNumberQuery, [lawyerId, number, secretKey]);
      }
    }

    await client.query('COMMIT');
    res.json({ id: lawyerId, message: 'Lawyer added successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err.message);
    res.status(500).send('Error adding lawyer');
  } finally {
    client.release();
  }
});

// New endpoint for decrypting email and contact numbers
app.get('/api/lawyers/decrypt/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const secretKey = process.env.ENCRYPTION_KEY;

    const query = `
      SELECT 
        pgp_sym_decrypt(l.email::bytea, $2) AS decrypted_email,
        array_agg(pgp_sym_decrypt(cn.contact_number::bytea, $2)) AS decrypted_contact_numbers
      FROM Lawyers l
      LEFT JOIN Contact_Numbers cn ON l.id = cn.lawyer_id
      WHERE l.id = $1
      GROUP BY l.id, l.email;
    `;

    const { rows } = await pool.query(query, [id, secretKey]);
    if (rows.length > 0) {
      res.json({
        email: rows[0].decrypted_email,
        contact_numbers: rows[0].decrypted_contact_numbers
      });
    } else {
      res.status(404).send('Lawyer not found');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error decrypting data');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Chatbot endpoints remain unchanged
app.post('/api/chat', async (req, res) => {
  const { sessionId, question, answer } = req.body;
  try {
    await pool.query(
      'INSERT INTO chat_history (session_id, user_question, bot_response) VALUES ($1, $2, $3)',
      [sessionId, question, answer]
    );
    res.status(200).send('Chat saved');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving chat');
  }
});

app.get('/api/chat/:sessionId', async (req, res) => {
  const { sessionId } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM chat_history WHERE session_id = $1 ORDER BY created_at',
      [sessionId]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching chat history');
  }
});

pool.query(
  `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    fullname VARCHAR(255) NOT NULL
  );`
);


/*Payment Code */
app.post('/payment', async (req, res) => {
  const { lawyerId } = req.body;
  const product = await stripe.products.create({
      name:"Satyavrat"
  });
  if(product){
      var price = await stripe.prices.create({
          product: `${product.id}`,
          unit_amount: 100 * 100,
          currency:'inr',
      });
  }
  if(price.id){
     var session = await stripe.checkout.sessions.create({
      line_items: [
          {
              price: `${price.id}`,
              quantity: 1,
          }
      ],
      mode:'payment',
      success_url: `http://localhost:5173/lawyer/${lawyerId}`, // "/payment1"
      cancel_url: `http://localhost:5173/lawyer/${lawyerId}`,
      customer_email:'satyavrat2005@gmail.com'

     }) 
  }
  res.json(session)
})

