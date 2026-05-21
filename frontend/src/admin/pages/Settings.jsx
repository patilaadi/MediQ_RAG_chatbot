import { useState } from "react";

const Settings = () => {

  const [settings, setSettings] = useState({
    model: "meta-llama/llama-3-8b-instruct",
    temperature: 0.2,
    top_k: 3,
  });

  const saveSettings = async () => {

    await fetch(
      "http://localhost:8080/admin/settings",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      }
    );

    alert("Settings Saved");
  };

  return (
    <div>

      <h1 className="text-3xl font-bold mb-8">
        Settings
      </h1>

      <div className="bg-white p-8 rounded-xl shadow w-[500px] space-y-5">

        <input
          type="text"
          value={settings.model}
          onChange={(e) =>
            setSettings({
              ...settings,
              model: e.target.value,
            })
          }
          className="border p-3 w-full"
        />

        <input
          type="number"
          value={settings.temperature}
          onChange={(e) =>
            setSettings({
              ...settings,
              temperature: e.target.value,
            })
          }
          className="border p-3 w-full"
        />

        <button
          onClick={saveSettings}
          className="bg-green-600 text-white px-5 py-2 rounded"
        >
          Save Settings
        </button>

      </div>

    </div>
  );
};

export default Settings;