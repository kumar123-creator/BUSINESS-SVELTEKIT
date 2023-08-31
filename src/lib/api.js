    export let currencyOptions = [];
    export let selectedTimezone;
    export let reactiveTimezoneOptions = [];
    export let countries = [];
    export let countryOptions = '';
    export let imageUrl = null;
    export let selectedCodes = [];
    export let selectedLabels = [];
   
export async function fetchCurrencyAndTimezones() {
    try {
        const currencyResponse = await fetch('https://api.recruitly.io/api/lookup/currency?apiKey=TEST27306FA00E70A0F94569923CD689CA9BE6CA');
        const currencyData = await currencyResponse.json();

        if (Array.isArray(currencyData.data)) {
            currencyOptions = currencyData.data.map((currency) => ({
                value: currency.code,
                label: currency.name,
            }));
            console.log('Currency Options:', currencyOptions);
        } else {
            console.error('Invalid currency data format:', currencyData);
        }

        const timezoneResponse = await fetch('https://api.recruitly.io/api/lookup/timezone?apiKey=TEST27306FA00E70A0F94569923CD689CA9BE6CA');
        const timezoneData = await timezoneResponse.json();

        if (Array.isArray(timezoneData.data)) {
            reactiveTimezoneOptions = timezoneData.data.map((timezone, index) => ({
                ...timezone,
                id: index + 1,
            }));
            selectedTimezone = reactiveTimezoneOptions.length > 0 ? reactiveTimezoneOptions[0].code : null;
            console.log('Timezone Options:', reactiveTimezoneOptions);
        } else {
            console.error('Invalid timezone data format:', timezoneData);
        }
    } catch (error) {
        console.error('Error fetching options:', error);
    }
};

    
export async function fetchCountryData() {
    try {
        const response = await fetch(
            "https://api.recruitly.io/api/lookup/countries?apiKey=TEST69513C4B379BD5594CD0AAC9ECA436CA2C83"
        );
        const responseData = await response.json();
        if (Array.isArray(responseData.data)) {
            countryOptions = responseData.data.map((country) => ({
                value: country.code,
                label: country.name,
            }));
            console.log("Country API response:", responseData);
        } else {
            console.error("Invalid country data format:", responseData);
        }
    } catch (error) {
        console.error("Error fetching country options:", error);
    }
};
    
export async function fetchCountries() {
    try {
        const response = await fetch(
            "https://api.recruitly.io/api/lookup/countries?apiKey=TEST69513C4B379BD5594CD0AAC9ECA436CA2C83"
        );
        const responseData = await response.json();
        if (Array.isArray(responseData.data)) {
            countries = responseData.data.map((country) => ({
                name: country.name,
                value: country.code.toLowerCase(),
            }));
            selectedCodes = countries
                .filter((country) => selectedLabels.includes(country.value))
                .map((selectedCountry) => selectedCountry.value);
        } else {
            console.error("Invalid API response format:", responseData);
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};
    
