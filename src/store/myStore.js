import { defineStore } from "pinia";
import axios from "axios";

export const useGameStore = defineStore("store", {
  state: () => ({
    baseUrl: "http://127.0.0.1:8000/",
  }),
  axiosHeader: {
    Authorization: "Bearer ",
  },
  actions: {
    async fetch(url) {
      try {
        const response = await axios.get(this.baseUrl + url, this.axiosHeader);
        console.log(url + " reached");
        return response.data;
      } catch (error) {
        if (error.response) {
          // Request made and server responded
          alert("Error: unable to fetch " + url);
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
      }
    },
    async delete(url) {
      try {
        const response = await axios.delete(this.baseUrl + url, this.axiosHeader);
        console.log(url + " deleted");
        return response.data;
      } catch (error) {
        if (error.response) {
          // Request made and server responded
          alert("Error: unable to delete " + url);
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
      }
    },
    async post(url, input) {
      try {
        const response = await axios.post(this.baseUrl + url, input, this.axiosHeader);
        console.log("reached " + url);
        return response.data;
      } catch (error) {
        if (error.response) {
          // Request made and server responded
          alert("Error: unable to reach " + url);
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
      }
    },
    async getMapById(id) {
      try {
        const response = await axios.get(this.baseUrl + `map/${id}`, this.axiosHeader);
        console.log("Map retrieved");
        return response.data;
      } catch (error) {
        if (error.response) {
          alert("Error: unable to fetch " + url);
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
      }
    },
  },
});
