import { useState } from 'react';

export default function useToken() {
  const getToken = () => {
    const userToken = localStorage.getItem('token');
    
    return userToken?.token
  };

  const getName = () => {
    const userName = localStorage.getItem('name');

    return userName?.name
  }

  const [token, setToken] = useState(getToken());
  const [name, setName] = useState(getName());

  const saveToken = userToken => {
    localStorage.setItem('token', userToken);

    setToken(userToken);
  };

  const saveName = userName => {
    localStorage.setItem('name', userName);

    setName(userName);
  };

  return {
    setToken: saveToken,
    token,
    setName: saveName,
    name
  }
}