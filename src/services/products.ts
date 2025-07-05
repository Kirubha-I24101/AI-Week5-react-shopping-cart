import axios from 'axios';
import { IGetProductsResponse } from 'models';

const isProduction = process.env.NODE_ENV === 'production';

// Loading and error state management
export let isLoading = false;
export let lastError: string | null = null;

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const getProducts = async () => {
  isLoading = true;
  lastError = null;
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    try {
      let response: IGetProductsResponse;

      if (isProduction) {
        response = await axios.get(
          'https://react-shopping-cart-67954.firebaseio.com/products.json'
        );

        // HTTP status code validation
        if (response.status < 200 || response.status >= 300) {
          throw new Error(`Unexpected response status: ${response.status}`);
        }
      } else {
        response = require('static/json/products.json');
      }

      const { products } = response.data || [];
      isLoading = false;
      return products;
    } catch (error: any) {
      attempt += 1;

      // Network error handling
      if (error.response) {
        // Server responded with a status outside 2xx
        lastError = `Server error: ${error.response.status} - ${error.response.statusText}`;
      } else if (error.request) {
        // Request was made but no response received
        lastError = 'Network error: No response from server. Please check your connection.';
      } else {
        // Something else happened
        lastError = `Unexpected error: ${error.message || 'Unknown error'}`;
      }

      if (attempt < MAX_RETRIES) {
        await delay(RETRY_DELAY_MS);
      } else {
        isLoading = false;
        throw new Error(
          lastError ||
            'Failed to fetch products after multiple attempts. Please try again later.'
        );
      }
    }
  }
  isLoading = false;
};
