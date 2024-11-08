const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const { URL } = require('url');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/getPageMeta', async (req, res) => {
  const pageUrl = req.query.pageUrl;

  if (!pageUrl) {
    return res.status(400).json({ error: 'Page URL is required' });
  }

  try {
    const response = await axios.get(pageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': pageUrl,
      },
      timeout: 5000, // Таймаут на випадок повільного відгуку
    });
    
    const $ = cheerio.load(response.data);

    // Favicon - беремо з /favicon.ico
    const faviconUrl = new URL('/favicon.ico', pageUrl).href;

    // Опис із розділу <head>
    const description = $('head meta[name="description"]').attr('content') ||
                        $('head meta[property="og:description"]').attr('content') ||
                        '';

    const domainUrl = new URL(pageUrl).hostname;

    res.json({
      faviconUrl,
      description,
      domainUrl,
    });
  } catch (error) {
    if (error.response) {
      console.error(`Error fetching page: Request failed with status code ${error.response.status}`);
    } else {
      console.error('Error:', error.message);
    }
    console.error(error.stack);

    res.status(500).json({
      error: 'Page can not be reached. Check your URL and try again',
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
