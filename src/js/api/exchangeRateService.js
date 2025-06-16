// --- IMPORTANT ---
// Replace with your own free API key from https://www.exchangerate-api.com/
// For production, use environment variables.
const EXCHANGE_RATE_API_KEY = "2ff00b7f40e6e5aa85f509fa";

// --- DOM Elements ---
const fromCurrencySelect = document.getElementById("from-currency");
const toCurrencySelect = document.getElementById("to-currency");
const amountInput = document.getElementById("amount");
const swapButton = document.getElementById("swap-currencies");
const conversionResultDiv = document.getElementById("conversion-result");
const converterForm = document.getElementById("converter-form");
const converterLoader = document.getElementById("converter-loader");

/**
 * Fetches the list of supported currency codes.
 */
async function fetchCurrencies() {
  converterForm.style.display = "none";
  converterLoader.style.display = "block";
  try {
    const url = `https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/codes`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Could not fetch currency codes.");

    const data = await response.json();
    if (data.result === "success") {
      populateCurrencyDropdowns(data.supported_codes);
    } else {
      throw new Error("API response was not successful.");
    }
  } catch (error) {
    // console.error("Failed to fetch currencies:", error);
    conversionResultDiv.innerHTML = "Could not load currencies.";
  } finally {
    converterForm.style.display = "block";
    converterLoader.style.display = "none";
  }
}

/**
 * Populates the currency select dropdowns.
 * @param {Array} codes - Array of supported currency codes.
 */
function populateCurrencyDropdowns(codes) {
  codes.forEach(([code, name]) => {
    const optionFrom = document.createElement("option");
    optionFrom.value = code;
    optionFrom.textContent = `${code} - ${name}`;
    fromCurrencySelect.appendChild(optionFrom);

    const optionTo = document.createElement("option");
    optionTo.value = code;
    optionTo.textContent = `${code} - ${name}`;
    toCurrencySelect.appendChild(optionTo);
  });

  fromCurrencySelect.value = "USD";
  toCurrencySelect.value = "EUR";

  convertCurrency(); // Perform initial conversion
}

/**
 * Fetches the exchange rate and calculates the conversion.
 */
async function convertCurrency() {
  const amount = amountInput.value;
  const fromCurrency = fromCurrencySelect.value;
  const toCurrency = toCurrencySelect.value;

  if (!amount || !fromCurrency || !toCurrency) return;

  conversionResultDiv.textContent = "Converting...";

  try {
    const url = `https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/pair/${fromCurrency}/${toCurrency}/${amount}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Conversion failed.");

    const data = await response.json();
    if (data.result === "success") {
      const result = data.conversion_result.toFixed(2);
      const rate = data.conversion_rate;
      conversionResultDiv.innerHTML = `
                <span>${amount} ${fromCurrency} =</span>
                <strong style="color: var(--secondary-color);">${result} ${toCurrency}</strong>
                <div style="font-size: 0.9rem; color: #666; margin-top: 5px;">1 ${fromCurrency} = ${rate} ${toCurrency}</div>
            `;
    } else {
      throw new Error(data["error-type"] || "An unknown error occurred.");
    }
  } catch (error) {
    // console.error("Currency conversion error:", error);
    conversionResultDiv.textContent = "Error converting currency.";
  }
}

/**
 * Sets up event listeners for the converter controls.
 */
export function handleConverterControls() {
  swapButton.addEventListener("click", () => {
    [fromCurrencySelect.value, toCurrencySelect.value] = [
      toCurrencySelect.value,
      fromCurrencySelect.value,
    ];
    convertCurrency();
  });

  converterForm.addEventListener("input", convertCurrency);
}

/**
 * Initializes the converter module by fetching currencies.
 */
export function initConverter() {
  fetchCurrencies();
}
