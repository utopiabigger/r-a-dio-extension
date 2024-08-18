class ApiClient {
  static async fetchMainData() {
    return this.fetchData('https://r-a-d.io/api');
  }

  static async fetchData(url, method = 'GET') {
    const response = await fetch(url, { method });
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    return await response.json();
  }
}