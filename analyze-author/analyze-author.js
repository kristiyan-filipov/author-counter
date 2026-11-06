import 'dotenv/config';
import { getJson } from 'serpapi';

export const handler = async (event) => {
  // Handle CORS preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      },
      body: '',
    };
  }

  try {
    console.log('Received query params:', event.queryStringParameters);

    const { authorLink, authorName } = event.queryStringParameters || {};
    if (!authorLink || !authorName) {
      console.error('Missing authorLink or authorName');
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        },
        body: JSON.stringify({ error: 'authorLink and authorName required' }),
      };
    }

    const apiKey = process.env.SERPAPI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      console.error('API key is missing from environment variables (SERPAPI_API_KEY or API_KEY)');
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        },
        body: JSON.stringify({ error: 'Server misconfiguration: API key missing from environment variables' }),
      };
    }

    // Extract authorId from authorLink
    let authorId = null;
    if (authorLink.includes('user=')) {
      const userIndex = authorLink.indexOf('user=');
      const ampIndex = authorLink.indexOf('&', userIndex);
      authorId = authorLink.substring(userIndex + 5, ampIndex > -1 ? ampIndex : undefined);
    }

    console.log('Extracted authorId:', authorId);

    if (!authorId) {
      console.error('Invalid authorLink, could not extract authorId');
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        },
        body: JSON.stringify({ error: 'Invalid authorLink' }),
      };
    }

    const params = {
      engine: 'google_scholar_author',
      author_id: authorId,
      api_key: apiKey,
      hl: 'en',
      num: 100,
    };

    let start = 0;
    const allAuthors = [];
    let firstTwoAmount = 0;

    while (true) {
      params.start = start;
      console.log(`Fetching articles starting at ${start} with params:`, params);

      let result;
      try {
        result = await getJson(params);
      } catch (apiError) {
        console.error('SerpApi call failed:', apiError.stack || apiError);
        return {
          statusCode: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          },
          body: JSON.stringify({
            error: 'Failed to fetch from SerpApi',
            details: apiError.message || apiError.toString(),
          }),
        };
      }

      if (!result) {
        console.error('No result returned from SerpApi');
        break;
      }

      const articles = result.articles || [];
      console.log(`Fetched ${articles.length} articles`);

      if (!articles.length) break;

      for (const article of articles) {
        if (article.authors) {
          allAuthors.push(article.authors);
        } else {
          console.warn('Article missing authors:', article);
        }
      }

      start += 100;
    }

    for (const authorList of allAuthors) {
      const authors = authorList.split(',').map((s) => s.trim());
      if (authors[0] === authorName || authors[1] === authorName) {
        firstTwoAmount++;
      }
    }

    const response = {
      totalArticles: allAuthors.length,
      firstOrSecondAuthorArticles: firstTwoAmount,
    };

    console.log('Response:', response);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      },
      body: JSON.stringify(response),
    };
  } catch (e) {
    console.error('Error in handler:', e.stack || e);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      },
      body: JSON.stringify({ error: e.message || e.toString() || 'Unknown error' }),
    };
  }
};
