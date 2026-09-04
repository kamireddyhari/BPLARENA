// ============================================================
// BPL Arena — Google Apps Script Backend
// USER-FRIENDLY VERSION: Edit rates directly in "Rates" sheet!
// ============================================================

const SHEET_ID = "1aeKTOp-svAgJV-6rJp8KlHISjVAWovMlKwDDMKFZJ3E";

// ---- MAIN GET HANDLER ----
function doGet(e) {
  var action = (e.parameter && e.parameter.action) ? e.parameter.action : "banks";
  if (action === "banks") return getCorsJSON(getBanks());
  return getCorsJSON({ error: "Unknown action" });
}

// ---- MAIN POST HANDLER ----
function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var action = body.action || "leads";
    if (action === "leads") return getCorsJSON(saveLead(body));
    if (action === "saveBanks") return getCorsJSON(saveBanks(body.banks));
    return getCorsJSON({ error: "Unknown action" });
  } catch (err) {
    return getCorsJSON({ error: "Invalid request: " + err.message });
  }
}

// ---- FORMAT RATE (fixes Google Sheets % auto-conversion) ----
function formatRate(val) {
  if (val === "" || val === null || val === undefined) return "N/A";
  var str = String(val).trim();
  if (str === "" || str.toLowerCase() === "n/a") return "N/A";
  if (str.indexOf("%") !== -1) return str;
  var num = parseFloat(str);
  if (!isNaN(num)) {
    if (num > 0 && num < 1) {
      return (Math.round(num * 10000) / 100) + "%";
    } else if (num >= 1) {
      return num + "%";
    }
  }
  return str;
}

// ---- GET BANKS ----
function getBanks() {
  try {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var ratesSheet = ss.getSheetByName("Rates");
    if (!ratesSheet) ratesSheet = createRatesSheet(ss);

    var data = ratesSheet.getDataRange().getValues();
    var banksMap = {};
    var bankOrder = [];

    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (!row[0]) continue;

      var bankName  = String(row[0]).trim();
      var logo      = String(row[1]).trim();
      var loanType  = String(row[2]).trim();
      var khatha    = String(row[3]).trim();
      var r825      = formatRate(row[4]);
      var r800      = formatRate(row[5]);
      var r750      = formatRate(row[6]);
      var r700      = formatRate(row[7]);
      var r650      = formatRate(row[8]);
      var note      = String(row[9]).trim();

      if (!banksMap[bankName]) {
        banksMap[bankName] = {
          name: bankName, logo: logo,
          homeLoan: {
            A_Khatha: { "825+":"N/A","800+":"N/A","750+":"N/A","700-749":"N/A","650-699":"N/A" },
            B_Khatha: { "825+":"N/A","800+":"N/A","750+":"N/A","700-749":"N/A","650-699":"N/A" },
            note: ""
          },
          personalLoan: {
            rates: { "825+":"N/A","800+":"N/A","750+":"N/A","700-749":"N/A","650-699":"N/A" },
            note: ""
          }
        };
        bankOrder.push(bankName);
      }

      var rates = { "825+":r825, "800+":r800, "750+":r750, "700-749":r700, "650-699":r650 };

      if (loanType === "Home Loan") {
        if (khatha === "A Khatha") {
          banksMap[bankName].homeLoan.A_Khatha = rates;
          if (note) banksMap[bankName].homeLoan.note = note;
        } else if (khatha === "B Khatha") {
          banksMap[bankName].homeLoan.B_Khatha = rates;
        }
      } else if (loanType === "Personal Loan") {
        banksMap[bankName].personalLoan.rates = rates;
        if (note) banksMap[bankName].personalLoan.note = note;
      }
    }

    return bankOrder.map(function(name) { return banksMap[name]; });
  } catch (err) {
    return { error: "Failed to load banks: " + err.message };
  }
}

