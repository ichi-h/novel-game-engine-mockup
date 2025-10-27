/**
 * Middleware for intercepting audio fetch requests
 */
export interface AudioFetchMiddleware {
  /**
   * Called before fetch request
   * Can modify request or cancel it by returning null
   */
  beforeFetch?: (
    url: string,
    init?: RequestInit,
  ) => Promise<{ url: string; init?: RequestInit } | null>;

  /**
   * Called after fetch response
   * Can transform the response data
   */
  afterFetch?: (url: string, data: ArrayBuffer) => Promise<ArrayBuffer>;
}

/**
 * Interface for fetching audio resources
 * Follows Fetch API signature: fetch(url, init?)
 */
export interface IAudioFetcher {
  /**
   * Fetch audio resource from URL
   * @param url - Resource URL
   * @param init - Optional RequestInit (headers, method, etc.)
   * @returns ArrayBuffer containing audio data
   */
  fetch(url: string, init?: RequestInit): Promise<ArrayBuffer>;
}

/**
 * Default implementation of IAudioFetcher
 */
export class AudioFetcher implements IAudioFetcher {
  private middlewares: AudioFetchMiddleware[] = [];

  /**
   * Add middleware to the fetcher
   */
  addMiddleware(middleware: AudioFetchMiddleware): void {
    this.middlewares.push(middleware);
  }

  /**
   * Fetch audio resource following Fetch API signature
   */
  async fetch(url: string, init?: RequestInit): Promise<ArrayBuffer> {
    let currentUrl = url;
    let currentInit = init;

    // Execute beforeFetch middlewares
    for (const middleware of this.middlewares) {
      if (middleware.beforeFetch) {
        const result = await middleware.beforeFetch(currentUrl, currentInit);
        if (result === null) {
          throw new Error('Request cancelled by middleware');
        }
        currentUrl = result.url;
        currentInit = result.init;
      }
    }

    // Fetch resource using Fetch API
    const response = await fetch(currentUrl, currentInit);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    let data = await response.arrayBuffer();

    // Execute afterFetch middlewares
    for (const middleware of this.middlewares) {
      if (middleware.afterFetch) {
        data = await middleware.afterFetch(currentUrl, data);
      }
    }

    return data;
  }
}
