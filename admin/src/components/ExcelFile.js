import * as XLSX from "xlsx";
import moment from "moment";

const DownloadExcel = (data, filename) => {
  const mainHeading =
    filename + " Excel Data, Export on " + moment().format("DD-MM-YYYY");
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);
  // XLSX.utils.sheet_add_aoa(worksheet, [[mainHeading]], { origin: 'A1' });
  XLSX.utils.book_append_sheet(workbook, worksheet, filename);
  XLSX.writeFile(
    workbook,
    `${
      moment().milliseconds() +
      1000 * (moment().seconds() + 60 * 60) +
      `-${filename}`
    }.xlsx`,
  );
  return true;
};

const SampleFileDownload = () => {
  const fileUrl = process.env.PUBLIC_URL + "/sample.xlsx";
  const link = document.createElement("a");
  link.href = fileUrl;
  link.download = "sample.xlsx";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export { DownloadExcel, SampleFileDownload };
