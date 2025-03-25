export async function GET() {
  console.log('the api req worked??')
  const res = await fetch('https://ai.hackclub.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: [
        {
          role: 'user',
          content: 'Give me a fun, creative, and realistic programming project idea for a high schooler. Do not add anything extra to your response, just state a potential project idea in the imperative voice in one sentence.',
        },
      ],
    }),
  });

  const data = await res.json();

  console.log(data);

  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
    },
    status: res.status,
  });
}
