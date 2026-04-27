exports.handler = async (event) => {
  const { url, method = 'GET', body } = JSON.parse(event.body || '{}');

  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'URL parameter is required' }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    };
  }

  try {
    const fetchOptions = {
      method: method,
      headers: {
        'Accept': 'application/json',
      },
    };

    if (body && method === 'POST') {
      fetchOptions.body = body;
      fetchOptions.headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, fetchOptions);
    const contentType = response.headers.get('content-type');
    
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    return {
      statusCode: response.status,
      body: JSON.stringify({
        status: response.status,
        statusText: response.statusText,
        data: data,
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    };
  }
};
