  
export const load = async ({fetch}) => {
    const response = await fetch("https://api.recruitly.io/api/business/profile?apiKey=TEST45684CB2A93F41FC40869DC739BD4D126D77");
    const profiledata= await response.json();
    const products = profiledata.products
    console.log(products);
    
   return {
    profiledata
     };
   };