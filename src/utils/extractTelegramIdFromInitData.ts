export function extractTelegramIdFromInitData(initDataString: string) {
  try {
    // Find the user data portion which starts with user%3D
    const userPart = initDataString.split('&')[0];

    // Remove the user%3D prefix to get the encoded user data
    const encodedUserData = userPart.replace('user%3D', '');

    // Decode the string twice (it's double URL-encoded)
    const decodedOnce = decodeURIComponent(encodedUserData);
    const userJSON = decodeURIComponent(decodedOnce);

    // Extract only the user JSON part (before any & character)
    const cleanUserJSON = userJSON.split('&')[0];

    // Parse the JSON to get the user object
    const userData = JSON.parse(cleanUserJSON);

    // Return the ID
    return Number(userData.id);
  } catch (error) {
    // Fallback to regex extraction if JSON parsing fails
    try {
      const decodedOnce = decodeURIComponent(initDataString.replace('user%3D', ''));
      const userJSON = decodeURIComponent(decodedOnce);
      const idMatch = userJSON.match(/"id":(\d+)/);

      if (idMatch && idMatch[1]) {
        return idMatch[1];
      }
    } catch (e) {
      console.error('Failed to extract user ID:', e);
    }
    return null;
  }
}