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
        const ipData = await axios.get('https://ipapi.co/json/').then(res => res.data);

        // const init_data = window.Telegram.WebApp.initData;
        const init_data = `query_id%3DAAEYoFtBAAAAABigW0EWkWAe%26user%3D%257B%2522id%2522%253A1096523800%252C%2522first_name%2522%253A%2522%25D0%2594%25D0%25BC%25D0%25B8%25D1%2582%25D1%2580%25D0%25B8%25D0%25B9%2522%252C%2522last_name%2522%253A%2522%25D0%25A1%25D0%25B8%25D0%25B4%25D0%25BE%25D1%2580%25D0%25B5%25D0%25BD%25D0%25BA%25D0%25BE%2522%252C%2522username%2522%253A%2522big_banka%2522%252C%2522language_code%2522%253A%2522ru%2522%252C%2522allows_write_to_pm%2522%253Atrue%252C%2522photo_url%2522%253A%2522https%253A%255C%252F%255C%252Ft.me%255C%252Fi%255C%252Fuserpic%255C%252F320%255C%252FUIap5sUEQ_kQmYD3jRj-ne9SxNjI5c3BYBgY6A_pxBk.svg%2522%257D%26auth_date%3D1737975633%26signature%3DywdBa29d1o-ds-geAR8bjU8MqzPiXhLvmBwchP0bUcm5L7hmeD0-URGP_sKYz5aTjl_4uaeOpy-KzR5YWq-3CQ%26hash%3D30aea7d2c9c9f31ce1bafbb35ed015f824d3838656b14f162d3d28edf7fcd264&tgWebAppVersion=8.0&tgWebAppPlatform=weba&tgWebAppThemeParams=%7B"bg_color"%3A"%23212121"%2C"text_color"%3A"%23ffffff"%2C"hint_color"%3A"%23aaaaaa"%2C"link_color"%3A"%238774e1"%2C"button_color"%3A"%238774e1"%2C"button_text_color"%3A"%23ffffff"%2C"secondary_bg_color"%3A"%230f0f0f"%2C"header_bg_color"%3A"%23212121"%2C"accent_text_color"%3A"%238774e1"%2C"section_bg_color"%3A"%23212121"%2C"section_header_text_color"%3A"%23aaaaaa"%2C"subtitle_text_color"%3A"%23aaaaaa"%2C"destructive_text_color"%3A"%23e53935"%7D`;

        const authResponse = await signIn({
          init_data: init_data,
          ip: ipData.ip,
          country: ipData.country,
        }).unwrap();
        console.log(authResponse);

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
