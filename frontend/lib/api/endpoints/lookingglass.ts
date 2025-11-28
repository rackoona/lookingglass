import { LookingGlassRequest, StreamOptions } from '../types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Generic helper to handle streaming responses
 */
async function handleStreamResponse(
  endpoint: string,
  data: LookingGlassRequest,
  options: StreamOptions,
  baseUrl?: string
) {
  const url = baseUrl || BASE_URL;
  try {
    const response = await fetch(`${url}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
      signal: options.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    while (true) {
      const { value, done } = await reader.read();
      
      if (done) {
        break;
      }
      
      const chunk = decoder.decode(value, { stream: true });
      options.onData(chunk);
    }
    
    if (options.onComplete) {
      options.onComplete();
    }
  } catch (error: any) {
    if (error.name === 'AbortError') {
      // Stream cancelled by user
      return;
    }
    if (options.onError) {
      options.onError(error instanceof Error ? error : new Error(String(error)));
    }
  }
}

export const lookingGlass = {
  ping: (target: string, options: StreamOptions, baseUrl?: string) => 
    handleStreamResponse('/lookingglass/ping', { target }, options, baseUrl),

  ping6: (target: string, options: StreamOptions, baseUrl?: string) => 
    handleStreamResponse('/lookingglass/ping6', { target }, options, baseUrl),

  traceroute: (target: string, options: StreamOptions, baseUrl?: string) => 
    handleStreamResponse('/lookingglass/traceroute', { target }, options, baseUrl),

  traceroute6: (target: string, options: StreamOptions, baseUrl?: string) => 
    handleStreamResponse('/lookingglass/traceroute6', { target }, options, baseUrl),

  mtr: (target: string, options: StreamOptions, baseUrl?: string) => 
    handleStreamResponse('/lookingglass/mtr', { target }, options, baseUrl),

  mtr6: (target: string, options: StreamOptions, baseUrl?: string) => 
    handleStreamResponse('/lookingglass/mtr6', { target }, options, baseUrl),
};

