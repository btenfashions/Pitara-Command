/**
 * PITARA COMMAND CENTER v3
 *
 * CORE MODULES:
 * - Orders & Processing
 * - Inventory & Stock Ledger
 * - Shipping & Logistics
 * - Anthropic AI (Claude) Integration
 * - Multi-Year Data Administration
 */

const APP_VERSION = "3.2.0";
const CLAUDE_API_KEY = PropertiesService.getScriptProperties().getProperty("CLAUDE_API_KEY");
const CLAUDE_MODEL = "claude-3-5-sonnet-20240620";

function doGet(e) {
  return HtmlService.createTemplateFromFile('App')
    .evaluate()
    .setTitle("PITARA COMMAND CENTER")
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, viewport-fit=cover')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * AI ORDER PARSING (Claude)
 */
function parseLotsWithClaude(lotsJson) {
  const lots = JSON.parse(lotsJson);
  const results = { orders: [], errors: [] };

  const systemPrompt = `You are an expert order parser for Pitara, a fashion boutique.
  Extract order details from WhatsApp text. Return a JSON array of orders.
  Fields: customerName, phoneNumber, designCode, size, fullAddress, pincode, city, state, senderName, senderPhone, flags.
  Normalization Rules:
  - Phone: 10 digits only.
  - Sku: Normalize to uppercase.
  - Address: Proper title case.`;

  for (const lot of lots) {
    try {
      const response = callClaude(systemPrompt, lot.text);
      const parsed = JSON.parse(response);
      if (Array.isArray(parsed)) {
        parsed.forEach(o => {
          o._lot = lot.label;
          results.orders.push(o);
        });
      }
    } catch (e) {
      results.errors.push({ label: lot.label, message: e.message });
    }
  }
  return JSON.stringify(results);
}

function callClaude(system, user) {
  const url = "https://api.anthropic.com/v1/messages";
  const payload = {
    model: CLAUDE_MODEL,
    max_tokens: 4096,
    system: system,
    messages: [{ role: "user", content: user }]
  };

  const options = {
    method: "post",
    contentType: "application/json",
    headers: {
      "x-api-key": CLAUDE_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);
  const resText = response.getContentText();
  const resJson = JSON.parse(resText);

  if (response.getResponseCode() !== 200) {
    throw new Error(resJson.error ? resJson.error.message : "Claude API error");
  }

  return resJson.content[0].text;
}

/**
 * INVENTORY ENGINE
 */
function getInventoryData() {
  // Optimization: use CacheService for heavy lookups
  const cache = CacheService.getScriptCache();
  const cached = cache.get("inventory_full");
  // if (cached) return cached; // Disabled for dev

  const ss = SpreadsheetApp.openById("1KEVI2HMuQFFWaerq3ufnjc3dOwj1rmkwBhM2ME8PpGk");
  const masterSheet = ss.getSheetByName("SKU Master");
  const ledgerSheet = ss.getSheetByName("Stock Ledger");

  const masterData = masterSheet.getDataRange().getValues();
  const ledgerData = ledgerSheet.getDataRange().getValues();

  // Logic to join and calculate availability
  const inventory = processInventory(masterData, ledgerData);

  const results = JSON.stringify({
    skus: inventory,
    summary: calculateInventorySummary(inventory),
    timestamp: new Date().toISOString()
  });

  // cache.put("inventory_full", results, 600);
  return results;
}

function processInventory(master, ledger) {
  // Implementation of join and stock logic
  // ... (placeholder for brevity)
  return [];
}

/**
 * ORDER WORKFLOW
 */
function confirmOrders(payloadJson) {
  const data = JSON.parse(payloadJson);
  const orders = data.orders;

  const ss = SpreadsheetApp.openById("1KEVI2HMuQFFWaerq3ufnjc3dOwj1rmkwBhM2ME8PpGk");
  const shippingLog = ss.getSheetByName("Shipping Log");

  const startRow = shippingLog.getLastRow() + 1;
  const written = [];

  orders.forEach((o, i) => {
    const orderRef = generateOrderRef(startRow + i);
    const row = [
      new Date(),
      orderRef,
      o.customerName,
      o.phoneNumber,
      o.designCode,
      o.size,
      o.fullAddress,
      o.city,
      o.state,
      o.pincode,
      o.senderName,
      o.senderPhone,
      "Confirmed"
    ];
    shippingLog.appendRow(row);
    written.push({ ...o, orderRef: orderRef });

    // Reservation logic
    updateReservations(o, orderRef);
  });

  return JSON.stringify({
    success: true,
    written: written.length,
    orders: written
  });
}

function generateOrderRef(row) {
  const date = new Date();
  const datePart = Utilities.formatDate(date, Session.getScriptTimeZone(), "yyyyMMdd");
  return `CMD-${datePart}-${row}`;
}

// ... more functions (placeholders)
function getMasterData() { return JSON.stringify({ skus: [], dealers: [], colours: [] }); }
function getOrderHistory() { return JSON.stringify({ items: [] }); }
function saveOpsQueue() { return JSON.stringify({ success: true }); }
function getOpsQueue() { return JSON.stringify({ orders: [] }); }
function calculateInventorySummary(inv) { return {}; }
function updateReservations() {}
