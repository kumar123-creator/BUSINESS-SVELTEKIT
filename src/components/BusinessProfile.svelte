<script>
  import { onMount } from 'svelte';
  import { fetchCurrencyAndTimezones,  fetchCountryData, fetchCountries } from '$lib/api';
  import { Input, Label, Select } from "flowbite-svelte";
  import 'flowbite/dist/flowbite.css';
  import { MultiSelect } from 'flowbite-svelte';
  import intlTelInput from "intl-tel-input";
  import "intl-tel-input/build/css/intlTelInput.css";

  let id = "";
    let name = "";
    let address = {
        addressLine: "",
        cityName: "",
        regionName: "",
        postCode: "",
        countryCode: "",
        latitude: "",
        longitude: "",
    };
    let phone = '';
    let website = "";
    let currencyCode = "gb";
    let preferredDateformat = "";
    let timeZone = "";
    let mobilePreferences = {
        preferredCountryCode: "",
        preferredCountries: "",
    };
    /**
   * @type {any[]}
   */
    let currencyOptions = [];
    let selectedTimezone;
    let reactiveTimezoneOptions = [];
    let imageUrl = null;
    let dataFetched = false;
    let countryOptions = '';
    let preferredCountryCode = [];
    let preferredCountryCode1 = [];
    let selectedLabels = [];
    let countries = [];
    let iti;
    let preferredCountries1 = [];
    let selectedCodes = [];
    let preferredCountries = [];

    async function fetchData() {
        try {
            const response = await fetch("https://api.recruitly.io/api/business/profile?apiKey=TEST45684CB2A93F41FC40869DC739BD4D126D77");
            const data = await response.json();
            console.log(data);

            // Populate the form fields with the fetched data
            id = data.id;
            name = data.name;
            address = {
                addressLine: data.address.addressLine,
                cityName: data.address.cityName,
                regionName: data.address.regionName,
                postCode: data.address.postCode,
                countryCode: data.address.countryCode,
                latitude: data.address.latitude,
                longitude: data.address.longitude,
            };

            console.log(phone);
            website = data.website;
            currencyCode = data.currencyCode.code;
            console.log(currencyCode);
            preferredDateformat = data.preferredDateFormat;
            timeZone = data.timeZone;
            console.log(timeZone);
            preferredCountryCode = data.mobilePreferences.preferredCountryCode,
            preferredCountries = data.mobilePreferences.preferredCountries;
            selectedLabels = preferredCountries.split(",");

            preferredCountries1 = preferredCountries.toUpperCase();
            preferredCountryCode1 = preferredCountryCode.toUpperCase();
            console.log(preferredCountries1);
            dataFetched = true;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    

  onMount(async () => {
    await fetchData();
    fetchCurrencyAndTimezones();
    fetchImage();
    fetchCountryData();
    fetchCountries();

    

    const inputElement = document.querySelector('#phone-input');
        iti = intlTelInput(inputElement, {
            utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@16.0.3/build/js/utils.js',
            separateDialCode: true,
        });

        iti.setNumber(phone);
        iti.setPlaceholderNumberType('FIXED_LINE');

        inputElement.addEventListener('countrychange', handleCountryChange);
        inputElement.addEventListener('input', handleInput);
  });

  const handleCountryChange = () => {
        phone = iti.getNumber(intlTelInputUtils.numberFormat.E164);
    };

    const handleInput = () => {
        phone = iti.getNumber(intlTelInputUtils.numberFormat.INTERNATIONAL);
    };

    const handleLogoClick = () => {
        const inputElement = document.createElement("input");
        inputElement.type = "file";
        inputElement.accept = "image/*";
        inputElement.addEventListener("change", uploadImage);
        inputElement.click();
    };

    const uploadImage = async (event) => {
        const apiKey = "TEST45684CB2A93F41FC40869DC739BD4D126D77";
        const uploadUrl = `https://api.recruitly.io/api/image/upload?apiKey=${apiKey}`;
        const formData = new FormData();
        formData.append("file", event.target.files[0]);
        formData.append("profilePic", "true");
        formData.append("type", "TENANT");
        try {
            const response = await fetch(uploadUrl, {
                method: "POST",
                headers: {
                    Cookie: "SESSION=NDU1ZDRjNmUtNDg1ZC00NjVhLWJhNmItN2NlZmE4NzYxMWRm",
                    "Cache-Control": "no-cache, no-store, must-revalidate",
                },
                body: formData,
            });
            const data = await response.json();
            imageUrl = data.logo.url;
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };
	async function saveFormData() {
        const Update = {    
            id,
            name,
            address: {
                addressLine: address.addressLine,
                cityName: address.cityName,
                regionName: address.regionName,
                postCode: address.postCode,
                countryCode: address.countryCode,
                latitude: address.latitude,
                longitude: address.longitude,
            },
            phone,
            website,
            currencyCode: { code: currencyCode },
            preferredDateformat,
            timeZone,
            preferredCountries: selectedLabels,
            preferredCountryCode: preferredCountryCode1.toLowerCase(),
        };

        try {
            const response = await fetch('https://api.recruitly.io/api/business/profile/save?apiKey=TEST45684CB2A93F41FC40869DC739BD4D126D77', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(Update),
            });
            const updatedData = await response.json();
            console.log("Updated data from API:", updatedData);
            alert("Business Profile Updated successfully");
        } catch (error) {
            console.error("Error updating data:", error);
        }
    };

    const handleSelection = (event) => {
        if (event && event.detail && event.detail.value) {
            selectedCodes = event.detail.value.map((selectedCountry) =>
                selectedCountry.value.toLowerCase()
            );
        }
    };

   async function fetchImage() {
    const apiKey = "TEST45684CB2A93F41FC40869DC739BD4D126D77";
    const uniqueParam = Date.now();
    const apiUrl = `https://api.recruitly.io/api/business/profile?apiKey=${apiKey}&timestamp=${uniqueParam}`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        imageUrl = data.logo.url;
    } catch (error) {
        console.error("Error fetching image:", error);
    }
};

 
</script>
<style>
  .container {
      max-width: 600px;
      margin: 0 auto;
  }

  .form-container {
      margin-top: 2rem;
      padding: 1rem;
      border: 1px solid #ccc;
      border-radius: 1.25rem;
  }

  .form-container h2 {
      text-align: center;
      font-weight: bold;
      margin-bottom: 1rem;
      font-size: x-large;
      color:blue;
  }

  .logo {
  cursor: pointer;
  max-width: 100%;
  height: auto;
}

.logo-container {
  cursor: pointer;
  max-width: 100%;
  height: auto;

}
</style>
<main class="container">
  <form class="form-container">
  <div class="grid gap-6 mb-6 md:grid-cols-1">
      <div>
          <h2>BUSINESS PROFILE</h2>
          <hr>
      </div>
  </div>
  <div class="mb-6 logo-container">
  <Label for="company_logo" class="mb-2">Company Logo</Label>
  <img id="uploadedImage" src="{imageUrl}" alt="Logo" on:click={handleLogoClick} style="cursor: pointer; max-width: 100px;" />
  
  </div>
  <div class="mb-6">
  <Label for="company_name" class="mb-2">Company Name</Label>
  <Input type="text" id="name" bind:value={name} required />
  
  </div>
  <div class="mb-6">
  <Label for="address" class="mb-2">Address</Label>
  <Input type="text" id="address" bind:value={address.cityName} required />
  </div>
  
  
  <div>
  <div class="mb-6">
  <label for="phone" class="mb-2" >Phone</label>
  <input type="tel" id="phone-input" on:input={handleInput}  class="form-select  block w-full py-2.5 pl-3 pr-10 text-base border border-gray-300 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white dark:focus:ring-gray-700 dark:focus:border-gray-600" style="width:500px;" />
    </div>
  </div>
  
  <div class="mb-6">
  <Label for="website" class="mb-2">Website</Label>
  <Input type="url" id="website" bind:value={website} required />
  </div>
  
  <div class="mb-6">
  <label for="currency" class="block text-sm font-medium text-gray-700 dark:text-white">Currency:</label>
  <div class="relative mt-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700">
  <select id="currency" bind:value={currencyCode} required class="block w-full py-2.5 pl-3 pr-10 text-base border-transparent bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white dark:focus:ring-gray-700 dark:focus:border-gray-600">
              {#each currencyOptions as currency}
  <option value={currency.value}>{currency.label}</option>
              {/each}
  </select>
  </div>
  </div>
  
  <div class="mb-6">
      <label for="timezone" class="block text-sm font-medium text-gray-700 dark:text-white">Timezone</label>
      <div class="relative mt-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700">
      <select id="timezone" bind:value={timeZone} required class="block w-full py-2.5 pl-3 pr-10 text-base border-transparent bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white dark:focus:ring-gray-700 dark:focus:border-gray-600">
                  {#each reactiveTimezoneOptions as timezone }
      <option value={timezone.code}>{timezone.name}</option>
                  {/each}
      </select>
      </div>
      </div>

  
  <label for="preferredDateFormat" class="block text-sm font-medium text-gray-700 dark:text-white">Preferred Date Format</label>
  <div class="relative mt-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700">
  <select id="preferredDateFormat" bind:value={preferredDateformat} required class="block w-full py-2.5 pl-3 pr-10 text-base border-transparent bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white dark:focus:ring-gray-700 dark:focus:border-gray-600">
  <option value="default" >Pretty (e.g., 1 Day Ago/2 Week Ago, etc.)</option>
  <option >Date only (e.g., 12/31/2020)</option>
  <option >Date and Time (e.g., 12/31/2020 15:00:00)</option>
  <option >Date and Time (e.g., 12/31/2020 03:00PM)</option>
  </select>
  </div>
  
   
  <div class="mb-3">
      <Label for="country" class="mb-2">Default Country To Display</Label>
      <Select class="block w-full rounded-lg bg-white border border-gray-300 text-gray-700 focus:outline-none focus:border-indigo-500" bind:value={preferredCountryCode1} on:change={(event) => {
              preferredCountryCode1 = event.target.value.toUpperCase();}}>
              {#each countryOptions as country1}
              <option value={country1.value}>{country1.label}</option> 
               {/each}
      </Select>
      </div>
  
       <div class="mb-3">
       <Label class="mb-2">Preferred Countries To Display on Top</Label>
       {#if countries.length > 0}
       <MultiSelect items={countries} bind:value={selectedLabels} on:change={handleSelection} />
       {/if}
      </div>
  
   <div class="mb-6">
  <button type="button" on:click={saveFormData} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">update profile</button>
  </div>
  </form>
  </main>