/**
 * Shared client-side cache for autocomplete data to prevent redundant API calls
 * during navigation or multiple component mounts.
 */

let cachedData: any = null;
let fetchPromise: Promise<any> | null = null;

export async function getAutocompleteData() {
  // 1. Return cache if available
  if (cachedData) return cachedData;

  // 2. If a fetch is already in progress, return that same promise
  if (fetchPromise) return fetchPromise;

  // 3. Otherwise, start a new fetch
  fetchPromise = fetch("/api/couriers/autocomplete")
    .then(async (res) => {
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      cachedData = json.data || json;
      return cachedData;
    })
    .catch((err) => {
      console.error("Autocomplete fetch error:", err);
      return { fromParties: [], toParties: [], destinations: [] };
    })
    .finally(() => {
      // Clear the promise so if it failed or succeeded we can try again if cache is empty
      // but usually we keep cachedData forever in the session.
      fetchPromise = null;
    });

  return fetchPromise;
}

/**
 * Manually clear the cache (e.g. after a new entry is added to ensure fresh suggestions)
 */
export function clearAutocompleteCache() {
  cachedData = null;
}
