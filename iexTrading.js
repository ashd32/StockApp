const stockList = ["dis", "vz", "nke", "goog"];

const showAPI = function () {
  const buttonVal = $(this).text();

  var apiurl = `https://api.iextrading.com/1.0/stock/${buttonVal}/batch?types=quote,logo,price,news`;
  $.ajax({
    url: apiurl,
    method: "GET"
  }).done(function (r) {

    const stockInfoExpand = $(".stockInfoExpand");
    stockInfoExpand.html("");
    const companyLogo = r.logo.url;
    stockInfoExpand.append(`<img src="${companyLogo}" width="150px"></img><br>`);
    const companyName = r.quote.companyName;
    stockInfoExpand.append(`<h1>${companyName}</h1>`);
    const companyPrice = r.price;
    stockInfoExpand.append(`<h4 class="ml-3 mb-3">Current Price: $${companyPrice}(USD)</h4>`);

    for (let i = 0; i < r.news.length; i++) {
      newsHeadline = r.news[i].headline;
      newsSource = r.news[i].source;
      newsURL = r.news[i].url;
      newsSummary = r.news[i].summary;
      stockInfoExpand.append(
        `<a href="${newsURL}" target="blank"><div class="newsbox"><h3>${newsHeadline}</h3><p>${newsSource}</p><p>${newsSummary}</p></div></a>`
      );
    }
  });
};

const makeStockButtons = function () {
  for (let i = 0; i < stockList.length; i++) {
    var upperCase = stockList[i].toUpperCase();
    let buttonHTML = $(`<button class="btn ml-2 id = "stockButton" val="${upperCase}">${upperCase}</button>`);
    buttonHTML.on("click", showAPI);
    $(".favStock").append(buttonHTML);
  }
};

makeStockButtons();

const makeButton = function () {
  const inputSymbol = $("#inputSymbol").val();
  const inputSymbolUC = inputSymbol.toUpperCase();
  var apiSymbols = "https://api.iextrading.com/1.0/ref-data/symbols";
  $.ajax({
    url: apiSymbols,
    method: "GET"
  }).done(function (response) {
    const validationList = response;
    for (let i = 0; i < validationList.length; i++) {
      if (inputSymbolUC === validationList[i].symbol) {
        let newStockHTML = $(
          `<button class="btn ml-2 mb-3" id="stockButton" val="${inputSymbolUC}">${inputSymbolUC}</button>;`
        );
        newStockHTML.on("click", showAPI);
        $(".newStock").append(newStockHTML);
        return;
      } else {
        $("#inputSymbol").val("");
      }
    }
  });
};
$("#addButton").on("click", makeButton);
