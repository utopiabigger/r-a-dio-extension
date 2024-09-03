class ApiClient {
  static async fetchMainData() {
    try {
      return await this.fetchData('https://r-a-d.io/api');
    } catch (error) {
      console.error('Error fetching main data:', error);
      throw error;
    }
  }

  static async fetchData(url, method = 'GET') {
    const response = await fetch(url, { method });
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    return await response.json();
  }
}

export default ApiClient;