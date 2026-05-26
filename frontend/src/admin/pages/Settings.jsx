import { useState } from "react";

const modelOptions = [
  { label: "gpt-4o-mini (OpenRouter free)", value: "gpt-4o-mini" },
  { label: "gpt-3.5-mini (OpenRouter free)", value: "gpt-3.5-mini" },
  { label: "llama-2-7b-chat (OpenRouter free)", value: "llama-2-7b-chat" },
  { label: "mistral-small (OpenRouter free)", value: "mistral-small" },
  { label: "gpt-3.5-turbo (OpenRouter free)", value: "gpt-3.5-turbo" },
];

const Settings = () => {
  const [settings, setSettings] = useState({
    model: "gpt-4o-mini",
    temperature: 0.2,
    top_k: 3,
  });

  const saveSettings = async () => {
    await fetch("http://localhost:8080/admin/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings),
    });

    alert("Settings Saved");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <div className="bg-white p-8 rounded-xl shadow w-[500px] space-y-5">
        <label className="block text-sm font-semibold text-gray-700">
          OpenRouter Model
        </label>

        <select
          value={settings.model}
          onChange={(e) =>
            setSettings({
              ...settings,
              model: e.target.value,
            })
          }
          className="border p-3 w-full rounded"
        >
          {modelOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <label className="block text-sm font-semibold text-gray-700">
          Temperature
        </label>

        <input
          type="number"
          step="0.1"
          min="0"
          max="1"
          value={settings.temperature}
          onChange={(e) =>
            setSettings({
              ...settings,
              temperature: Number(e.target.value),
            })
          }
          className="border p-3 w-full rounded"
        />

        <label className="block text-sm font-semibold text-gray-700">
          Top K
        </label>

        <input
          type="number"
          min="1"
          value={settings.top_k}
          onChange={(e) =>
            setSettings({
              ...settings,
              top_k: Number(e.target.value),
            })
          }
          className="border p-3 w-full rounded"
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
