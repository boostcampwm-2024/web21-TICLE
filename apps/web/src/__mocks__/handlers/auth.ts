import { HttpResponse, HttpResponseResolver } from 'msw';

interface SignUpData {
  email: string;
  password: string;
  name: string;
}

export const signUp: HttpResponseResolver<object, SignUpData> = async ({ request }) => {
  const requestData = await request.json();

  const responseData = {
    status: 'success',
    data: {
      ...requestData,
      id: String(Math.floor(Math.random() * 1000) + 1),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };

  return HttpResponse.json(responseData, { status: 201 });
};

interface SignInData {
  email: string;
  password: string;
}

export const logIn: HttpResponseResolver<object, SignInData> = async ({ request }) => {
  const url = new URL(request.url);
  const redirectUrl = url.searchParams.get('redirect-url') || '/';

  return HttpResponse.json(null, {
    status: 302,
    headers: {
      Location: redirectUrl,
      'Set-Cookie': `accessToken=mock-access-token-${Date.now()}; Path=/; HttpOnly, refreshToken=mock-refresh-token-${Date.now()}; Path=/; HttpOnly`,
    },
  });
};

export const signOut: HttpResponseResolver = async () => {
  return HttpResponse.json(null, {
    status: 302,
    headers: {
      Location: '/',
      'Set-Cookie': `accessToken=; Path=/; HttpOnly, refreshToken=; Path=/; HttpOnly`,
    },
  });
};
