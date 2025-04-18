export async function GET() {
  const res = await fetch('https://ai.hackclub.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: [
        {
          role: 'user',
          content: 'You are an embedded model that takes a project idea and outputs an action plan of how one could go about building it to a creative developer, preferably in about 4 bullet points. Your explanation should not include dumb stuff like "testing" but should describe the subsystems and how they will fit together. Do not preface your answer. There is no option to converse - your first answer will be displayed on the website. Do not waffle. Use plaintext only. No markdown. Keep it extremely concise and technical. Remember to number the bullet points!',
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
