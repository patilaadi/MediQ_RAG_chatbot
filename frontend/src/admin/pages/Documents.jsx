import { useState } from "react";

const Documents = () => {

  const [file, setFile] = useState(null);

  const uploadPDF = async () => {

    const formData = new FormData();

    formData.append("file", file);

    await fetch(
      "http://localhost:8080/admin/upload-pdf",
      {
        method: "POST",
        body: formData,
      }
    );

    alert("PDF Uploaded");
  };

  return (
    <div>

      <h1 className="text-3xl font-bold mb-8">
        Document Management
      </h1>

      <div className="bg-white p-8 rounded-xl shadow w-[500px]">

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          onClick={uploadPDF}
          className="bg-blue-600 text-white px-5 py-2 rounded mt-5"
        >
          Upload PDF
        </button>

      </div>

    </div>
  );
};

export default Documents;