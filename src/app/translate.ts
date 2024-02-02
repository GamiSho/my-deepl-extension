type Result = {
  translations: [
    {
      detectedSourceLanguage: string;
      text: string;
    }
  ];
};

export async function translate(text: string, targetLang: string): Promise<string> {
  const API_KEY = process.env.API_KEY as string;
  const API_URL = process.env.API_URL as string;
  const params = new URLSearchParams({
    auth_key: API_KEY,
    text,
    target_lang: targetLang,
  });
  const res = await fetch(`${API_URL}?${params.toString()}`);
  const json: Result = await res.json();
  return json.translations[0].text;
}
