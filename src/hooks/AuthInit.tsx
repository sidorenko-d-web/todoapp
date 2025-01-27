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
        const init_data
         = "query_id=AAEJqZMZAAAAAAmpkxlQSVp7&user=%7B%22id%22%3A429107465%2C%22first_name%22%3A%22Kiryl%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22UseNameKiryl%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FRBi5fqzvkaFYBv7fi7y6iDpojRJtZPm9dHKm_PjZ-5U.svg%22%7D&auth_date=1737752793&signature=DT6xPhJ49yglmy9tZEFqnunJEYhWLk--4yqWLHRIh1NkyK1hLWtm-KqH8nEclEQz5s-PBFMeBq-GejoGnqI2BQ&hash=b9e05e787f2c5745d21d8adb25f9e3f735d7060bd6767fde70e984d3f613b5f6";

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