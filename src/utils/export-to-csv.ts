export const exportToCSV = (html: any, filename: any) => {
  var data = [];
  const rows = html.querySelectorAll("table tr");

  for (var i = 0; i < rows.length; i++) {
    const row = [],
      cols = rows[i].querySelectorAll("td, th");

    for (let j = 0; j < cols.length; j++) {
      row.push(cols[j].innerText);
    }

    data.push(row.join(","));
  }

  let csv = data.join("\n");
  let csv_file, download_link;

  csv_file = new Blob([csv], { type: "text/csv" });

  download_link = document.createElement("a");

  download_link.download = filename;

  download_link.href = window.URL.createObjectURL(csv_file);

  download_link.style.display = "none";

  document.body.appendChild(download_link);

  download_link.click();
};
