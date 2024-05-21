import { useState, useEffect } from 'react';

const trueValidator = () => true;

const useFetch = ({url, options = {}, validator = trueValidator}) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (validator()) {
          if (!loading && response === null && error === null) { 
            setLoading(true);
            const res = await fetch(url, options);
            const json = await res.json();
            setResponse(json);
            setLoading(false);
          }
        } else {
          setResponse(null);
          setError(null);
        }
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [url, options, validator]);

  return { response, error, loading };
}

export { useFetch };