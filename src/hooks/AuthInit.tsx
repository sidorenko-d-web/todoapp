import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSignInMutation } from '../redux';

type AuthInitProps = {
  children: React.ReactNode;
};

export function AuthInit({ children }: AuthInitProps) {
  const [signIn, { isLoading, isError, error }] = useSignInMutation();
  const [isAuthDone, setIsAuthDone] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const ipData = await axios
          .get('https://ipapi.co/json/')
          .then(res => res.data);

        // const init_data = window.Telegram.WebApp.initData;
        const init_data = `query_id%3DAAExhbpYAAAAADGFuljtpDcK%26user%3D%257B%2522id%2522%253A1488618801%252C%2522first_name%2522%253A%2522Viktor%2522%252C%2522last_name%2522%253A%2522St%2522%252C%2522username%2522%253A%2522STR_Viktor%2522%252C%2522language_code%2522%253A%2522ru%2522%252C%2522allows_write_to_pm%2522%253Atrue%252C%2522photo_url%2522%253A%2522https%253A%255C%252F%255C%252Ft.me%255C%252Fi%255C%252Fuserpic%255C%252F320%255C%252Fyt_vHT436Zb5sbv-Pui-oE8AJ9OcsFTJ2CotbwzNVoI.svg%2522%257D%26auth_date%3D1737744276%26signature%3DXNulVioOrxVgpto5z82Q8l39WypzjusSBMXdWUY4O0GQaKUrIBXx_UCLV36DP1xhCpRFCNqPxVXUh4fcqm7eDQ%26hash%3D3e6b0382dee254367ef0920ba5b2f32b8545c19d6238140e8609459c45079d6c&tgWebAppVersion=7.10&tgWebAppPlatform=web&tgWebAppThemeParams=%7B"bg_color"%3A"%23212121"%2C"button_color"%3A"%238774e1"%2C"button_text_color"%3A"%23ffffff"%2C"hint_color"%3A"%23aaaaaa"%2C"link_color"%3A"%238774e1"%2C"secondary_bg_color"%3A"%23181818"%2C"text_color"%3A"%23ffffff"%2C"header_bg_color"%3A"%23212121"%2C"accent_text_color"%3A"%238774e1"%2C"section_bg_color"%3A"%23212121"%2C"section_header_text_color"%3A"%238774e1"%2C"subtitle_text_color"%3A"%23aaaaaa"%2C"destructive_text_color"%3A"%23ff595a"%7D`;

        const authResponse = await signIn({
          init_data: init_data,
          ip: ipData.ip,
          country: ipData.country,
        }).unwrap();
        console.log(authResponse)


        localStorage.setItem('access_token', authResponse.access_token);
        localStorage.setItem('refresh_token', authResponse.refresh_token);

        setIsAuthDone(true);
      } catch (err) {

        console.error('Ошибка при авторизации:', err);
        setIsAuthDone(true);
      }
    })();
  }, [signIn]);

  if (isLoading && !isAuthDone) {
    return <div>Авторизация...</div>;
  }

  if (isError) {
    return <div style={{ color: 'red' }}>Ошибка при авторизации: {String(error)}</div>;
  }
  return <>{children}</>;
}
