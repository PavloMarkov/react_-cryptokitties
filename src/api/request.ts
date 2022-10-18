const BASE_URL = 'https://ftl-cryptokitties.fly.dev/api/crypto_kitties';

function request<T>(
  UIdata: string,
): Promise<T> {
  const options: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
  };

  return fetch(BASE_URL + UIdata, options)
    .then(response => {
      if (!response.ok) {
        throw new Error();
      }

      return response.json();
    });
}

export const client = {
  getDataFromServer: <Response>(UIdata: string) => request<Response>(UIdata),
};