// ---- SAVE BANKS ----
function saveBanks(banksData) {
  try {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var ratesSheet = ss.getSheetByName("Rates");
    if (!ratesSheet) ratesSheet = createRatesSheet(ss);

    var lastRow = ratesSheet.getLastRow();
    if (lastRow > 1) ratesSheet.getRange(2, 1, lastRow - 1, 10).clearContent();

    var rows = [];
    banksData.forEach(function(bank) {
      rows.push([bank.name, bank.logo, "Home Loan", "A Khatha",
        bank.homeLoan.A_Khatha["825+"], bank.homeLoan.A_Khatha["800+"],
        bank.homeLoan.A_Khatha["750+"], bank.homeLoan.A_Khatha["700-749"],
        bank.homeLoan.A_Khatha["650-699"], bank.homeLoan.note || ""]);
      rows.push([bank.name, bank.logo, "Home Loan", "B Khatha",
        bank.homeLoan.B_Khatha["825+"], bank.homeLoan.B_Khatha["800+"],
        bank.homeLoan.B_Khatha["750+"], bank.homeLoan.B_Khatha["700-749"],
        bank.homeLoan.B_Khatha["650-699"], ""]);
      rows.push([bank.name, bank.logo, "Personal Loan", "All",
        bank.personalLoan.rates["825+"], bank.personalLoan.rates["800+"],
        bank.personalLoan.rates["750+"], bank.personalLoan.rates["700-749"],
        bank.personalLoan.rates["650-699"], bank.personalLoan.note || ""]);
    });

    if (rows.length > 0) ratesSheet.getRange(2, 1, rows.length, 10).setValues(rows);
    return { status: "success", message: "Banks saved" };
  } catch (err) {
    return { error: "Failed to save banks: " + err.message };
  }
}

// ---- SAVE LEAD ----
function saveLead(body) {
  try {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var leadsSheet = ss.getSheetByName("Leads");
    if (!leadsSheet) {
      leadsSheet = ss.insertSheet("Leads");
      leadsSheet.appendRow(["Lead ID", "Name", "Phone", "Service", "Timestamp"]);
      leadsSheet.setFrozenRows(1);
    }
    var leadId = body.lead_id || ("BPL-" + Math.floor(1000 + Math.random() * 9000));
    var timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    leadsSheet.appendRow([leadId, body.name||"", body.phone||"", body.service||"", timestamp]);
    return { status: "success", lead_id: leadId, message: "Lead received" };
  } catch (err) {
    return { error: "Failed to save lead: " + err.message };
  }
}

