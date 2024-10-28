import axios from "axios";

// Replace 'YOUR_UNSPLASH_API_KEY' with your actual Unsplash API key
const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY as string;
const defaultImg = 'https://via.placeholder.com/150'; // Fallback image URL

export function fetchImageByTitle(title: string): Promise<string> {
  return axios.get('https://api.unsplash.com/search/photos', {
    params: {
      query: title,
      per_page: 1, // Number of images to return
    },
    headers: {
      Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
    },
  })
    .then(response => {
      if (response.data.results.length > 0) {
        return response.data.results[0].urls.small; // Return the URL if an image is found
      } else {
        throw new Error('No image found');
      }
    })
    .catch(error => {
      console.error('Error fetching image:', error.message);
      return defaultImg; // Return the fallback image if there's an error
    });
}

// Example usage with Promises

