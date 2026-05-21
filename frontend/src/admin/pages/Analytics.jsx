import { useEffect, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const Analytics = () => {

  const [analytics, setAnalytics] = useState({
    daily_chats: [],
    top_topics: [],
    avg_response_time: 0,
    faithfulness: 0,
    context_recall: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetch("http://localhost:8080/admin/analytics")
      .then((res) => res.json())
      .then((data) => {

        setAnalytics(data);

        setLoading(false);

      })
      .catch((err) => {

        console.log(err);

        setLoading(false);

      });

  }, []);

  if (loading) {

    return (

      <div className="flex items-center justify-center h-screen">

        <div className="text-2xl font-semibold text-gray-600">
          Loading Analytics...
        </div>

      </div>

    );

  }

  return (

    <div className="p-8 bg-gray-100 min-h-screen">

      {/* Header */}
      <div className="mb-10">

        <h1 className="text-4xl font-bold text-gray-800">
          Analytics Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Monitor chatbot performance and user activity
        </p>

      </div>

      {/* Top Stats */}
      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-6
          mb-10
        "
      >

        {/* Avg Response */}
        <div className="bg-white p-6 rounded-2xl shadow">

          <p className="text-gray-500 mb-2">
            Avg Response Time
          </p>

          <h2 className="text-4xl font-bold text-gray-800">
            {analytics.avg_response_time}s
          </h2>

        </div>

        {/* Faithfulness */}
        <div className="bg-white p-6 rounded-2xl shadow">

          <p className="text-gray-500 mb-2">
            Faithfulness
          </p>

          <h2 className="text-4xl font-bold text-green-600">
            {analytics.faithfulness}
          </h2>

        </div>

        {/* Recall */}
        <div className="bg-white p-6 rounded-2xl shadow">

          <p className="text-gray-500 mb-2">
            Context Recall
          </p>

          <h2 className="text-4xl font-bold text-blue-600">
            {analytics.context_recall}
          </h2>

        </div>

        {/* Topics */}
        <div className="bg-white p-6 rounded-2xl shadow">

          <p className="text-gray-500 mb-2">
            Medical Topics
          </p>

          <h2 className="text-4xl font-bold text-purple-600">
            {analytics.top_topics.length}
          </h2>

        </div>

      </div>

      {/* Graph Section */}
      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-8
        "
      >

        {/* Daily Chats */}
        <div className="bg-white p-6 rounded-2xl shadow">

          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Daily Chats
          </h2>

          <ResponsiveContainer width="100%" height={350}>

            <LineChart data={analytics.daily_chats}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="date" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="count"
                strokeWidth={3}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

        {/* Top Topics */}
        <div className="bg-white p-6 rounded-2xl shadow">

          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Most Asked Topics
          </h2>

          <ResponsiveContainer width="100%" height={350}>

            <BarChart data={analytics.top_topics}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="topic" />

              <YAxis />

              <Tooltip />

              <Bar dataKey="count" />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* Additional Metrics */}
      <div className="mt-10">

        <div className="bg-white rounded-2xl shadow p-6">

          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Accuracy Metrics
          </h2>

          <div className="space-y-5">

            {/* Faithfulness */}
            <div>

              <div className="flex justify-between mb-2">

                <span className="text-gray-700">
                  Faithfulness
                </span>

                <span className="font-semibold">
                  {(analytics.faithfulness * 100).toFixed(0)}%
                </span>

              </div>

              <div className="w-full bg-gray-200 rounded-full h-4">

                <div
                  className="bg-green-500 h-4 rounded-full"
                  style={{
                    width: `${analytics.faithfulness * 100}%`
                  }}
                />

              </div>

            </div>

            {/* Recall */}
            <div>

              <div className="flex justify-between mb-2">

                <span className="text-gray-700">
                  Context Recall
                </span>

                <span className="font-semibold">
                  {(analytics.context_recall * 100).toFixed(0)}%
                </span>

              </div>

              <div className="w-full bg-gray-200 rounded-full h-4">

                <div
                  className="bg-blue-500 h-4 rounded-full"
                  style={{
                    width: `${analytics.context_recall * 100}%`
                  }}
                />

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );
};

export default Analytics;