export const openDownloadXLSXDialog = (url, saveName) => {
  if (typeof url == "object" && url instanceof Blob) {
    url = URL.createObjectURL(url); // 创建blob地址
  }
  var aLink = document.createElement("a");
  aLink.href = url;
  aLink.download = saveName || ""; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
  var event;
  if (window.MouseEvent) {
    event = new MouseEvent("click");
  } else {
    event = document.createEvent("MouseEvents");
    event.initMouseEvent(
      "click",
      true,
      false,
      window,
      0,
      0,
      0,
      0,
      0,
      false,
      false,
      false,
      false,
      0,
      null
    );
  }
  aLink.dispatchEvent(event);
};
export const s2ab = s => {
  let buf = new ArrayBuffer(s.length);
  let view = new Uint8Array(buf);
  for (let i = 0; i !== s.length; ++i) {
    view[i] = s.charCodeAt(i) & 0xff;
  }
  return buf;
};
export const aoa_to_sheet = (data, headerRows) => {
  const ws = {};
  const range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } };
  for (let R = 0; R !== data.length; ++R) {
    for (let C = 0; C !== data[R].length; ++C) {
      if (range.s.r > R) {
        range.s.r = R;
      }
      if (range.s.c > C) {
        range.s.c = C;
      }
      if (range.e.r < R) {
        range.e.r = R;
      }
      if (range.e.c < C) {
        range.e.c = C;
      }
      /// 这里生成cell的时候，使用上面定义的默认样式
      const cell = {
        v: data[R][C] || "",
        s: {
          font: { name: "宋体", sz: 11, color: { auto: 1 } },
          alignment: {
            /// 自动换行
            wrapText: 1,
            // 居中
            horizontal: "center",
            vertical: "center",
            indent: 0
          }
        }
      };
      // 头部列表加边框
      if (R < headerRows) {
        // cell.s.border = {
        //   top: { style: "thin", color: { rgb: "000000" } },
        //   left: { style: "thin", color: { rgb: "000000" } },
        //   bottom: { style: "thin", color: { rgb: "000000" } },
        //   right: { style: "thin", color: { rgb: "000000" } }
        // };
        cell.s.fill = {
          // patternType: "solid",
          fgColor: { theme: 3, tint: 0.3999755851924192, rgb: "DDD9C4" },
          bgColor: { theme: 7, tint: 0.3999755851924192, rgb: "DDD9C4" }
        };
      }
      const cell_ref = XLSX.utils.encode_cell({ c: C, r: R });
      if (typeof cell.v === "number") {
        cell.t = "n";
      } else if (typeof cell.v === "boolean") {
        cell.t = "b";
      } else {
        cell.t = "s";
      }
      ws[cell_ref] = cell;
    }
  }
  if (range.s.c < 10000000) {
    ws["!ref"] = XLSX.utils.encode_range(range);
  }
  return ws;
};