// ---- CREATE RATES SHEET ----
function createRatesSheet(ss) {
  var old = ss.getSheetByName("Rates");
  if (old) ss.deleteSheet(old);

  var sheet = ss.insertSheet("Rates");
  var headers = ["Bank Name","Logo Path","Loan Type","Khatha","825+","800+","750+","700-749","650-699","Note"];
  sheet.appendRow(headers);
  sheet.getRange(1,1,1,10).setFontWeight("bold").setBackground("#1a73e8").setFontColor("#ffffff");
  sheet.setFrozenRows(1);
  sheet.getRange("E:I").setNumberFormat("@STRING@");
  sheet.setColumnWidth(1,150); sheet.setColumnWidth(2,160);
  sheet.setColumnWidth(3,120); sheet.setColumnWidth(4,100);
  for (var c = 5; c <= 9; c++) sheet.setColumnWidth(c, 80);
  sheet.setColumnWidth(10, 200);

  var rows = [
    ["SBI","/banks/sbi.svg","Home Loan","A Khatha","8.25%","8.25%","8.40%","8.65%","9.10%","Does not finance B Khatha"],
    ["SBI","/banks/sbi.svg","Home Loan","B Khatha","N/A","N/A","N/A","N/A","N/A",""],
    ["SBI","/banks/sbi.svg","Personal Loan","All","10.90%","10.90%","11.05%","12.00%","N/A","Govt employees preferred"],
    ["HDFC Bank","/banks/hdfc.png","Home Loan","A Khatha","8.15%","8.15%","8.50%","8.75%","9.25%","B Khatha case-by-case"],
    ["HDFC Bank","/banks/hdfc.png","Home Loan","B Khatha","8.15%","8.15%","10.50%","N/A","N/A",""],
    ["HDFC Bank","/banks/hdfc.png","Personal Loan","All","10.25%","10.25%","10.50%","11.00%","12.50%","Salary & self-employed"],
    ["ICICI Bank","/banks/icici.png","Home Loan","A Khatha","8.50%","8.50%","8.65%","8.90%","9.40%","Flexible on B Khatha"],
    ["ICICI Bank","/banks/icici.png","Home Loan","B Khatha","10.50%","10.50%","10.75%","11.00%","N/A",""],
    ["ICICI Bank","/banks/icici.png","Personal Loan","All","10.50%","10.50%","10.65%","11.25%","13.00%","Instant disbursal"],
    ["Axis Bank","/banks/axis.svg","Home Loan","A Khatha","8.55%","8.55%","8.70%","8.95%","9.50%","Active in B Khatha"],
    ["Axis Bank","/banks/axis.svg","Home Loan","B Khatha","10.60%","10.60%","10.80%","11.10%","11.50%",""],
    ["Axis Bank","/banks/axis.svg","Personal Loan","All","10.25%","10.25%","10.49%","11.50%","13.50%","Flexible tenure up to 5 yrs"],
    ["LIC HFL","/banks/lic.png","Home Loan","A Khatha","7.15%","7.15%","8.60%","8.80%","9.30%","Good for B Khatha"],
    ["LIC HFL","/banks/lic.png","Home Loan","B Khatha","7.15%","7.15%","10.60%","10.90%","11.30%",""],
    ["LIC HFL","/banks/lic.png","Personal Loan","All","N/A","N/A","N/A","N/A","N/A","Home loans only"],
    ["PNB Housing","/banks/pnb.svg","Home Loan","A Khatha","8.60%","8.60%","8.75%","9.00%","9.60%","Actively funds B Khatha"],
    ["PNB Housing","/banks/pnb.svg","Home Loan","B Khatha","10.70%","10.70%","10.90%","11.20%","11.75%",""],
    ["PNB Housing","/banks/pnb.svg","Personal Loan","All","N/A","N/A","N/A","N/A","N/A","Home loans only"],
    ["Kotak Mahindra","/banks/kotak.svg","Home Loan","A Khatha","8.65%","8.65%","8.80%","9.05%","9.65%","A Khatha only"],
    ["Kotak Mahindra","/banks/kotak.svg","Home Loan","B Khatha","N/A","N/A","N/A","N/A","N/A",""],
    ["Kotak Mahindra","/banks/kotak.svg","Personal Loan","All","10.50%","10.50%","10.99%","12.00%","14.00%","Min salary Rs.25,000"],
    ["Bank of Baroda","/banks/bob.png","Home Loan","A Khatha","8.30%","8.30%","8.45%","8.70%","9.20%","A Khatha only"],
    ["Bank of Baroda","/banks/bob.png","Home Loan","B Khatha","N/A","N/A","N/A","N/A","N/A",""],
    ["Bank of Baroda","/banks/bob.png","Personal Loan","All","11.00%","11.00%","11.40%","12.50%","N/A","Low processing fee"],
    ["Bank of Maharastra","/banks/bank_maha.png","Home Loan","A Khatha","7.0%","7.0%","7.25%","7.75%","8.35%",""],
    ["Bank of Maharastra","/banks/bank_maha.png","Home Loan","B Khatha","7.0%","7.0%","7.25%","7.75%","8.35%",""],
    ["Bank of Maharastra","/banks/bank_maha.png","Personal Loan","All","9.75%","9.75%","9.95%","10.50%","13.55%",""]
  ];

  sheet.getRange(2, 1, rows.length, 10).setValues(rows);
  for (var i = 0; i < rows.length; i++) {
    sheet.getRange(i+2,1,1,10).setBackground(i % 6 < 3 ? "#f8f9fa" : "#ffffff");
  }
  return sheet;
}

// ---- JSON RESPONSE HELPER ----
function getCorsJSON(data) {
  var output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
