// useFetch.test.js

import { renderHook } from '@testing-library/react-hooks';
import { useFetch } from '../use-fetch.js';

describe('useFetch hook', () => {
  it('fetches data successfully', async () => {
    const mockUrl = 'https://api.sampleapis.com/coffee/hot/1';
    const mockData = {
      "title": "Black Coffee",
      "description": "Svart kaffe är så enkelt som det kan bli med malda kaffebönor dränkta i hett vatten, serverat varmt. Och om du vill låta fancy kan du kalla svart kaffe med sitt rätta namn: café noir.",
      "ingredients": [
        "Coffee"
      ],
      "image": "https://images.unsplash.com/photo-1494314671902-399b18174975?auto=format&fit=crop&q=80&w=1887&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "id": 1
    };

    const mockFetch = jest.fn().mockResolvedValueOnce(new Response(JSON.stringify(mockData)));
    fetch = mockFetch; // Override the global fetch function

    const { result, waitForNextUpdate } = renderHook(() => useFetch({ url: mockUrl }));

    await waitForNextUpdate(); // Wait for the fetch to complete

    expect(result.current.loading).toBe(false); // Loading should be false after fetch
    expect(result.current.error).toBe(null); // No error
    expect(result.current.response).toEqual(mockData); // Response should match mock data
  });

  it('fetches with bad request', async () => {
    const mockUrl = 'https://api.sampleapis.com/coffee/hotr';
    const mockData = {
      "error": 500,
      "message": "Unexpected data sent in! GET NOT accepted. Please send valid data next time!",
      "received": {}
    };

    const mockFetch = jest.fn().mockResolvedValueOnce(new Response(JSON.stringify(mockData)));
    fetch = mockFetch; // Override the global fetch function

    const { result, waitForNextUpdate } = renderHook(() => useFetch({ url: mockUrl }));

    await waitForNextUpdate(); // Wait for the fetch to complete

    expect(result.current.loading).toBe(false); // Loading should be false after fetch
    expect(result.current.error).toBe(null); // No error
    expect(result.current.response).toEqual(mockData); // Response should match mock data
  });

  it('handles errors during fetch', async () => {
    const mockUrl = 'https://api.sampleapis.com/coffee/hot/1';
    const mockError = new Error('Failed to fetch');
      

    // Mock fetch behavior to throw an error
    const mockFetch = jest.fn().mockRejectedValueOnce(mockError);
    fetch = mockFetch;

    const { result, waitForNextUpdate } = renderHook(() => useFetch({ url: mockUrl}));

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false); // Loading should be false after fetch
    expect(result.current.error).toEqual(mockError); // Error should match mock error
    expect(result.current.response).toBe(null); // No response
  });

  it('skips fetch if validator returns false', () => {
    const mockUrl = 'https://api.sampleapis.com/coffee/hot/1';
    const mockValidator = jest.fn().mockReturnValueOnce(false);
    const fetch = jest.fn();
    const { result } = renderHook(() => useFetch({ url: mockUrl, validator: mockValidator }));

    expect(mockValidator).toHaveBeenCalledTimes(1); // Validator should be called
    expect(fetch).not.toHaveBeenCalled(); // Fetch shouldn't be called
    expect(result.current.loading).toBe(false); // No loading state
    expect(result.current.error).toBe(null); // No error
    expect(result.current.response).toBe(null); // No response
  });
});
