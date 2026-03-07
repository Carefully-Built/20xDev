interface Web3FormsData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface Web3FormsResponse {
  success: boolean;
  message?: string;
}

export async function submitContactForm(
  data: Web3FormsData,
): Promise<Web3FormsResponse> {
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

  if (!accessKey) {
    throw new Error(
      'NEXT_PUBLIC_WEB3FORMS_KEY environment variable is not set',
    );
  }

  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      access_key: accessKey,
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      botcheck: '',
    }),
  });

  const result = (await response.json()) as Web3FormsResponse;
  return result;
}
